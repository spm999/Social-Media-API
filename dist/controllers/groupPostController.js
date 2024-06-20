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
exports.deleteGroupPost = exports.getGroupPosts = exports.createGroupPost = void 0;
const prisma_1 = __importDefault(require("../prisma"));
// Create a group post
const createGroupPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId; // Assuming userId is set by authentication middleware
    const groupId = req.params.groupId;
    const { content } = req.body;
    try {
        // Check if the user is a member of the group
        const isMember = yield prisma_1.default.groupMembership.findFirst({
            where: {
                groupId,
                userId,
                // Optional: Ensure the status is "active" if you have such a field
                // status: 'active'
            }
        });
        if (!isMember) {
            return res.status(403).json({ error: 'You must be a member of the group to create a post' });
        }
        const newPost = yield prisma_1.default.groupPost.create({
            data: {
                content,
                groupId,
                authorId: userId,
            },
        });
        res.status(201).json({ post: newPost, message: 'Group post created successfully' });
    }
    catch (error) {
        console.error('Error creating group post:', error);
        res.status(500).json({ error: 'Failed to create group post' });
    }
});
exports.createGroupPost = createGroupPost;
// Get posts for a specific group
const getGroupPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId; // Assuming userId is set by authentication middleware
    const groupId = req.params.groupId;
    try {
        // Check if the user is a member of the group
        const isMember = yield prisma_1.default.groupMembership.findFirst({
            where: {
                groupId,
                userId,
                // Optional: Ensure the status is "active" if you have such a field
                // status: 'active'
            }
        });
        if (!isMember) {
            return res.status(403).json({ error: 'You must be a member of the group to view posts' });
        }
        const posts = yield prisma_1.default.groupPost.findMany({
            where: { groupId },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(posts);
    }
    catch (error) {
        console.error('Error fetching group posts:', error);
        res.status(500).json({ error: 'Failed to fetch group posts' });
    }
});
exports.getGroupPosts = getGroupPosts;
const deleteGroupPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    const userId = req.userId; // Assuming userId is set by authentication middleware
    try {
        const post = yield prisma_1.default.groupPost.findUnique({
            where: { id: postId },
        });
        if (!post) {
            return res.status(404).json({ error: 'Group post not found' });
        }
        if (post.authorId !== userId) {
            // Check if user is admin
            const isAdmin = yield prisma_1.default.group.findFirst({
                where: {
                    id: post.groupId,
                    adminId: userId,
                },
            });
            if (!isAdmin) {
                return res.status(403).json({ error: 'You are not authorized to delete this post' });
            }
        }
        yield prisma_1.default.groupPost.delete({
            where: { id: postId },
        });
        res.status(200).json({ message: 'Group post deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting group post:', error);
        res.status(500).json({ error: 'Failed to delete group post' });
    }
});
exports.deleteGroupPost = deleteGroupPost;
