import { NextResponse } from "next/server"

// Mock notes storage
const notes = [
  {
    _id: "1",
    title: "Magic System Ideas",
    content:
      "The magic in this world is based on emotions. The stronger the emotion, the more powerful the magic. However, using magic drains the user emotionally, leaving them feeling empty.",
    category: "World Building",
    tags: "magic, emotions, system",
    isImportant: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "Character Dialogue",
    content:
      "Remember that Marcus speaks in an old-fashioned way, using 'thee' and 'thou'. He also tends to speak in metaphors related to nature.",
    category: "Character Ideas",
    tags: "Marcus, dialogue, speech patterns",
    isImportant: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

export async function GET() {
  return NextResponse.json(notes)
}

export async function POST(request) {
  try {
    const noteData = await request.json()

    const newNote = {
      _id: Date.now().toString(),
      ...noteData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    notes.push(newNote)

    return NextResponse.json(newNote, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to create note" }, { status: 500 })
  }
}
