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
exports.getLikesByUserId = exports.getLikesByPostId = exports.removeLike = exports.addLike = void 0;
const prisma_1 = __importDefault(require("../prisma"));
// Add a like to a post
const addLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.body;
    const userId = req.userId; // Assume userId is set by authentication middleware
    try {
        const post = yield prisma_1.default.post.findUnique({
            where: { id: postId },
            select: {
                id: true,
                visibility: true,
                authorId: true,
            },
        });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        // Check the post visibility
        if (post.visibility === 'private') {
            return res.status(403).json({ error: 'You cannot like a private post' });
        }
        if (post.visibility === 'friends') {
            // Check if the liker is a friend of the post author
            const isFriend = yield prisma_1.default.friendship.findFirst({
                where: {
                    status: 'accepted',
                    OR: [
                        { requesterId: userId, receiverId: post.authorId, status: 'accepted' },
                        { receiverId: userId, requesterId: post.authorId, status: 'accepted' }
                    ],
                },
            });
            if (!isFriend) {
                return res.status(403).json({ error: 'You can only like posts made by friends' });
            }
        }
        // Check if the like already exists
        const existingLike = yield prisma_1.default.like.findFirst({
            where: { postId, userId },
        });
        if (existingLike) {
            return res.status(400).json({ error: 'You have already liked this post' });
        }
        // Create a new like
        const like = yield prisma_1.default.like.create({
            data: {
                postId,
                userId,
            },
        });
        // Create a notification for the post author
        if (post.authorId !== userId) { // Don't notify if the user is liking their own post
            yield prisma_1.default.notification.create({
                data: {
                    userId: post.authorId, // Notify the post author
                    type: 'like',
                    data: {
                        postId,
                        likerId: userId,
                    },
                },
            });
        }
        res.status(201).json({ like, message: 'Post liked successfully' });
    }
    catch (error) {
        console.error('Error adding like:', error);
        res.status(500).json({ error: 'Failed to add like' });
    }
});
exports.addLike = addLike;
// Remove a like from a post
const removeLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.body;
    const userId = req.userId; // Assume userId is set by authentication middleware
    try {
        // Check if the like exists
        const existingLike = yield prisma_1.default.like.findFirst({
            where: { postId, userId },
        });
        if (!existingLike) {
            return res.status(404).json({ error: 'Like not found' });
        }
        // Delete the like
        yield prisma_1.default.like.delete({
            where: { id: existingLike.id },
        });
        // Fetch the post to get author details
        const post = yield prisma_1.default.post.findUnique({
            where: { id: postId },
        });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        // Remove the notification for the post author
        // Remove the notification for the post author
        if (post.authorId !== userId) {
            yield prisma_1.default.notification.deleteMany({
                where: {
                    userId: post.authorId,
                    type: 'like',
                    data: {
                        equals: {
                            postId,
                            likerId: userId,
                        },
                    },
                },
            });
        }
        res.status(200).json({ message: 'Like removed and notification deleted successfully' });
    }
    catch (error) {
        console.error('Error removing like:', error);
        res.status(500).json({ error: 'Failed to remove like' });
    }
});
exports.removeLike = removeLike;
// Get all likes for a specific post
const getLikesByPostId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    try {
        const likes = yield prisma_1.default.like.findMany({
            where: { postId },
            include: {
                user: { select: { id: true, profilePicture: true, username: true } }, // Select only needed user fields
            },
        });
        res.status(200).json(likes);
    }
    catch (error) {
        console.error('Error fetching likes:', error);
        res.status(500).json({ error: 'Failed to fetch likes' });
    }
});
exports.getLikesByPostId = getLikesByPostId;
// Get likes by user
const getLikesByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId; // Assume userId is set by authentication middleware
    try {
        const likes = yield prisma_1.default.like.findMany({
            where: { userId },
            include: {
                post: { select: { id: true, content: true, image: true, createdAt: true } }, // Select only needed post fields
            },
        });
        res.status(200).json(likes);
    }
    catch (error) {
        console.error('Error fetching likes by user:', error);
        res.status(500).json({ error: 'Failed to fetch likes' });
    }
});
exports.getLikesByUserId = getLikesByUserId;
