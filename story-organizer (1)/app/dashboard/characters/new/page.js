"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewCharacter() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    role: "",
    description: "",
    background: "",
    motivation: "",
    avatar: "",
    appearance: "",
    personality: "",
    relationships: "",
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const roles = [
    "Protagonist",
    "Antagonist",
    "Supporting Character",
    "Mentor",
    "Love Interest",
    "Comic Relief",
    "Sidekick",
    "Villain",
    "Anti-Hero",
    "Other",
  ]

  const avatars = ["👤", "👨", "👩", "🧙‍♂️", "🧙‍♀️", "⚔️", "🏹", "🛡️", "👑", "🎭", "🦸‍♂️", "🦸‍♀️", "🧝‍♂️", "🧝‍♀️"]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/dashboard/characters")
      } else {
        alert("Failed to create character")
      }
    } catch (error) {
      alert("Failed to create character")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: "30px" }}>Create New Character</h1>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div className="form-group">
              <label>Character Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter character name"
                required
              />
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="text"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="Character's age"
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div className="form-group">
              <label>Role *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              >
                <option value="">Select character role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Avatar</label>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "8px" }}>
                {avatars.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar })}
                    style={{
                      padding: "8px",
                      border: formData.avatar === avatar ? "2px solid #667eea" : "2px solid #e1e5e9",
                      borderRadius: "8px",
                      background: formData.avatar === avatar ? "#f0f4ff" : "white",
                      cursor: "pointer",
                      fontSize: "20px",
                    }}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the character"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Background</label>
            <textarea
              value={formData.background}
              onChange={(e) => setFormData({ ...formData, background: e.target.value })}
              placeholder="Character's backstory and history"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Motivation</label>
            <textarea
              value={formData.motivation}
              onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
              placeholder="What drives this character? Goals and desires"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Appearance</label>
            <textarea
              value={formData.appearance}
              onChange={(e) => setFormData({ ...formData, appearance: e.target.value })}
              placeholder="Physical description of the character"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Personality</label>
            <textarea
              value={formData.personality}
              onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
              placeholder="Character traits, quirks, and personality"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Relationships</label>
            <textarea
              value={formData.relationships}
              onChange={(e) => setFormData({ ...formData, relationships: e.target.value })}
              placeholder="Relationships with other characters"
              rows="3"
            />
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create Character"}
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
