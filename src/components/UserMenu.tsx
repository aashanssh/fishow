import { LogOut, User } from 'lucide-react';

interface UserMenuProps {
  username: string;
  onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ username, onLogout }) => (
  <div className="flex items-center space-x-4">
    <div className="flex items-center space-x-2">
      <User className="w-5 h-5 text-gray-500" />
      <span className="text-sm text-gray-700">{username}</span>
    </div>
    <button
      onClick={onLogout}
      className="flex items-center space-x-1 px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
    >
      <LogOut className="w-4 h-4" />
      <span className="text-sm">Logout</span>
    </button>
  </div>
);

export default UserMenu;
