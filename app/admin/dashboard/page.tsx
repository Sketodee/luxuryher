'use client';

import { useEffect, useState } from 'react';
import { Package, FolderTree, TrendingUp, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  totalWigs: number;
  totalCategories: number;
  availableWigs: number;
  outOfStock: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalWigs: 0,
    totalCategories: 0,
    availableWigs: 0,
    outOfStock: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [wigsRes, categoriesRes] = await Promise.all([
        fetch('/api/wigs'),
        fetch('/api/categories'),
      ]);

      const wigsData = await wigsRes.json();
      const categoriesData = await categoriesRes.json();

      const wigs = wigsData.data || [];
      const availableCount = wigs.filter((w: any) => w.available && w.stock > 0).length;
      const outOfStockCount = wigs.filter((w: any) => w.stock === 0).length;

      setStats({
        totalWigs: wigs.length,
        totalCategories: categoriesData.data?.length || 0,
        availableWigs: availableCount,
        outOfStock: outOfStockCount,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Wigs',
      value: stats.totalWigs,
      icon: Package,
      color: 'bg-gold',
      link: '/admin/dashboard/wigs',
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: FolderTree,
      color: 'bg-purple-500',
      link: '/admin/dashboard/categories',
    },
    {
      title: 'Available',
      value: stats.availableWigs,
      icon: TrendingUp,
      color: 'bg-green-500',
      link: '/admin/dashboard/wigs',
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStock,
      icon: DollarSign,
      color: 'bg-red-500',
      link: '/admin/dashboard/wigs',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your store overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.link}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/admin/dashboard/wigs/new"
              className="block px-4 py-3 bg-gold hover:bg-gold-dark text-white rounded-lg transition text-center font-medium"
            >
              Add New Wig
            </Link>
            <Link
              href="/admin/dashboard/categories/new"
              className="block px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition text-center font-medium"
            >
              Add New Category
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <p className="text-gray-600 text-sm">Your recent store activities will appear here.</p>
        </div>
      </div>
    </div>
  );
}
