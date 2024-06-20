"use strict";
// src/controllers/groupController.ts
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
exports.deleteGroup = exports.updateGroup = exports.getGroupById = exports.createGroup = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const createGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId; // Assuming userId is set by authentication middleware
    const { name, description } = req.body;
    try {
        const newGroup = yield prisma_1.default.group.create({
            data: {
                name,
                description,
                adminId: userId, // Set the creator as admin
                memberships: {
                    create: {
                        userId: userId,
                        role: 'admin', // Set the role of the creator as admin
                    },
                },
            },
            include: {
                memberships: true,
            },
        });
        res.status(201).json({ group: newGroup, message: 'Group created successfully' });
    }
    catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ error: 'Failed to create group' });
    }
});
exports.createGroup = createGroup;
const getGroupById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = req.params.groupId;
    try {
        const group = yield prisma_1.default.group.findUnique({
            where: { id: groupId },
            include: { memberships: true, posts: true },
        });
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        res.status(200).json(group);
    }
    catch (error) {
        console.error('Error fetching group by ID:', error);
        res.status(500).json({ error: 'Failed to fetch group' });
    }
});
exports.getGroupById = getGroupById;
const updateGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = req.params.groupId;
    const userId = req.userId; // Assume userId is set by authentication middleware
    const { name, description } = req.body;
    try {
        // Fetch the group to check the admin
        const group = yield prisma_1.default.group.findUnique({
            where: { id: groupId },
            select: { adminId: true },
        });
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        // Check if the current user is the admin of the group
        if (group.adminId !== userId) {
            return res.status(403).json({ error: 'Only the group admin can update the group' });
        }
        const updatedGroup = yield prisma_1.default.group.update({
            where: { id: groupId },
            data: { name, description },
        });
        res.status(200).json({ group: updatedGroup, message: 'Group updated successfully' });
    }
    catch (error) {
        console.error('Error updating group:', error);
        res.status(500).json({ error: 'Failed to update group' });
    }
});
exports.updateGroup = updateGroup;
const deleteGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = req.params.groupId;
    const userId = req.userId; // Assume userId is set by authentication middleware
    try {
        // Fetch the group to check the admin
        const group = yield prisma_1.default.group.findUnique({
            where: { id: groupId },
            select: { adminId: true },
        });
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        // Check if the current user is the admin of the group
        if (group.adminId !== userId) {
            return res.status(403).json({ error: 'Only the group admin can delete the group' });
        }
        // Proceed with deleting the group
        yield prisma_1.default.group.delete({
            where: { id: groupId },
        });
    }
    catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({ error: 'Failed to delete group' });
    }
});
exports.deleteGroup = deleteGroup;
