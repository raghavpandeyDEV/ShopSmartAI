import multer from "multer";

// 🔥 Use memory storage (for Cloudinary buffer upload)
const storage = multer.memoryStorage();

// 🔹 Single file upload
export const singleUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit (optional)
}).single("file"); // ⚠️ MUST match frontend name

// 🔹 Multiple file upload
export const multipleUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).array("files", 5); // max 5 files