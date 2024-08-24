import express from "express";
import {registerController,loginController,testController, forgotPasswordController, updateProfileController, getAllOrdersController} from '../controllers/authController.js'
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
const router =express.Router()
//register
router.post('/register',registerController)
//login
router.post('/login',loginController)
//forget password

router.post('/forgot-password',forgotPasswordController)


//test router
router.get('/test',requireSignIn,isAdmin,testController)

router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
  });

  router.get("/admin-auth", requireSignIn,isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
  });
  router.put("/profile", requireSignIn, updateProfileController);


  router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

export default router