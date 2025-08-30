import { ChevronDown } from 'lucide-react';

interface DropdownItem {
  label: string;
  path: string;
}

interface DropdownMenuProps {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  items: DropdownItem[];
  onNavigate: (path: string) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  icon,
  label,
  isOpen,
  setIsOpen,
  items,
  onNavigate,
}) => (
  <div className="relative">
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
    >
      {icon}
      <span className="font-medium">{label}</span>
      <ChevronDown className="w-4 h-4" />
    </button>

    {isOpen && (
      <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              onNavigate(item.path);
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
          >
            {item.label}
          </button>
        ))}
      </div>
    )}
  </div>
);

export default DropdownMenu;
