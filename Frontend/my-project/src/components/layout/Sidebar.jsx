import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      logout();
      navigate('/login');
    }
  };

  const baseLink = "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors";
  const activeLink = "bg-blue-600 text-white";
  const inactiveLink = "text-gray-600 hover:bg-gray-100";

  const NavItem = ({ to, icon, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${baseLink} ${isActive ? activeLink : inactiveLink}`
      }
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </NavLink>
  );

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600">DigiWallet</h1>
        <p className="text-sm text-gray-500 mt-1">
          {isAdmin() ? 'Administrator' : 'User Dashboard'}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <NavItem to="/" icon="🏠" label="Dashboard" />
        <NavItem to="/transactions" icon="💰" label="Transaksi" />
        <NavItem to="/products" icon="📦" label="Produk" />
        <NavItem to="/categories" icon="📂" label="Kategori" />
        
        {isAdmin() && (
          <>
            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Admin
              </p>
            </div>
            <NavItem to="/reports" icon="📊" label="Laporan" />
            <NavItem to="/users" icon="👥" label="Kelola User" />
          </>
        )}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800 truncate">{user?.name || 'User'}</p>
            <p className="text-sm text-gray-500 truncate">{user?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
        >
          <span>🚪</span>
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
