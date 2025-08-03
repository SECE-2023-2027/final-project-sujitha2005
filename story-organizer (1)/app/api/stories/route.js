import { NextResponse } from "next/server"

// Mock stories storage
const stories = [
  {
    _id: "1",
    title: "The Dragon's Quest",
    summary: "A young hero embarks on a journey to find the legendary dragon.",
    genre: "Fantasy",
    targetAudience: "young-adult",
    status: "writing",
    chapters: [],
    characters: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function GET() {
  return NextResponse.json(stories)
}

export async function POST(request) {
  try {
    const storyData = await request.json()

    const newStory = {
      _id: Date.now().toString(),
      ...storyData,
      chapters: [],
      characters: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    stories.push(newStory)

    return NextResponse.json(newStory, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to create story" }, { status: 500 })
  }
}
