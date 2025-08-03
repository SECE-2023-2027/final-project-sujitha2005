"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function Characters() {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState(null)

  useEffect(() => {
    fetchCharacters()
  }, [])

  const fetchCharacters = async () => {
    try {
      const response = await fetch("/api/characters")
      const data = await response.json()
      setCharacters(data)
    } catch (error) {
      console.error("Failed to fetch characters:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteCharacter = async (id) => {
    if (confirm("Are you sure you want to delete this character?")) {
      try {
        await fetch(`/api/characters/${id}`, { method: "DELETE" })
        fetchCharacters()
      } catch (error) {
        console.error("Failed to delete character:", error)
      }
    }
  }

  const CharacterModal = ({ character, onClose }) => (
    <div className="modal">
      <div className="modal-content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2>{character.name}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}>
            ×
          </button>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <strong>Age:</strong> {character.age}
        </div>
        <div style={{ marginBottom: "15px" }}>
          <strong>Role:</strong> {character.role}
        </div>
        <div style={{ marginBottom: "15px" }}>
          <strong>Description:</strong>
          <p>{character.description}</p>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <strong>Background:</strong>
          <p>{character.background}</p>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <strong>Motivation:</strong>
          <p>{character.motivation}</p>
        </div>
      </div>
    </div>
  )

  if (loading) return <div>Loading...</div>

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>Characters</h1>
        <Link href="/dashboard/characters/new" className="btn btn-primary">
          🎭 New Character
        </Link>
      </div>

      {characters.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {characters.map((character) => (
            <div key={character._id} className="card">
              <div style={{ textAlign: "center", marginBottom: "15px" }}>
                <div style={{ fontSize: "48px", marginBottom: "10px" }}>{character.avatar || "👤"}</div>
                <h3>{character.name}</h3>
                <p style={{ color: "#666" }}>{character.role}</p>
              </div>
              <p style={{ marginBottom: "15px", fontSize: "14px" }}>{character.description?.substring(0, 100)}...</p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <button
                  onClick={() => {
                    setSelectedCharacter(character)
                    setShowModal(true)
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: "12px", padding: "8px 16px" }}
                >
                  View
                </button>
                <Link
                  href={`/dashboard/characters/${character._id}/edit`}
                  className="btn btn-secondary"
                  style={{ fontSize: "12px", padding: "8px 16px" }}
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteCharacter(character._id)}
                  className="btn"
                  style={{ background: "#e74c3c", color: "white", fontSize: "12px", padding: "8px 16px" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: "center", padding: "60px" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>🎭</div>
          <h2>No Characters Yet</h2>
          <p style={{ marginBottom: "30px", color: "#666" }}>Create compelling characters for your stories</p>
          <Link href="/dashboard/characters/new" className="btn btn-primary">
            Create Your First Character
          </Link>
        </div>
      )}

      {showModal && selectedCharacter && (
        <CharacterModal character={selectedCharacter} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}
