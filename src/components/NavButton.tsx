interface NavButtonProps {
  label: string;
  onClick: () => void;
}
const NavButton: React.FC<NavButtonProps> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium"
  >
    {label}
  </button>
);

export default NavButton;
