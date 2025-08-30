import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminBoard from '../../components/AdminBoard';
import { Eye, FileText } from 'lucide-react';
import { supabase } from '../../database/supabase';

interface SalesEntry {
  id: string;
  date: string;
  party: string;
  totalBox: string;
  salesman: string;
  items: Array<{
    id: string;
    item: string;
    box: string;
    price: string;
    total: string;
  }>;
  totalAmount: string;
  createdAt: string;
}

const SalesSummary: React.FC = () => {
  const navigate = useNavigate();
  const [salesEntries, setSalesEntries] = useState<SalesEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<SalesEntry | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filtered entries logic (unchanged)
  const filteredEntries = salesEntries.filter((entry) => {
    const entryDate = new Date(entry.date).setHours(0, 0, 0, 0);
    const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const end = endDate ? new Date(endDate).setHours(0, 0, 0, 0) : null;

    if (start && end && start === end) return entryDate === start;
    if (start && !end) return entryDate === start;
    if (!start && end) return entryDate === end;
    if (start && end) return entryDate >= start && entryDate <= end;

    return true;
  });

  useEffect(() => {
    if (startDate && !endDate) setEndDate(startDate);
  }, [startDate, endDate]);

  // Fetch from Supabase
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchSales = async () => {
      try {
        // Step 1: Fetch sales
        const { data: salesData, error: salesError } = await supabase
          .from('sales')
          .select('*')
          .order('date', { ascending: false });

        if (salesError) throw salesError;

        if (!salesData || salesData.length === 0) {
          setSalesEntries([]);
          return;
        }

        // Step 2: Collect all ids
        const partyIds = [
          ...new Set(salesData.map((s) => s.party).filter(Boolean)),
        ];
        const salesmanIds = [
          ...new Set(salesData.map((s) => s.salesman).filter(Boolean)),
        ];
        const customerIds = [
          ...new Set(
            salesData.flatMap((s) =>
              (s.items || []).map((i) => i.customer).filter(Boolean)
            )
          ),
        ];
        const productIds = [
          ...new Set(
            salesData.flatMap((s) =>
              (s.items || []).map((i) => i.item).filter(Boolean)
            )
          ),
        ];

        // Step 3: Fetch lookup tables
        const [parties, salesmen, customers, products] = await Promise.all([
          supabase.from('parties').select('id, name'),
          supabase.from('salesmen').select('id, name'),
          supabase.from('customers').select('id, name'),
          supabase.from('products').select('id, name'),
        ]);

        // Create lookup maps
        const partyMap = Object.fromEntries(
          (parties.data || []).map((p) => [p.id, p.name])
        );
        const salesmanMap = Object.fromEntries(
          (salesmen.data || []).map((s) => [s.id, s.name])
        );
        const customerMap = Object.fromEntries(
          (customers.data || []).map((c) => [c.id, c.name])
        );
        const productMap = Object.fromEntries(
          (products.data || []).map((p) => [p.id, p.name])
        );

        // Step 4: Map sales with names
        const mappedData: SalesEntry[] = salesData.map((sale) => ({
          id: sale.id,
          date: sale.date,
          party: partyMap[sale.party] || sale.party,
          totalBox: String(sale.total_box),
          salesman: salesmanMap[sale.salesman] || sale.salesman,
          items: (sale.items || []).map((item: any) => ({
            ...item,
            item: productMap[item.item] || item.item,
            customer: customerMap[item.customer] || item.customer,
          })),
          totalAmount: String(sale.total_amount),
          createdAt: sale.created_at,
        }));

        setSalesEntries(mappedData);
      } catch (err) {
        console.error('Error fetching sales:', err);
      }
    };

    fetchSales();
  }, [navigate]);

  const viewDetails = (entry: SalesEntry) => setSelectedEntry(entry);
  const closeDetails = () => setSelectedEntry(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminBoard />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Sales Summary</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <label>From: </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              />
              <label>To: </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              />
              <div className="flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>{filteredEntries.length} entries found</span>
              </div>
            </div>
          </div>

          {filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No sales entries found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Load No
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Party
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Total Boxes
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Salesman
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Total Amount
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-medium text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry, index) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                        LD{String(index + 1).padStart(3, '0')}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                        {entry.party}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                        {entry.totalBox}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                        {entry.salesman}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-900">
                        ₹{entry.totalAmount}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <button
                          onClick={() => viewDetails(entry)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal (no changes) */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Sales Entry Details
                </h2>
                <button
                  onClick={closeDetails}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedEntry.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Party
                  </label>
                  <p className="text-sm text-gray-900">{selectedEntry.party}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Total Boxes
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedEntry.totalBox}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Salesman
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedEntry.salesman}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Item
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Boxes
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Price
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEntry.items.map((item) => (
                      <tr key={item.id}>
                        <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">
                          {item.item}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">
                          {item.box}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">
                          ₹{item.price}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">
                          ₹{item.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-semibold">
                      <td
                        colSpan={3}
                        className="border border-gray-300 px-4 py-2 text-right text-sm"
                      >
                        Total Amount:
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        ₹{selectedEntry.totalAmount}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesSummary;
