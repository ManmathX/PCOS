import express from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateAccessToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * POST /auth/register
 * Register new user (USER or DOCTOR role)
 */
router.post('/register', async (req, res) => {
    try {
        const { email, password, role, firstName, lastName, phone, dateOfBirth, specialization, licenseNumber } = req.body;

        // Validate required fields
        if (!email || !password || !role) {
            return res.status(400).json({ error: 'Email, password, and role are required' });
        }

        if (!['USER', 'DOCTOR'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role. Must be USER or DOCTOR' });
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
                firstName,
                lastName,
                phone,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            },
        });

        // If doctor, create doctor profile
        if (role === 'DOCTOR') {
            await prisma.doctor.create({
                data: {
                    userId: user.id,
                    specialization,
                    licenseNumber,
                },
            });
        }

        // Generate token
        const token = generateAccessToken(user);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

/**
 * POST /auth/login
 * Email + password login
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = generateAccessToken(user);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
});

/**
 * GET /auth/me
 * Get current user profile
 */
router.get("/me", authenticateToken, async (req, res) => {
    try {
        // Assumes auth middleware has attached req.user
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                role: true,
                firstName: true,
                lastName: true,
                phone: true,
                dateOfBirth: true,
                createdAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

/**
 * POST /auth/otp/send
 * Send OTP to user's phone (placeholder for now)
 */
router.post('/otp/send', async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ error: 'Phone number is required' });
        }

        // TODO: Integrate with SMS provider (Twilio, AWS SNS, etc.)
        // For now, return success with placeholder OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        console.log(`[OTP] Sending OTP ${otp} to ${phone}`);

        res.json({
            message: 'OTP sent successfully',
            // In production, DO NOT return OTP in response!
            otp: process.env.NODE_ENV === 'development' ? otp : undefined,
        });
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

/**
 * POST /auth/otp/verify
 * Verify OTP and login (placeholder for now)
 */
router.post('/otp/verify', async (req, res) => {
    try {
        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({ error: 'Phone and OTP are required' });
        }

        // TODO: Verify OTP from cache/database
        // Placeholder logic

        // Find or create user with phone
        let user = await prisma.user.findFirst({ where: { phone } });

        if (!user) {
            return res.status(404).json({ error: 'User not found with this phone number' });
        }

        const token = generateAccessToken(user);

        res.json({
            message: 'OTP verified successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ error: 'Failed to verify OTP' });
    }
});

export default router;
