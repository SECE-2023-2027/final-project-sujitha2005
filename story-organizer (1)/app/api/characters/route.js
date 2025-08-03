import { NextResponse } from "next/server"

// Mock characters storage
const characters = [
  {
    _id: "1",
    name: "Aria Stormwind",
    age: 17,
    role: "Protagonist",
    description: "A brave young warrior with the power to control wind magic.",
    background: "Raised in a small village, discovered her powers at age 15.",
    motivation: "To save her village from the dark forces threatening it.",
    avatar: "⚔️",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    name: "Marcus the Wise",
    age: 65,
    role: "Mentor",
    description: "An old wizard who guides the protagonist on her journey.",
    background: "Former court wizard who went into exile after a great war.",
    motivation: "To train the next generation of heroes.",
    avatar: "🧙‍♂️",
    createdAt: new Date().toISOString(),
  },
]

export async function GET() {
  return NextResponse.json(characters)
}

export async function POST(request) {
  try {
    const characterData = await request.json()

    const newCharacter = {
      _id: Date.now().toString(),
      ...characterData,
      createdAt: new Date().toISOString(),
    }

    characters.push(newCharacter)

    return NextResponse.json(newCharacter, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to create character" }, { status: 500 })
  }
}
