import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminBoard from '../../components/AdminBoard';
import { Save } from 'lucide-react';
import { supabase } from '../../database/supabase';

interface BoxTrackingItem {
  id: string;
  customer: string;
  party: string;
  lastSent: number;
  boxToBeReceived: number;
  total: number;
  rcdBox: number;
  balance: number;
}

const MultipleBoxReceiveUpdate: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<BoxTrackingItem[]>([]);
  const [saveMessage, setSaveMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const autosaveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // 👇 Fetch data from Supabase
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('box_tracking').select('*');

      if (error) {
        console.error('Error fetching data:', error.message);
      } else {
        const mappedData: BoxTrackingItem[] = (data || []).map((row: any) => ({
          id: row.id,
          customer: row.customer,
          party: row.party,
          lastSent: row.last_sent,
          boxToBeReceived: row.box_to_be_received,
          rcdBox: row.rcd_box,
          balance: row.balance,
        }));

        setItems(mappedData as BoxTrackingItem[]);
      }
      setLoading(false);
    };

    fetchData();
  }, [navigate]);

  const updateRcdBox = (id: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, rcdBox: numValue };
          updatedItem.balance =
            updatedItem.boxToBeReceived - updatedItem.rcdBox;
          return updatedItem;
        }
        return item;
      })
    );
  };

  // 🔄 Autosave effect
  useEffect(() => {
    if (autosaveTimeout.current) {
      clearTimeout(autosaveTimeout.current);
    }

    autosaveTimeout.current = setTimeout(() => {
      if (items.length > 0) {
        console.log('⏳ Autosaving...');
        handleSaveChanges(true); // pass true so no alerts
      }
    }, 2000);

    return () => {
      if (autosaveTimeout.current) clearTimeout(autosaveTimeout.current);
    };
  }, [items]);

  const handleSaveChanges = async (isAuto = false) => {
    try {
      for (const item of items) {
        const { error } = await supabase
          .from('box_tracking')
          .update({
            rcd_box: item.rcdBox,
            balance: item.balance,
            updated_at: new Date().toISOString(),
          })
          .eq('id', item.id);

        if (error) {
          console.error(`❌ Error updating row ${item.id}:`, error.message);
          if (!isAuto)
            alert(`Failed to update ${item.customer} - ${item.party}`);
          return;
        }
      }

      if (!isAuto) {
        setSaveMessage('✅ All changes saved successfully!');
      } else {
        setSaveMessage('✅ Autosave complete.');
      }
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error('Unexpected error:', err);
      if (!isAuto) alert('❌ Something went wrong while saving changes.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminBoard />

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Multiple Box Receive
            </h1>

            {/* Combined Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Customer
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Party
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Opening Balance
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Today's sales
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Total
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Received Box
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Closing Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr
                      key={item.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                        {item.customer}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                        {item.party}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                        {item.lastSent}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                        {}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                        {item.boxToBeReceived}
                      </td>
                      <td
                        className="border border-gray-300 px-4 py-3"
                        style={{ backgroundColor: '#FFF9E6' }}
                      >
                        <input
                          type="number"
                          value={item.rcdBox}
                          onChange={(e) =>
                            updateRcdBox(item.id, e.target.value)
                          }
                          className="w-full px-2 py-1 border-none focus:ring-0 focus:outline-none bg-transparent text-sm"
                          style={{ backgroundColor: 'transparent' }}
                        />
                      </td>
                      <td
                        className={`border border-gray-300 px-4 py-3 text-sm font-medium ${
                          item.balance < 0
                            ? 'text-red-600'
                            : item.balance > 0
                            ? 'text-green-600'
                            : 'text-gray-900'
                        }`}
                      >
                        {item.balance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              className={`flex items-center mt-6 ${
                saveMessage ? 'justify-between' : 'justify-end'
              }`}
            >
              {/* Save Message */}
              {saveMessage && (
                <div className="text-sm text-gray-600">{saveMessage}</div>
              )}

              {/* Save Button */}
              <button
                onClick={handleSaveChanges}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                Instructions:
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>
                  • Only the "RCD Box" column (highlighted in yellow) is
                  editable
                </li>
                <li>
                  • Balance is automatically calculated as (Box to be Received -
                  RCD Box)
                </li>
                <li>
                  • Positive balance (green) indicates boxes still to be
                  received
                </li>
                <li>• Negative balance (red) indicates over-received boxes</li>
                <li>• Click "Save Changes" to log updated data to console</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleBoxReceiveUpdate;
