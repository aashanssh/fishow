import { Plus, Save, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminBoard from '../../components/AdminBoard';
import SearchableInput from '../../components/SearchableInput';
import { supabase } from '../../database/supabase';

interface SalesItem {
  id: string;
  customer: string;
  box: string;
  kg: string;
  price: string;
  total: string;
  item: string;
  remark: string;
}

const SalesEntryForm: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<{ id: string; name: string }[]>(
    []
  );
  const [parties, setParties] = useState<{ id: string; name: string }[]>([]);
  const [salesmenList, setSalesmenList] = useState<
    { id: string; name: string }[]
  >([]);
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [party, setParty] = useState('');
  const [salesman, setSalesman] = useState('');
  const [totalBox, setTotalBox] = useState('');
  const [items, setItems] = useState<SalesItem[]>([
    {
      id: '1',
      customer: '',
      box: '',
      kg: '',
      price: '',
      total: '',
      item: '',
      remark: '',
    },
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
      const { data: salesData } = await supabase
        .from('salesmen')
        .select('id, name')
        .order('name');
      const { data: productData } = await supabase
        .from('products')
        .select('id, name')
        .order('name');

      if (custData) setCustomers(custData);
      if (partyData) setParties(partyData);
      if (salesData) setSalesmenList(salesData);
      if (productData) setProducts(productData);
    };

    fetchData();
  }, []);

  const addItem = () => {
    const newItem: SalesItem = {
      id: crypto.randomUUID(), // optional temporary UUID for React
      customer: '',
      box: '',
      kg: '',
      price: '',
      total: '',
      item: '',
      remark: '',
    };
    setItems([...items, newItem]);
    return newItem.id;
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof SalesItem, value: string) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Auto-calculate total when box, kg, or price changes
          if (field === 'box' || field === 'kg' || field === 'price') {
            const box =
              parseFloat(field === 'box' ? value : updatedItem.box) || 0;
            const kg = parseFloat(field === 'kg' ? value : updatedItem.kg) || 0;
            const price =
              parseFloat(field === 'price' ? value : updatedItem.price) || 0;

            // Use KG if available, otherwise use Box
            const quantity = kg > 0 ? kg : box;
            updatedItem.total = (price * quantity).toFixed(2);
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleCustomerSelect = (itemId: string, customer: { id: string; name: string }) => {
    updateItem(itemId, 'customer', customer.id);
    // You can add logic here to pre-fill customer-specific data if needed
  };

  const handleItemSelect = (itemId: string, product: { id: string; name: string }) => {
    updateItem(itemId, 'item', product.id);
    // You can add logic here to pre-fill product-specific data if needed
  };

  const handlePartySelect = (party: { id: string; name: string }) => {
    setParty(party.id);
    // You can add logic here to pre-fill party-specific data if needed
  };

  const handleSalesmanSelect = (salesman: { id: string; name: string }) => {
    setSalesman(salesman.id);
    // You can add logic here to pre-fill salesman-specific data if needed
  };

  const calculateTotal = () => {
    return items
      .reduce((total, item) => {
        return total + (parseFloat(item.total) || 0);
      }, 0)
      .toFixed(2);
  };

  const calculateTotalBoxes = () => {
    return items.reduce((total, item) => {
      return total + (parseFloat(item.box) || 0);
    }, 0);
  };

  const fieldOrder: (keyof SalesItem)[] = [
    'customer',
    'box',
    'price',
    'item',
    'remark',
  ];

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    itemId: string
  ) => {
    if (
      e.key === 'Enter' &&
      (e.target as HTMLInputElement).dataset.field === 'remark'
    ) {
      const isLastRow = items[items.length - 1]?.id === itemId;

      if (isLastRow && !e.shiftKey) {
        e.preventDefault();
        const newId = addItem();

        setTimeout(() => {
          const firstInput = document.querySelector<HTMLInputElement>(
            `input[data-item-id="${newId}"][data-field="customer"]`
          );
          firstInput?.focus();
        }, 0);
      }
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const currentField = (e.target as HTMLInputElement).dataset.field as
        | keyof SalesItem
        | undefined;
      if (!currentField) return;

      const currentIndex = fieldOrder.indexOf(currentField);
      if (currentIndex === -1) return;

      const nextField = fieldOrder[currentIndex + 1];
      if (!nextField) return;

      const nextInput = document.querySelector<HTMLInputElement>(
        `input[data-item-id="${itemId}"][data-field="${nextField}"]`
      );
      nextInput?.focus();
    }
  };

  const handleSave = async () => {
    const salesEntry = {
      date, // must be YYYY-MM-DD format
      party,
      total_box: calculateTotalBoxes(),
      salesman,
      items, // stays as JSON, Supabase will handle jsonb
      total_amount: calculateTotal(),
      created_at: new Date().toISOString(), // optional if default value in DB
    };

    try {
      const { error } = await supabase.from('sales').insert([salesEntry]);

      if (error) throw error;

      alert('Sales entry saved successfully!');

      // Reset form
      setDate(new Date().toISOString().split('T')[0]);
      setParty('');
      setSalesman('');
      setTotalBox('');
      setItems([
        {
          id: '1',
          customer: '',
          box: '',
          kg: '',
          price: '',
          total: '',
          item: '',
          remark: '',
        },
      ]);
    } catch (err) {
      console.error(err);
      alert('Error saving sales entry');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminBoard />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Cash Sales</h1>

          {/* Header Information */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Box
              </label>
              <input
                type="number"
                value={totalBox}
                onChange={(e) => setTotalBox(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salesman
              </label>
              <SearchableInput
                value={salesman}
                onChange={setSalesman}
                placeholder="Search salesman..."
                searchData={salesmenList}
                onSelect={handleSalesmanSelect}
                createRoute="/create-salesman"
                entityType="salesman"
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
                    Box
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    KG
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Price
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Total
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Item
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Remark
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
                        step="1"
                        value={item.box}
                        onChange={(e) =>
                          updateItem(item.id, 'box', e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, item.id)}
                        data-item-id={item.id}
                        data-field="box"
                        className="w-full px-2 py-1 border-none focus:ring-0 focus:outline-none"
                        placeholder="0"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="number"
                        step="0.01"
                        value={item.kg}
                        onChange={(e) =>
                          updateItem(item.id, 'kg', e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, item.id)}
                        data-item-id={item.id}
                        data-field="kg"
                        className="w-full px-2 py-1 border-none focus:ring-0 focus:outline-none"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="number"
                        step="0.01"
                        value={item.price}
                        onChange={(e) =>
                          updateItem(item.id, 'price', e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, item.id)}
                        data-item-id={item.id}
                        data-field="price"
                        className="w-full px-2 py-1 border-none focus:ring-0 focus:outline-none"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={item.total}
                        readOnly
                        className="w-full px-2 py-1 border-none focus:ring-0 focus:outline-none bg-gray-50"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <SearchableInput
                        value={item.item}
                        onChange={(value) => updateItem(item.id, 'item', value)}
                        placeholder="Search item..."
                        searchData={products}
                        onSelect={(product) => handleItemSelect(item.id, product)}
                        createRoute="/create-item"
                        entityType="item"
                        className="min-w-[200px]"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={item.remark}
                        onChange={(e) =>
                          updateItem(item.id, 'remark', e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, item.id)}
                        data-item-id={item.id}
                        data-field="remark"
                        className="w-full px-2 py-1 border-none focus:ring-0 focus:outline-none"
                        placeholder="Remark"
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
                  <td
                    colSpan={4}
                    className="border border-gray-300 px-4 py-2 text-right"
                  >
                    Total Amount:
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ₹{calculateTotal()}
                  </td>
                  <td
                    colSpan={3}
                    className="border border-gray-300 px-4 py-2"
                  ></td>
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
              <span>Add Row</span>
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

export default SalesEntryForm;
