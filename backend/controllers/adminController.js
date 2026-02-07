import { getPendingUsers, updateUserStatus, getUserById } from '../config/supabase.js';
import { sendApprovalEmail, sendRejectionEmail } from '../services/EmailService.js';

/**
 * Get all pending users
 * GET /api/admin/pending
 */
export const getPendingList = async (req, res) => {
    try {
        const users = await getPendingUsers();
        res.status(200).json({ users });
    } catch (error) {
        console.error('Admin Get Pending Error:', error);
        res.status(500).json({ error: 'Failed to fetch pending users' });
    }
};

/**
 * Approve a user
 * POST /api/admin/approve/:id
 */
export const approveUser = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user?.id; // Assumes middleware sets req.user

        const updatedUser = await updateUserStatus(id, 'active', adminId);

        // Send approval email (non-blocking)
        const profile = await getUserById(id).catch(() => null);
        if (profile?.email) {
            sendApprovalEmail(profile.email, profile.full_name).catch(() => {});
        }

        res.status(200).json({
            message: 'User approved successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Admin Approve Error:', error);
        res.status(500).json({ error: 'Failed to approve user' });
    }
};

/**
 * Reject a user
 * POST /api/admin/reject/:id
 */
export const rejectUser = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user?.id;

        const updatedUser = await updateUserStatus(id, 'rejected', adminId);

        // Send rejection email (non-blocking)
        const profile = await getUserById(id).catch(() => null);
        if (profile?.email) {
            sendRejectionEmail(profile.email, profile.full_name).catch(() => {});
        }

        res.status(200).json({
            message: 'User rejected',
            user: updatedUser
        });
    } catch (error) {
        console.error('Admin Reject Error:', error);
        res.status(500).json({ error: 'Failed to reject user' });
    }
};
