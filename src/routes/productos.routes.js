import { Router } from 'express'
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/products.controllers.js'
import { isAdmin } from '../middleware/authorization.middleware.js'

const productRouter = Router()

productRouter.get('/', getProducts)
productRouter.get('/:pid', getProduct)

// Solo admin puede crear, actualizar y eliminar
productRouter.post('/', isAdmin, createProduct)
productRouter.put('/:pid', isAdmin, updateProduct)
productRouter.delete('/:pid', isAdmin, deleteProduct)

export default productRouter
