const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const parsePDF = require("../utils/pdfparser");

const router = express.Router();

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

router.post("/", upload.single("file"), async (req, res) => {
         console.log("req.file:", req.file);
         console.log("req.body:", req.body);
    try {

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const filePath = req.file.path;

        await parsePDF(filePath);

        res.json({ message: "PDF processed successfully" });

    } catch (error) {

        console.error(error);
        res.status(500).json({ error: "Processing failed" });

    }

});

module.exports = router;