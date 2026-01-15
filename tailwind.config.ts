import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Taşeroncum Brand Colors
        'primary-orange': '#F37021',
        'primary-orange-dark': '#D85F17',
        'dark-bg': '#2E2E2E',
        'soft-dark': '#2A2A2A',
        'light-gray-bg': '#F5F5F5',
        'success-green': '#22C55E',
        'warning-yellow': '#FACC15',
        'border-gray': '#E5E7EB',
        
        // Text colors for light backgrounds
        'text-primary': '#2E2E2E',
        'text-secondary': '#6B7280',
        'text-muted': '#9CA3AF',
        
        // Text colors for dark backgrounds
        'text-on-dark': '#F9FAFB',
        'text-on-dark-secondary': '#D1D5DB',
        'text-on-dark-muted': '#9CA3AF',
        
        border: "#E5E7EB",
        input: "#E5E7EB",
        ring: "#F37021",
        background: "#F5F5F5",
        foreground: "#2E2E2E",
        primary: {
          DEFAULT: "#F37021",
          foreground: "#FFFFFF",
          dark: "#D85F17",
        },
        secondary: {
          DEFAULT: "#6B7280",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F3F4F6",
          foreground: "#6B7280",
        },
        accent: {
          DEFAULT: "#F97316",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#111827",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#111827",
        },
        dark: "#1F1F1F",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
