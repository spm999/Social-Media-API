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
exports.deleteComment = exports.updateComment = exports.getCommentsByPostId = exports.getCommentById = exports.createComment = void 0;
const prisma_1 = __importDefault(require("../prisma"));
// Create a comment
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId; // Assume userId is set by authentication middleware
    const postId = req.params.postId;
    const { content } = req.body;
    try {
        // Fetch the post to check its visibility and author
        const post = yield prisma_1.default.post.findUnique({
            where: { id: postId },
            select: {
                visibility: true,
                authorId: true,
            }
        });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        // Check if the post is private
        if (post.visibility === 'private') {
            return res.status(403).json({ error: 'You cannot comment on private posts' });
        }
        // Check if the post is friends-only and if the commenter is a friend of the post author
        if (post.visibility === 'friends') {
            const isFriend = yield prisma_1.default.friendship.findFirst({
                where: {
                    OR: [
                        { requesterId: userId, receiverId: post.authorId, status: 'accepted' },
                        { receiverId: userId, requesterId: post.authorId, status: 'accepted' }
                    ]
                }
            });
            // If not friends, return an error
            if (!isFriend) {
                return res.status(403).json({ error: 'You can only comment on friends-only posts if you are friends with the author' });
            }
        }
        // Create the comment
        const newComment = yield prisma_1.default.comment.create({
            data: {
                content,
                postId,
                authorId: userId,
            },
        });
        // Create a notification for the post author
        if (post.authorId !== userId) { // Don't notify if the user is commenting on their own post
            yield prisma_1.default.notification.create({
                data: {
                    userId: post.authorId, // Notify the post author
                    type: 'comment',
                    data: {
                        postId,
                        commenterId: userId,
                        commentId: newComment.id
                    },
                },
            });
        }
        res.status(201).json({ comment: newComment, message: 'Comment created successfully' });
    }
    catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Failed to create comment' });
    }
});
exports.createComment = createComment;
const getCommentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.commentId;
    // console.log(commentId)
    try {
        const comment = yield prisma_1.default.comment.findUnique({
            where: { id: commentId },
        });
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.status(200).json(comment);
    }
    catch (error) {
        console.error('Error fetching comment by ID:', error);
        res.status(500).json({ error: 'Failed to fetch comment' });
    }
});
exports.getCommentById = getCommentById;
const getCommentsByPostId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    // console.log(postId)
    try {
        const comments = yield prisma_1.default.comment.findMany({
            where: { postId: postId },
            orderBy: { createdAt: 'asc' },
        });
        res.status(200).json(comments);
    }
    catch (error) {
        console.error('Error fetching comments for post:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});
exports.getCommentsByPostId = getCommentsByPostId;
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.commentId;
    const { content } = req.body;
    const userId = req.userId;
    try {
        const comment = yield prisma_1.default.comment.findUnique({
            where: { id: commentId },
        });
        if (!comment || comment.authorId !== userId) {
            return res.status(404).json({ error: 'Comment not found or not authorized' });
        }
        const updatedComment = yield prisma_1.default.comment.update({
            where: { id: commentId },
            data: { content },
        });
        res.status(200).json({ comment: updatedComment, message: 'Comment updated successfully' });
    }
    catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ error: 'Failed to update comment' });
    }
});
exports.updateComment = updateComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.commentId;
    const userId = req.userId;
    try {
        const comment = yield prisma_1.default.comment.findUnique({
            where: { id: commentId },
        });
        if (!comment || comment.authorId !== userId) {
            return res.status(404).json({ error: 'Comment not found or not authorized' });
        }
        yield prisma_1.default.comment.delete({
            where: { id: commentId },
        });
        res.status(200).json({ message: 'Comment deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Failed to delete comment' });
    }
});
exports.deleteComment = deleteComment;
