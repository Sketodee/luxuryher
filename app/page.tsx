'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Crown,
  Sparkles,
  ShoppingBag,
  Star,
  Instagram,
  Facebook,
  Twitter,
  MessageCircle,
  Phone,
  Mail,
  Award,
  Truck,
  ShieldCheck,
  Heart
} from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

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

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [wigs, setWigs] = useState<Wig[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero carousel images
  const heroImages = [
    'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1200&q=80',
    'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=1200&q=80',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=1200&q=80',
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchWigs();
  }, [selectedCategory]);

  // Auto-rotate hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const fetchData = async () => {
    try {
      const [categoriesRes] = await Promise.all([
        fetch('/api/categories'),
      ]);

      const categoriesData = await categoriesRes.json();
      if (categoriesData.success) {
        setCategories(categoriesData.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const fetchWigs = async () => {
    setLoading(true);
    try {
      const url = selectedCategory
        ? `/api/wigs?category=${selectedCategory}&available=true`
        : '/api/wigs?available=true';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setWigs(data.data.filter((w: Wig) => w.stock > 0));
      }
    } catch (error) {
      console.error('Failed to fetch wigs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink via-white to-rose">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center shadow-lg">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Luxury Her</h1>
                <p className="text-xs text-gold font-medium">Premium Wigs Collection</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gold transition"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gold transition"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <Link
                href="/admin/login"
                className="text-sm text-gray-600 hover:text-gold transition hidden sm:block"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Image Carousel Background */}
      <section className="relative h-[500px] sm:h-[600px] md:h-[700px] overflow-hidden">
        {/* Background Image Carousel */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={image}
                alt={`Hero ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/80"></div>
          {/* Gold gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-gold/10 via-transparent to-gold/20"></div>
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center justify-center px-4 sm:px-6">
          <div className="max-w-7xl mx-auto text-center">
            {/* <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full mb-8 shadow-lg">
              <Sparkles className="w-5 h-5 text-gold" />
              <span className="text-sm font-semibold text-gold">Luxury Collection 2024</span>
            </div> */}

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-2xl px-2">
              Elevate Your Style with
              <br />
              <span className="text-gold">
                Luxury Wigs
              </span>
            </h2>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed drop-shadow-lg px-4">
              Discover our exquisite collection of premium wigs. Handcrafted with care,
              designed to make you feel confident, beautiful, and absolutely stunning.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4">
              <a
                href="#collection"
                className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full transition shadow-lg hover:shadow-2xl flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Shop Collection</span>
              </a>
              <a
                href="#features"
                className="w-full sm:w-auto bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full transition shadow-lg hover:shadow-2xl"
              >
                Learn More
              </a>
            </div>

            <div className="flex items-center justify-center space-x-3 sm:space-x-6 flex-wrap gap-2 px-4 text-sm sm:text-base">
              <div className="flex items-center space-x-1 text-gold">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-gold" />
                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-gold" />
                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-gold" />
                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-gold" />
                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-gold" />
              </div>
              <span className="text-white font-medium drop-shadow-md">5.0 Rating</span>
              <span className="text-white/60 hidden sm:inline">|</span>
              <span className="text-white font-medium drop-shadow-md">500+ Happy Customers</span>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-gold w-8'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div> */}
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Luxury Her?</h3>
            <p className="text-xl text-gray-600">Experience the difference of premium quality</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 rounded-full mb-4">
                <Award className="w-8 h-8 text-gold" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">Premium Quality</h4>
              <p className="text-gray-600">100% high-grade human hair and synthetic blends</p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 rounded-full mb-4">
                <Truck className="w-8 h-8 text-gold" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">Fast Delivery</h4>
              <p className="text-gray-600">Quick and secure shipping to your doorstep</p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 rounded-full mb-4">
                <ShieldCheck className="w-8 h-8 text-gold" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">Secure Shopping</h4>
              <p className="text-gray-600">Safe and trusted ordering process</p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 rounded-full mb-4">
                <Heart className="w-8 h-8 text-gold" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">Customer Love</h4>
              <p className="text-gray-600">Rated 5 stars by our amazing customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle Banner */}
      <section className="py-20 px-4 bg-gradient-to-r from-gold/10 via-pink to-rose/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80"
                alt="Luxury hair fashion"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-4xl font-bold text-gray-800 mb-6">
                Redefine Your Look with Confidence
              </h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Every wig in our collection is carefully selected and crafted to ensure you look and feel your absolute best.
                Whether you're looking for a natural everyday style or a glamorous look for special occasions, we have the perfect wig for you.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Star className="w-3 h-3 text-white fill-white" />
                  </div>
                  <span className="text-gray-700">Natural-looking textures and colors</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Star className="w-3 h-3 text-white fill-white" />
                  </div>
                  <span className="text-gray-700">Comfortable all-day wear</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Star className="w-3 h-3 text-white fill-white" />
                  </div>
                  <span className="text-gray-700">Easy to style and maintain</span>
                </li>
              </ul>
              <a
                href="#collection"
                className="inline-flex items-center space-x-2 bg-gold hover:bg-gold-dark text-white font-bold px-8 py-4 rounded-full transition shadow-lg"
              >
                <span>Explore Collection</span>
                <ShoppingBag className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section id="collection" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">Our Collection</h3>
            <p className="text-xl text-gray-600">Browse by category to find your perfect match</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-8 py-3 rounded-full font-semibold transition shadow-sm ${
                selectedCategory === ''
                  ? 'bg-gold text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gold-light border border-gray-200'
              }`}
            >
              All Wigs
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(category._id)}
                className={`px-8 py-3 rounded-full font-semibold transition shadow-sm ${
                  selectedCategory === category._id
                    ? 'bg-gold text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gold-light border border-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Wigs Grid */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gold mb-4"></div>
              <p className="text-gray-600">Loading our beautiful collection...</p>
            </div>
          ) : wigs.length === 0 ? (
            <div className="text-center py-20 bg-gradient-to-br from-pink to-rose/20 rounded-3xl">
              <ShoppingBag className="w-20 h-20 text-gold/50 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-gray-800 mb-3">No wigs available yet</h3>
              <p className="text-xl text-gray-600 mb-8">Check back soon for new additions to our luxurious collection.</p>
              <p className="text-gray-500">Follow us on social media to be the first to know!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {wigs.map((wig) => (
                <Link
                  key={wig._id}
                  href={`/wigs/${wig.slug}`}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                    {wig.images[0] && (
                      <Image
                        src={wig.images[0]}
                        alt={wig.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                    {wig.discount && wig.discount > 0 && (
                      <div className="absolute top-4 left-4 bg-gold text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                        -{wig.discount}% OFF
                      </div>
                    )}
                    {wig.stock <= 5 && (
                      <div className="absolute bottom-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg animate-pulse">
                        Only {wig.stock} left!
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-gold font-bold uppercase tracking-wide mb-2">
                      {wig.category?.name || 'Uncategorized'}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-1 group-hover:text-gold transition">
                      {wig.name}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        {wig.discount && wig.discount > 0 ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-gold">₦{wig.finalPrice.toLocaleString()}</span>
                            <span className="text-sm text-gray-400 line-through">₦{wig.price.toLocaleString()}</span>
                          </div>
                        ) : (
                          <span className="text-2xl font-bold text-gray-800">₦{wig.price.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300 bg-white"></div>
                      <span className="font-medium">{wig.color}</span>
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                      <span className="text-gold font-semibold text-sm group-hover:underline">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-pink via-white to-rose">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h3>
            <p className="text-xl text-gray-600">Join hundreds of satisfied customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-1 text-gold mb-4">
                  <Star className="w-5 h-5 fill-gold" />
                  <Star className="w-5 h-5 fill-gold" />
                  <Star className="w-5 h-5 fill-gold" />
                  <Star className="w-5 h-5 fill-gold" />
                  <Star className="w-5 h-5 fill-gold" />
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "Absolutely stunning quality! The wig looks so natural and feels comfortable.
                  I've received so many compliments. Luxury Her is now my go-to for premium wigs!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                    <span className="text-gold font-bold">
                      {String.fromCharCode(64 + i)}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Happy Customer</p>
                    <p className="text-sm text-gray-500">Verified Buyer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-gold via-gold-dark to-gold">
        <div className="max-w-4xl mx-auto text-center text-white">
          <Crown className="w-16 h-16 mx-auto mb-6" />
          <h3 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Look?</h3>
          <p className="text-xl mb-8 text-white/90">
            Browse our collection and find the perfect wig that matches your style and personality.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#collection"
              className="bg-white text-gold hover:bg-gray-100 font-bold px-8 py-4 rounded-full transition shadow-lg flex items-center space-x-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Shop Now</span>
            </a>
            <a
              href="https://wa.me/2348100250306"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-full transition shadow-lg flex items-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
                  <Crown className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Luxury Her</h3>
                  <p className="text-sm text-gold">Premium Wigs Collection</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Your destination for premium, luxury wigs. We believe every woman deserves to feel
                confident and beautiful. Discover our exquisite collection handpicked for you.
              </p>
              <div className="flex items-center space-x-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-gold rounded-full flex items-center justify-center transition"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-gold rounded-full flex items-center justify-center transition"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-gold rounded-full flex items-center justify-center transition"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://wa.me/2348100250306"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-gold rounded-full flex items-center justify-center transition"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#collection" className="text-gray-400 hover:text-gold transition">
                    Shop Collection
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-gray-400 hover:text-gold transition">
                    Why Choose Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-gold transition">
                    About Us
                  </a>
                </li>
                <li>
                  <Link href="/admin/login" className="text-gray-400 hover:text-gold transition">
                    Admin Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-bold mb-4">Get in Touch</h4>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <MessageCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <a href="https://wa.me/2348100250306" className="text-gray-400 hover:text-gold transition">
                    WhatsApp Us
                  </a>
                </li>
                <li className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <a href="tel:+2348100250306" className="text-gray-400 hover:text-gold transition">+234 810 025 0306</a>
                </li>
                <li className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <a href="mailto:hello@luxuryher.com" className="text-gray-400 hover:text-gold transition">
                    hello@luxuryher.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 mb-2">
              &copy; 2024 Luxury Her. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Crafted with love for beautiful women everywhere
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
