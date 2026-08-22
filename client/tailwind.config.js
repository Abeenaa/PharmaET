/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pharma: {
          // Primary - Healthcare Green
          green: {
            50: '#F0FDF4',
            100: '#DCFCE7',
            200: '#BBFBDE',
            300: '#86EFAC',
            400: '#4ADE80',
            500: '#10B981', // Brand primary
            600: '#059669',
            700: '#047857',
            800: '#065F46',
            900: '#064E3B',
          },
          // Secondary - Professional Blue
          blue: {
            50: '#F0F9FF',
            100: '#E0F2FE',
            200: '#BAE6FD',
            300: '#7DD3FC',
            400: '#38BDF8',
            500: '#0EA5E9', // Secondary actions
            600: '#0284C7',
            700: '#0369A1',
            800: '#075985',
            900: '#0C3D66',
          },
          // Accent - Alert Red
          red: {
            50: '#FEF2F2',
            100: '#FEE2E2',
            400: '#F87171',
            500: '#EF4444', // Critical alerts
            600: '#DC2626',
            700: '#B91C1C',
          },
          // Accent - Warning Amber
          amber: {
            50: '#FFFBEB',
            100: '#FEF3C7',
            200: '#FDE68A',
            400: '#FBBF24',
            500: '#F59E0B', // Warnings/expiring
            600: '#D97706',
            700: '#B45309',
          },
          // Accent - Purple
          purple: {
            50: '#FAF5FF',
            100: '#F3E8FF',
            500: '#8B5CF6',
            600: '#7C3AED',
            700: '#6D28D9',
          },
          // Neutrals
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
          },
        }
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        fira: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        subtle: '0 1px 3px rgba(0,0,0,0.12)',
        elevation: '0 4px 6px rgba(0,0,0,0.15)',
        modal: '0 20px 25px rgba(0,0,0,0.2)',
      },
      animation: {
        'pulse-green': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;',
        'spin-slow': 'spin 3s linear infinite',
      },
      backdropFilter: {
        none: 'none',
        blur: 'blur(10px)',
      },
    },
  },
  plugins: [],
}
