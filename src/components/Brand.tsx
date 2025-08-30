import { Fish } from 'lucide-react';

const Brand: React.FC = () => (
  <div className="flex items-center space-x-3">
    <div className="bg-blue-100 p-2 rounded-lg">
      <Fish className="w-6 h-6 text-blue-600" />
    </div>
    <div>
      <h1 className="text-xl font-bold text-gray-900">Fishow</h1>
      <p className="text-xs text-gray-500">Popular Fish ERP</p>
    </div>
  </div>
);

export default Brand;
