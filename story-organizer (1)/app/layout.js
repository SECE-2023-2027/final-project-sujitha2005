import "./globals.css"

export const metadata = {
  title: "StoryForge - Plot Organizer",
  description: "Organize your stories, characters, and plots with ease",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
