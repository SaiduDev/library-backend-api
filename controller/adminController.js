import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

export const createAccount = async(req, res)=>{
    try {
        let {fullname, email, contact, password, role} = req.body;

        let checkUser = await pool.query("SELECT * FROM admin WHERE email = $1", [email]);

        if(checkUser.rows.length > 0){
            return res.status(409).json({message: "email already existed"});
        }

        let hashedPassword = await bcrypt.hash(password, 10);
        
        let userInfo = await pool.query("INSERT INTO admin (fullname, email, contact, password, role) VALUES($1, $2, $3, $4, $5) RETURNING *", [fullname, email, contact, hashedPassword, role]);

        let token = jwt.sign(
            {
            id: userInfo.rows[0].id, 
            role: userInfo.rows[0].role
             },
            process.env.JWT_Secret,
            {expiresIn: "4h"}
        );

        res.status(201).json({
            success: true,
            message: "Admin created successfully",
            token
        });
        
        
    } catch (error) {
        res.status(500).json({message: "failed to create admin account", error: error.message})
        console.error(error);
        
    }
}

export const adminLogin = async(req, res)=>{
    try {
        let {email, password} = req.body;

        let adminEmail = await pool.query("SELECT * FROM admin WHERE email = $1", [email]);

        if(adminEmail.rows.length === 0){
            return res.status(409).json({message: "email already existed"});
        }

        let admin = adminEmail.rows[0];

        let checkPassword = await bcrypt.compare(password, admin.password);

        if(!checkPassword){
            return res.status(401).json({message: "incorrect password"});
        }

        let token = jwt.sign(
            {id: admin.id, role: admin.role},
            process.env.JWT_Secret,
            {expiresIn: "4h"}
        );

        res.status(201).json({
            success: true,
            message: "Log in successfully",
            token
        });

        
    } catch (error) {
         res.status(500).json({message: "failed to login admin", error: error.message})
        console.error(error);
        
    }
}

export const getUserProfile = async (req, res) => {
    try {
        let id = req.user.id;
        let profile = await pool.query("SELECT fullname, email, contact, role FROM admin WHERE id = $1", [id]);

        res.status(200).json(profile.rows[0]);
        
    } catch (error) {
         res.status(500).json({message: "failed to fetch profile", error: error.message})
        console.error(error);
    }
}

export const updateAdminProfile = async (req, res) => {
    try {
        let user_id = req.user.id;
        let {fullname, email, contact} = req.body;

        let newProfile = await pool.query("UPDATE admin SET fullname = $1, email = $2, contact = $3 WHERE id = $4 RETURNING *", [fullname, email, contact, user_id]);

        res.status(201).json({message: "profile updated"})
 
    } catch (error) {
         res.status(500).json({message: "failed to update profile", error: error.message})
        console.error(error);
    }
}