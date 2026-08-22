import { useState } from 'react'
import { Link } from 'react-router-dom'
import newLogo from '@/assets/new-one.png'

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={newLogo} alt="PharmaET Logo" className="w-8 h-8" />
            <span className="font-bold text-lg tracking-tight">
              <span style={{ color: '#0F172A' }}>Pharma</span>
              <span style={{ color: '#0F766E' }}>ET</span>
            </span>
          </div>

          {/* Menu - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-600 hover:text-slate-900 transition">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-slate-600 hover:text-slate-900 transition">
              How it Works
            </a>
            <a href="#pricing" className="text-sm text-slate-600 hover:text-slate-900 transition">
              Pricing
            </a>
            <a href="#contact" className="text-sm text-slate-600 hover:text-slate-900 transition">
              Contact
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
              Log in
            </Link>
            <a
              href="#contact"
              className="px-5 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-sm font-semibold rounded-lg hover:from-teal-700 hover:to-emerald-700 transition shadow-lg hover:shadow-xl"
            >
              Request Demo
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 px-6 py-4 space-y-3">
            <a href="#features" className="block text-sm text-slate-600 hover:text-slate-900">
              Features
            </a>
            <a href="#how-it-works" className="block text-sm text-slate-600 hover:text-slate-900">
              How it Works
            </a>
            <a href="#pricing" className="block text-sm text-slate-600 hover:text-slate-900">
              Pricing
            </a>
            <a href="#contact" className="block text-sm text-slate-600 hover:text-slate-900">
              Contact
            </a>
            <div className="pt-3 border-t space-y-2">
              <Link to="/login" className="block text-sm text-slate-600">
                Log in
              </Link>
              <a
                href="#contact"
                className="block w-full px-5 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-sm font-semibold rounded-lg text-center"
              >
                Request Demo
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center min-h-[70vh]">
            {/* Left Content */}
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-4">
                Stop Losing Money to Expired Medicines
              </h1>

              <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-6">
                PharmaET is an offline-first multi-branch pharmacy management system built for Ethiopian pharmacies.
                Control inventory, enforce FEFO, and process sales — even without internet.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <a
                  href="#contact"
                  className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-emerald-700 transition shadow-lg hover:shadow-xl text-center text-sm"
                >
                  Start Exploring
                </a>
                <a
                  href="#contact"
                  className="px-6 py-2.5 border-2 border-slate-300 text-slate-900 font-semibold rounded-lg hover:border-slate-400 hover:bg-slate-50 transition text-center text-sm"
                >
                  View Demo
                </a>
              </div>

              {/* Badges - Now Visible Above Fold */}
              <div className="flex flex-wrap gap-2">
                {['Offline-First', 'Multi-Branch', 'FEFO Inventory'].map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200"
                  >
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Right - Product Mockup */}
            <div className="relative hidden md:block">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-emerald-50 rounded-2xl opacity-60 blur-2xl"></div>

              {/* Dashboard Mockup */}
              <div className="relative bg-white rounded-2xl shadow-2xl p-5 border border-gray-100">
                {/* Browser Header */}
                <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 bg-red-400 rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
                  </div>
                  <span className="text-xs text-slate-400 ml-3">Dashboard</span>
                </div>

                {/* Mock Dashboard Content */}
                <div className="space-y-3">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2.5">
                      <p className="text-xs text-blue-600 font-medium">Today's Sales</p>
                      <p className="text-base font-bold text-blue-900 mt-0.5">15,420 Birr</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-2.5">
                      <p className="text-xs text-emerald-600 font-medium">Transactions</p>
                      <p className="text-base font-bold text-emerald-900 mt-0.5">47</p>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <p className="text-xs font-semibold text-slate-700 mb-1.5">Top Medicines</p>
                    <div className="space-y-1">
                      {['Paracetamol 500mg', 'Amoxicillin 250mg', 'Ibuprofen 400mg'].map((item) => (
                        <div key={item} className="flex justify-between items-center text-xs">
                          <span className="text-slate-600">{item}</span>
                          <span className="font-semibold text-slate-900">+89 sold</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* POS Interface Peek */}
                  <div className="flex gap-1.5">
                    <div className="flex-1 bg-teal-50 rounded-lg p-1.5 text-center">
                      <p className="text-xs font-semibold text-teal-700">POS</p>
                    </div>
                    <div className="flex-1 bg-slate-100 rounded-lg p-1.5 text-center">
                      <p className="text-xs font-semibold text-slate-600">Inventory</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating POS Card */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-xl p-3 w-48 border border-gray-100">
                <p className="text-xs font-semibold text-slate-700 mb-2">POS - Quick Sale</p>
                <div className="space-y-1.5">
                  <input
                    type="text"
                    placeholder="Search medicine..."
                    className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  />
                  <div className="flex gap-1.5">
                    <button className="flex-1 px-2.5 py-1 bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs font-semibold rounded-lg">
                      Add
                    </button>
                    <button className="flex-1 px-2.5 py-1 border border-gray-200 text-slate-600 text-xs font-semibold rounded-lg">
                      Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Running a Pharmacy Shouldn't Be This Hard
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Most pharmacies in Ethiopia face the same challenges. PharmaET solves them all.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="8" width="36" height="32" rx="3" stroke="#10B981" strokeWidth="2" fill="none"/>
                    <path d="M12 14L36 34" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M36 14L12 34" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="24" cy="24" r="20" stroke="#10B981" strokeWidth="2" fill="none" opacity="0.3"/>
                  </svg>
                ),
                title: 'Expired Medicine Waste',
                description: 'Lose 15-20% revenue to expired stock without proper FEFO tracking',
              },
              {
                icon: (
                  <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="8" y="10" width="14" height="28" rx="2" stroke="#10B981" strokeWidth="2"/>
                    <rect x="26" y="10" width="14" height="28" rx="2" stroke="#10B981" strokeWidth="2"/>
                    <line x1="24" y1="14" x2="24" y2="38" stroke="#10B981" strokeWidth="2" strokeDasharray="2,2"/>
                    <circle cx="15" cy="24" r="2" fill="#10B981" opacity="0.4"/>
                    <circle cx="33" cy="24" r="2" fill="#10B981" opacity="0.4"/>
                  </svg>
                ),
                title: 'No Branch Visibility',
                description: 'Cannot see real-time stock levels across multiple pharmacy locations',
              },
              {
                icon: (
                  <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 12H40V36C40 37.1046 39.1046 38 38 38H10C8.89543 38 8 37.1046 8 36V12Z" stroke="#10B981" strokeWidth="2" fill="none"/>
                    <path d="M12 12V8C12 6.89543 12.8954 6 14 6H34C35.1046 6 36 6.89543 36 8V12" stroke="#10B981" strokeWidth="2"/>
                    <circle cx="16" cy="20" r="1.5" fill="#10B981"/>
                    <circle cx="24" cy="20" r="1.5" fill="#10B981"/>
                    <circle cx="32" cy="20" r="1.5" fill="#10B981"/>
                    <line x1="18" y1="26" x2="30" y2="26" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="18" y1="30" x2="30" y2="30" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'Slow Manual Checkout',
                description: 'Manual POS causes errors, long customer queues, lost sales',
              },
              {
                icon: (
                  <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M36 18C38.2091 18 40 16.2091 40 14C40 11.7909 38.2091 10 36 10C33.7909 10 32 11.7909 32 14C32 16.2091 33.7909 18 36 18Z" stroke="#10B981" strokeWidth="2" fill="none"/>
                    <path d="M32 20H40V28C40 30.2091 38.2091 32 36 32C33.7909 32 32 30.2091 32 28V20Z" stroke="#10B981" strokeWidth="2" fill="none"/>
                    <line x1="28" y1="24" x2="12" y2="24" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="18" cy="24" r="6" stroke="#10B981" strokeWidth="2" fill="none"/>
                    <path d="M14 28V32C14 33.1046 14.8954 34 16 34H20C21.1046 34 22 33.1046 22 32V28" stroke="#10B981" strokeWidth="2" fill="none"/>
                  </svg>
                ),
                title: 'Internet Dependency',
                description: 'Sales stop when connection drops, losing critical business hours',
              },
            ].map((problem, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100 transition duration-300 hover:-translate-y-1"
              >
                <div className="mb-6 inline-flex p-3 bg-gray-50 group-hover:bg-emerald-50 rounded-xl transition">
                  {problem.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{problem.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{problem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Everything You Need to Run Your Pharmacy Efficiently
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              All the tools pharmacy managers need, designed with offline-first capability
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="8" y="14" width="32" height="24" rx="2" stroke="#10B981" strokeWidth="2" fill="none"/>
                    <path d="M20 14V10C20 8.89543 20.8954 8 22 8H26C27.1046 8 28 8.89543 28 10V14" stroke="#10B981" strokeWidth="2"/>
                    <circle cx="24" cy="26" r="3" stroke="#10B981" strokeWidth="2" fill="none"/>
                    <path d="M8 20H40" stroke="#10B981" strokeWidth="2" opacity="0.3"/>
                  </svg>
                ),
                title: 'Offline-First POS',
                description: 'Accept sales anytime, anywhere. Syncs automatically when online.',
              },
              {
                icon: (
                  <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 8L32 14V32C32 33.1046 31.1046 34 30 34H18C16.8954 34 16 33.1046 16 32V14L24 8Z" stroke="#10B981" strokeWidth="2" fill="none"/>
                    <path d="M24 18V26" stroke="#10B981" strokeWidth="2"/>
                    <path d="M20 22H28" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="24" cy="14" r="2" fill="#10B981"/>
                  </svg>
                ),
                title: 'Smart FEFO Inventory',
                description: 'Automatically select earliest-expiring batches to reduce waste.',
              },
              {
                icon: (
                  <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="8" width="12" height="32" rx="1.5" stroke="#10B981" strokeWidth="2" fill="none"/>
                    <rect x="22" y="8" width="12" height="32" rx="1.5" stroke="#10B981" strokeWidth="2" fill="none"/>
                    <rect x="38" y="8" width="4" height="32" rx="1" stroke="#10B981" strokeWidth="2" fill="none" opacity="0.5"/>
                    <circle cx="12" cy="20" r="1.5" fill="#10B981"/>
                    <circle cx="28" cy="24" r="1.5" fill="#10B981"/>
                    <line x1="6" y1="42" x2="42" y2="42" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'Multi-Branch Management',
                description: 'Manage unlimited branches with real-time visibility and control.',
              },
              {
                icon: (
                  <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="8" y="10" width="32" height="28" rx="2" stroke="#10B981" strokeWidth="2" fill="none"/>
                    <rect x="12" y="14" width="8" height="6" rx="1" stroke="#10B981" strokeWidth="1.5" fill="none"/>
                    <rect x="24" y="14" width="8" height="6" rx="1" stroke="#10B981" strokeWidth="1.5" fill="none"/>
                    <rect x="12" y="24" width="8" height="6" rx="1" stroke="#10B981" strokeWidth="1.5" fill="none"/>
                    <rect x="24" y="24" width="8" height="6" rx="1" stroke="#10B981" strokeWidth="1.5" fill="none"/>
                  </svg>
                ),
                title: 'Fast Point of Sale',
                description: 'Barcode scanning, cart management, receipts in seconds.',
              },
              {
                icon: (
                  <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 18H38V36C38 37.1046 37.1046 38 36 38H12C10.8954 38 10 37.1046 10 36V18Z" stroke="#10B981" strokeWidth="2" fill="none"/>
                    <path d="M14 18V12C14 10.8954 14.8954 10 16 10H32C33.1046 10 34 10.8954 34 12V18" stroke="#10B981" strokeWidth="2"/>
                    <circle cx="24" cy="27" r="2" fill="#10B981" opacity="0.6"/>
                    <path d="M18 32H30" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
                  </svg>
                ),
                title: 'Purchase & Stock Receiving',
                description: 'Streamlined PO creation, GRN processing, auto-inventory updates.',
              },
              {
                icon: (
                  <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="18" r="6" stroke="#10B981" strokeWidth="2" fill="none"/>
                    <path d="M10 28C10 24.6863 12.6863 22 16 22C19.3137 22 22 24.6863 22 28" stroke="#10B981" strokeWidth="2" fill="none"/>
                    <circle cx="32" cy="18" r="6" stroke="#10B981" strokeWidth="2" fill="none"/>
                    <path d="M26 28C26 24.6863 28.6863 22 32 22C35.3137 22 38 24.6863 38 28" stroke="#10B981" strokeWidth="2" fill="none"/>
                    <path d="M10 38H38" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M14 34H15M24 34H25M34 34H35" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'Role-Based Access',
                description: 'Cashier, Pharmacist, Manager, Admin roles with specific permissions.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group rounded-2xl bg-gradient-to-br from-slate-50 to-white p-8 border border-gray-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100 transition duration-300 hover:-translate-y-1"
              >
                <div className="mb-6 inline-flex p-3 bg-emerald-50 group-hover:bg-emerald-100 rounded-xl transition">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">How PharmaET Works</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Simple, intuitive, and built for Ethiopian pharmacies
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                number: '01',
                title: 'Sign Up',
                description: 'Create your account and set up your branches in minutes',
                icon: (
                  <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 24C28.4183 24 32 20.4183 32 16C32 11.5817 28.4183 8 24 8C19.5817 8 16 11.5817 16 16C16 20.4183 19.5817 24 24 24Z" stroke="#10B981" strokeWidth="2" fill="none"/>
                    <path d="M8 42C8 35.3726 15.163 30 24 30C32.837 30 40 35.3726 40 42" stroke="#10B981" strokeWidth="2" fill="none"/>
                  </svg>
                ),
              },
              {
                number: '02',
                title: 'Load Inventory',
                description: 'Add medicines, batches, expiry dates, and suppliers',
                icon: (
                  <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="10" width="36" height="28" rx="2" stroke="#10B981" strokeWidth="2" fill="none"/>
                    <path d="M6 18H42" stroke="#10B981" strokeWidth="2"/>
                    <path d="M14 10V38" stroke="#10B981" strokeWidth="2" opacity="0.3"/>
                    <path d="M24 10V38" stroke="#10B981" strokeWidth="2" opacity="0.3"/>
                    <path d="M34 10V38" stroke="#10B981" strokeWidth="2" opacity="0.3"/>
                  </svg>
                ),
              },
              {
                number: '03',
                title: 'Start Selling',
                description: 'Use POS for sales, manage stock, process purchases',
                icon: (
                  <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 12H40V36C40 37.1046 39.1046 38 38 38H10C8.89543 38 8 37.1046 8 36V12Z" stroke="#10B981" strokeWidth="2" fill="none"/>
                    <path d="M12 12V8C12 6.89543 12.8954 6 14 6H34C35.1046 6 36 6.89543 36 8V12" stroke="#10B981" strokeWidth="2"/>
                    <circle cx="24" cy="26" r="3" stroke="#10B981" strokeWidth="2" fill="none"/>
                    <path d="M18 32H30" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
                  </svg>
                ),
              },
              {
                number: '04',
                title: 'Grow & Scale',
                description: 'Real-time reports, analytics, multi-branch control',
                icon: (
                  <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 36H42" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 36L10 28L14 32L18 20L22 24L26 14L30 26L34 18L36 32L40 28" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M36 32V36" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ),
              },
            ].map((step, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100 transition duration-300 hover:-translate-y-1"
              >
                <div className="mb-6 inline-flex p-3 bg-emerald-50 group-hover:bg-emerald-100 rounded-xl transition">
                  {step.icon}
                </div>
                <p className="text-sm font-bold text-emerald-600 mb-2">{step.number}</p>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Built for Ethiopian Pharmacies
              </h2>

              <div className="space-y-6">
                {[
                  {
                    icon: (
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" fill="#10B981"/>
                      </svg>
                    ),
                    title: 'Made for Ethiopia',
                    description: 'Understands Ethiopian pharmacy workflows, pricing, and regulations',
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" fill="#10B981"/>
                      </svg>
                    ),
                    title: 'Works Without Internet',
                    description: 'Offline-first architecture means you never stop selling',
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" fill="#10B981"/>
                      </svg>
                    ),
                    title: 'Your Data is Safe',
                    description: 'Enterprise-grade security, encrypted data, automatic backups',
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" fill="#10B981"/>
                      </svg>
                    ),
                    title: 'Built by Pharmacists',
                    description: 'Designed with pharmacy managers and pharmacists',
                  },
                ].map((trust, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {trust.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">{trust.title}</h3>
                      <p className="text-slate-600 text-sm">{trust.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Stats */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { number: '500+', label: 'Medicines Managed' },
                { number: '99.9%', label: 'Uptime' },
                { number: '0ms', label: 'Offline Response' },
                { number: 'Unlimited', label: 'Branches' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
                  <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                    {stat.number}
                  </p>
                  <p className="text-slate-600 text-sm mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Start free. Scale as you grow. No credit card required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: 'Free',
                period: 'Forever',
                description: 'Perfect for single pharmacy locations',
                features: ['1 Branch', 'Basic POS', 'Offline Mode', 'Email Support'],
                cta: 'Start Free',
              },
              {
                name: 'Professional',
                price: '499',
                period: '/month',
                description: 'For growing pharmacy chains',
                features: [
                  'Unlimited Branches',
                  'Advanced Analytics',
                  'Priority Support',
                  'Custom Reports',
                  'API Access',
                ],
                cta: 'Start Trial',
                featured: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: 'pricing',
                description: 'For large pharmacy networks',
                features: [
                  'Everything in Pro',
                  'Dedicated Support',
                  'Custom Integration',
                  'SLA Guarantee',
                  'On-Premise Option',
                ],
                cta: 'Contact Sales',
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl border transition ${
                  plan.featured
                    ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-white shadow-xl ring-1 ring-emerald-200'
                    : 'border-gray-100 bg-white hover:shadow-lg'
                }`}
              >
                {plan.featured && (
                  <div className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-center text-sm font-bold rounded-t-xl">
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-sm text-slate-600 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-slate-600 text-sm ml-2">{plan.period}</span>
                  </div>

                  <button
                    className={`w-full py-3 rounded-lg font-semibold transition mb-8 ${
                      plan.featured
                        ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-700 hover:to-emerald-700'
                        : 'border-2 border-slate-300 text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {plan.cta}
                  </button>

                  <div className="space-y-4">
                    {plan.features.map((feature, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-slate-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-white px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Ready to Transform Your Pharmacy?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Join pharmacy managers across Ethiopia who are already saving money and running better operations with PharmaET.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold rounded-lg hover:from-teal-700 hover:to-emerald-700 transition shadow-lg hover:shadow-xl text-center"
            >
              Start Free Trial
            </a>
            <a
              href="#contact"
              className="px-8 py-4 border-2 border-slate-300 text-slate-900 font-bold rounded-lg hover:border-slate-400 hover:bg-slate-50 transition text-center"
            >
              Schedule Demo
            </a>
          </div>

          <p className="text-slate-600 text-sm mt-8">
            No credit card required. 14-day free trial. Full access to all features.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-white px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-slate-600">
              Have questions? Our team is ready to help you succeed with PharmaET.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Left - Contact Info */}
            <div className="space-y-10">
              {[
                {
                  icon: (
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 8L10.89 13.26C11.5475 13.7154 12.4525 13.7154 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                  title: 'Email',
                  value: 'support@pharmaet.com',
                  link: 'mailto:support@pharmaet.com',
                },
                {
                  icon: (
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 16.5V19C17 19.5304 16.7893 20.0391 16.4142 20.4142C16.0391 20.7893 15.5304 21 15 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V8C2 7.46957 2.21071 6.96086 2.58579 6.58579C2.96086 6.21071 3.46957 6 4 6H7M15 4H21V10M21 4L14 11" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                  title: 'Phone',
                  value: '+251 (0)1 23 45 67 89',
                  link: 'tel:+251123456789',
                },
                {
                  icon: (
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.58172 6.58172 2 12 2C17.4183 2 21 5.58172 21 10Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="10" r="3" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                  title: 'Location',
                  value: 'Addis Ababa, Ethiopia',
                  link: null,
                },
              ].map((contact, i) => (
                <div key={i} className="flex gap-4">
                  <div className="inline-flex p-3 bg-emerald-50 rounded-lg flex-shrink-0 h-fit">
                    {contact.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{contact.title}</h3>
                    {contact.link ? (
                      <a href={contact.link} className="text-emerald-600 hover:text-emerald-700 font-semibold transition">
                        {contact.value}
                      </a>
                    ) : (
                      <p className="text-slate-600">{contact.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Right - Contact Form */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-gray-200 hover:bg-gradient-to-br hover:from-teal-50 hover:to-emerald-50 hover:border-emerald-300 transition duration-300">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Name</label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-0 focus:border-emerald-600 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-0 focus:border-emerald-600 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Subject</label>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-0 focus:border-emerald-600 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Message</label>
                  <textarea
                    placeholder="Tell us about your inquiry..."
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-0 focus:border-emerald-600 outline-none transition resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-emerald-700 transition shadow-lg hover:shadow-xl"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={newLogo} alt="PharmaET Logo" className="w-8 h-8" />
                <span className="font-bold text-lg tracking-tight">
                  <span style={{ color: '#0F172A' }}>Pharma</span>
                  <span style={{ color: '#0F766E' }}>ET</span>
                </span>
              </div>
              <p className="text-sm text-slate-600">
                Modern pharmacy management for Ethiopian pharmacies.
              </p>
            </div>

            {/* Links */}
            {[
              {
                title: 'Product',
                links: ['Features', 'How it Works', 'Pricing', 'Security'],
              },
              {
                title: 'Company',
                links: ['About', 'Blog', 'Careers', 'Contact'],
              },
              {
                title: 'Legal',
                links: ['Privacy', 'Terms', 'License', 'Security'],
              },
              {
                title: 'Support',
                links: ['Documentation', 'API Docs', 'Help Center', 'Status'],
              },
            ].map((section, i) => (
              <div key={i}>
                <h4 className="text-slate-900 font-semibold mb-4 text-sm">{section.title}</h4>
                <div className="space-y-3">
                  {section.links.map((link, j) => (
                    <a key={j} href="#" className="text-sm text-slate-600 hover:text-slate-900 transition block">
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-slate-600">
              © 2026 PharmaET. All rights reserved.
            </p>
            <div className="flex gap-4">
              {[
                {
                  name: 'Twitter',
                  icon: (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 9-7 9-7z"/>
                    </svg>
                  ),
                },
                {
                  name: 'LinkedIn',
                  icon: (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                  ),
                },
                {
                  name: 'Facebook',
                  icon: (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a2 2 0 012-2h3z"/>
                    </svg>
                  ),
                },
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className="p-2.5 rounded-lg bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition duration-200"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
