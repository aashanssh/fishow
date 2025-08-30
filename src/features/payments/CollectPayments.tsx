// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AdminBoard from '../components/AdminBoard';
// import { Save } from 'lucide-react';
// import { supabase } from '../database/supabase';

// interface PaymentItem {
//   id: string;
//   customer_name: string;
//   old_balance: number;
//   last_bill_amount: number;
//   received: number;
//   discount: number;
//   remarks: string;
//   balance: number;
// }

// const CollectPayments: React.FC = () => {
//   const navigate = useNavigate();
//   const [items, setItems] = useState<PaymentItem[]>([]);

//   const lastSavedRef = useRef<string>(JSON.stringify(items));

//   useEffect(() => {
//     const isAuthenticated = localStorage.getItem('isAuthenticated');
//     if (!isAuthenticated) {
//       navigate('/login');
//     }

//     // ✅ fetch from Supabase instead of using sampleData
//     const fetchPayments = async () => {
//       const { data, error } = await supabase.from('payment_item').select('*');

//       if (error) {
//         console.error('Error fetching payment items:', error);
//       } else {
//         setItems(data || []);
//       }
//     };

//     fetchPayments();
//   }, [navigate]);

//   const updateField = (id: string, field: keyof PaymentItem, value: string) => {
//     const numValue = parseFloat(value) || 0;

//     setItems((prev) =>
//       prev.map((item) => {
//         if (item.id === id) {
//           const updated = {
//             ...item,
//             [field]: field === 'remarks' ? value : numValue,
//           };

//           const received = field === 'received' ? numValue : updated.received;
//           const discount = field === 'discount' ? numValue : updated.discount;

//           // ✅ adjust balance calculation
//           updated.balance = updated.old_balance - (received + discount);

//           return updated;
//         }
//         return item;
//       })
//     );
//   };

//   const handleSaveChanges = async () => {
//     try {
//       for (const item of items) {
//         const { error } = await supabase
//           .from('payment_item')
//           .update({
//             received: item.received,
//             discount: item.discount,
//             remarks: item.remarks,
//             balance: item.balance,
//           })
//           .eq('id', item.id);

//         if (error) {
//           console.error(`Error updating item ${item.id}:`, error);
//         }
//       }

//       alert('Changes saved successfully!');
//     } catch (err) {
//       console.error('Unexpected error while saving changes:', err);
//     }
//   };

//   useEffect(() => {
//     const interval = setInterval(async () => {
//       try {
//         const currentState = JSON.stringify(items);

//         // ✅ Only save if something changed
//         if (currentState !== lastSavedRef.current && items.length > 0) {
//           for (const item of items) {
//             const { error } = await supabase
//               .from('payment_item')
//               .update({
//                 received: item.received,
//                 discount: item.discount,
//                 remarks: item.remarks,
//                 balance: item.balance,
//               })
//               .eq('id', item.id);

//             if (error) {
//               console.error(`Auto-save error for ${item.id}:`, error);
//             }
//           }

//           lastSavedRef.current = currentState; // ✅ update snapshot
//           console.log('✅ Auto-saved at', new Date().toLocaleTimeString());
//         }
//       } catch (err) {
//         console.error('Unexpected autosave error:', err);
//       }
//     }, 2000);

//     return () => clearInterval(interval);
//   }, [items]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <AdminBoard />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <h1 className="text-2xl font-bold text-gray-900 mb-6">
//             Collect Payments
//           </h1>

