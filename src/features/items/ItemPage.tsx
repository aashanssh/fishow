// import React, { useState, useEffect } from 'react';
// import { supabase } from '../database/supabase';
// import AdminBoard from '../components/AdminBoard';
// import { Edit, Trash2, Check, X } from 'lucide-react';

// interface Item {
//   id: number;
//   name: string;
//   created_at: string;
// }

// const ItemPage: React.FC = () => {
//   const [name, setName] = useState('');
//   const [items, setItems] = useState<Item[]>([]);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [editingName, setEditingName] = useState('');
//   const [page, setPage] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);
//   const pageSize = 10;

//   const fetchItems = async () => {
//     const from = (page - 1) * pageSize;
//     const to = from + pageSize - 1;

//     const { data, error, count } = await supabase
//       .from('products')
//       .select('*', { count: 'exact' })
//       .order('id', { ascending: true })
//       .range(from, to);

//     if (error) console.error('Error fetching items:', error);
//     else {
//       setItems(data || []);
//       setTotalCount(count || 0);
//     }
//   };

//   useEffect(() => {
//     fetchItems();
//   }, [page]);

//   const handleSave = async () => {
//     if (!name.trim()) return;
//     const { error } = await supabase.from('products').insert([{ name }]);
//     if (error) console.error('Error saving item:', error);
//     else {
//       setName('');
//       fetchItems();
//     }
//   };

//   const handleEdit = (item: Item) => {
//     setEditingId(item.id);
//     setEditingName(item.name);
//   };

//   const handleUpdate = async (id: number) => {
//     if (!editingName.trim()) return;
//     const { error } = await supabase
//       .from('products')
//       .update({ name: editingName })
//       .eq('id', id);
//     if (error) console.error('Error updating item:', error);
//     else {
//       setEditingId(null);
//       setEditingName('');
//       fetchItems();
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (!window.confirm('Are you sure you want to delete this item?')) return;
//     const { error } = await supabase.from('products').delete().eq('id', id);
//     if (error) console.error('Error deleting item:', error);
//     else fetchItems();
//   };

//   return (
//     <>
//       <AdminBoard />
//       <div className="p-6 flex justify-center">
//         <div className="w-full max-w-4xl">
//           <h1 className="text-xl font-bold mb-4">Create Item</h1>

//           {/* Form */}
//           <div className="flex flex-col sm:flex-row items-center sm:space-x-2 mb-6 space-y-2 sm:space-y-0">
//             <input
//               type="text"
//               placeholder="Item name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="border rounded px-3 py-2 w-full sm:w-auto flex-1"
//             />
//             <button
//               onClick={handleSave}
//               className="bg-blue-500 text-white px-4 py-2 rounded"
//             >
//               Save
//             </button>
//           </div>

//           {/* Table with horizontal scroll */}
//           <div className="overflow-x-auto">
//             <table className="min-w-[600px] w-full border">
//               <thead>
//                 <tr className="bg-gray-100 border-b">
//                   <th className="p-2 text-left">ID</th>
//                   <th className="p-2 text-left">Name</th>
//                   <th className="p-2 text-left">Created At</th>
//                   <th className="p-2 text-left">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {items.map((i) => (
//                   <tr key={i.id} className="border-b">
//                     <td className="p-2">{i.id}</td>
//                     <td className="p-2">
//                       {editingId === i.id ? (
//                         <input
//                           type="text"
//                           value={editingName}
//                           onChange={(e) => setEditingName(e.target.value)}
//                           className="border rounded px-2 py-1 w-full"
//                         />
//                       ) : (
//                         i.name
//                       )}
//                     </td>
//                     <td className="p-2">
//                       {new Date(i.created_at).toLocaleString()}
//                     </td>
//                     <td className="p-2 flex space-x-2">
//                       {editingId === i.id ? (
//                         <>
//                           <button
//                             onClick={() => handleUpdate(i.id)}
//                             title="Save"
//                             className="text-green-600 hover:text-green-800"
//                           >
//                             <Check size={18} />
//                           </button>
//                           <button
//                             onClick={() => setEditingId(null)}
//                             title="Cancel"
//                             className="text-gray-500 hover:text-gray-700"
//                           >
//                             <X size={18} />
//                           </button>
//                         </>
//                       ) : (
//                         <>
//                           <button
//                             onClick={() => handleEdit(i)}
//                             title="Edit"
//                             className="text-yellow-500 hover:text-yellow-700"
//                           >
//                             <Edit size={18} />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(i.id)}
//                             title="Delete"
//                             className="text-red-500 hover:text-red-700"
//                           >
//                             <Trash2 size={18} />
//                           </button>
//                         </>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="flex justify-between items-center mt-4">
//             <button
//               disabled={page === 1}
//               onClick={() => setPage((p) => p - 1)}
//               className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
//             >
//               Previous
//             </button>
//             <span>
//               Page {page} of {Math.ceil(totalCount / pageSize)}
//             </span>
//             <button
//               disabled={page * pageSize >= totalCount}
//               onClick={() => setPage((p) => p + 1)}
//               className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ItemPage;

