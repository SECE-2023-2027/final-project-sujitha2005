import { NextResponse } from "next/server"

export async function PUT(request) {
  try {
    const { scenes: reorderedScenes } = await request.json()

    // In production, update the database with new order
    // For now, just return success

    return NextResponse.json({ message: "Scenes reordered successfully" })
  } catch (error) {
    return NextResponse.json({ message: "Failed to reorder scenes" }, { status: 500 })
  }
}