//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse border border-gray-300">
//               <thead>
//                 <tr className="bg-gray-50">
//                   <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
//                     Customer
//                   </th>
//                   <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
//                     Old Balance
//                   </th>
//                   <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
//                     Last Bill Amount
//                   </th>
//                   <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
//                     Received
//                   </th>
//                   <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
//                     Discount
//                   </th>
//                   <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
//                     Remarks
//                   </th>
//                   <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
//                     Balance
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {items.map((item, index) => (
//                   <tr
//                     key={item.id}
//                     className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
//                   >
//                     <td className="border border-gray-300 px-4 py-3 text-sm">
//                       {item.customer_name}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-3 text-sm">
//                       {item.old_balance}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-3 text-sm">
//                       {item.last_bill_amount}
//                     </td>
//                     <td
//                       className="border border-gray-300 px-4 py-3"
//                       style={{ backgroundColor: '#FFF9E6' }}
//                     >
//                       <input
//                         type="number"
//                         value={item.received}
//                         onChange={(e) =>
//                           updateField(item.id, 'received', e.target.value)
//                         }
//                         className="w-full px-2 py-1 border-none focus:ring-0 focus:outline-none bg-transparent text-sm"
//                       />
//                     </td>
//                     <td
//                       className="border border-gray-300 px-4 py-3"
//                       style={{ backgroundColor: '#FFF9E6' }}
//                     >
//                       <input
//                         type="number"
//                         value={item.discount}
//                         onChange={(e) =>
//                           updateField(item.id, 'discount', e.target.value)
//                         }
//                         className="w-full px-2 py-1 border-none focus:ring-0 focus:outline-none bg-transparent text-sm"
//                       />
//                     </td>
//                     <td
//                       className="border border-gray-300 px-4 py-3"
//                       style={{ backgroundColor: '#FFF9E6' }}
//                     >
//                       <input
//                         type="text"
//                         value={item.remarks}
//                         onChange={(e) =>
//                           updateField(item.id, 'remarks', e.target.value)
//                         }
//                         className="w-full px-2 py-1 border-none focus:ring-0 focus:outline-none bg-transparent text-sm"
//                       />
//                     </td>
//                     <td
//                       className={`border border-gray-300 px-4 py-3 text-sm font-medium ${
//                         item.balance < 0
//                           ? 'text-red-600'
//                           : item.balance > 0
//                           ? 'text-green-600'
//                           : 'text-gray-900'
//                       }`}
//                     >
//                       {item.balance}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="flex justify-end mt-6">
//             <button
//               onClick={handleSaveChanges}
//               className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
//             >
//               <Save className="w-4 h-4" />
//               <span>Save Changes</span>
//             </button>
//           </div>

//           <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//             <h3 className="text-sm font-medium text-blue-900 mb-2">
//               Instructions:
//             </h3>
//             <ul className="text-sm text-blue-700 space-y-1">
//               <li>
//                 • "Received", "Discount", and "Remarks" columns are editable
//                 (highlighted in yellow)
//               </li>
//               <li>
//                 • Balance = (Old Balance + Last Bill Amount) - (Received +
//                 Discount)
//               </li>
//               <li>• Positive balance (green) means payment still due</li>
//               <li>• Negative balance (red) means overpayment</li>
//               <li>• Click "Save Changes" to log updated data to console</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CollectPayments;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminBoard from '../../components/AdminBoard';
import { Save } from 'lucide-react';
import { supabase } from '../../database/supabase';

interface PaymentItem {
  id: string;
  customer_name: string;
  old_balance: number;
  last_bill_amount: number;
  received: number;
  discount: number;
  remarks: string;
  balance: number;
}

const CollectPayments: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<PaymentItem[]>([]);
  const [saveMessage, setSaveMessage] = useState<string>(''); // ✅ message state
  const autosaveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }

    const fetchPayments = async () => {
      const { data, error } = await supabase.from('payment_item').select('*');

      if (error) {
        console.error('Error fetching payment items:', error);
      } else {
        setItems(data || []);
      }
    };

    fetchPayments();
  }, [navigate]);

  const updateField = (id: string, field: keyof PaymentItem, value: string) => {
    const numValue = parseFloat(value) || 0;

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = {
            ...item,
            [field]: field === 'remarks' ? value : numValue,
          };

          const received = field === 'received' ? numValue : updated.received;
          const discount = field === 'discount' ? numValue : updated.discount;

          updated.balance = updated.last_bill_amount - (received + discount);

          return updated;
        }
        return item;
      })
    );
  };

  const handleSaveChanges = async (isAuto = false) => {
    try {
      for (const item of items) {
        const { error } = await supabase
          .from('payment_item')
          .update({
            received: item.received,
            discount: item.discount,
            remarks: item.remarks,
            balance: item.balance,
          })
          .eq('id', item.id);

        if (error) {
          console.error(`Error updating item ${item.id}:`, error);
          if (!isAuto) alert(`❌ Failed to update ${item.customer_name}`);
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
      console.error('Unexpected error while saving changes:', err);
      if (!isAuto) alert('❌ Something went wrong while saving changes.');
    }
  };

  // 🔄 Autosave effect (debounced like in MultipleBoxReceiveUpdate)
  useEffect(() => {
    if (autosaveTimeout.current) clearTimeout(autosaveTimeout.current);

    autosaveTimeout.current = setTimeout(() => {
      if (items.length > 0) {
        setSaveMessage('⏳ Autosaving...');
        handleSaveChanges(true);
      }
    }, 2000);

    return () => {
      if (autosaveTimeout.current) clearTimeout(autosaveTimeout.current);
    };
  }, [items]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminBoard />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Collect Payments
          </h1>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Customer
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Old Balance
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Last Bill Amount
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Received
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Discount
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Remarks
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={item.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      {item.customer_name}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      {item.old_balance}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      {item.last_bill_amount}
                    </td>
                    <td
                      className="border border-gray-300 px-4 py-3"
                      style={{ backgroundColor: '#FFF9E6' }}
                    >
                      <input
                        type="number"
                        value={item.received}
                        onChange={(e) =>
                          updateField(item.id, 'received', e.target.value)
                        }
                        className="w-full px-2 py-1 border-none focus:ring-0 focus:outline-none bg-transparent text-sm"
                      />
                    </td>
                    <td
                      className="border border-gray-300 px-4 py-3"
                      style={{ backgroundColor: '#FFF9E6' }}
                    >
                      <input
                        type="number"
                        value={item.discount}
                        onChange={(e) =>
                          updateField(item.id, 'discount', e.target.value)
                        }
                        className="w-full px-2 py-1 border-none focus:ring-0 focus:outline-none bg-transparent text-sm"
                      />
                    </td>
                    <td
                      className="border border-gray-300 px-4 py-3"
                      style={{ backgroundColor: '#FFF9E6' }}
                    >
                      <input
                        type="text"
                        value={item.remarks}
                        onChange={(e) =>
                          updateField(item.id, 'remarks', e.target.value)
                        }
                        className="w-full px-2 py-1 border-none focus:ring-0 focus:outline-none bg-transparent text-sm"
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
            {saveMessage && (
              <div className="text-sm text-gray-600">{saveMessage}</div>
            )}

            <button
              onClick={() => handleSaveChanges(false)}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              Instructions:
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                • "Received", "Discount", and "Remarks" columns are editable
                (highlighted in yellow)
              </li>
              <li>
                • Balance = (Old Balance + Last Bill Amount) - (Received +
                Discount)
              </li>
              <li>• Positive balance (green) means payment still due</li>
              <li>• Negative balance (red) means overpayment</li>
              <li>• Click "Save Changes" to log updated data to console</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectPayments;
