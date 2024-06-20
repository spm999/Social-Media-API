"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
router.post('/register', userController_1.registerUser);
router.post('/login', userController_1.loginUser);
router.put('/update-bio', auth_1.authMiddleware, userController_1.updateUserBio);
router.post('/upload-pimg', upload.single('image'), auth_1.authMiddleware, userController_1.updateProfileImage);
exports.default = router;
