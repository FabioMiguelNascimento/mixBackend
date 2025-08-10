import { Router } from "express";
import {
  handleFileDelete,
  handleFileDownload,
  handleFileUpload,
  upload,
} from "../controller/storage.controller.js";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { requirePermission } from "@/middlewares/permissionMiddleware.js";

const router = Router();

router.post(
  "/upload",
  authMiddleware,
  requirePermission(["ADMIN", "MANAGER", "SELLER"]),
  upload.single("file"),
  handleFileUpload
);

router.get(
  "/:key(*)",
  authMiddleware,
  requirePermission(["ADMIN", "MANAGER", "SELLER"]),
  handleFileDownload
);

router.delete(
  "/:key(*)",
  authMiddleware,
  requirePermission(["ADMIN", "MANAGER", "SELLER"]),
  handleFileDelete
);

export default router;
