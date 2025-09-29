// repo: Minimal image server + upload
const express = require("express");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
const multer = require("multer");

const app = express();
app.use(morgan("combined"));

const IMAGES_DIR = path.join(__dirname, "public", "images");
fs.mkdirSync(IMAGES_DIR, { recursive: true });

// health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// 이미지 리스트
app.get("/api/images", (req, res) => {
  fs.readdir(IMAGES_DIR, (err, files) => {
    if (err) return res.status(500).json({ error: "cannot read images" });
    const imgs = files.filter((f) => /\.(png|jpg|jpeg|gif)$/i.test(f));
    res.json(imgs);
  });
});

// 정적 이미지 서빙
app.use(
  "/images",
  express.static(IMAGES_DIR, {
    setHeaders: (res) => res.setHeader("Cache-Control", "no-cache"),
  })
);

// Multer 스토리지 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, IMAGES_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const ts = new Date().toISOString().replace(/[:T]/g, "-").split(".")[0];
    const base = path
      .basename(file.originalname || "image", ext)
      .replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${ts}_${base}${ext}`);
  },
});

const allowed = new Set(["image/png", "image/jpeg", "image/gif"]);
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (allowed.has(file.mimetype)) cb(null, true);
    else cb(new Error("Unsupported file type"));
  },
}).single("file"); // field name: file

// 업로드 폼 (테스트용)
app.get("/upload", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(`<!doctype html>
  <html><body>
  <h3>Upload Image</h3>
  <form method="post" action="/upload" enctype="multipart/form-data">
    <input type="file" name="file" accept="image/*" />
    <button type="submit">Upload</button>
  </form>
  </body></html>`);
});

// 업로드 처리
app.post("/upload", (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ ok: false, error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ ok: false, error: "No file" });
    }
    return res.json({
      ok: true,
      filename: req.file.filename,
      url: `/images/${req.file.filename}`,
    });
  });
});

// 다운로드
app.get("/download/:name", (req, res) => {
  const file = path.join(IMAGES_DIR, req.params.name);
  if (!fs.existsSync(file)) return res.status(404).send("not found");
  res.download(file);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`repo listening on ${port}`);
});
