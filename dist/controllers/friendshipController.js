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
exports.getAllFriends = exports.rejectFriendRequest = exports.acceptFriendRequest = exports.sendFriendRequest = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const sendFriendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { receiverId } = req.body;
    const requesterId = req.userId; // Assume userId is set by an authentication middleware
    try {
        const existingRequest = yield prisma_1.default.friendship.findFirst({
            where: {
                requesterId,
                receiverId,
            },
        });
        if (existingRequest) {
            return res.status(400).json({ error: 'Friend request already sent' });
        }
        const friendship = yield prisma_1.default.friendship.create({
            data: {
                requesterId,
                receiverId,
                status: 'pending',
            },
        });
        // Create a notification for the receiver
        yield prisma_1.default.notification.create({
            data: {
                userId: receiverId, // Notify the receiver of the friend request
                type: 'friendRequest',
                data: {
                    requesterId, // Include requester ID in the notification data
                },
            },
        });
        res.status(201).json({ friendship, message: 'Friend request sent' });
    }
    catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).json({ error: 'Failed to send friend request' });
    }
});
exports.sendFriendRequest = sendFriendRequest;
const acceptFriendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { requesterId } = req.body;
    const receiverId = req.userId; // Assume userId is set by an authentication middleware
    try {
        const friendship = yield prisma_1.default.friendship.updateMany({
            where: {
                requesterId,
                receiverId,
                status: 'pending',
            },
            data: {
                status: 'accepted',
            },
        });
        if (friendship.count === 0) {
            return res.status(404).json({ error: 'Friend request not found' });
        }
        res.status(200).json({ message: 'Friend request accepted' });
    }
    catch (error) {
        console.error('Error accepting friend request:', error);
        res.status(500).json({ error: 'Failed to accept friend request' });
    }
});
exports.acceptFriendRequest = acceptFriendRequest;
const rejectFriendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { requesterId } = req.body;
    const receiverId = req.userId; // Assume userId is set by an authentication middleware
    try {
        const friendship = yield prisma_1.default.friendship.updateMany({
            where: {
                requesterId,
                receiverId,
                status: 'pending',
            },
            data: {
                status: 'declined',
            },
        });
        if (friendship.count === 0) {
            return res.status(404).json({ error: 'Friend request not found' });
        }
        res.status(200).json({ message: 'Friend request rejected' });
    }
    catch (error) {
        console.error('Error rejecting friend request:', error);
        res.status(500).json({ error: 'Failed to reject friend request' });
    }
});
exports.rejectFriendRequest = rejectFriendRequest;
const getAllFriends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId; // Assume userId is set by an authentication middleware
    try {
        const friendships = yield prisma_1.default.friendship.findMany({
            where: {
                OR: [
                    { requesterId: userId, status: 'accepted' },
                    { receiverId: userId, status: 'accepted' },
                ],
            },
            include: {
                //   requester: true,
                //   receiver: true,
                requester: {
                    select: {
                        profilePicture: true,
                        bio: true
                    }
                },
                receiver: {
                    select: {
                        profilePicture: true,
                        bio: true
                    }
                },
            },
        });
        const friends = friendships.map(friendship => friendship.requesterId === userId ? friendship.receiver : friendship.requester);
        res.status(200).json(friends);
    }
    catch (error) {
        console.error('Error fetching friends:', error);
        res.status(500).json({ error: 'Failed to fetch friends' });
    }
});
exports.getAllFriends = getAllFriends;
