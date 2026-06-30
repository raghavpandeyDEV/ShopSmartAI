import express from 'express';

import { isAdmin,isAuthenticated } from '../middleware/isAuthenticated.js';
import { addToCart, getCart, removeFromCart, updateQuantity } from '../Controller/cartController.js';

const router = express.Router();

router.get('/', isAuthenticated, getCart);
router.post('/add',isAuthenticated,addToCart)
router.put('/update' , isAuthenticated , updateQuantity)
router.delete('/remove', isAuthenticated , removeFromCart)


 
export default router;