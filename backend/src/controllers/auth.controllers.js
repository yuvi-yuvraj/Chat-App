import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/utils.js";
import cloudinary from "../utils/cloudinary.js"

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if(password.length < 6){
            return res.status(400).json({message: "assword must be at least 6 characters"});
        }

        const user = await User.findOne({email})

        if (user) return res.status(400).json({message: "Email is already exists"});

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password:hashedPassword
        })

        if(newUser){
            // can jwt token
            generateToken(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic: newUser.profilePic,
            });
        }
        else{
            res.status(400).json({message: "Invalid data"});
        }
    } catch (error) {
        console.log("error in signup controller", error.message);
        res.status(500).json({message: "Invalid server error"});
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message: "invalid credential"})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!isPasswordCorrect){
            return res.status(400).json({message: "invalid credential"})
        }

        generateToken(user._id, res)

        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
        })
    } catch (error) {
        console.log("Error in login controller", error.message);

        res.status(500).json({message: "Internal server error"});
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge:0})
        res.status(200).json({message: "logout successfully"});
    } catch (error) {
        console.log("Error in logout controller", error.message);

        res.status(500).json({message: "Internal server error"});
    }
};

export const updateProfile = async (req, res) => {
    try {
        const {updatePic} = req.body;
        const userId = req.user._id;

        if(!profilePic){
            res.status(400).json({message: "profilPic required"});
        }
        
        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updateUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url}, {new:true})

        res.status(200).json(updateUser);
    } catch (error) {
        console.log("error in updated profile: ", error.message);
        res.status(500).json({message: "Internal server error"});
    }
};

export const CheckAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("error in authcontroll: ", error.message);
        res.status(500).json({message: "Internal server error"});
    }
};