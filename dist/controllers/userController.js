"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileImage = exports.updateUserBio = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../prisma"));
const jwt_1 = require("../utils/jwt");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
//register the user
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = yield prisma_1.default.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username },
                ],
            },
        });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email or username already exists' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield prisma_1.default.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
        res.status(201).json({ user, message: 'User created successfully' });
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(400).json({ error: 'User registration failed' });
    }
});
exports.registerUser = registerUser;
//login
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: { email },
        });
        if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        // Update the lastLogin field
        yield prisma_1.default.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date().toISOString() },
        });
        const token = (0, jwt_1.generateToken)(user.id);
        // console.log(user.id, user.email, token)
        res.status(200).json({ user, token, message: 'Login successful' });
    }
    catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});
exports.loginUser = loginUser;
//add user bio
const updateUserBio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId; // Assuming userId is available in request
    try {
        const { bio } = req.body;
        const updatedUser = yield prisma_1.default.user.update({
            where: { id: userId },
            data: { bio },
        });
        res.status(200).json({ user: updatedUser, message: 'Bio updated successfully' });
    }
    catch (error) {
        console.error('Error updating user bio:', error);
        res.status(500).json({ error: 'Failed to update bio' });
    }
});
exports.updateUserBio = updateUserBio;
// const image="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
// export const updateProfileImage = async (req: Request, res: Response) => {
//   try {
//     // Check if image path is provided
//     if (!image) {
//       return res.status(400).json({ error: 'No image path provided' });
//     }
//     // Upload image to Cloudinary
//     cloudinary.uploader.upload(image, { folder: 'uploads' }, (error, result) => {
//       if (error || !result) {
//         console.error('Cloudinary upload error:', error);
//         return res.status(500).json({ error: 'Image upload failed' });
//       }
//       res.status(200).json({ url: result.secure_url });
//     });
//   } catch (error) {
//     console.error('Internal server error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };
const updateProfileImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Access the file using req.file, not req.image
    const file = req.file;
    try {
        // Check if file is uploaded
        if (!file) {
            return res.status(400).json({ error: 'No file found' });
        }
        // Upload image to Cloudinary
        cloudinary_1.default.uploader.upload_stream({ folder: 'uploads/users' }, (error, result) => {
            if (error || !result) {
                console.error('Cloudinary upload error:', error);
                return res.status(500).json({ error: 'Image upload failed' });
            }
            // Assuming userId is available in request
            const userId = req.userId;
            // Update user profile picture in the database
            prisma_1.default.user
                .update({
                where: { id: userId },
                data: {
                    profilePicture: result.secure_url, // Assuming result contains the secure URL
                },
            })
                .then((updatedUser) => {
                res.status(200).json({ user: updatedUser, message: 'Profile image updated successfully' });
            })
                .catch((error) => {
                console.error('Database update error:', error);
                res.status(500).json({ error: 'Failed to update profile image in database' });
            });
        }).end(file.buffer);
    }
    catch (error) {
        console.error('Internal server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.updateProfileImage = updateProfileImage;
