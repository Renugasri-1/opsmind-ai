require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const uploadRoute = require("./routes/upload");
const queryRoute = require("./routes/query");
const historyRoutes = require("./routes/history");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use("/upload", uploadRoute);
app.use("/query", queryRoute);
app.use("/history", historyRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});