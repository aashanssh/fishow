import React, { useState, useEffect } from 'react';
import { supabase } from '../../database/supabase';
import AdminBoard from '../../components/AdminBoard';
import { Edit, Trash2, Check, X } from 'lucide-react';

interface Party {
  id: number;
  name: string;
  created_at: string;
}

const PartyPage: React.FC = () => {
  const [name, setName] = useState('');
  const [parties, setParties] = useState<Party[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const fetchParties = async () => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from('parties')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) console.error('Error fetching parties:', error);
    else {
      setParties(data || []);
      setTotalCount(count || 0);
    }
  };

  useEffect(() => {
    fetchParties();
  }, [page]);

  const handleSave = async () => {
    if (!name.trim()) return;
    const { error } = await supabase.from('parties').insert([{ name }]);
    if (error) console.error('Error saving party:', error);
    else {
      setName('');
      fetchParties();
    }
  };

  const handleEdit = (party: Party) => {
    setEditingId(party.id);
    setEditingName(party.name);
  };

  const handleUpdate = async (id: number) => {
    if (!editingName.trim()) return;
    const { error } = await supabase
      .from('parties')
      .update({ name: editingName })
      .eq('id', id);
    if (error) console.error('Error updating party:', error);
    else {
      setEditingId(null);
      setEditingName('');
      fetchParties();
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this party?')) return;
    const { error } = await supabase.from('parties').delete().eq('id', id);
    if (error) console.error('Error deleting party:', error);
    else fetchParties();
  };

  return (
    <>
      <AdminBoard />
      <div className="p-6 flex justify-center">
        <div className="w-full max-w-4xl">
          <h1 className="text-xl font-bold mb-4">Create Party</h1>

          <form
            className="flex flex-col sm:flex-row items-center sm:space-x-2 mb-6 space-y-2 sm:space-y-0"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <input
              type="text"
              placeholder="Party name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded px-3 py-2 w-full sm:w-auto flex-1"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Save
            </button>
          </form>

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
                {parties.map((p) => (
                  <tr key={p.id} className="border-b">
                    <td className="p-2">
                      {new Date(p.created_at).toLocaleString()}
                    </td>
                    <td className="p-2">
                      {editingId === p.id ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        p.name
                      )}
                    </td>

                    <td className="p-2 flex space-x-2">
                      {editingId === p.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(p.id)}
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
                            onClick={() => handleEdit(p)}
                            title="Edit"
                            className="text-yellow-500 hover:text-yellow-700"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
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

export default PartyPage;
