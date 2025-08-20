"use client"

import Link from "next/link"
import { ChevronUp, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import { getCategories } from "@/lib/data"
import type { Category } from "@/lib/types"

const referenceCategories = [
  {
    group: "Chargers",
    items: [
      "EV Lead Acid Charger (Low Cost)",
      "EV Lead Acid Charger (Leaf)",
      "EV Lead Acid Charger (Percent)",
      "EV Lead Acid Charger (Pulse)",
      "EV Lead Acid Charger (Full Display)",
      "EV Lithium Charger (ECycle)",
      "EV Lithium Charger (Plastic)",
      "EV Lithium Charger (Alum)",
      "EV Lithium Charger (ERikshaw)",
      "EV Charger (PCB)",
      "EV Charger (Solar Battery)",
      "EV Charger (Indian)"
    ]
  },
  {
    group: "Parts & Accessories",
    items: [
      "BODY PARTS", "MOTOR & ACCESSORIES", "CONTROLLER", "EV CONVERSION KIT", "CONVERTOR & TRANSVERTOR", "MIRRORS", "HELMET", "BALL RACER & BEARING", "BULBS & LIGHTS", "SPEEDOMETER", "GLASS", "LINERS & BRAKE CABLES", "DISC PAD & LEVERS", "DISC ASSY"
    ]
  },
  {
    group: "Connectors & Cables",
    items: [
      "POWER CONNECTOR (SB 50)", "POWER CONNECTOR (IEC & XTs)", "POWER CONNECTOR (CHOKARI)", "XLRs & CHARGING CABLES", "ESS CONNECTOR", "SILICON CABLES"
    ]
  },
  {
    group: "Throttles & Switches",
    items: [
      "THROTTLES COMMON", "THROTTLES PREMIUM", "THROTTLES SWITCH", "SWITCHES"
    ]
  },
  {
    group: "Other Parts",
    items: [
      "ECYCLE PARTS", "ERIKSHAW PARTS", "FLASHER MCB & COUPLER", "FOOTRESTS & IRON PARTS", "STEEL GUARD", "FRONT SHOCKER & RODS", "HANDLE TEE", "SUSPENSION REAR", "LOCK & REMOTE KITs", "NUT BOLTS", "OIL SEALS", "SEAT COVERS", "SMALL ITEMS", "TAPES & PAINTS", "GREASE", "TYRES"
    ]
  },
  {
    group: "Battery & BMS",
    items: [
      "EV CELL", "BATTERY METAL BOX", "BMS LFP DALY", "BMS DALY NMC", "BMS DALY SMART", "BMS LFP JBD", "BMS NMC JBD", "BMS JBD SMART", "BMS OTHER", "BATTERY ACCESSORIES"
    ]
  },
  {
    group: "Machines & Components",
    items: [
      "DK MACHINES", "SUNKKO MACHINES", "TESTING MACHINE", "MOSFETS & ICS", "BALANCER MACHINES", "EPOXY RESIN BOARD", "HST (HEAT SHRINK TUBE)", "INSULATION PAPER", "NICKEL PLATED", "PVC"
    ]
  }
]

export default function Sidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories()
        setCategories(fetchedCategories)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Helper to get the slug for a category name from the categories array
  function getCategorySlug(name: string) {
    const match = categories.find((c) => c.name.toLowerCase() === name.toLowerCase())
    if (match) return match.slug
    // fallback: old logic
    return encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))
  }

  if (loading) {
    return (
      <aside className="w-full md:w-64 bg-white">
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-3 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    )
  }

  return (
    <>
      {/* Mobile menu toggle */}
      <div className="md:hidden p-4 border-b">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="flex items-center justify-between w-full">
          <span className="font-medium">Categories</span>
          {mobileMenuOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Sidebar content */}
      <aside className={`w-full md:w-64 bg-white ${mobileMenuOpen ? "block" : "hidden"} md:block md:sticky md:top-0 md:h-screen md:overflow-y-auto`}>
        <nav className="p-4">
          <ul className="space-y-4">
            {referenceCategories.map((group) => (
              <li key={group.group}>
                <div className="font-semibold text-gray-700 mb-1">{group.group}</div>
                <ul className="space-y-1 ml-2">
                  {group.items.map((item) => (
                    <li key={item}>
                      <Link
                        href={`/category/${getCategorySlug(item)}`}
                        className="block py-1 px-2 rounded-md hover:bg-gray-100 text-sm"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          
          {/* Dynamic categories section */}
          {categories.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <div className="font-semibold text-gray-700 mb-2">All Categories</div>
              <ul className="space-y-1">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/category/${category.slug}`}
                      className="block py-1 px-2 rounded-md hover:bg-gray-100 text-sm"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      </aside>
    </>
  )
}
