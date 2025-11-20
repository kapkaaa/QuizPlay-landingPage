import React, { useState, useEffect, useRef } from 'react';
import { GraduationCap, Gamepad2, Trophy, Target, Users, BookOpen, CheckCircle, Star, Menu, X, MessageCircle, Mail, Phone, TrendingUp, Clock, Shield, ArrowRight, Play } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Konfigurasi Supabase - GANTI dengan kredensial Anda
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cllzeodekryrguojsjvr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbHplb2Rla3J5cmd1b2pzanZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MzI4OTYsImV4cCI6MjA3OTEwODg5Nn0.DnSceF8Y_SUEJI2PnBaSMeKoOFUXdmCVMwJlt49Rk6A';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function QuizPlayLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State untuk data dari database
  const [statistics, setStatistics] = useState({
    totalStudents: 0,
    totalSchools: 0,
    satisfactionRate: 0
  });
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch statistik
  useEffect(() => {
    fetchStatistics();
    fetchTestimonials();
  }, []);

  const fetchStatistics = async () => {
    try {
      const { count: studentCount } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'student');
      const { count: schoolCount } = await supabase.from('schools').select('*', { count: 'exact', head: true });

      const { data: attemptsData } = await supabase.from('quiz_attempts').select('percentage').eq('status', 'completed');

      let avgSatisfaction = 98;
      if (attemptsData && attemptsData.length > 0) {
        const total = attemptsData.reduce((sum, item) => sum + (item.percentage || 0), 0);
        avgSatisfaction = Math.round(total / attemptsData.length);
      }

      setStatistics({
        totalStudents: studentCount || 1000,
        totalSchools: schoolCount || 50,
        satisfactionRate: avgSatisfaction
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setStatistics({ totalStudents: 1000, totalSchools: 50, satisfactionRate: 98 });
    }
  };

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching testimonials:', error.message);
        throw error;
      }

      if (data && data.length > 0) {
        console.log('Testimonials fetched:', data);
        setTestimonials(data);
      } else {
        console.log('No testimonials found');
      }
    } catch (error) {
      console.error('Error in fetchTestimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.from('contact_submissions').insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        status: 'new'
      }]);
      if (error) throw error;

      alert('✅ Terima kasih! Pesan Anda berhasil dikirim.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('❌ Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img src="" alt="" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                QuizPlay
              </span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-purple-600 transition">Fitur</button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-gray-700 hover:text-purple-600 transition">Cara Kerja</button>
              <button onClick={() => scrollToSection('pricing')} className="text-gray-700 hover:text-purple-600 transition">Harga</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-purple-600 transition">Kontak</button>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-3 space-y-3">
              <button onClick={() => scrollToSection('features')} className="block w-full text-left text-gray-700 hover:text-purple-600">Fitur</button>
              <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left text-gray-700 hover:text-purple-600">Cara Kerja</button>
              <button onClick={() => scrollToSection('pricing')} className="block w-full text-left text-gray-700 hover:text-purple-600">Harga</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left text-gray-700 hover:text-purple-600">Kontak</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-semibold">
                🎮 learn hard, play smart.
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Belajar Lebih Seru dengan{' '}
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
                  Sistem Quiz Berbasis Game
                </span>
              </h1>
              <p className="text-xl text-gray-600">
              QuizPlay adalah layanan pembuatan website pendidikan berbasis game yang menghadirkan pengalaman menjawab soal layaknya bermain game. Dengan QuizPlay, proses belajar menjadi lebih interaktif, seru, dan menyenangkan sehingga siswa lebih termotivasi saat memahami materi.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition flex items-center justify-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Coba Demo</span>
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Hubungi Kami</span>
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-400 to-blue-500 rounded-3xl p-8 shadow-2xl transform rotate-3">
                <div className="bg-white rounded-2xl p-6 transform -rotate-3">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-6 h-6 text-yellow-500" />
                        <span className="font-semibold">Quiz Mode</span>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">Level 5</span>
                    </div>
                    <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-xl">
                      <p className="text-lg font-medium mb-4">Berapa hasil dari 15 × 8?</p>
                      <div className="space-y-2">
                        {['120', '110', '130', '115'].map((opt, i) => (
                          <div key={i} className="bg-white p-3 rounded-lg hover:bg-purple-50 cursor-pointer transition">
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">850 Poin</span>
                      </div>
                      <div className="text-sm text-gray-500">⏱️ 00:45</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Fitur Unggulan QuizPlay</h2>
            <p className="text-xl text-gray-600">Semua yang Anda butuhkan untuk pembelajaran yang efektif</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Gamepad2, title: 'Gamifikasi Penuh', desc: 'Sistem poin, badge, dan level yang membuat belajar seperti bermain game', color: 'purple' },
              { icon: TrendingUp, title: 'Motivasi Belajar', desc: 'Tingkatkan semangat siswa dengan kompetisi sehat dan reward menarik', color: 'blue' },
              { icon: Trophy, title: 'Progress & Leaderboard', desc: 'Pantau perkembangan dan bersaing dengan teman secara real-time', color: 'yellow' },
              { icon: Target, title: 'Multi-Platform', desc: 'Akses dari smartphone, tablet, atau komputer kapan saja, di mana saja', color: 'green' },
              { icon: BookOpen, title: 'Materi Fleksibel', desc: 'Guru dapat menyesuaikan soal dan materi sesuai kebutuhan kelas', color: 'pink' },
              { icon: Shield, title: 'Aman & Terpercaya', desc: 'Data siswa terlindungi dengan enkripsi tingkat enterprise', color: 'indigo' }
            ].map((feature, i) => (
              <div key={i} className={`p-6 rounded-2xl bg-gradient-to-br from-${feature.color}-50 to-${feature.color}-100 hover:shadow-xl transition transform hover:-translate-y-2`}>
                <feature.icon className={`w-12 h-12 text-${feature.color}-600 mb-4`} />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Cara Kerja QuizPlay</h2>
            <p className="text-xl text-gray-600">Mudah digunakan dalam 4 langkah sederhana</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Guru Membuat Soal', desc: 'Guru membuat quiz dengan mudah melalui dashboard intuitif', icon: BookOpen },
              { step: '02', title: 'Siswa Bermain Quiz', desc: 'Siswa mengakses quiz dan bermain seperti game seru', icon: Gamepad2 },
              { step: '03', title: 'Dapatkan Poin & Badge', desc: 'Sistem otomatis memberikan reward untuk motivasi', icon: Trophy },
              { step: '04', title: 'Lihat Laporan', desc: 'Guru melihat analisis lengkap progress siswa', icon: TrendingUp }
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {step.step}
                  </div>
                  <step.icon className="w-12 h-12 text-purple-600 mb-4 mt-4" />
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-purple-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Kenapa Memilih QuizPlay?</h2>
            <p className="text-xl opacity-90">Solusi terbaik untuk pembelajaran modern</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, title: 'Tingkatkan Engagement', desc: 'Siswa 3x lebih aktif dalam pembelajaran' },
              { icon: Star, title: 'Menyenangkan & Interaktif', desc: 'Belajar terasa seperti bermain game' },
              { icon: CheckCircle, title: 'Mudah Digunakan', desc: 'Interface intuitif, setup dalam 5 menit' },
              { icon: Clock, title: 'Hemat Waktu & Biaya', desc: 'Otomasi penilaian dan laporan instan' }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="inline-block p-4 bg-white/20 rounded-2xl mb-4">
                  <item.icon className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="opacity-90">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Scrollable Horizontal */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Apa Kata Mereka?</h2>
            <p className="text-xl text-gray-600">Testimoni dari guru dan siswa yang telah menggunakan QuizPlay</p>
          </div>

          <div className="overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex space-x-6 pb-4">
              {testimonials.map((item, i) => (
                <div
                  key={item.id || i}
                  className="flex-shrink-0 w-full md:w-[300px] lg:w-[350px] bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-2xl shadow-lg h-[300px] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex mb-4">
                      {[...Array(item.rating || 5)].map((_, j) => (
                        <Star key={j} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic">"{item.testimonial_text}"</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                      {(item.user_name || 'A').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold">{item.user_name}</div>
                      <div className="text-sm text-gray-600">{item.user_role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Paket Berlangganan</h2>
            <p className="text-xl text-gray-600">Pilih paket yang sesuai dengan kebutuhan Anda</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-gray-200 hover:border-purple-300 transition">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Paket Sekolah</h3>
                <div className="text-4xl font-bold text-purple-600 mb-2">Custom</div>
                <p className="text-gray-600">Harga disesuaikan jumlah siswa</p>
              </div>
              <ul className="space-y-4 mb-8">
                {['Unlimited quiz & soal', 'Dashboard admin lengkap', 'Laporan & analitik detail', 'Support prioritas', 'Training untuk guru', 'Custom branding'].map((item, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => scrollToSection('contact')}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                Request Proposal
              </button>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-sm font-bold">
                POPULER
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Paket Individu</h3>
                <div className="text-4xl font-bold mb-2">Rp 49K</div>
                <p className="opacity-90">per bulan</p>
              </div>
              <ul className="space-y-4 mb-8">
                {['Akses semua fitur', '100 quiz per bulan', 'Progress tracking', 'Leaderboard pribadi', 'Mobile app access', 'Email support'].map((item, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 bg-white text-purple-600 rounded-lg font-semibold hover:shadow-lg transition">
                Mulai Sekarang
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Pertanyaan Umum</h2>
            <p className="text-xl text-gray-600">Jawaban untuk pertanyaan yang sering diajukan</p>
          </div>

          <div className="space-y-6">
            {[
              { q: 'Apakah QuizPlay cocok untuk semua jenjang pendidikan?', a: 'Ya! QuizPlay dapat digunakan untuk SD, SMP, SMA, hingga perguruan tinggi. Materi dapat disesuaikan dengan kebutuhan.' },
              { q: 'Bagaimana cara memulai menggunakan QuizPlay?', a: 'Cukup daftar akun, buat quiz pertama Anda, dan bagikan kode kepada siswa. Sangat mudah!' },
              { q: 'Apakah ada biaya tersembunyi?', a: 'Tidak ada! Semua fitur yang tercantum dalam paket sudah termasuk dalam harga berlangganan.' },
              { q: 'Bisakah mencoba dulu sebelum berlangganan?', a: 'Tentu! Kami menyediakan free trial 14 hari tanpa perlu kartu kredit.' }
            ].map((faq, i) => (
              <div key={i} className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl">
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 bg-gradient-to-br from-purple-100 to-blue-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Hubungi Kami</h2>
            <p className="text-xl text-gray-600">Punya pertanyaan? Tim kami siap membantu Anda!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <a 
                href="https://wa.me/628574880949" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4 hover:shadow-xl transition"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold">WhatsApp</div>
                  <div className="text-gray-600">+62 850-4880-6949</div>
                </div>
              </a>

              <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold">Email</div>
                  <div className="text-gray-600">quizplay.ofc@gmail.com</div>
                </div>
              </div>

            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-4">
              <input
                type="text"
                placeholder="Nama Lengkap"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                required
                disabled={isSubmitting}
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                required
                disabled={isSubmitting}
              />
              <input
                type="tel"
                placeholder="No. Telepon"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                required
                disabled={isSubmitting}
              />
              <textarea
                placeholder="Pesan Anda"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                required
                disabled={isSubmitting}
              />
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Gamepad2 className="w-8 h-8 text-purple-400" />
                <span className="text-2xl font-bold">QuizPlay</span>
              </div>
              <p className="text-gray-400">Platform edukasi berbasis game untuk pembelajaran yang lebih seru dan efektif.</p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Produk</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition">Fitur</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-white transition">Harga</button></li>
                <li><a href="#" className="hover:text-white transition">Demo</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Perusahaan</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Karir</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Ikuti Kami</h3>
              <div className="flex space-x-4">
                <a href="https://instagram.com/quizplay.ofc" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition">
                  <span className="text-sm">IG</span>
                </a>
                <a href="https://tiktok.com/@quizplay.ofc" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition">
                  <span className="text-sm">TT</span>
                </a>
                <a href="https://facebook.com/profile.php?id=61584117713497" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition">
                  <span className="text-sm">FB</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 QuizPlay. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition">Kebijakan Privasi</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition">Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}