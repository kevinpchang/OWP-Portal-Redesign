const express = require("express");
const { connectToDatabase } = require("./src/database/connect"); // adjust path if needed

const app = express();
const PORT = process.env.PORT || 3001;

app.get("/health", (req, res) => {
    res.json({ ok: true, message: "Backend running, DB connected" });
});

(async () => {
    await connectToDatabase(); // if this fails, your connect.js exits the process
    app.listen(PORT, () => {
        console.log(`🚀 Backend running on http://localhost:${PORT}`);
    });
})();
