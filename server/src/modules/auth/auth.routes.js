import { Router } from "express";
import * as authController from '../auth/auth.controller.js';
import { requireAuth } from '../../middlewares/auth.js';
const router = Router();

router.post('/registerOwner',authController.registerOwner);
router.post('/login',authController.login);
router.post('/refresh',authController.refresh);
router.post('/logout',authController.logout);
router.get('/getMe',requireAuth,authController.getMe);

export default router;