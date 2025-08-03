"use client"
import { useState, useEffect } from "react"

export default function PlotOrganizer() {
  const [scenes, setScenes] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingScene, setEditingScene] = useState(null)
  const [draggedItem, setDraggedItem] = useState(null)

  useEffect(() => {
    fetchScenes()
  }, [])

  const fetchScenes = async () => {
    try {
      const response = await fetch("/api/scenes")
      const data = await response.json()
      setScenes(data.sort((a, b) => a.order - b.order))
    } catch (error) {
      console.error("Failed to fetch scenes:", error)
    }
  }

  const saveScene = async (sceneData) => {
    try {
      const url = editingScene ? `/api/scenes/${editingScene._id}` : "/api/scenes"
      const method = editingScene ? "PUT" : "POST"

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sceneData),
      })

      fetchScenes()
      setShowModal(false)
      setEditingScene(null)
    } catch (error) {
      console.error("Failed to save scene:", error)
    }
  }

  const deleteScene = async (id) => {
    if (confirm("Are you sure you want to delete this scene?")) {
      try {
        await fetch(`/api/scenes/${id}`, { method: "DELETE" })
        fetchScenes()
      } catch (error) {
        console.error("Failed to delete scene:", error)
      }
    }
  }

  const handleDragStart = (e, scene) => {
    setDraggedItem(scene)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (e, targetScene) => {
    e.preventDefault()

    if (!draggedItem || draggedItem._id === targetScene._id) return

    const newScenes = [...scenes]
    const draggedIndex = newScenes.findIndex((s) => s._id === draggedItem._id)
    const targetIndex = newScenes.findIndex((s) => s._id === targetScene._id)

    newScenes.splice(draggedIndex, 1)
    newScenes.splice(targetIndex, 0, draggedItem)

    // Update order
    const updatedScenes = newScenes.map((scene, index) => ({
      ...scene,
      order: index,
    }))

    setScenes(updatedScenes)

    // Save new order to backend
    try {
      await fetch("/api/scenes/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenes: updatedScenes }),
      })
    } catch (error) {
      console.error("Failed to reorder scenes:", error)
    }

    setDraggedItem(null)
  }

  const SceneModal = ({ scene, onSave, onClose }) => {
    const [formData, setFormData] = useState({
      title: scene?.title || "",
      description: scene?.description || "",
      location: scene?.location || "",
      characters: scene?.characters || "",
      notes: scene?.notes || "",
      order: scene?.order || scenes.length,
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      onSave(formData)
    }

    return (
      <div className="modal">
        <div className="modal-content">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2>{scene ? "Edit Scene" : "New Scene"}</h2>
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Scene Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="4"
                placeholder="What happens in this scene?"
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Where does this scene take place?"
              />
            </div>

            <div className="form-group">
              <label>Characters</label>
              <input
                type="text"
                value={formData.characters}
                onChange={(e) => setFormData({ ...formData, characters: e.target.value })}
                placeholder="Characters involved (comma separated)"
              />
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
                placeholder="Additional notes or ideas"
              />
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <button type="submit" className="btn btn-primary">
                {scene ? "Update Scene" : "Create Scene"}
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

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>Plot Organizer</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          🎬 New Scene
        </button>
      </div>

      <div className="card" style={{ marginBottom: "20px", padding: "15px", background: "#f8f9fa" }}>
        <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
          💡 <strong>Tip:</strong> Drag and drop scenes to reorder them in your story
        </p>
      </div>

      {scenes.length > 0 ? (
        <div style={{ display: "grid", gap: "15px" }}>
          {scenes.map((scene, index) => (
            <div
              key={scene._id}
              className="drag-item"
              draggable
              onDragStart={(e) => handleDragStart(e, scene)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, scene)}
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
                      Scene {index + 1}
                    </span>
                    <h3 style={{ margin: 0 }}>{scene.title}</h3>
                  </div>

                  {scene.description && <p style={{ marginBottom: "10px", color: "#666" }}>{scene.description}</p>}

                  <div style={{ display: "flex", gap: "20px", fontSize: "14px", color: "#888" }}>
                    {scene.location && <span>📍 {scene.location}</span>}
                    {scene.characters && <span>🎭 {scene.characters}</span>}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => {
                      setEditingScene(scene)
                      setShowModal(true)
                    }}
                    className="btn btn-secondary"
                    style={{ fontSize: "12px", padding: "6px 12px" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteScene(scene._id)}
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
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>🎬</div>
          <h2>No Scenes Yet</h2>
          <p style={{ marginBottom: "30px", color: "#666" }}>Start organizing your plot by creating your first scene</p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            Create Your First Scene
          </button>
        </div>
      )}

      {showModal && (
        <SceneModal
          scene={editingScene}
          onSave={saveScene}
          onClose={() => {
            setShowModal(false)
            setEditingScene(null)
          }}
        />
      )}
    </div>
  )
}
