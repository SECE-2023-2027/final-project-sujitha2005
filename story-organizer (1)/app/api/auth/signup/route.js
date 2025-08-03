import { NextResponse } from "next/server"

// Mock user storage (in production, use MongoDB)
const users = []

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email)
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In production, hash this password
      createdAt: new Date(),
    }

    users.push(newUser)

    return NextResponse.json({ message: "User created successfully", userId: newUser.id })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
