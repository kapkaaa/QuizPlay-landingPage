import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { CheckCircle, Star, Users, Clock, Shield, ArrowLeft, Gamepad2, Trophy, TrendingUp, BookOpen } from 'lucide-react';

// Konfigurasi Supabase - GANTI dengan kredensial Anda
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cllzeodekryrguojsjvr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbHplb2Rla3J5cmd1b2pzanZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MzI4OTYsImV4cCI6MjA3OTEwODg5Nn0.DnSceF8Y_SUEJI2PnBaSMeKoOFUXdmCVMwJlt49Rk6A';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState('monthly');

  useEffect(() => {
    fetchPlanDetail();
  }, [id]);

  const fetchPlanDetail = async () => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .single();
        
        
        if (error) throw error;
        
        if (data) {
          setPlan(data);
      } else {
        console.log('Plan not found');
      }
    } catch (error) {
      console.error('Error fetching plan detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Paket tidak ditemukan</h2>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const originalPrice = plan.price || 0;
  const discountPercentage = plan.discount_percentage || 0;
  const discountedPrice = originalPrice - (originalPrice * discountPercentage / 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Kembali</span>
            </button>
            <div className="flex items-center space-x-2">
              <img src="/assets/logo1.png" alt="logo" class="w-8 h-8"/>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                QuizPlay
              </span>
            </div>
            <div className="w-20"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-semibold mb-4">
            {plan.category || 'Paket Game'}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{plan.name}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {plan.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Product Info */}
          <div className="lg:col-span-2 space-y-8">
          {plan && (
            <div 
              className="rounded-3xl overflow-hidden bg-white border shadow-md hover:shadow-xl transition cursor-pointer"
              onClick={() => window.open(plan.preview_url, "_blank")}
            >
              
              {/* FOTO PREVIEW */}
              <div className="w-80 mx-auto rounded-3xl overflow-hidden bg-white border shadow-md hover:shadow-xl transition cursor-pointer">
                <div className="aspect-[16/9] bg-gray-100">
                  <img 
                    src={plan.thumbnail_url}
                    alt={plan.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* BAWAHNYA */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900">Preview Game</h3>
                <p className="text-gray-500 text-sm">Klik untuk melihat detail atau demo</p>
              </div>
            </div>
          )}

            {/* Features Section */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Fitur Lengkap</h2>
              <div className="grid md:grid-cols-2 gap-6">
              {plan.features
                ? plan.features.split(',').map((feature, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature.trim()}</span>
                    </div>
                  ))
                : <p className="text-gray-500">Fitur tidak tersedia</p>
              }
              </div>
            </div>

            {/* Detail Section */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Detail Paket</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-semibold text-gray-700">Durasi Akses:</span>
                  <span className="text-gray-600">{plan.duration || 'Tidak terbatas'}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-semibold text-gray-700">Kapasitas Siswa:</span>
                  <span className="text-gray-600">{plan.student_capacity || 'Custom'}</span>
                </div>
                <div className="flex justify-between items-start py-3 border-b border-gray-100 flex-wrap">
                  <span className="font-semibold text-gray-700">Fitur Tambahan:</span>
                  <span className="text-gray-600 max-w-[70%] text-right break-words">
                    {plan.features || 'Tersedia'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Pricing Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white p-6 md:p-8 rounded-3xl shadow-xl border-2 border-purple-300 relative overflow-hidden">
              {/* Popular Badge */}
              {(plan.name.toLowerCase().includes('populer') || plan.is_popular) && (
                <div className="absolute top-4 right-4 bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-sm font-bold">
                  POPULER
                </div>
              )}

              {/* Pricing Info */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4 break-words">{plan.name}</h3>
                
                {originalPrice > 0 ? (
                  <div>
                    {discountPercentage > 0 && (
                      <div className="text-gray-500 mb-2">
                        <span className="line-through text-lg">Rp {originalPrice.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
                      Rp {discountedPrice.toLocaleString()}
                      {!plan.category?.toLowerCase().includes('sekolah') && (
                        <span className="text-lg"></span>
                      )}
                    </div>
                    {discountPercentage > 0 && (
                      <div className="text-green-600 font-semibold">
                        Hemat {discountPercentage}%!
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
                    Gratis
                  </div>
                )}
              </div>

              {/* Benefits */}
              <div className="space-y-4 mb-8">
                <p className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Gratis pengiriman</span>
                </p>
                <p className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Dukungan 24/7</span>
                </p>
                <p className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Akses seumur hidup</span>
                </p>
              </div>

              {/* CTA Button */}
              <div className="w-full">
                <a
                  href="https://wa.me/6285748806949?text=Halo%2C%20saya%20mau%20membeli%20paket%20game%28hapus%20yang%20tidak%20anda%20butuhkan%29%0A-Teka%20Teki%20Silang%0A-Dungeoun%0A-Russian%20Roulette"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block py-4 rounded-lg font-semibold hover:shadow-lg transition bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg text-center"
                >
                  Beli Sekarang
                </a>
              </div>

              {/* Security Info */}
              <div className="mt-6 text-center text-sm text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Pembayaran aman dan terenkripsi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}