import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminBoard from '../../components/AdminBoard';
import { Eye } from 'lucide-react';

interface PaymentItem {
  id: string;
  date: string;
  customer: string;
  oldBalance: number;
  lastBillAmount: number;
  received: number;
  discount: number;
  remarks: string;
  balance: number;
}

const PaymentsList: React.FC = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(
    null
  );
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');

  const customerOptions = Array.from(new Set(payments.map((p) => p.customer)));

  // Filter payments by date range
  const filteredPayments = payments.filter((p) => {
    // Filter by customer
    if (selectedCustomer && p.customer !== selectedCustomer) return false;

    // Filter by date
    const paymentDate = new Date(p.date).setHours(0, 0, 0, 0);
    const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const end = endDate ? new Date(endDate).setHours(0, 0, 0, 0) : null;

    if (start && end && start === end) return paymentDate === start;
    if (start && !end) return paymentDate === start;
    if (!start && end) return paymentDate === end;
    if (start && end) return paymentDate >= start && paymentDate <= end;
    return true;
  });

  useEffect(() => {
    if (startDate && !endDate) setEndDate(startDate);
  }, [startDate, endDate]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) navigate('/login');

    // Load payments from localStorage or use sample data
    const savedPayments: PaymentItem[] = JSON.parse(
      localStorage.getItem('payments') || '[]'
    );

    const samplePayments: PaymentItem[] = [
      {
        id: '1',
        date: '2025-08-10',
        customer: 'John Doe',
        oldBalance: 50,
        lastBillAmount: 45,
        received: 0,
        discount: 0,
        remarks: '',
        balance: 45,
      },
      {
        id: '2',
        date: '2025-08-11',
        customer: 'Jane Smith',
        oldBalance: 30,
        lastBillAmount: 28,
        received: 0,
        discount: 0,
        remarks: '',
        balance: 28,
      },
    ];

    setPayments(savedPayments.length ? savedPayments : samplePayments);
  }, [navigate]);

  const viewDetails = (payment: PaymentItem) => setSelectedPayment(payment);
  const closeDetails = () => setSelectedPayment(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminBoard />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Payments List</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <label>Customer: </label>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="">All</option>
                {customerOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
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
                <Eye className="w-4 h-4" />
                <span>{filteredPayments.length} payments found</span>
              </div>
            </div>
          </div>

          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No payments found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Date
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Customer
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Old Balance
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Last Bill
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Received
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Discount
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Balance
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-medium text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-sm">
                        {new Date(p.date).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">
                        {p.customer}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">
                        {p.oldBalance}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">
                        {p.lastBillAmount}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">
                        {p.received}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">
                        {p.discount}
                      </td>
                      <td
                        className={`border border-gray-300 px-4 py-3 text-sm font-medium ${
                          p.balance < 0 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {p.balance}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <button
                          onClick={() => viewDetails(p)}
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

      {/* Payment Details Modal */}
      {/* {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Payment Details
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
                    {new Date(selectedPayment.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Customer
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedPayment.customer}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Old Balance
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedPayment.oldBalance}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Balance
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedPayment.balance}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Field
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        Last Bill Amount
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {selectedPayment.lastBillAmount}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        Received
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {selectedPayment.received}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        Discount
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {selectedPayment.discount}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        Remarks
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {selectedPayment.remarks}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )} */}
      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Popular Fish Kondotty: Statement
                </h2>
                <button
                  onClick={closeDetails}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedPayment.customer}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    From
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Date(
                      startDate || selectedPayment.date
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    To
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Date(
                      endDate || selectedPayment.date
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Old Balance
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedPayment.oldBalance}
                  </p>
                </div>
              </div>

              {/* Party Details Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Party
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Remarks
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-right text-sm font-medium text-gray-700">
                        Qty
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-right text-sm font-medium text-gray-700">
                        Price
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-right text-sm font-medium text-gray-700">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {selectedPayment.customer}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {selectedPayment.remarks}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                        {1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                        {selectedPayment.lastBillAmount}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                        {selectedPayment.lastBillAmount}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-bold">
                      <td
                        className="border border-gray-300 px-4 py-2 text-sm"
                        colSpan={4}
                      >
                        Total
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                        {selectedPayment.balance}
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

export default PaymentsList;
