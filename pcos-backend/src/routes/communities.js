import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /communities
 * List all communities (or doctor-only communities)
 */
router.get('/', async (req, res) => {
    try {
        const userId = req.user.id;

        const communities = await prisma.community.findMany({
            where: {
                OR: [
                    { isPrivate: false },
                    { members: { some: { userId } } },
                ],
            },
            include: {
                creator: {
                    select: { id: true, firstName: true, lastName: true, role: true },
                },
                _count: {
                    select: { members: true, posts: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json({ communities });
    } catch (error) {
        console.error('Get communities error:', error);
        res.status(500).json({ error: 'Failed to fetch communities' });
    }
});

/**
 * POST /communities
 * Create a new community
 */
router.post('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, description, isPrivate } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Community name is required' });
        }

        const community = await prisma.community.create({
            data: {
                name,
                description,
                isPrivate: isPrivate || false,
                creatorId: userId,
                members: {
                    create: {
                        userId,
                        role: 'ADMIN',
                    },
                },
            },
            include: {
                creator: {
                    select: { id: true, firstName: true, lastName: true },
                },
            },
        });

        res.status(201).json({ community, message: 'Community created successfully' });
    } catch (error) {
        console.error('Create community error:', error);
        res.status(500).json({ error: 'Failed to create community' });
    }
});

/**
 * GET /communities/:id
 * Get community details with posts
 */
router.get('/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const community = await prisma.community.findUnique({
            where: { id },
            include: {
                creator: {
                    select: { id: true, firstName: true, lastName: true },
                },
                members: {
                    include: {
                        user: {
                            select: { id: true, firstName: true, lastName: true, role: true },
                        },
                    },
                },
                posts: {
                    include: {
                        author: {
                            select: { id: true, firstName: true, lastName: true },
                        },
                        _count: {
                            select: { replies: true },
                        },
                    },
                    orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
                },
            },
        });

        if (!community) {
            return res.status(404).json({ error: 'Community not found' });
        }

        // Check access
        const isMember = community.members.some(m => m.userId === userId);
        if (community.isPrivate && !isMember) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json({ community });
    } catch (error) {
        console.error('Get community error:', error);
        res.status(500).json({ error: 'Failed to fetch community' });
    }
});

/**
 * POST /communities/:id/join
 * Join a community
 */
router.post('/:id/join', async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const community = await prisma.community.findUnique({
            where: { id },
        });

        if (!community) {
            return res.status(404).json({ error: 'Community not found' });
        }

        const member = await prisma.communityMember.create({
            data: {
                communityId: id,
                userId,
                role: 'MEMBER',
            },
        });

        res.status(201).json({ member, message: 'Joined community successfully' });
    } catch (error) {
        console.error('Join community error:', error);
        res.status(500).json({ error: 'Failed to join community' });
    }
});

/**
 * POST /communities/:id/posts
 * Create a post in a community
 */
router.post('/:id/posts', async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Post content is required' });
        }

        // Check membership
        const member = await prisma.communityMember.findUnique({
            where: {
                communityId_userId: {
                    communityId: id,
                    userId,
                },
            },
        });

        if (!member) {
            return res.status(403).json({ error: 'You must be a member to post' });
        }

        const post = await prisma.communityPost.create({
            data: {
                communityId: id,
                authorId: userId,
                content,
            },
            include: {
                author: {
                    select: { id: true, firstName: true, lastName: true },
                },
            },
        });

        res.status(201).json({ post, message: 'Post created successfully' });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

/**
 * POST /communities/:communityId/posts/:postId/replies
 * Reply to a post
 */
router.post('/:communityId/posts/:postId/replies', async (req, res) => {
    try {
        const userId = req.user.id;
        const { postId } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Reply content is required' });
        }

        const reply = await prisma.communityPostReply.create({
            data: {
                postId,
                authorId: userId,
                content,
            },
            include: {
                author: {
                    select: { id: true, firstName: true, lastName: true },
                },
            },
        });

        res.status(201).json({ reply, message: 'Reply added successfully' });
    } catch (error) {
        console.error('Create reply error:', error);
        res.status(500).json({ error: 'Failed to create reply' });
    }
});

export default router;
