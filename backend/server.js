const express = require("express");
const cors = require("cors");
const { connectToDatabase } = require("./src/database/connect");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ ok: true, message: "Backend running, DB connected" });
});

const messagingRoutes = require("./src/api/messagingRoutes");
app.use("/api/messaging", messagingRoutes);

(async () => {
    await connectToDatabase(); // if this fails, your connect.js exits the process
    app.listen(PORT, () => {
        console.log(`🚀 Backend running on http://localhost:${PORT}`);
    });
})();