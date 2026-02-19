// configController.js
// Returns UI configuration (navigation, permissions) based on the authenticated user's role.
// All role-based logic lives here in the backend — the frontend is a thin client.

class ConfigController {
    /**
     * GET /api/auth/config
     * Returns navigation items and permissions for the logged-in user's role.
     */
    async getConfig(req, res) {
        const { role } = req.user;

        // ── Navigation items per role ────────────────────────
        const NAV_MAP = {
            USER: [
                { id: 'dashboard',    label: 'Dashboard',       icon: '📊' },
                { id: 'transactions', label: 'Transaksi',       icon: '📋' },
                { id: 'profile',      label: 'Profil',          icon: '👤' },
            ],
            ADMIN: [
                { id: 'dashboard',    label: 'Dashboard',       icon: '📊' },
                { id: 'transactions', label: 'Transaksi',       icon: '📋' },
                { id: 'users',        label: 'Kelola Pengguna', icon: '👥' },
                { id: 'products',     label: 'Produk',          icon: '📦' },
                { id: 'categories',   label: 'Kategori',        icon: '🗂️' },
                { id: 'analytics',    label: 'Analitik',        icon: '📈' },
                { id: 'profile',      label: 'Profil',          icon: '👤' },
            ],
        };

        // ── Permissions per role ─────────────────────────────
        const PERMISSIONS_MAP = {
            USER: {
                dashboardType:          'user',
                canCreateTransaction:   true,
                canTopUpSelf:           true,
                canViewOwnTransactions: true,
                canManageUsers:         false,
                canManageProducts:      false,
                canManageCategories:    false,
                canManageTransactions:  false,
                canViewAnalytics:       false,
                canTopUpOthers:         false,
                canChangeRoles:         false,
                canDeleteUsers:         false,
            },
            ADMIN: {
                dashboardType:          'admin',
                canCreateTransaction:   false,
                canTopUpSelf:           true,
                canViewOwnTransactions: true,
                canManageUsers:         true,
                canManageProducts:      true,
                canManageCategories:    true,
                canManageTransactions:  true,
                canViewAnalytics:       true,
                canTopUpOthers:         true,
                canChangeRoles:         true,
                canDeleteUsers:         true,
            },
        };

        const navigation  = NAV_MAP[role]         || NAV_MAP.USER;
        const permissions  = PERMISSIONS_MAP[role]  || PERMISSIONS_MAP.USER;

        return res.json({
            success: true,
            role,
            navigation,
            permissions,
        });
    }
}

module.exports = new ConfigController();
