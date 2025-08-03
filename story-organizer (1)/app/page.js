import Link from "next/link"

export default function LandingPage() {
  return (
    <div>
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <div className="logo">📚 StoryForge</div>
            <div className="nav-links">
              <Link href="/auth/signin">Sign In</Link>
              <Link href="/auth/signup" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Organize Your Stories Like Never Before</h1>
          <p>The ultimate tool for writers to manage plots, characters, and chapters in one place</p>
          <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
            <Link href="/auth/signup" className="btn btn-primary">
              Start Writing
            </Link>
            <Link href="#features" className="btn btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <h2 style={{ textAlign: "center", fontSize: "36px", marginBottom: "20px" }}>Everything You Need to Write</h2>
          <p style={{ textAlign: "center", fontSize: "18px", color: "#666", marginBottom: "40px" }}>
            Powerful tools designed specifically for storytellers
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📖</div>
              <h3>Story Management</h3>
              <p>Create and organize multiple stories with detailed summaries, genres, and metadata</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎭</div>
              <h3>Character Profiles</h3>
              <p>Build detailed character profiles with backgrounds, motivations, and relationships</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎬</div>
              <h3>Scene Organizer</h3>
              <p>Plan and organize scenes with drag-and-drop functionality for easy reordering</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Chapter Management</h3>
              <p>Structure your story with organized chapters and track your progress</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Notes & Ideas</h3>
              <p>Keep all your creative thoughts, references, and research in one place</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚙️</div>
              <h3>Customizable</h3>
              <p>Adapt the tool to your writing style with flexible organization options</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: "80px 0",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          textAlign: "center",
        }}
      >
        <div className="container">
          <h2 style={{ fontSize: "36px", marginBottom: "20px" }}>Ready to Start Your Story?</h2>
          <p style={{ fontSize: "18px", marginBottom: "40px", opacity: "0.9" }}>
            Join thousands of writers who trust StoryForge with their creative process
          </p>
          <Link href="/auth/signup" className="btn btn-secondary">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#333", color: "white", padding: "40px 0", textAlign: "center" }}>
        <div className="container">
          <div className="logo" style={{ color: "white", marginBottom: "20px" }}>
            📚 StoryForge
          </div>
          <p>&copy; 2024 StoryForge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
