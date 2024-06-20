"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/likeRoutes.ts
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const likeController_1 = require("../controllers/likeController");
const router = express_1.default.Router();
router.post('/likes', auth_1.authMiddleware, likeController_1.addLike);
router.delete('/likes', auth_1.authMiddleware, likeController_1.removeLike);
router.get('/posts/:postId/likes', auth_1.authMiddleware, likeController_1.getLikesByPostId);
router.get('/likes/user', auth_1.authMiddleware, likeController_1.getLikesByUserId);
exports.default = router;
