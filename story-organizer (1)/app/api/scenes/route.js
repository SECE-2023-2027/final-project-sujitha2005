import { NextResponse } from "next/server"

// Mock scenes storage
const scenes = [
  {
    _id: "1",
    title: "The Call to Adventure",
    description: "Aria discovers her magical powers when her village is attacked.",
    location: "Windmere Village",
    characters: "Aria, Village Elder",
    notes: "This is the inciting incident that starts the hero's journey.",
    order: 0,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "Meeting the Mentor",
    description: "Aria meets Marcus, who agrees to train her in magic.",
    location: "Ancient Forest",
    characters: "Aria, Marcus",
    notes: "Important character development scene.",
    order: 1,
    createdAt: new Date().toISOString(),
  },
]

export async function GET() {
  return NextResponse.json(scenes)
}

export async function POST(request) {
  try {
    const sceneData = await request.json()

    const newScene = {
      _id: Date.now().toString(),
      ...sceneData,
      createdAt: new Date().toISOString(),
    }

    scenes.push(newScene)

    return NextResponse.json(newScene, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to create scene" }, { status: 500 })
  }
}
