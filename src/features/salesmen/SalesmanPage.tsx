import React, { useState, useEffect } from 'react';
import { supabase } from '../../database/supabase';
import AdminBoard from '../../components/AdminBoard';
import { Edit, Trash2, Check, X } from 'lucide-react';

interface Salesman {
  id: number;
  name: string;
  created_at: string;
}

const SalesmanPage: React.FC = () => {
  const [name, setName] = useState('');
  const [salesmen, setSalesmen] = useState<Salesman[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const fetchSalesmen = async () => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from('salesmen')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) console.error('Error fetching salesmen:', error);
    else {
      setSalesmen(data || []);
      setTotalCount(count || 0);
    }
  };

  useEffect(() => {
    fetchSalesmen();
  }, [page]);

  const handleSave = async () => {
    if (!name.trim()) return;
    const { error } = await supabase.from('salesmen').insert([{ name }]);
    if (error) console.error('Error saving salesman:', error);
    else {
      setName('');
      fetchSalesmen();
    }
  };

  const handleEdit = (s: Salesman) => {
    setEditingId(s.id);
    setEditingName(s.name);
  };

  const handleUpdate = async (id: number) => {
    if (!editingName.trim()) return;
    const { error } = await supabase
      .from('salesmen')
      .update({ name: editingName })
      .eq('id', id);

    if (error) console.error('Error updating salesman:', error);
    else {
      setEditingId(null);
      setEditingName('');
      fetchSalesmen();
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this salesman?'))
      return;
    const { error } = await supabase.from('salesmen').delete().eq('id', id);
    if (error) console.error('Error deleting salesman:', error);
    else fetchSalesmen();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminBoard />
      <div className="p-6 flex justify-center">
        <div className="w-full max-w-4xl">
          <h1 className="text-xl font-bold mb-4">Create Salesman</h1>

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
              placeholder="Salesman name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded px-3 py-2 w-full sm:w-auto flex-1"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Save
            </button>
          </form>

          {/* Table with horizontal scroll */}
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
                {salesmen.map((s) => (
                  <tr key={s.id} className="border-b">
                    <td className="p-2">
                      {new Date(s.created_at).toLocaleString()}
                    </td>
                    <td className="p-2">
                      {editingId === s.id ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        s.name
                      )}
                    </td>

                    <td className="p-2 flex space-x-2">
                      {editingId === s.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(s.id)}
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
                            onClick={() => handleEdit(s)}
                            title="Edit"
                            className="text-yellow-500 hover:text-yellow-700"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
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
    </div>
  );
};

export default SalesmanPage;
