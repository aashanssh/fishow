import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminBoard from '../../components/AdminBoard';
import SearchableInput from '../../components/SearchableInput';
import { Plus, Trash2, Save } from 'lucide-react';
import { supabase } from '../../database/supabase';

interface BoxSentItem {
  id: string;
  customer: string;
  boxCount: string;
}

const FishBoxSentForm: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<{ id: string; name: string }[]>(
    []
  );
  const [parties, setParties] = useState<{ id: string; name: string }[]>([]);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [party, setParty] = useState('');
  const [items, setItems] = useState<BoxSentItem[]>([
    { id: '1', customer: '', boxCount: '' },
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: custData } = await supabase
        .from('customers')
        .select('id, name')
        .order('name');
      const { data: partyData } = await supabase
        .from('parties')
        .select('id, name')
        .order('name');

      if (custData) setCustomers(custData);
      if (partyData) setParties(partyData);
    };

    fetchData();
  }, []);

  const addItem = () => {
    const newItem: BoxSentItem = {
      id: Date.now().toString(),
      customer: '',
      boxCount: '',
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof BoxSentItem, value: string) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleCustomerSelect = (itemId: string, customer: { id: string; name: string }) => {
    updateItem(itemId, 'customer', customer.id);
  };

  const handlePartySelect = (party: { id: string; name: string }) => {
    setParty(party.id);
  };

  const calculateTotalBoxes = () => {
    return items.reduce((total, item) => {
      return total + (parseInt(item.boxCount) || 0);
    }, 0);
  };

  const handleSave = () => {
    const boxSentEntry = {
      id: Date.now().toString(),
      date,
      party,
      items,
      totalBoxes: calculateTotalBoxes(),
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const existingEntries = JSON.parse(
      localStorage.getItem('boxSentEntries') || '[]'
    );
    existingEntries.push(boxSentEntry);
    localStorage.setItem('boxSentEntries', JSON.stringify(existingEntries));

    alert('Fish box sent entry saved successfully!');

    // Reset form
    setDate(new Date().toISOString().split('T')[0]);
    setParty('');
    setItems([{ id: '1', customer: '', boxCount: '' }]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminBoard />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6"> Box Sale</h1>

          {/* Header Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Party
              </label>
              <SearchableInput
                value={party}
                onChange={setParty}
                placeholder="Search party..."
                searchData={parties}
                onSelect={handlePartySelect}
                createRoute="/create-party"
                entityType="party"
              />
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Customer
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Box Count
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="border border-gray-300 p-2">
                      <SearchableInput
                        value={item.customer}
                        onChange={(value) => updateItem(item.id, 'customer', value)}
                        placeholder="Search customer..."
                        searchData={customers}
                        onSelect={(customer) => handleCustomerSelect(item.id, customer)}
                        createRoute="/create-customer"
                        entityType="customer"
                        className="min-w-[200px]"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="number"
                        value={item.boxCount}
                        onChange={(e) =>
                          updateItem(item.id, 'boxCount', e.target.value)
                        }
                        className="w-full px-2 py-1 border-none focus:ring-0 focus:outline-none"
                        placeholder="0"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 font-semibold">
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    Total Boxes:
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {calculateTotalBoxes()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={addItem}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer</span>
            </button>

            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Entry</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FishBoxSentForm;
