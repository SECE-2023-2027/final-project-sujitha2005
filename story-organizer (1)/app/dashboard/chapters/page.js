"use client"
import { useState, useEffect } from "react"

export default function Chapters() {
  const [chapters, setChapters] = useState([])
  const [stories, setStories] = useState([])
  const [selectedStory, setSelectedStory] = useState("")
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingChapter, setEditingChapter] = useState(null)
  const [draggedItem, setDraggedItem] = useState(null)

  useEffect(() => {
    fetchStories()
    fetchChapters()
  }, [])

  const fetchStories = async () => {
    try {
      const response = await fetch("/api/stories")
      const data = await response.json()
      setStories(data)
      if (data.length > 0 && !selectedStory) {
        setSelectedStory(data[0]._id)
      }
    } catch (error) {
      console.error("Failed to fetch stories:", error)
    }
  }

  const fetchChapters = async () => {
    try {
      const response = await fetch("/api/chapters")
      const data = await response.json()
      setChapters(data.sort((a, b) => a.order - b.order))
    } catch (error) {
      console.error("Failed to fetch chapters:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveChapter = async (chapterData) => {
    try {
      const url = editingChapter ? `/api/chapters/${editingChapter._id}` : "/api/chapters"
      const method = editingChapter ? "PUT" : "POST"

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...chapterData, storyId: selectedStory }),
      })

      fetchChapters()
      setShowModal(false)
      setEditingChapter(null)
    } catch (error) {
      console.error("Failed to save chapter:", error)
    }
  }

  const deleteChapter = async (id) => {
    if (confirm("Are you sure you want to delete this chapter?")) {
      try {
        await fetch(`/api/chapters/${id}`, { method: "DELETE" })
        fetchChapters()
      } catch (error) {
        console.error("Failed to delete chapter:", error)
      }
    }
  }

  const handleDragStart = (e, chapter) => {
    setDraggedItem(chapter)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (e, targetChapter) => {
    e.preventDefault()

    if (!draggedItem || draggedItem._id === targetChapter._id) return

    const newChapters = [...chapters]
    const draggedIndex = newChapters.findIndex((c) => c._id === draggedItem._id)
    const targetIndex = newChapters.findIndex((c) => c._id === targetChapter._id)

    newChapters.splice(draggedIndex, 1)
    newChapters.splice(targetIndex, 0, draggedItem)

    const updatedChapters = newChapters.map((chapter, index) => ({
      ...chapter,
      order: index,
    }))

    setChapters(updatedChapters)

    try {
      await fetch("/api/chapters/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapters: updatedChapters }),
      })
    } catch (error) {
      console.error("Failed to reorder chapters:", error)
    }

    setDraggedItem(null)
  }

  const ChapterModal = ({ chapter, onSave, onClose }) => {
    const [formData, setFormData] = useState({
      title: chapter?.title || "",
      summary: chapter?.summary || "",
      content: chapter?.content || "",
      wordCount: chapter?.wordCount || 0,
      status: chapter?.status || "planning",
      notes: chapter?.notes || "",
      order: chapter?.order || chapters.length,
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      onSave(formData)
    }

    return (
      <div className="modal">
        <div className="modal-content">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2>{chapter ? "Edit Chapter" : "New Chapter"}</h2>
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Chapter Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Summary</label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                rows="3"
                placeholder="Brief summary of what happens in this chapter"
              />
            </div>

            <div className="form-group">
              <label>Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows="8"
                placeholder="Write your chapter content here..."
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="form-group">
                <label>Word Count</label>
                <input
                  type="number"
                  value={formData.wordCount}
                  onChange={(e) => setFormData({ ...formData, wordCount: Number.parseInt(e.target.value) || 0 })}
                />
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
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
                placeholder="Chapter notes, ideas, or reminders"
              />
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <button type="submit" className="btn btn-primary">
                {chapter ? "Update Chapter" : "Create Chapter"}
              </button>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const filteredChapters = selectedStory ? chapters.filter((chapter) => chapter.storyId === selectedStory) : chapters

  if (loading) return <div>Loading...</div>

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>Chapters</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          📖 New Chapter
        </button>
      </div>

      {/* Story Selector */}
      {stories.length > 0 && (
        <div className="card" style={{ marginBottom: "20px" }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Select Story</label>
            <select value={selectedStory} onChange={(e) => setSelectedStory(e.target.value)}>
              <option value="">All Stories</option>
              {stories.map((story) => (
                <option key={story._id} value={story._id}>
                  {story.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {filteredChapters.length > 0 ? (
        <div style={{ display: "grid", gap: "15px" }}>
          {filteredChapters.map((chapter, index) => (
            <div
              key={chapter._id}
              className="drag-item"
              draggable
              onDragStart={(e) => handleDragStart(e, chapter)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, chapter)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                    <span
                      style={{
                        background: "#667eea",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        marginRight: "10px",
                      }}
                    >
                      Chapter {index + 1}
                    </span>
                    <h3 style={{ margin: 0 }}>{chapter.title}</h3>
                    <span
                      style={{
                        marginLeft: "10px",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        background:
                          chapter.status === "completed"
                            ? "#d4edda"
                            : chapter.status === "writing"
                              ? "#fff3cd"
                              : "#f8d7da",
                        color:
                          chapter.status === "completed"
                            ? "#155724"
                            : chapter.status === "writing"
                              ? "#856404"
                              : "#721c24",
                      }}
                    >
                      {chapter.status}
                    </span>
                  </div>

                  {chapter.summary && <p style={{ marginBottom: "10px", color: "#666" }}>{chapter.summary}</p>}

                  <div style={{ display: "flex", gap: "20px", fontSize: "14px", color: "#888" }}>
                    <span>📝 {chapter.wordCount || 0} words</span>
                    <span>📅 {new Date(chapter.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => {
                      setEditingChapter(chapter)
                      setShowModal(true)
                    }}
                    className="btn btn-secondary"
                    style={{ fontSize: "12px", padding: "6px 12px" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteChapter(chapter._id)}
                    className="btn"
                    style={{ background: "#e74c3c", color: "white", fontSize: "12px", padding: "6px 12px" }}
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
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>📖</div>
          <h2>No Chapters Yet</h2>
          <p style={{ marginBottom: "30px", color: "#666" }}>
            {selectedStory
              ? "Start writing your story by creating the first chapter"
              : "Select a story to view chapters"}
          </p>
          {selectedStory && (
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
              Create Your First Chapter
            </button>
          )}
        </div>
      )}

      {showModal && (
        <ChapterModal
          chapter={editingChapter}
          onSave={saveChapter}
          onClose={() => {
            setShowModal(false)
            setEditingChapter(null)
          }}
        />
      )}
    </div>
  )
}
