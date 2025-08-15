const categories = [
  {
    name: 'EV Lead Acid Charger (Low Cost)',
    slug: 'ev-lead-acid-charger-low-cost',
    description: 'Affordable lead acid chargers for electric vehicles'
  },
  {
    name: 'EV Lead Acid Charger (Leaf)',
    slug: 'ev-lead-acid-charger-leaf',
    description: 'Leaf series lead acid chargers for electric vehicles'
  },
  {
    name: 'EV Lead Acid Charger (Percent)',
    slug: 'ev-lead-acid-charger-percent',
    description: 'Percent series lead acid chargers with advanced features'
  },
  {
    name: 'EV Lead Acid Charger (Pulse)',
    slug: 'ev-lead-acid-charger-pulse',
    description: 'Pulse series lead acid chargers with QT7 technology'
  },
  {
    name: 'EV Lead Acid Charger (Full Display)',
    slug: 'ev-lead-acid-charger-full-display',
    description: 'ELOW9 series lead acid chargers with LCD display'
  },
  {
    name: 'EV Lithium Charger (ECycle)',
    slug: 'ev-lithium-charger-ecycle',
    description: 'ECycle series lithium chargers for electric vehicles'
  },
  {
    name: 'EV Lithium Charger (Plastic)',
    slug: 'ev-lithium-charger-plastic',
    description: 'Plastic housing lithium chargers for electric vehicles'
  },
  {
    name: 'EV Lithium Charger (Alum)',
    slug: 'ev-lithium-charger-alum',
    description: 'Aluminum housing lithium chargers for electric vehicles'
  },
  {
    name: 'EV Lithium Charger (ERikshaw)',
    slug: 'ev-lithium-charger-erikshaw',
    description: 'High-power lithium chargers for E-Rickshaws'
  },
  {
    name: 'EV Charger (Solar Battery)',
    slug: 'ev-charger-solar-battery',
    description: 'Specialized chargers for solar battery systems'
  }
];

const products = [
  {
    name: "COMMON MAT (+GST 18%)",
    code: "(1d83)",
    price: 69.90,
    unit: "PCS",
    image: "",
    category: "seat-covers",
    minimumQuantity: 5,
    inStock: true,
    gstRate: 18,
    description: "",
    stockQuantity: 100
  },
  {
    name: "RAXENE UNIVERSAL (+GST 12%)",
    code: "(034f)",
    price: 79.80,
    unit: "PCS",
    image: "",
    category: "seat-covers",
    minimumQuantity: 5,
    inStock: true,
    gstRate: 12,
    description: "",
    stockQuantity: 100
  },
  {
    name: "RAXENE BIG SIZE (+GST 12%)",
    code: "(247d)",
    price: 89.90,
    unit: "PCS",
    image: "",
    category: "seat-covers",
    minimumQuantity: 5,
    inStock: true,
    gstRate: 12,
    description: "",
    stockQuantity: 100
  },
  {
    name: "RAIN COVER (+GST 12%)",
    code: "(1d3b)",
    price: 129.80,
    unit: "PCS",
    image: "",
    category: "seat-covers",
    minimumQuantity: 1,
    inStock: true,
    gstRate: 12,
    description: "",
    stockQuantity: 100
  },
  {
    name: "SWITCH WIRE (+GST 18%)",
    code: "(1b50)",
    price: 19.80,
    unit: "PCS",
    image: "",
    category: "switches",
    minimumQuantity: 10,
    inStock: true,
    gstRate: 18,
    description: "",
    stockQuantity: 100
  },
  // ... (all other products from lib/products_fixed.ts, converted in the same way)
];

module.exports = {
  categories,
  products
}; 