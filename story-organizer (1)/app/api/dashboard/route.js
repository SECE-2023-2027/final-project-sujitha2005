import { NextResponse } from "next/server"

// Mock data
const mockData = {
  stats: {
    stories: 3,
    characters: 8,
    chapters: 15,
    notes: 12,
  },
  recentStories: [
    {
      _id: "1",
      title: "The Dragon's Quest",
      genre: "Fantasy",
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "2",
      title: "Space Odyssey",
      genre: "Science Fiction",
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ],
}

export async function GET() {
  return NextResponse.json(mockData)
}
