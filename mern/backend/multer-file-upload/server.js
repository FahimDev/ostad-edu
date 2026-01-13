import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;

fs.mkdirSync("uploads", { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const timestamp = Date.now();
    const randomNumber = Math.round(Math.random() * 1e9);
    const safeName = `${timestamp}-${randomNumber}${ext}`;
    cb(null, safeName);
  },
});

const fileFilter = (req, file, cb) => {
  const allow = new Set(["image/jpeg", "image/png"]);

  // mimetype (not mimeType)
  if (!allow.has(file.mimetype)) {
    return cb(new Error("Only JPG/PNG allowed"), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB
    files: 1,
  },
  fileFilter,
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.post("/upload", upload.single("avatar"), (req, res) => {
  res.json({
    message: "File Uploaded Successfully",
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size,
  });
});

app.use((err, req, res, next) => {
  res.status(400).json({ error: err.message || "Upload failed" });
});

app.listen(PORT, () => console.log(`Running at ${PORT}`));

