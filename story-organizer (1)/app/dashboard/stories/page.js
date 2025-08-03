"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function Stories() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const response = await fetch("/api/stories")
      const data = await response.json()
      setStories(data)
    } catch (error) {
      console.error("Failed to fetch stories:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteStory = async (id) => {
    if (confirm("Are you sure you want to delete this story?")) {
      try {
        await fetch(`/api/stories/${id}`, { method: "DELETE" })
        fetchStories()
      } catch (error) {
        console.error("Failed to delete story:", error)
      }
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>My Stories</h1>
        <Link href="/dashboard/stories/new" className="btn btn-primary">
          📚 New Story
        </Link>
      </div>

      {stories.length > 0 ? (
        <div style={{ display: "grid", gap: "20px" }}>
          {stories.map((story) => (
            <div key={story._id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: "10px" }}>{story.title}</h3>
                  <p style={{ color: "#666", marginBottom: "10px" }}>{story.genre}</p>
                  <p style={{ marginBottom: "15px" }}>{story.summary}</p>
                  <div style={{ display: "flex", gap: "10px", fontSize: "14px", color: "#888" }}>
                    <span>📖 {story.chapters?.length || 0} chapters</span>
                    <span>🎭 {story.characters?.length || 0} characters</span>
                    <span>📅 {new Date(story.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <Link href={`/dashboard/stories/${story._id}/edit`} className="btn btn-secondary">
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteStory(story._id)}
                    className="btn"
                    style={{ background: "#e74c3c", color: "white" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: "center", padding: "60px" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>📚</div>
          <h2>No Stories Yet</h2>
          <p style={{ marginBottom: "30px", color: "#666" }}>Start your writing journey by creating your first story</p>
          <Link href="/dashboard/stories/new" className="btn btn-primary">
            Create Your First Story
          </Link>
        </div>
      )}
    </div>
  )
}
