"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewStory() {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    genre: "",
    targetAudience: "",
    status: "planning",
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const genres = [
    "Fantasy",
    "Science Fiction",
    "Mystery",
    "Romance",
    "Thriller",
    "Horror",
    "Adventure",
    "Drama",
    "Comedy",
    "Historical Fiction",
    "Young Adult",
    "Literary Fiction",
    "Other",
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/dashboard/stories")
      } else {
        alert("Failed to create story")
      }
    } catch (error) {
      alert("Failed to create story")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: "30px" }}>Create New Story</h1>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Story Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter your story title"
              required
            />
          </div>

          <div className="form-group">
            <label>Genre *</label>
            <select
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              required
            >
              <option value="">Select a genre</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Summary</label>
            <textarea
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Brief summary of your story"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Target Audience</label>
            <select
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
            >
              <option value="">Select target audience</option>
              <option value="children">Children (8-12)</option>
              <option value="young-adult">Young Adult (13-17)</option>
              <option value="adult">Adult (18+)</option>
              <option value="all-ages">All Ages</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
              <option value="planning">Planning</option>
              <option value="writing">Writing</option>
              <option value="editing">Editing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create Story"}
            </button>
            <button type="button" onClick={() => router.back()} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
