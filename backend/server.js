require("dotenv").config();

const app = require("./app");
require("./config/db");
const userRoutes = require("./routes/userRoutes");

app.use("/api/users", userRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🔥This is My server`);
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
console.log(`🚀 Server running on http://localhost:${PORT}`);