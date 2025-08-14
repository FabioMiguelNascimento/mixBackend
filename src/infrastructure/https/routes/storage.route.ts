import { requirePermission } from "@/middlewares/permissionMiddleware.js";
import { validateBody, validateParams } from "@/middlewares/validateRequestMiddleware.js";
import { Router } from "express";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { batchStorageSchema, storageParamsSchema } from "../../../schema/storage.schema.js";
import {
  handleBatchFileDownload,
  handleFileDelete,
  handleFileDownload,
  handleFileUpload,
  handleImageProxy,
  upload,
} from "../controller/storage.controller.js";

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
  validateParams(storageParamsSchema),
  handleImageProxy
);

router.get(
  "/download/*key",
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