import { getPendingUsers, updateUserStatus } from '../config/supabase.js';

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
        res.status(500).json({ error: error.message });
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

        // TODO: Send approval email (Phase 2 extension)

        res.status(200).json({
            message: 'User approved successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Admin Approve Error:', error);
        res.status(500).json({ error: error.message });
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

        // TODO: Send rejection email

        res.status(200).json({
            message: 'User rejected',
            user: updatedUser
        });
    } catch (error) {
        console.error('Admin Reject Error:', error);
        res.status(500).json({ error: error.message });
    }
};
