'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Save, Upload, X, Video } from 'lucide-react';
import Toast from '@/components/Toast';

interface Category {
  _id: string;
  name: string;
}

export default function EditWigPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    discount: '',
    color: '',
    stock: '',
    available: true,
    images: [] as string[],
    video: '',
  });

  useEffect(() => {
    fetchCategories();
    fetchWig();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchWig = async () => {
    try {
      const res = await fetch(`/api/wigs/${id}`);
      const data = await res.json();
      if (data.success) {
        const wig = data.data;
        setFormData({
          name: wig.name,
          description: wig.description || '',
          category: wig.category._id || wig.category,
          price: wig.price.toString(),
          discount: wig.discount?.toString() || '',
          color: wig.color,
          stock: wig.stock.toString(),
          available: wig.available,
          images: wig.images,
          video: wig.video || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch wig:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', files[i]);
        formDataUpload.append('folder', 'luxuryher/wigs');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });

        const data = await res.json();
        if (data.success) {
          uploadedUrls.push(data.url);
        }
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (error) {
      setToast({ message: 'Failed to upload images', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setToast({ message: 'Video file size must be less than 10MB', type: 'warning' });
      return;
    }

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'luxuryher/videos');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, video: data.url }));
      }
    } catch (error) {
      setToast({ message: 'Failed to upload video', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      setToast({ message: 'Please upload at least one image', type: 'warning' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/wigs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          discount: formData.discount ? parseFloat(formData.discount) : 0,
          stock: parseInt(formData.stock),
        }),
      });

      if (res.ok) {
        setToast({ message: 'Wig updated successfully!', type: 'success' });
        setTimeout(() => {
          router.push('/admin/dashboard/wigs');
        }, 1000);
      } else {
        const data = await res.json();
        setToast({ message: data.error || 'Failed to update wig', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'Failed to update wig', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="mb-8">
        <Link
          href="/admin/dashboard/wigs"
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Wigs
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Wig</h1>
        <p className="text-gray-600">Update wig information</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Wig Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price (₦) <span className="text-red-500">*</span>
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-2">
                Discount (%)
              </label>
              <input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
              Color <span className="text-red-500">*</span>
            </label>
            <input
              id="color"
              type="text"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              id="available"
              type="checkbox"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              className="w-4 h-4 text-gold focus:ring-gold border-gray-300 rounded"
            />
            <label htmlFor="available" className="ml-2 text-sm text-gray-700">
              Available for purchase
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={uploading}
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  {uploading ? 'Uploading...' : 'Click to upload images'}
                </span>
              </label>
            </div>
            {formData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={url}
                      alt={`Upload ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video (Optional, max 10MB)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
                id="video-upload"
                disabled={uploading}
              />
              <label
                htmlFor="video-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <Video className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  {uploading ? 'Uploading...' : 'Click to upload video'}
                </span>
              </label>
            </div>
            {formData.video && (
              <div className="mt-4 relative">
                <video src={formData.video} controls className="w-full rounded-lg max-h-64" />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, video: '' })}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 pt-6 border-t">
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex items-center space-x-2 bg-gold hover:bg-gold-dark text-white px-6 py-3 rounded-lg transition font-medium disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Updating...' : 'Update Wig'}</span>
            </button>
            <Link
              href="/admin/dashboard/wigs"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
