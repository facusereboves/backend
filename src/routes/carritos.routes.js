import { Router } from "express";
import { getCart, createCart, insertProductCart, updateProductsCart, updateQuantityProductCart, deleteCart, deleteProductCart } from "../controllers/carts.controllers.js";
import authenticateToken from "../middleware/auth.middleware.js";
import { isUserOrAdmin } from "../middleware/authorization.middleware.js";

const cartRouter = Router();

cartRouter.get('/:cid', authenticateToken, isUserOrAdmin, getCart);
cartRouter.post('/', authenticateToken, createCart);

// Solo usuarios autenticados (dueños o admin) pueden agregar productos
cartRouter.post('/:cid/products/:pid', authenticateToken, isUserOrAdmin, insertProductCart);

cartRouter.put('/:cid', authenticateToken, isUserOrAdmin, updateProductsCart);
cartRouter.put('/:cid/products/:pid', authenticateToken, isUserOrAdmin, updateQuantityProductCart);
cartRouter.delete('/:cid', authenticateToken, isUserOrAdmin, deleteCart);
cartRouter.delete('/:cid/products/:pid', authenticateToken, isUserOrAdmin, deleteProductCart);

export default cartRouter;
