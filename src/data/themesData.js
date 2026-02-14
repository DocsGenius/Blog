const themesData = [
  {
    "name": "light",
    "displayName": "Light",
    "colors": {
      "primary": "#111111",
      "secondary": "#555555",
      "accent": "#29bbffff",
      "surface": "#ffffff",
      "background": "#fafafa",
      "text": "#222222",
      "border": "#e5e5e5",
      "highlight": "#e3f2fd"
    }
  },
  {
    "name": "dark",
    "displayName": "Dark",
    "colors": {
      "primary": "#e0e0e0",
      "secondary": "#9e9e9e",
      "accent": "#e229ffff",
      "surface": "#1e1e1e",
      "background": "#121212",
      "text": "#f5f5f5",
      "border": "#2c2c2c",
      "highlight": "#ffb74d"
    }
  },
  {
    "name": "midnight",
    "displayName": "Midnight",
    "colors": {
      "primary": "#0b0f2a",
      "secondary": "#1c2541",
      "accent": "#e229ffff",
      "surface": "#121629",
      "background": "#070b1a",
      "text": "#e6ecff",
      "border": "#1f2a44",
      "highlight": "#5dade2"
    }
  },
  {
    "name": "ocean",
    "displayName": "Ocean",
    "colors": {
      "primary": "#005f73",
      "secondary": "#0a9396",
      "accent": "#0b7bcba0",
      "surface": "#e0fbfc",
      "background": "#edf6f9",
      "text": "#003845",
      "border": "#bde0e6",
      "highlight": "#48cae4"
    }
  },
  {
    "name": "forest",
    "displayName": "Forest",
    "colors": {
      "primary": "#1b4332",
      "secondary": "#2d6a4f",
      "accent": "#7ae8acea",
      "surface": "#d8f3dc",
      "background": "#f1faee",
      "text": "#081c15",
      "border": "#b7e4c7",
      "highlight": "#74c69d"
    }
  },
  {
    "name": "sunset",
    "displayName": "Sunset",
    "colors": {
      "primary": "#d62828",
      "secondary": "#f77f00",
      "accent": "#ff6600ff",
      "surface": "#fff3e0",
      "background": "#ffe5d9",
      "text": "#6a040f",
      "border": "#ffba08",
      "highlight": "#ff7b00"
    }
  },
  {
    "name": "arctic",
    "displayName": "Arctic",
    "colors": {
      "primary": "#dff6ff",
      "secondary": "#b8e4f9",
      "accent": "#0099ffff",
      "surface": "#f4fbff",
      "background": "#eaf7ff",
      "text": "#0f3057",
      "border": "#cdefffac",
      "highlight": "#00e5ff"
    }
  },
  {
    "name": "volcano",
    "displayName": "Volcano",
    "colors": {
      "primary": "#ff4500",
      "secondary": "#ff6347",
      "accent": "#c82b00ff",
      "surface": "#fff5ee",
      "background": "#ffe4e1",
      "text": "#8b0000",
      "border": "#ff7f50",
      "highlight": "#ff8c00"
    }
  },
  {
    "name": "lime",
    "displayName": "Lime",
    "colors": {
      "primary": "#50c878",
      "secondary": "#3cb371",
      "accent": "#00c9abff",
      "surface": "#f0fff0",
      "background": "#f5fffa",
      "text": "#006400",
      "border": "#90ee90",
      "highlight": "#7fff00"
    }
  },
  {
    "name": "royal",
    "displayName": "Royal",
    "colors": {
      "primary": "#4b0082",
      "secondary": "#663399",
      "accent": "#9370db",
      "surface": "#faf5ff",
      "background": "#f8f4ff",
      "text": "#2e0854",
      "border": "#dda0dd",
      "highlight": "#ffd700"
    }
  },
  {
    "name": "matrix",
    "displayName": "Matrix",
    "colors": {
      "primary": "#00ff00",
      "secondary": "#32cd32",
      "accent": "#ffffffff",
      "surface": "#001100",
      "background": "#000000",
      "text": "#00ff00",
      "border": "#006400",
      "highlight": "#adff2f"
    }
  },
  {
    "name": "cyberpunk",
    "displayName": "Cyberpunk",
    "colors": {
      "primary": "#ff00ff",
      "secondary": "#00ffff",
      "accent": "#ff007f",
      "surface": "#14001f",
      "background": "#0a0014",
      "text": "#f0f0ff",
      "border": "#2b0a3d",
      "highlight": "#00ffea"
    }
  },
  {
    "name": "lavender",
    "displayName": "Lavender",
    "colors": {
      "primary": "#7b2cbf",
      "secondary": "#9d4edd",
      "accent": "#c77dff",
      "surface": "#f3e8ff",
      "background": "#faf5ff",
      "text": "#3c096c",
      "border": "#e0aaff",
      "highlight": "#b5179e"
    }
  },
  {
    "name": "rose",
    "displayName": "Rose",
    "colors": {
      "primary": "#c9184a",
      "secondary": "#ff4d6d",
      "accent": "#ff0000ff",
      "surface": "#fff0f3",
      "background": "#ffe5ec",
      "text": "#590d22",
      "border": "#ffb3c1",
      "highlight": "#ff8fa3"
    }
  },
  {
    "name": "sky",
    "displayName": "Sky",
    "colors": {
      "primary": "#0077b6",
      "secondary": "#00b4d8",
      "accent": "#90e0ef",
      "surface": "#f0faff",
      "background": "#e6f7ff",
      "text": "#023e8a",
      "border": "#ade8f4",
      "highlight": "#48cae4"
    }
  },
  {
    "name": "coffee",
    "displayName": "Coffee",
    "colors": {
      "primary": "#6f4e37",
      "secondary": "#a47148",
      "accent": "#c19a6b",
      "surface": "#f5ebe0",
      "background": "#ede0d4",
      "text": "#3e2723",
      "border": "#d7ccc8",
      "highlight": "#bc8f8f"
    }
  },
  {
    "name": "mint",
    "displayName": "Mint",
    "colors": {
      "primary": "#2ec4b6",
      "secondary": "#52d1c6",
      "accent": "#58e820ff",
      "surface": "#f0fdfa",
      "background": "#e6fffa",
      "text": "#065f46",
      "border": "#a7f3d0",
      "highlight": "#99f6e4"
    }
  },
  {
    "name": "gold",
    "displayName": "Gold",
    "colors": {
      "primary": "#b8860b",
      "secondary": "#daa520",
      "accent": "#c3af00ff",
      "surface": "#fffbea",
      "background": "#fff8dc",
      "text": "#7c5c00",
      "border": "#f1c40f",
      "highlight": "#ffec99"
    }
  },
  {
    "name": "peach",
    "displayName": "Peach",
    "colors": {
      "primary": "#ff7f50",
      "secondary": "#ffb5a7",
      "accent": "#fec89a",
      "surface": "#fff1e6",
      "background": "#ffe5d9",
      "text": "#9c6644",
      "border": "#ffd7ba",
      "highlight": "#ffdab9"
    }
  },
  {
    "name": "slate",
    "displayName": "Slate",
    "colors": {
      "primary": "#334155",
      "secondary": "#475569",
      "accent": "#94a3b8",
      "surface": "#f1f5f9",
      "background": "#e2e8f0",
      "text": "#0f172a",
      "border": "#cbd5e1",
      "highlight": "#64748b"
    }
  }
]

export default themesData
