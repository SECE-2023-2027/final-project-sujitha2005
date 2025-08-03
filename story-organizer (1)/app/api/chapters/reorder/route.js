import { NextResponse } from "next/server"

export async function PUT(request) {
  try {
    const { chapters: reorderedChapters } = await request.json()

    // In production, update the database with new order
    // For now, just return success

    return NextResponse.json({ message: "Chapters reordered successfully" })
  } catch (error) {
    return NextResponse.json({ message: "Failed to reorder chapters" }, { status: 500 })
  }
}
