"use client"
import { useState, useEffect } from "react"

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  const categories = [
    "General",
    "Character Ideas",
    "Plot Ideas",
    "World Building",
    "Research",
    "Dialogue",
    "Scenes",
    "Other",
  ]

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes")
      const data = await response.json()
      setNotes(data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)))
    } catch (error) {
      console.error("Failed to fetch notes:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveNote = async (noteData) => {
    try {
      const url = editingNote ? `/api/notes/${editingNote._id}` : "/api/notes"
      const method = editingNote ? "PUT" : "POST"

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData),
      })

      fetchNotes()
      setShowModal(false)
      setEditingNote(null)
    } catch (error) {
      console.error("Failed to save note:", error)
    }
  }

  const deleteNote = async (id) => {
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        await fetch(`/api/notes/${id}`, { method: "DELETE" })
        fetchNotes()
      } catch (error) {
        console.error("Failed to delete note:", error)
      }
    }
  }

  const NoteModal = ({ note, onSave, onClose }) => {
    const [formData, setFormData] = useState({
      title: note?.title || "",
      content: note?.content || "",
      category: note?.category || "General",
      tags: note?.tags || "",
      isImportant: note?.isImportant || false,
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      onSave(formData)
    }

    return (
      <div className="modal">
        <div className="modal-content">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2>{note ? "Edit Note" : "New Note"}</h2>
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Note Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter note title"
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Comma separated tags"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows="10"
                placeholder="Write your note content here..."
                required
              />
            </div>

            <div className="form-group">
              <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  checked={formData.isImportant}
                  onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
                />
                Mark as important
              </label>
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <button type="submit" className="btn btn-primary">
                {note ? "Update Note" : "Create Note"}
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

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || note.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) return <div>Loading...</div>

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>Notes & Ideas</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          📝 New Note
        </button>
      </div>

      {/* Search and Filter */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Search Notes</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or content..."
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Filter by Category</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredNotes.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
          {filteredNotes.map((note) => (
            <div key={note._id} className="card" style={{ position: "relative" }}>
              {note.isImportant && (
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "#ffd700",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                  }}
                >
                  ⭐
                </div>
              )}

              <div style={{ marginBottom: "15px" }}>
                <h3 style={{ marginBottom: "8px" }}>{note.title}</h3>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
                  <span
                    style={{
                      background: "#667eea",
                      color: "white",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  >
                    {note.category}
                  </span>
                  <span style={{ fontSize: "12px", color: "#888" }}>
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <p style={{ marginBottom: "15px", color: "#666", fontSize: "14px" }}>
                {note.content.length > 150 ? `${note.content.substring(0, 150)}...` : note.content}
              </p>

              {note.tags && (
                <div style={{ marginBottom: "15px" }}>
                  {note.tags.split(",").map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        background: "#f0f4ff",
                        color: "#667eea",
                        padding: "2px 6px",
                        borderRadius: "8px",
                        fontSize: "11px",
                        marginRight: "5px",
                      }}
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  onClick={() => {
                    setEditingNote(note)
                    setShowModal(true)
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: "12px", padding: "6px 12px" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteNote(note._id)}
                  className="btn"
                  style={{ background: "#e74c3c", color: "white", fontSize: "12px", padding: "6px 12px" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: "center", padding: "60px" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>📝</div>
          <h2>No Notes Yet</h2>
          <p style={{ marginBottom: "30px", color: "#666" }}>
            {searchTerm || selectedCategory
              ? "No notes match your search criteria"
              : "Start capturing your creative ideas and research"}
          </p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            Create Your First Note
          </button>
        </div>
      )}

      {showModal && (
        <NoteModal
          note={editingNote}
          onSave={saveNote}
          onClose={() => {
            setShowModal(false)
            setEditingNote(null)
          }}
        />
      )}
    </div>
  )
}
