import express from 'express'
import { registerUser,verifyUser,loginUser, logoutUser, forgotPassword, changePassword, allUser, getUserById, updateUser } from '../Controller/userController.js';
import { isAdmin, isAuthenticated } from '../middleware/isAuthenticated.js';
import { singleUpload } from '../middleware/multer.js';

const router=express.Router();

router.post('/register' , registerUser)
router.post('/verify' , verifyUser)
router.post('/login' , loginUser)
router.post('/logout' ,isAuthenticated,  logoutUser)
router.post('/forgot-password' , forgotPassword)
router.post('/change-password/:email' , changePassword)
router.get('/all-user' ,isAuthenticated ,isAdmin, allUser);
router.get('/get-user/:userId', getUserById);
router.put("/update/:id" , isAuthenticated , updateUser)

export default router
