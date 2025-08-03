"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function Dashboard() {
  const [stats, setStats] = useState({
    stories: 0,
    characters: 0,
    chapters: 0,
    notes: 0,
  })
  const [recentStories, setRecentStories] = useState([])

  useEffect(() => {
    // Fetch dashboard data
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard")
      const data = await response.json()
      setStats(data.stats)
      setRecentStories(data.recentStories)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    }
  }

  return (
    <div className="dashboard">
      <div className="container">
        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "10px" }}>📚</div>
            <h3>{stats.stories}</h3>
            <p>Stories</p>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "10px" }}>🎭</div>
            <h3>{stats.characters}</h3>
            <p>Characters</p>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "10px" }}>📖</div>
            <h3>{stats.chapters}</h3>
            <p>Chapters</p>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "10px" }}>📝</div>
            <h3>{stats.notes}</h3>
            <p>Notes</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 style={{ marginBottom: "20px" }}>Quick Actions</h2>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <Link href="/dashboard/stories/new" className="btn btn-primary">
              📚 New Story
            </Link>
            <Link href="/dashboard/characters/new" className="btn btn-secondary">
              🎭 New Character
            </Link>
            <Link href="/dashboard/plot" className="btn btn-secondary">
              🎬 Plot Organizer
            </Link>
            <Link href="/dashboard/notes" className="btn btn-secondary">
              📝 Quick Note
            </Link>
          </div>
        </div>

        {/* Recent Stories */}
        <div className="card">
          <h2 style={{ marginBottom: "20px" }}>Recent Stories</h2>
          {recentStories.length > 0 ? (
            <div style={{ display: "grid", gap: "15px" }}>
              {recentStories.map((story) => (
                <div key={story._id} style={{ padding: "15px", border: "1px solid #e1e5e9", borderRadius: "8px" }}>
                  <h3>{story.title}</h3>
                  <p style={{ color: "#666", marginBottom: "10px" }}>{story.genre}</p>
                  <p style={{ fontSize: "14px", color: "#888" }}>
                    Last updated: {new Date(story.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#666" }}>
              No stories yet. <Link href="/dashboard/stories/new">Create your first story!</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
