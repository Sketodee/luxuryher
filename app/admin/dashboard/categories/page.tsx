'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, FolderTree } from 'lucide-react';
import Toast from '@/components/Toast';
import ConfirmModal from '@/components/ConfirmModal';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    setConfirmDelete(null);
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setCategories(categories.filter((c) => c._id !== id));
        setToast({ message: 'Category deleted successfully', type: 'success' });
      } else {
        setToast({ message: 'Failed to delete category', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'Failed to delete category', type: 'error' });
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirmDelete && (
        <ConfirmModal
          title="Delete Category"
          message="Are you sure you want to delete this category? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Categories</h1>
          <p className="text-gray-600">Manage your wig categories</p>
        </div>
        <Link
          href="/admin/dashboard/categories/new"
          className="flex items-center space-x-2 bg-gold hover:bg-gold-dark text-white px-6 py-3 rounded-lg transition font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Add Category</span>
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FolderTree className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No categories yet</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first category.</p>
          <Link
            href="/admin/dashboard/categories/new"
            className="inline-flex items-center space-x-2 bg-gold hover:bg-gold-dark text-white px-6 py-3 rounded-lg transition font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Add Category</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Name</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Slug</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Description
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((category) => (
                <tr key={category._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-800">{category.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{category.slug}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {category.description ? (
                      <span className="line-clamp-1">{category.description}</span>
                    ) : (
                      <span className="text-gray-400 italic">No description</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/admin/dashboard/categories/${category._id}/edit`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setConfirmDelete(category._id)}
                        disabled={deleting === category._id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
