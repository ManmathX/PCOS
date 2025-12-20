import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/daily-photos"));
  },
  filename: (req, file, cb) => {
    // Create unique filename: userId_date_timestamp.ext
    const userId = req.user.id;
    const date = new Date().toISOString().split("T")[0];
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${userId}_${date}_${timestamp}${ext}`);
  },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, JPG, PNG, WebP) are allowed!"));
  }
};

// Configure multer
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
