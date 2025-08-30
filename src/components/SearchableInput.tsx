import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, X } from 'lucide-react';

interface SearchableInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  searchData: Array<{ id: string; name: string; [key: string]: any }>;
  onSelect: (item: any) => void;
  createRoute: string;
  entityType: string;
  className?: string;
  disabled?: boolean;
}

const SearchableInput: React.FC<SearchableInputProps> = ({
  value,
  onChange,
  placeholder,
  searchData,
  onSelect,
  createRoute,
  entityType,
  className = '',
  disabled = false,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredData, setFilteredData] = useState<Array<{ id: string; name: string; [key: string]: any }>>([]);
  const [selectedItem, setSelectedItem] = useState<{ id: string; name: string; [key: string]: any } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set selected item when value changes externally
    if (value && !selectedItem) {
      const item = searchData.find(item => item.id === value);
      if (item) {
        setSelectedItem(item);
        setSearchTerm(item.name);
      }
    }
  }, [value, searchData, selectedItem]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredData([]);
      return;
    }

    const filtered = searchData.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, searchData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(true);
    
    if (newValue === '') {
      setSelectedItem(null);
      onChange('');
    }
  };

  const handleSelect = (item: { id: string; name: string; [key: string]: any }) => {
    setSelectedItem(item);
    setSearchTerm(item.name);
    setIsOpen(false);
    onChange(item.id);
    onSelect(item);
  };

  const handleCreateNew = () => {
    navigate(createRoute);
  };

  const handleClear = () => {
    setSelectedItem(null);
    setSearchTerm('');
    onChange('');
    setIsOpen(false);
  };

  const handleFocus = () => {
    if (searchTerm.trim() !== '') {
      setIsOpen(true);
    }
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          {selectedItem ? (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <Search className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredData.length > 0 ? (
            <>
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-900">{item.name}</div>
                  {item.id && (
                    <div className="text-sm text-gray-500">ID: {item.id}</div>
                  )}
                </div>
              ))}
              <div className="border-t border-gray-200">
                <button
                  onClick={handleCreateNew}
                  className="w-full px-3 py-2 text-left text-blue-600 hover:bg-blue-50 flex items-center space-x-2"
                  type="button"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create new {entityType}</span>
                </button>
              </div>
            </>
          ) : searchTerm.trim() !== '' ? (
            <div className="px-3 py-4 text-center">
              <div className="text-gray-500 mb-2">No {entityType} found</div>
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 mx-auto"
                type="button"
              >
                <Plus className="w-4 h-4" />
                <span>Create new {entityType}</span>
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchableInput;