import { Check, Edit, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import AdminBoard from '../../components/AdminBoard';
import { supabase } from '../../database/supabase';

interface Item {
  id: number;
  name: string;
  created_at: string;
}

const ItemPage: React.FC = () => {
  const [name, setName] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const pageSize = 10;

  const fetchItems = async () => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) console.error('Error fetching items:', error);
    else {
      setItems(data || []);
      setTotalCount(count || 0);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [page]);

  const handleSave = async () => {
    if (!name.trim()) return;
    const { error } = await supabase.from('products').insert([{ name }]);
    if (error) console.error('Error saving item:', error);
    else {
      setName('');
      fetchItems();
      toast.success('Item added successfully!');
    }
  };

  const handleEdit = (item: Item) => {
    setEditingId(item.id);
    setEditingName(item.name);
  };

  const handleUpdate = async (id: number) => {
    if (!editingName.trim()) return;
    const { error } = await supabase
      .from('products')
      .update({ name: editingName })
      .eq('id', id);
    if (error) console.error('Error updating item:', error);
    else {
      setEditingId(null);
      setEditingName('');
      fetchItems();
      toast.success('Item updated successfully!');
    }
  };

  const handleDelete = (id: number) => {
    toast(
      (t) => (
        <div className="flex flex-col items-center space-y-2">
          <span>Are you sure you want to delete this item?</span>
          <div className="flex space-x-2">
            <button
              onClick={async () => {
                const { error } = await supabase
                  .from('products')
                  .delete()
                  .eq('id', id);
                if (error) toast.error('Error deleting item!');
                else {
                  fetchItems();
                  toast.success('Item deleted successfully!');
                }
                toast.dismiss(t.id);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: 'top-center',
        style: {
          transform: 'translateY(50vh) translateX(-50%)',
          left: '50%',
          top: '50%',
          minWidth: '200px',
          padding: '16px',
          textAlign: 'center',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
      }
    );
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <AdminBoard />
      <div className="p-6 flex justify-center">
        <div className="w-full max-w-4xl">
          <h1 className="text-xl font-bold mb-4">Create Item</h1>

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
              placeholder="Item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded px-3 py-2 w-full sm:w-auto flex-1"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Save
            </button>
          </form>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full border">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Created At</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id} className="border-b">
                    <td className="p-2">{i.id}</td>
                    <td className="p-2">
                      {editingId === i.id ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        i.name
                      )}
                    </td>
                    <td className="p-2">
                      {new Date(i.created_at).toLocaleString()}
                    </td>
                    <td className="p-2 flex space-x-2">
                      {editingId === i.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(i.id)}
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
                            onClick={() => handleEdit(i)}
                            title="Edit"
                            className="text-yellow-500 hover:text-yellow-700"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(i.id)}
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

export default ItemPage;
