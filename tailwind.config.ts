import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Neue Farbpalette basierend auf dem Screenshot
        white: "#FFFFFF",
        black: "#000000",
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        purple: "#4F46E5",
        blue: "#3B82F6",
        green: {
          DEFAULT: "#0070f3",
          50: "#f0f7ff",
          100: "#e0f0fe",
          200: "#bae0fd",
          300: "#7cc5fb",
          400: "#36a4f8",
          500: "#0c87e8",
          600: "#0070f3",
          700: "#0058c7",
          800: "#0149a0",
          900: "#013d83",
        },
        yellow: {
          DEFAULT: "#F59E0B",
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        orange: "#F97316",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "heading-1": ["3.5rem", { lineHeight: "1.2", fontWeight: "700" }],
        "heading-2": ["2.5rem", { lineHeight: "1.2", fontWeight: "700" }],
        "heading-3": ["2rem", { lineHeight: "1.3", fontWeight: "700" }],
        "heading-4": ["1.5rem", { lineHeight: "1.4", fontWeight: "700" }],
        "heading-5": ["1.25rem", { lineHeight: "1.5", fontWeight: "700" }],
        "heading-6": ["1rem", { lineHeight: "1.5", fontWeight: "700" }],
        "body-large": ["1.125rem", { lineHeight: "1.6" }],
        "body-normal": ["1rem", { lineHeight: "1.6" }],
        "body-small": ["0.875rem", { lineHeight: "1.5" }],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
