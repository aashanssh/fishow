// import React, { useState, useEffect } from 'react';
// import { supabase } from '../database/supabase';
// import AdminBoard from '../components/AdminBoard';

// interface Customer {
//   id: number;
//   name: string;
//   created_at: string;
// }

// const CustomerPage: React.FC = () => {
//   const [name, setName] = useState('');
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [page, setPage] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);
//   const pageSize = 10;

//   // Fetch customers with pagination
//   const fetchCustomers = async () => {
//     const from = (page - 1) * pageSize;
//     const to = from + pageSize - 1;

//     const { data, error, count } = await supabase
//       .from('customers')
//       .select('*', { count: 'exact' })
//       .order('id', { ascending: true })
//       .range(from, to);

//     if (error) {
//       console.error('Error fetching customers:', error);
//     } else {
//       setCustomers(data || []);
//       setTotalCount(count || 0);
//     }
//   };

//   useEffect(() => {
//     fetchCustomers();
//   }, [page]);

//   // Save a new customer
//   const handleSave = async () => {
//     if (!name.trim()) return;

//     const { data, error } = await supabase
//       .from('customers') // ✅ fixed table name
//       .insert([{ name }]); // created_at is auto-filled by DB default

//     if (error) {
//       console.error('Error saving customer:', error);
//     } else {
//       setName('');
//       fetchCustomers(); // refresh table
//     }
//   };

//   return (
//     <>
//       <AdminBoard />
//       <div className="p-6 max-w-2xl mx-auto">
//         <h1 className="text-xl font-bold mb-4">Create Customer</h1>

//         {/* Form */}
//         <div className="flex items-center space-x-2 mb-6">
//           <input
//             type="text"
//             placeholder="Customer name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="border rounded px-3 py-2 w-full"
//           />
//           <button
//             onClick={handleSave}
//             className="bg-blue-500 text-white px-4 py-2 rounded"
//           >
//             Save
//           </button>
//         </div>

//         {/* Table */}
//         <table className="w-full border">
//           <thead>
//             <tr className="bg-gray-100 border-b">
//               <th className="p-2 text-left">ID</th>
//               <th className="p-2 text-left">Name</th>
//               <th className="p-2 text-left">Created At</th>
//             </tr>
//           </thead>
//           <tbody>
//             {customers.map((c) => (
//               <tr key={c.id} className="border-b">
//                 <td className="p-2">{c.id}</td>
//                 <td className="p-2">{c.name}</td>
//                 <td className="p-2">
//                   {new Date(c.created_at).toLocaleString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Pagination */}
//         <div className="flex justify-between items-center mt-4">
//           <button
//             disabled={page === 1}
//             onClick={() => setPage((p) => p - 1)}
//             className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span>
//             Page {page} of {Math.ceil(totalCount / pageSize)}
//           </span>
//           <button
//             disabled={page * pageSize >= totalCount}
//             onClick={() => setPage((p) => p + 1)}
//             className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CustomerPage;

import React, { useState, useEffect } from 'react';
import { supabase } from '../../database/supabase';
import AdminBoard from '../../components/AdminBoard';
import { Edit, Trash2, Check, X } from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  created_at: string;
}

const CustomerPage: React.FC = () => {
  const [name, setName] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const fetchCustomers = async () => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from('customers')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) console.error('Error fetching customers:', error);
    else {
      setCustomers(data || []);
      setTotalCount(count || 0);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const handleSave = async () => {
    if (!name.trim()) return;
    const { error } = await supabase.from('customers').insert([{ name }]);
    if (error) console.error('Error saving customer:', error);
    else {
      setName('');
      fetchCustomers();
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setEditingName(customer.name);
  };

  const handleUpdate = async (id: number) => {
    if (!editingName.trim()) return;
    const { error } = await supabase
      .from('customers')
      .update({ name: editingName })
      .eq('id', id);

    if (error) console.error('Error updating customer:', error);
    else {
      setEditingId(null);
      setEditingName('');
      fetchCustomers();
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this customer?'))
      return;
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) console.error('Error deleting customer:', error);
    else fetchCustomers();
  };

  return (
    <>
      <AdminBoard />
      <div className="p-6 flex justify-center">
        <div className="w-full max-w-4xl">
          <h1 className="text-xl font-bold mb-4">Create Customer</h1>

          {/* Form */}
          <form
            className="flex flex-col sm:flex-row items-center sm:space-x-2 mb-6 space-y-2 sm:space-y-0"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <input
              type="text"
              placeholder="Customer name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded px-3 py-2 w-full sm:w-auto flex-1"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Save
            </button>
          </form>

          {/* Table container with horizontal scroll if needed */}
          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full border">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-2 text-left">Created At</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-b">
                    <td className="p-2">
                      {new Date(c.created_at).toLocaleString()}
                    </td>
                    <td className="p-2">
                      {editingId === c.id ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        c.name
                      )}
                    </td>
                    <td className="p-2 flex space-x-2">
                      {editingId === c.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(c.id)}
                            title="Save"
                            className="text-green-600 hover:text-green-800"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            title="Cancel"
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(c)}
                            title="Edit"
                            className="text-yellow-500 hover:text-yellow-700"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            title="Delete"
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {page} of {Math.ceil(totalCount / pageSize)}
            </span>
            <button
              disabled={page * pageSize >= totalCount}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerPage;
