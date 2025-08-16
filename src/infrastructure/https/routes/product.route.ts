import { authMiddleware } from "@/middlewares/authMiddleware.js";
import { requirePermission } from "@/middlewares/permissionMiddleware.js";
import { validateBody, validateParams } from "@/middlewares/validateRequestMiddleware.js";
import { imageIdSchema, imageKeysSchema } from "@/schema/image.schema.js";
import { createProductSchema, listProductSchema, productIdSchema, updateProductSchema } from "@/schema/product.schema.js";
import { handleAddProductImages, handleCreateProduct, handleDeleteProduct, handleDeleteProductImage, handleFindAllProducts, handleFindProduct, handleGetImageUrls, handleUpdateProduct } from "../controller/product.controller.js";
import { upload } from "../controller/storage.controller.js";
import express from 'express';


const router = express.Router();

router.post('/list',validateBody(listProductSchema),handleFindAllProducts);
router.get('/:id', validateParams(productIdSchema), handleFindProduct);
router.post('/images/urls', validateBody(imageKeysSchema), handleGetImageUrls);

router.use(authMiddleware, requirePermission(['ADMIN', 'MANAGER', 'SELLER']));

router.post('/',validateBody(createProductSchema),handleCreateProduct);

router.patch( '/:id', validateParams(productIdSchema), validateBody(updateProductSchema), handleUpdateProduct);

router.delete('/:id', validateParams(productIdSchema), handleDeleteProduct);

router.post('/images/:id', validateParams(productIdSchema),upload.array('images'),handleAddProductImages);

router.delete('/images/:imageId',validateParams(imageIdSchema),handleDeleteProductImage);

export default router;
