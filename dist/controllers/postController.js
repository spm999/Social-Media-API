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
exports.deletePostById = exports.updatePostById = exports.getAllPosts = exports.getAllPublicPosts = exports.createPost = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
// Create a new post
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const image = req.file;
    const { content, visibility } = req.body;
    const authorId = req.userId; // Assuming userId is attached to the request object
    if (!image) {
        return res.status(400).json({ error: 'No file found' });
    }
    try {
        // Upload image to Cloudinary
        cloudinary_1.default.uploader.upload_stream({ folder: 'uploads/post' }, (error, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (error || !result) {
                console.error('Cloudinary upload error:', error);
                return res.status(500).json({ error: 'Image upload failed' });
            }
            try {
                // Create post in the database
                const post = yield prisma_1.default.post.create({
                    data: {
                        content,
                        image: result.secure_url, // Use Cloudinary secure URL
                        authorId,
                        visibility,
                    },
                });
                res.status(201).json({ post, message: 'Post created successfully' });
            }
            catch (dbError) {
                console.error('Error creating post:', dbError);
                res.status(500).json({ error: 'Failed to create post' });
            }
        })).end(image.buffer);
    }
    catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        res.status(500).json({ error: 'Image upload failed' });
    }
});
exports.createPost = createPost;
// Get all posts
const getAllPublicPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield prisma_1.default.post.findMany({
            where: {
                visibility: 'public',
            },
        });
        res.status(200).json(posts);
    }
    catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});
exports.getAllPublicPosts = getAllPublicPosts;
//Get all posts for authenticated users
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId; // Assume userId is set by an authentication middleware
    try {
        // Find posts that are public
        const publicPosts = yield prisma_1.default.post.findMany({
            where: { visibility: 'public' },
        });
        // Find posts that are friends-only and the user is a friend of the author
        const friendsPosts = yield prisma_1.default.post.findMany({
            where: {
                AND: [
                    { visibility: 'friends' },
                    {
                        author: {
                            friendshipsReceived: {
                                some: {
                                    requesterId: userId,
                                    status: 'accepted',
                                },
                            },
                        },
                    },
                ],
            },
        });
        // Find posts that belong to the current user
        const userPosts = yield prisma_1.default.post.findMany({
            where: { authorId: userId },
        });
        // Combine all posts and remove duplicates
        const allPosts = [...publicPosts, ...friendsPosts, ...userPosts];
        // Removing duplicates
        const uniquePosts = Array.from(new Set(allPosts.map(post => post.id)))
            .map(id => allPosts.find(post => post.id === id));
        res.status(200).json(uniquePosts);
    }
    catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});
exports.getAllPosts = getAllPosts;
// Update a post by ID
const updatePostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    const { content, visibility } = req.body;
    const image = req.file;
    // console.log(image, content, visibility)
    try {
        let imageUrl;
        if (image) {
            // Upload the new image to Cloudinary
            const result = yield new Promise((resolve, reject) => {
                cloudinary_1.default.uploader.upload_stream({ folder: 'uploads/post' }, (error, result) => {
                    if (error || !result) {
                        return reject(error);
                    }
                    resolve(result);
                }).end(image.buffer);
            });
            imageUrl = result.secure_url;
        }
        // Update post in the database
        const updatedPost = yield prisma_1.default.post.update({
            where: { id: postId },
            data: Object.assign({ content,
                visibility }, (imageUrl && { image: imageUrl })),
        });
        res.status(200).json({ post: updatedPost, message: 'Post updated successfully' });
    }
    catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Failed to update post' });
    }
});
exports.updatePostById = updatePostById;
// Delete a post by ID
const deletePostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    try {
        yield prisma_1.default.post.delete({
            where: { id: postId },
        });
        res.status(200).json({ message: 'Post deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});
exports.deletePostById = deletePostById;
