import { NextResponse } from "next/server"

// Mock chapters storage
const chapters = [
  {
    _id: "1",
    title: "The Beginning",
    summary: "Our hero's journey starts in a small village.",
    content: "It was a dark and stormy night...",
    wordCount: 1250,
    status: "completed",
    order: 0,
    storyId: "1",
    notes: "This chapter sets the tone for the entire story.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function GET() {
  return NextResponse.json(chapters)
}

export async function POST(request) {
  try {
    const chapterData = await request.json()

    const newChapter = {
      _id: Date.now().toString(),
      ...chapterData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    chapters.push(newChapter)

    return NextResponse.json(newChapter, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to create chapter" }, { status: 500 })
  }
}
