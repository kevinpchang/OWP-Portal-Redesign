const express = require("express");
const router = express.Router();
const sql = require("mssql");
const { connectToDatabase } = require("../database/connect");

// helper to parse ints/bigints safely
function toInt(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

function toBigInt(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

function normalizeEmail(e) {
    const s = String(e ?? "").trim().toLowerCase();
    // light validation — you can make this stricter if you want
    if (!s || !s.includes("@") || s.length > 640) return null;
    return s;
}

/**
 * Ensure all emails exist in dbo.Users and return their UserIds.
 * - Creates missing users with IsActive=1, CreatedAt=now, DisplayName=NULL.
 */
async function ensureUsersByEmail(txOrPool, emails) {
    const unique = Array.from(new Set(emails.map(normalizeEmail).filter(Boolean)));
    if (unique.length === 0) return [];
    const req = txOrPool.request ? txOrPool.request() : new sql.Request(txOrPool);
    const r = txOrPool instanceof sql.Transaction ? new sql.Request(txOrPool) : req;

    unique.forEach((email, i) => {
        r.input(`e${i}`, sql.NVarChar(640), email);
    });

    const valuesSql = unique.map((_, i) => `(@e${i})`).join(",");

    await r.query(`
    ;WITH src(Email) AS (
      SELECT v.Email
      FROM (VALUES ${valuesSql}) AS v(Email)
    )
    INSERT INTO dbo.Users (Email, DisplayName, CreatedAt, IsActive)
    SELECT s.Email, NULL, SYSUTCDATETIME(), 1
    FROM src s
    WHERE NOT EXISTS (
      SELECT 1 FROM dbo.Users u WHERE LOWER(u.Email) = s.Email
    );
  `);

    // 2) Fetch ids
    const r2 = txOrPool instanceof sql.Transaction ? new sql.Request(txOrPool) : txOrPool.request();
    unique.forEach((email, i) => {
        r2.input(`e${i}`, sql.NVarChar(640), email);
    });

    const res = await r2.query(`
    SELECT u.UserId, LOWER(u.Email) AS Email
    FROM dbo.Users u
    WHERE LOWER(u.Email) IN (${unique.map((_, i) => `@e${i}`).join(",")});
  `);


    const map = new Map(res.recordset.map((row) => [row.Email, row.UserId]));
    return unique.map((e) => map.get(e)).filter(Boolean);
}

/**
 * GET /api/messaging/threads?userId=123&search=foo
 */
router.get("/threads", async (req, res) => {
    const userId = toInt(req.query.userId);
    const search = String(req.query.search ?? "").trim();

    if (!userId) {
        return res.status(400).json({ error: "userId query parameter is required" });
    }

    try {
        const pool = await connectToDatabase();
        const request = pool.request();
        request.input("userId", sql.Int, userId);
        request.input("search", sql.NVarChar(200), search);

        const q = `
            SELECT
                t.ThreadId,
                t.CreatedAt,
                t.LastMessageAt,
                t.SubjectPreview,

                lm.MessageId  AS LastMessageId,
                lm.Body       AS LastBody,
                lm.SentAt     AS LastSentAt,

                COALESCE(u.DisplayName, u.Email, es.DisplayName, es.Email, 'Unknown') AS LastSenderName,
                COALESCE(u.Email, es.Email, '') AS LastSenderEmail,

                ISNULL(unr.UnreadCount, 0) AS UnreadCount,

                -- ✅ Starred support (ThreadStars)
                CASE WHEN ts.ThreadId IS NULL THEN CAST(0 AS bit) ELSE CAST(1 AS bit) END AS IsStarred

            FROM dbo.Threads t

                OUTER APPLY (
        SELECT TOP 1
          m.MessageId,
          m.Body,
          m.SentAt,
          m.SenderUserId,
          m.ExternalSenderId
        FROM dbo.Messages m
        WHERE m.ThreadId = t.ThreadId
        ORDER BY m.SentAt DESC, m.MessageId DESC
      ) lm

      LEFT JOIN dbo.Users u
            ON u.UserId = lm.SenderUserId

                LEFT JOIN dbo.ExternalSenders es
                ON es.ExternalSenderId = lm.ExternalSenderId

                LEFT JOIN (
                SELECT m.ThreadId, COUNT(*) AS UnreadCount
                FROM dbo.MessageRecipients mr
                JOIN dbo.Messages m ON m.MessageId = mr.MessageId
                WHERE mr.RecipientUserId = @userId
                AND mr.ReadAt IS NULL
                AND mr.IsDeleted = 0
                AND mr.IsArchived = 0
                GROUP BY m.ThreadId
                ) unr
                ON unr.ThreadId = t.ThreadId

               
                LEFT JOIN dbo.ThreadStars ts
                ON ts.ThreadId = t.ThreadId
                AND ts.UserId = @userId

            WHERE EXISTS (
                SELECT 1
                FROM dbo.Messages m2
                JOIN dbo.MessageRecipients mr2 ON mr2.MessageId = m2.MessageId
                WHERE m2.ThreadId = t.ThreadId
              AND mr2.RecipientUserId = @userId
              AND mr2.IsDeleted = 0
              AND mr2.IsArchived = 0
                )
              AND (
                @search = ''
               OR ISNULL(t.SubjectPreview, '') LIKE '%' + @search + '%'
               OR ISNULL(lm.Body, '') LIKE '%' + @search + '%'
               OR ISNULL(u.DisplayName, '') LIKE '%' + @search + '%'
               OR ISNULL(u.Email, '') LIKE '%' + @search + '%'
               OR ISNULL(es.DisplayName, '') LIKE '%' + @search + '%'
               OR ISNULL(es.Email, '') LIKE '%' + @search + '%'
                )
            ORDER BY COALESCE(t.LastMessageAt, t.CreatedAt) DESC
        `;

        const result = await request.query(q);
        res.json({ threads: result.recordset });
    } catch (err) {
        console.error("GET /threads error:", err);
        res.status(500).json({ error: err.message ?? String(err) });
    }
});

/**
 * GET /api/messaging/threads/:threadId?userId=123
 */
router.get("/threads/:threadId", async (req, res) => {
    const threadId = toBigInt(req.params.threadId);
    const userId = toInt(req.query.userId);

    if (!threadId || !userId) {
        return res
            .status(400)
            .json({ error: "threadId (param) and userId (query) are required" });
    }

    try {
        const pool = await connectToDatabase();

        const threadReq = pool.request();
        threadReq.input("threadId", sql.BigInt, threadId);
        const threadRes = await threadReq.query(`
            SELECT ThreadId, CreatedAt, LastMessageAt, SubjectPreview
            FROM dbo.Threads
            WHERE ThreadId = @threadId
        `);
        const thread = threadRes.recordset[0] ?? null;

        const msgReq = pool.request();
        msgReq.input("threadId", sql.BigInt, threadId);
        const messagesRes = await msgReq.query(`
            SELECT
                m.MessageId,
                m.ThreadId,
                m.Subject,
                m.Body,
                m.SentAt,
                m.SenderUserId,
                m.ExternalSenderId,
                u.DisplayName AS SenderDisplayName,
                u.Email       AS SenderEmail,
                es.DisplayName AS ExternalDisplayName,
                es.Email       AS ExternalEmail
            FROM dbo.Messages m
                     LEFT JOIN dbo.Users u ON u.UserId = m.SenderUserId
                     LEFT JOIN dbo.ExternalSenders es ON es.ExternalSenderId = m.ExternalSenderId
            WHERE m.ThreadId = @threadId
            ORDER BY m.SentAt ASC, m.MessageId ASC
        `);

        const markReq = pool.request();
        markReq.input("threadId", sql.BigInt, threadId);
        markReq.input("userId", sql.Int, userId);
        await markReq.query(`
            UPDATE mr
            SET mr.ReadAt = COALESCE(mr.ReadAt, SYSUTCDATETIME())
                FROM dbo.MessageRecipients mr
      JOIN dbo.Messages m ON m.MessageId = mr.MessageId
            WHERE m.ThreadId = @threadId
              AND mr.RecipientUserId = @userId
              AND mr.IsDeleted = 0
              AND mr.IsArchived = 0
        `);

        res.json({ thread, messages: messagesRes.recordset });
    } catch (err) {
        console.error("GET /threads/:threadId error:", err);
        res.status(500).json({ error: err.message ?? String(err) });
    }
});

/**
 * POST /api/messaging/threads/:threadId/star
 * Body: { userId: 123 }
 */
router.post("/threads/:threadId/star", async (req, res) => {
    const threadId = toBigInt(req.params.threadId);
    const userId = toInt(req.body.userId);

    if (!threadId || !userId) {
        return res
            .status(400)
            .json({ error: "threadId (param) and userId (JSON) are required" });
    }

    try {
        const pool = await connectToDatabase();
        const r = pool.request();
        r.input("threadId", sql.BigInt, threadId);
        r.input("userId", sql.Int, userId);

        await r.query(`
      IF NOT EXISTS (
        SELECT 1
        FROM dbo.Messages m
        JOIN dbo.MessageRecipients mr ON mr.MessageId = m.MessageId
        WHERE m.ThreadId = @threadId
          AND mr.RecipientUserId = @userId
          AND mr.IsDeleted = 0
          AND mr.IsArchived = 0
      )
      BEGIN
        THROW 50001, 'Forbidden: user not a participant in this thread', 1;
      END

      MERGE dbo.ThreadStars AS tgt
      USING (SELECT @threadId AS ThreadId, @userId AS UserId) AS src
      ON tgt.ThreadId = src.ThreadId AND tgt.UserId = src.UserId
      WHEN NOT MATCHED THEN
        INSERT (ThreadId, UserId) VALUES (src.ThreadId, src.UserId);
    `);

        res.json({ ok: true });
    } catch (err) {
        console.error("POST /threads/:threadId/star error:", err);
        res.status(500).json({ error: err.message ?? String(err) });
    }
});

/**
 * DELETE /api/messaging/threads/:threadId/star?userId=123
 */
router.delete("/threads/:threadId/star", async (req, res) => {
    const threadId = toBigInt(req.params.threadId);
    const userId = toInt(req.query.userId);

    if (!threadId || !userId) {
        return res
            .status(400)
            .json({ error: "threadId (param) and userId (query) are required" });
    }

    try {
        const pool = await connectToDatabase();
        const r = pool.request();
        r.input("threadId", sql.BigInt, threadId);
        r.input("userId", sql.Int, userId);

        await r.query(`
            DELETE FROM dbo.ThreadStars
            WHERE ThreadId = @threadId AND UserId = @userId;
        `);

        res.json({ ok: true });
    } catch (err) {
        console.error("DELETE /threads/:threadId/star error:", err);
        res.status(500).json({ error: err.message ?? String(err) });
    }
});

/**
 * POST /api/messaging/threads/:threadId/reply
 * (still uses senderUserId)
 */
router.post("/threads/:threadId/reply", async (req, res) => {
    const threadId = toBigInt(req.params.threadId);
    const senderUserId = toInt(req.body.senderUserId);
    const body = String(req.body.body ?? "").trim();

    if (!threadId || !senderUserId || !body) {
        return res.status(400).json({
            error: "threadId (param), senderUserId and body (JSON) are required",
        });
    }

    const pool = await connectToDatabase();
    const tx = new sql.Transaction(pool);

    try {
        await tx.begin();

        const insMsgReq = new sql.Request(tx);
        insMsgReq.input("threadId", sql.BigInt, threadId);
        insMsgReq.input("senderUserId", sql.Int, senderUserId);
        insMsgReq.input("body", sql.NVarChar(sql.MAX), body);

        const insertMsgResult = await insMsgReq.query(`
            INSERT INTO dbo.Messages
            (ThreadId, SenderUserId, Subject, Body, SentAt, IsEdited, EditedAt, ExternalSenderId, ExternalMessageId)
                OUTPUT INSERTED.MessageId
            VALUES
                (@threadId, @senderUserId, NULL, @body, SYSUTCDATETIME(), 0, NULL, NULL, NULL)
        `);

        const messageId = insertMsgResult.recordset[0]?.MessageId;

        const addRecipientsReq = new sql.Request(tx);
        addRecipientsReq.input("threadId", sql.BigInt, threadId);
        addRecipientsReq.input("messageId", sql.BigInt, messageId);
        addRecipientsReq.input("senderUserId", sql.Int, senderUserId);

        await addRecipientsReq.query(`
            INSERT INTO dbo.MessageRecipients
            (MessageId, RecipientUserId, RecipientType, DeliveredAt, ReadAt, IsArchived, IsDeleted)
            SELECT
                @messageId,
                mr.RecipientUserId,
                1,
                SYSUTCDATETIME(),
                NULL,
                0,
                0
            FROM dbo.MessageRecipients mr
                     JOIN dbo.Messages m ON m.MessageId = mr.MessageId
            WHERE m.ThreadId = @threadId
              AND mr.RecipientUserId <> @senderUserId
              AND mr.IsDeleted = 0
              AND mr.IsArchived = 0
            GROUP BY mr.RecipientUserId
        `);

        const senderReq = new sql.Request(tx);
        senderReq.input("messageId", sql.BigInt, messageId);
        senderReq.input("sid", sql.Int, senderUserId);
        await senderReq.query(`
            INSERT INTO dbo.MessageRecipients
            (MessageId, RecipientUserId, RecipientType, DeliveredAt, ReadAt, IsArchived, IsDeleted)
            VALUES
                (@messageId, @sid, 1, SYSUTCDATETIME(), SYSUTCDATETIME(), 0, 0)
        `);

        const updReq = new sql.Request(tx);
        updReq.input("threadId", sql.BigInt, threadId);
        await updReq.query(`
            UPDATE dbo.Threads
            SET LastMessageAt = SYSUTCDATETIME()
            WHERE ThreadId = @threadId
        `);

        await tx.commit();
        res.json({ ok: true, messageId });
    } catch (err) {
        console.error("POST /threads/:threadId/reply error:", err);
        try {
            await tx.rollback();
        } catch (e) {}
        res.status(500).json({ error: err.message ?? String(err) });
    }
});

/**
 * POST /api/messaging/threads
 *
 * Body: { subject, senderUserId, recipientEmails: ["a@x.com","b@x.com"], body }
 */
router.post("/threads", async (req, res) => {
    const subject = String(req.body.subject ?? "").trim();
    const senderUserId = toInt(req.body.senderUserId);

    const recipientEmailsRaw = Array.isArray(req.body.recipientEmails)
        ? req.body.recipientEmails
        : [];
    const recipientEmails = Array.from(
        new Set(recipientEmailsRaw.map(normalizeEmail).filter(Boolean)),
    );

    const body = String(req.body.body ?? "").trim();

    if (!subject || !senderUserId || recipientEmails.length === 0 || !body) {
        return res.status(400).json({
            error: "subject, senderUserId, recipientEmails (non-empty array), and body are required",
        });
    }

    const pool = await connectToDatabase();
    const tx = new sql.Transaction(pool);

    try {
        await tx.begin();


        const recipientUserIds = await ensureUsersByEmail(tx, recipientEmails);

        if (!recipientUserIds.length) {
            throw new Error("No valid recipient emails found after normalization.");
        }

        const threadReq = new sql.Request(tx);
        threadReq.input("subjectPreview", sql.NVarChar(400), subject.slice(0, 400));
        const threadInsert = await threadReq.query(`
      INSERT INTO dbo.Threads (CreatedAt, LastMessageAt, SubjectPreview)
      OUTPUT INSERTED.ThreadId
      VALUES (SYSUTCDATETIME(), SYSUTCDATETIME(), @subjectPreview)
    `);
        const threadId = threadInsert.recordset[0]?.ThreadId;

        const msgReq = new sql.Request(tx);
        msgReq.input("threadId", sql.BigInt, threadId);
        msgReq.input("senderUserId", sql.Int, senderUserId);
        msgReq.input("subject", sql.NVarChar(400), subject.slice(0, 400));
        msgReq.input("body", sql.NVarChar(sql.MAX), body);

        const msgInsert = await msgReq.query(`
            INSERT INTO dbo.Messages
            (ThreadId, SenderUserId, Subject, Body, SentAt, IsEdited, EditedAt, ExternalSenderId, ExternalMessageId)
                OUTPUT INSERTED.MessageId
            VALUES
                (@threadId, @senderUserId, @subject, @body, SYSUTCDATETIME(), 0, NULL, NULL, NULL)
        `);
        const messageId = msgInsert.recordset[0]?.MessageId;

        // add recipients
        for (const rid of recipientUserIds) {
            const rreq = new sql.Request(tx);
            rreq.input("messageId", sql.BigInt, messageId);
            rreq.input("rid", sql.Int, rid);
            await rreq.query(`
                INSERT INTO dbo.MessageRecipients
                (MessageId, RecipientUserId, RecipientType, DeliveredAt, ReadAt, IsArchived, IsDeleted)
                VALUES
                    (@messageId, @rid, 1, SYSUTCDATETIME(), NULL, 0, 0)
            `);
        }

        // add sender as recipient (read immediately)
        const senderReq = new sql.Request(tx);
        senderReq.input("messageId", sql.BigInt, messageId);
        senderReq.input("sid", sql.Int, senderUserId);
        await senderReq.query(`
            INSERT INTO dbo.MessageRecipients
            (MessageId, RecipientUserId, RecipientType, DeliveredAt, ReadAt, IsArchived, IsDeleted)
            VALUES
                (@messageId, @sid, 1, SYSUTCDATETIME(), SYSUTCDATETIME(), 0, 0)
        `);

        await tx.commit();
        res.json({ ok: true, threadId, messageId });
    } catch (err) {
        console.error("POST /threads error:", err);
        try {
            await tx.rollback();
        } catch (e) {}
        res.status(500).json({ error: err.message ?? String(err) });
    }
});

module.exports = router;