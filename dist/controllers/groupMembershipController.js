"use strict";
// src/controllers/groupMembershipController.ts
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
exports.getGroupMembers = exports.removeGroupMember = exports.rejectGroupMembership = exports.acceptGroupMembership = exports.requestGroupMembership = void 0;
const prisma_1 = __importDefault(require("../prisma"));
// Request to join a group
const requestGroupMembership = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId; // Assuming userId is set by authentication middleware
    const groupId = req.params.groupId;
    try {
        // Check if the user already requested to join the group
        const existingRequest = yield prisma_1.default.groupMembership.findFirst({
            where: {
                groupId,
                userId,
            },
        });
        if (existingRequest) {
            return res.status(400).json({ error: 'You have already requested to join this group' });
        }
        // Create a new group membership request
        const membershipRequest = yield prisma_1.default.groupMembership.create({
            data: {
                groupId,
                userId,
                role: 'pending', // Use 'pending' or similar to indicate a request
            },
        });
        res.status(201).json({ membershipRequest, message: 'Request to join group sent successfully' });
    }
    catch (error) {
        console.error('Error requesting group membership:', error);
        res.status(500).json({ error: 'Failed to request group membership' });
    }
});
exports.requestGroupMembership = requestGroupMembership;
// src/controllers/groupMembershipController.ts
// Accept a membership request
const acceptGroupMembership = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminId = req.userId; // Assuming userId is set by authentication middleware
    const groupId = req.params.groupId;
    const { userId } = req.body; // ID of the user to accept
    try {
        // Verify the current user is the admin of the group
        const group = yield prisma_1.default.group.findUnique({
            where: { id: groupId },
        });
        if (!group || group.adminId !== adminId) {
            return res.status(403).json({ error: 'You are not authorized to accept members for this group' });
        }
        // Accept the membership request
        const updatedMembership = yield prisma_1.default.groupMembership.updateMany({
            where: {
                groupId,
                userId,
                role: 'pending', // Ensure it’s a pending request
            },
            data: {
                role: 'member', // Change role to 'member'
            },
        });
        if (updatedMembership.count === 0) {
            return res.status(404).json({ error: 'Membership request not found' });
        }
        res.status(200).json({ message: 'Membership request accepted' });
    }
    catch (error) {
        console.error('Error accepting group membership:', error);
        res.status(500).json({ error: 'Failed to accept group membership' });
    }
});
exports.acceptGroupMembership = acceptGroupMembership;
// src/controllers/groupMembershipController.ts
// Reject a membership request
const rejectGroupMembership = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminId = req.userId; // Assuming userId is set by authentication middleware
    const groupId = req.params.groupId;
    const { userId } = req.body; // ID of the user to reject
    try {
        // Verify the current user is the admin of the group
        const group = yield prisma_1.default.group.findUnique({
            where: { id: groupId },
        });
        if (!group || group.adminId !== adminId) {
            return res.status(403).json({ error: 'You are not authorized to reject members for this group' });
        }
        // Reject the membership request
        yield prisma_1.default.groupMembership.deleteMany({
            where: {
                groupId,
                userId,
                role: 'pending', // Ensure it’s a pending request
            },
        });
        res.status(200).json({ message: 'Membership request rejected' });
    }
    catch (error) {
        console.error('Error rejecting group membership:', error);
        res.status(500).json({ error: 'Failed to reject group membership' });
    }
});
exports.rejectGroupMembership = rejectGroupMembership;
// src/controllers/groupMembershipController.ts
// Remove a group member
const removeGroupMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminId = req.userId; // Assuming userId is set by authentication middleware
    const groupId = req.params.groupId;
    const { userId } = req.body; // ID of the user to remove
    try {
        // Verify the current user is the admin of the group
        const group = yield prisma_1.default.group.findUnique({
            where: { id: groupId },
        });
        if (!group || group.adminId !== adminId) {
            return res.status(403).json({ error: 'You are not authorized to remove members from this group' });
        }
        // Remove the group member
        yield prisma_1.default.groupMembership.deleteMany({
            where: {
                groupId,
                userId,
                role: 'member', // Ensure it’s a valid member
            },
        });
        res.status(200).json({ message: 'Group member removed successfully' });
    }
    catch (error) {
        console.error('Error removing group member:', error);
        res.status(500).json({ error: 'Failed to remove group member' });
    }
});
exports.removeGroupMember = removeGroupMember;
// src/controllers/groupMembershipController.ts
// Get all members of a group
const getGroupMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = req.params.groupId;
    try {
        const members = yield prisma_1.default.groupMembership.findMany({
            where: { groupId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true,
                    },
                },
            },
        });
        res.status(200).json(members);
    }
    catch (error) {
        console.error('Error fetching group members:', error);
        res.status(500).json({ error: 'Failed to fetch group members' });
    }
});
exports.getGroupMembers = getGroupMembers;
