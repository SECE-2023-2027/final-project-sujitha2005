"use client"
import { useState } from "react"

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile")
  const [profileData, setProfileData] = useState({
    name: "John Writer",
    email: "john@example.com",
    bio: "Aspiring fantasy novelist with a passion for world-building.",
    location: "New York, USA",
    website: "https://johnwriter.com",
    writingGoals: "Complete my first novel by the end of the year",
  })

  const [preferences, setPreferences] = useState({
    theme: "light",
    emailNotifications: true,
    autoSave: true,
    defaultGenre: "Fantasy",
    wordsPerPage: 250,
    backupFrequency: "daily",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleProfileSave = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      })
      if (response.ok) {
        alert("Profile updated successfully!")
      }
    } catch (error) {
      alert("Failed to update profile")
    }
  }

  const handlePreferencesSave = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      })
      if (response.ok) {
        alert("Preferences updated successfully!")
      }
    } catch (error) {
      alert("Failed to update preferences")
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match")
      return
    }
    try {
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData),
      })
      if (response.ok) {
        alert("Password updated successfully!")
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      }
    } catch (error) {
      alert("Failed to update password")
    }
  }

  const exportData = async () => {
    try {
      const response = await fetch("/api/user/export")
      const data = await response.json()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "storyforge-data.json"
      a.click()
    } catch (error) {
      alert("Failed to export data")
    }
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "preferences", label: "Preferences", icon: "⚙️" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "data", label: "Data", icon: "💾" },
  ]

  return (
    <div className="container">
      <h1 style={{ marginBottom: "30px" }}>Settings</h1>

      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "30px" }}>
        {/* Sidebar Tabs */}
        <div className="card" style={{ height: "fit-content" }}>
          <nav>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px 16px",
                  border: "none",
                  background: activeTab === tab.id ? "#667eea" : "transparent",
                  color: activeTab === tab.id ? "white" : "#555",
                  textAlign: "left",
                  borderRadius: "8px",
                  marginBottom: "8px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <span style={{ marginRight: "10px" }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="card">
          {activeTab === "profile" && (
            <div>
              <h2 style={{ marginBottom: "20px" }}>Profile Information</h2>
              <form onSubmit={handleProfileSave}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows="3"
                    placeholder="Tell us about yourself and your writing"
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Website</label>
                    <input
                      type="url"
                      value={profileData.website}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Writing Goals</label>
                  <textarea
                    value={profileData.writingGoals}
                    onChange={(e) => setProfileData({ ...profileData, writingGoals: e.target.value })}
                    rows="3"
                    placeholder="What are your writing goals?"
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Save Profile
                </button>
              </form>
            </div>
          )}

          {activeTab === "preferences" && (
            <div>
              <h2 style={{ marginBottom: "20px" }}>Preferences</h2>
              <form onSubmit={handlePreferencesSave}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div className="form-group">
                    <label>Theme</label>
                    <select
                      value={preferences.theme}
                      onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Default Genre</label>
                    <select
                      value={preferences.defaultGenre}
                      onChange={(e) => setPreferences({ ...preferences, defaultGenre: e.target.value })}
                    >
                      <option value="Fantasy">Fantasy</option>
                      <option value="Science Fiction">Science Fiction</option>
                      <option value="Mystery">Mystery</option>
                      <option value="Romance">Romance</option>
                      <option value="Thriller">Thriller</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div className="form-group">
                    <label>Words Per Page</label>
                    <input
                      type="number"
                      value={preferences.wordsPerPage}
                      onChange={(e) =>
                        setPreferences({ ...preferences, wordsPerPage: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Backup Frequency</label>
                    <select
                      value={preferences.backupFrequency}
                      onChange={(e) => setPreferences({ ...preferences, backupFrequency: e.target.value })}
                    >
                      <option value="never">Never</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                    />
                    Email Notifications
                  </label>
                </div>

                <div className="form-group">
                  <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                      type="checkbox"
                      checked={preferences.autoSave}
                      onChange={(e) => setPreferences({ ...preferences, autoSave: e.target.checked })}
                    />
                    Auto Save
                  </label>
                </div>

                <button type="submit" className="btn btn-primary">
                  Save Preferences
                </button>
              </form>
            </div>
          )}

          {activeTab === "security" && (
            <div>
              <h2 style={{ marginBottom: "20px" }}>Security</h2>
              <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Change Password
                </button>
              </form>

              <div style={{ marginTop: "40px", padding: "20px", background: "#f8f9fa", borderRadius: "8px" }}>
                <h3 style={{ marginBottom: "15px" }}>Account Security</h3>
                <p style={{ marginBottom: "15px", color: "#666" }}>
                  Keep your account secure by using a strong password and enabling two-factor authentication.
                </p>
                <button className="btn btn-secondary">Enable 2FA</button>
              </div>
            </div>
          )}

          {activeTab === "data" && (
            <div>
              <h2 style={{ marginBottom: "20px" }}>Data Management</h2>

              <div style={{ marginBottom: "30px" }}>
                <h3 style={{ marginBottom: "15px" }}>Export Data</h3>
                <p style={{ marginBottom: "15px", color: "#666" }}>
                  Download all your stories, characters, and notes as a JSON file.
                </p>
                <button onClick={exportData} className="btn btn-primary">
                  Export All Data
                </button>
              </div>

              <div style={{ marginBottom: "30px" }}>
                <h3 style={{ marginBottom: "15px" }}>Import Data</h3>
                <p style={{ marginBottom: "15px", color: "#666" }}>Import your data from a previously exported file.</p>
                <input type="file" accept=".json" style={{ marginBottom: "15px" }} />
                <button className="btn btn-secondary">Import Data</button>
              </div>

              <div style={{ padding: "20px", background: "#fff5f5", borderRadius: "8px", border: "1px solid #fed7d7" }}>
                <h3 style={{ marginBottom: "15px", color: "#e53e3e" }}>Danger Zone</h3>
                <p style={{ marginBottom: "15px", color: "#666" }}>
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button
                  className="btn"
                  style={{ background: "#e53e3e", color: "white" }}
                  onClick={() => {
                    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                      alert("Account deletion feature would be implemented here")
                    }
                  }}
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
