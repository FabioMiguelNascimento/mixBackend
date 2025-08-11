import { Router } from "express";
import {
  handleFileDelete,
  handleFileDownload,
  handleFileUpload,
  upload,
} from "../controller/storage.controller.js";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { requirePermission } from "@/middlewares/permissionMiddleware.js";
import { validateParams } from "@/middlewares/validateRequestMiddleware.js";
import { storageParamsSchema } from "../../../schema/storage.schema.js";

const router = Router();

router.post(
  "/upload",
  authMiddleware,
  requirePermission(["ADMIN", "MANAGER", "SELLER"]),
  upload.single("file"),
  handleFileUpload
);

router.get(
  "/*key",
  authMiddleware,
  requirePermission(["ADMIN", "MANAGER", "SELLER"]),
  validateParams(storageParamsSchema),
  handleFileDownload
);

router.delete(
  "/*key",
  authMiddleware,
  requirePermission(["ADMIN", "MANAGER", "SELLER"]),
  validateParams(storageParamsSchema),
  handleFileDelete
);

export default router;