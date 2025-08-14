import { Router } from "express";
import {
  handleFileDelete,
  handleFileDownload,
  handleFileUpload,
  handleBatchFileDownload,
  handleImageProxy,
  upload,
} from "../controller/storage.controller.js";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { requirePermission } from "@/middlewares/permissionMiddleware.js";
import { validateParams, validateBody } from "@/middlewares/validateRequestMiddleware.js";
import { storageParamsSchema, batchStorageSchema } from "../../../schema/storage.schema.js";

const router = Router();

router.post(
  "/upload",
  authMiddleware,
  requirePermission(["ADMIN", "MANAGER", "SELLER"]),
  upload.single("file"),
  handleFileUpload
);

router.post(
  "/batch",
  authMiddleware,
  requirePermission(["ADMIN", "MANAGER", "SELLER"]),
  validateBody(batchStorageSchema),
  handleBatchFileDownload
);

router.get(
  "/image/*key",
  authMiddleware,
  requirePermission(["ADMIN", "MANAGER", "SELLER"]),
  validateParams(storageParamsSchema),
  handleImageProxy
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