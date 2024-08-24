

import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import  JWT from 'jsonwebtoken';



export const registerController= async(req,res)=>{
try{
const {name,email,password,phone,address,answer}= req.body;
//validation
if(!name){
    return res.send({message:"Name is Required"});
}
if(!email){
    return res.send({message:"Email is Required"});
}
if(!password){
    return res.send({message:"password is Required"});
}
if(!phone){
    return res.send({message:"phone is Required"});
}
if(!address){
    return res.send({message:"address is Required"});
}
if(!answer){
    return res.send({message:"answer is Required"});
}
//check user
const exisitingUser = await userModel.findOne({email})
if(exisitingUser){
    return res.status(200).send({
        success:false,
        message:'Already Register please login',
    });
}
const hashedPassword = await hashPassword(password)
//save
const user = await new userModel({name,email,phone,address,password:hashedPassword,answer}).save() ;
res.status(201).send({
    success:true,
    message:'User register succefully',
    user
})

}
catch(error){
  console.log(error)
  res.status(500).send({
    success:false,
    message:"Error in Registration",
    error
  })
}

};

export const loginController =async(req,res)=>{
    try {
        const {email,password}=req.body
        if(!email||!password){
            return res.status(404).send({
                success:false,
                message:'invalid email or password'


            })
        }
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:'invalid email'


            })
        }
        const match = await comparePassword(password,user.password)
        if(!match){
            return res.status(200).send({
                success:false,
                message:'Invalid password'


            })

        }
        //token
        const token  = await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

        res.status(200).send({
            success:true,
            message:'login successfully',
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role

            },token



        })





    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in login'
            ,error
        })
        
    }

};

//forgotpassword

export const forgotPasswordController = async(req,res)=>{
  try {
    const{email,answer,newPassword} =req.body 
    if(!email){
        res.status(400).send({
            message:"email required"
        })
    }
    if(!answer){
        res.status(400).send({
            message:"answer required"
        })
    }
    if(!newPassword){
        res.status(400).send({
            message:"New Password is required"
        })
    }
    //check
    const user = await userModel.findOne({email,answer})
    if(!user){
        return  res.status(404).send({
            success:false,
            message:"something wrong",
            
        })
    }
    const hashed= await hashPassword(newPassword)
    await userModel.findByIdAndUpdate(user._id,{password:hashed})
    res.status(200).send({
        success:true,
        message:"Password reset",
        
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:"something wrong",
        error
    })
  }
}



//test controller

export const testController =(req,res)=>{
   try {
    res.send("protected route")
   } catch (error) {
    console.log(error)
    res.send({error})
    
   }
};
//admin 


export const updateProfileController = async (req, res) => {
    try {
      const { name, email, password, address, phone } = req.body;
      const user = await userModel.findById(req.user._id);
      //password
      if (password && password.length < 6) {
        return res.json({ error: "Passsword is required and 6 character long" });
      }
      const hashedPassword = password ? await hashPassword(password) : undefined;
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        {
          name: name || user.name,
          password: hashedPassword || user.password,
          phone: phone || user.phone,
          address: address || user.address,
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "Profile Updated SUccessfully",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error WHile Update profile",
        error,
      });
    }
  };

  export const getAllOrdersController = async (req, res) => {
    try {
      const orders = await orderModel
        .find({})
        .populate("products", "-photo")
        .populate("buyer", "name")
        .sort({ createdAt: "-1" });
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };