'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Crown, ShoppingBag, Package, Palette, Tag, MessageCircle } from 'lucide-react';

interface Wig {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  category: {
    _id: string;
    name: string;
  };
  price: number;
  discount?: number;
  finalPrice: number;
  color: string;
  stock: number;
  available: boolean;
  images: string[];
  video?: string;
}

export default function WigDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [wig, setWig] = useState<Wig | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchWig();
  }, [slug]);

  const fetchWig = async () => {
    try {
      const res = await fetch(`/api/wigs/slug/${slug}`);
      const data = await res.json();
      if (data.success) {
        setWig(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch wig:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppOrder = () => {
    if (!wig) return;

    const productUrl = window.location.href;
    const message = `Hi! I'm interested in ordering this wig:\n\n*${wig.name}*\nColor: ${wig.color}\nPrice: ₦${wig.finalPrice.toLocaleString()}${wig.discount ? ` (${wig.discount}% OFF)` : ''}\n\nProduct Link: ${productUrl}`;

    const whatsappUrl = `https://wa.me/2348100250306?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!wig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Wig not found</h2>
          <Link href="/" className="text-gold hover:underline">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink via-white to-rose">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Luxury Her</h1>
                <p className="text-xs text-gold">Premium Wigs Collection</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gold transition mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images Section */}
          <div>
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4">
              {wig.images[selectedImage] && (
                <Image
                  src={wig.images[selectedImage]}
                  alt={wig.name}
                  fill
                  className="object-cover"
                  priority
                />
              )}
              {wig.discount && wig.discount > 0 && (
                <div className="absolute top-4 left-4 bg-gold text-white text-lg font-bold px-4 py-2 rounded-full shadow-lg">
                  -{wig.discount}% OFF
                </div>
              )}
              {wig.stock <= 5 && wig.stock > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-2 rounded-full">
                  Only {wig.stock} left!
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {wig.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-gold' : 'opacity-60 hover:opacity-100'
                  } transition`}
                >
                  <Image src={image} alt={`${wig.name} ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>

            {/* Video */}
            {wig.video && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Product Video</h3>
                <video src={wig.video} controls className="w-full rounded-2xl" />
              </div>
            )}
          </div>

          {/* Details Section */}
          <div>
            <div className="inline-block bg-gold/10 text-gold text-sm font-semibold px-4 py-1 rounded-full mb-4">
              {wig.category.name}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 break-words">{wig.name}</h1>

            <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4 mb-6">
              {wig.discount && wig.discount > 0 ? (
                <>
                  <span className="text-3xl sm:text-4xl font-bold text-gold break-words">₦{wig.finalPrice.toLocaleString()}</span>
                  <span className="text-xl sm:text-2xl text-gray-400 line-through sm:pb-1">₦{wig.price.toLocaleString()}</span>
                  <span className="text-base sm:text-lg text-green-600 font-semibold sm:pb-1">
                    Save ₦{(wig.price - wig.finalPrice).toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-3xl sm:text-4xl font-bold text-gray-800 break-words">₦{wig.price.toLocaleString()}</span>
              )}
            </div>

            {wig.description && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{wig.description}</p>
              </div>
            )}

            {/* Product Details */}
            <div className="bg-white rounded-2xl p-6 mb-8 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Details</h3>

              <div className="flex items-center space-x-3">
                <Palette className="w-5 h-5 text-gold" />
                <div>
                  <span className="text-sm text-gray-500">Color</span>
                  <p className="font-semibold text-gray-800">{wig.color}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-gold" />
                <div>
                  <span className="text-sm text-gray-500">Stock Status</span>
                  <p className="font-semibold text-gray-800">
                    {wig.stock > 0 ? (
                      <span className="text-green-600">In Stock ({wig.stock} available)</span>
                    ) : (
                      <span className="text-red-600">Out of Stock</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Tag className="w-5 h-5 text-gold" />
                <div>
                  <span className="text-sm text-gray-500">Availability</span>
                  <p className="font-semibold text-gray-800">
                    {wig.available ? (
                      <span className="text-green-600">Available for Order</span>
                    ) : (
                      <span className="text-red-600">Currently Unavailable</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Button */}
            {wig.available && wig.stock > 0 ? (
              <button
                onClick={handleWhatsAppOrder}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="w-6 h-6" />
                <span>Order via WhatsApp</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 font-bold py-4 rounded-xl cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-6 h-6" />
                <span>{wig.stock === 0 ? 'Out of Stock' : 'Currently Unavailable'}</span>
              </button>
            )}

            <p className="text-sm text-gray-500 text-center mt-4">
              Click the button above to send us a message on WhatsApp with your order details
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold">Luxury Her</h3>
          </div>
          <p className="text-gray-400 mb-6">Your destination for premium, luxury wigs</p>
          <p className="text-sm text-gray-500">&copy; 2024 Luxury Her. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
