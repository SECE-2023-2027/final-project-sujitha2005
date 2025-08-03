"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "🏠" },
    { href: "/dashboard/stories", label: "Stories", icon: "📚" },
    { href: "/dashboard/characters", label: "Characters", icon: "🎭" },
    { href: "/dashboard/plot", label: "Plot Organizer", icon: "🎬" },
    { href: "/dashboard/chapters", label: "Chapters", icon: "📖" },
    { href: "/dashboard/notes", label: "Notes", icon: "📝" },
    { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
  ]

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="logo">📚 StoryForge</div>
        <ul className="sidebar-nav">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={pathname === item.href ? "active" : ""}>
                <span style={{ marginRight: "10px" }}>{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
          <li style={{ marginTop: "40px" }}>
            <Link href="/api/auth/signout" style={{ color: "#e74c3c" }}>
              <span style={{ marginRight: "10px" }}>🚪</span>
              Sign Out
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="dashboard-header">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-secondary"
            style={{ display: "none" }}
          >
            ☰
          </button>
          <h1>Welcome to StoryForge</h1>
          <div>
            <span>👤 John Writer</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
