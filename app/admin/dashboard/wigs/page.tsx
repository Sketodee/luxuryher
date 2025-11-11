'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';

interface Wig {
  _id: string;
  name: string;
  slug: string;
  category: any;
  price: number;
  discount?: number;
  finalPrice: number;
  color: string;
  stock: number;
  available: boolean;
  images: string[];
}

export default function WigsPage() {
  const [wigs, setWigs] = useState<Wig[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchWigs();
  }, []);

  const fetchWigs = async () => {
    try {
      const res = await fetch('/api/wigs');
      const data = await res.json();
      if (data.success) {
        setWigs(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch wigs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this wig?')) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/wigs/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setWigs(wigs.filter((w) => w._id !== id));
      } else {
        alert('Failed to delete wig');
      }
    } catch (error) {
      alert('Failed to delete wig');
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Wigs</h1>
          <p className="text-gray-600">Manage your wig inventory</p>
        </div>
        <Link
          href="/admin/dashboard/wigs/new"
          className="flex items-center space-x-2 bg-gold hover:bg-gold-dark text-white px-6 py-3 rounded-lg transition font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Add Wig</span>
        </Link>
      </div>

      {wigs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No wigs yet</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first wig.</p>
          <Link
            href="/admin/dashboard/wigs/new"
            className="inline-flex items-center space-x-2 bg-gold hover:bg-gold-dark text-white px-6 py-3 rounded-lg transition font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Add Wig</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wigs.map((wig) => (
            <div key={wig._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="relative h-64 bg-gray-100">
                {wig.images[0] && (
                  <Image
                    src={wig.images[0]}
                    alt={wig.name}
                    fill
                    className="object-cover"
                  />
                )}
                {!wig.available && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Unavailable
                  </div>
                )}
                {wig.stock === 0 && (
                  <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                    Out of Stock
                  </div>
                )}
                {wig.discount && wig.discount > 0 && (
                  <div className="absolute top-2 left-2 bg-gold text-white text-xs px-2 py-1 rounded">
                    -{wig.discount}%
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{wig.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{wig.category?.name || 'Uncategorized'}</p>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    {wig.discount && wig.discount > 0 ? (
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gold">₦{wig.finalPrice.toLocaleString()}</span>
                        <span className="text-sm text-gray-500 line-through">₦{wig.price.toLocaleString()}</span>
                      </div>
                    ) : (
                      <span className="font-bold text-gray-800">₦{wig.price.toLocaleString()}</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">Stock: {wig.stock}</span>
                </div>
                <div className="flex items-center space-x-2 pt-3 border-t">
                  <Link
                    href={`/admin/dashboard/wigs/${wig._id}/edit`}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm font-medium"
                  >
                    <Pencil className="w-4 h-4" />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(wig._id)}
                    disabled={deleting === wig._id}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
