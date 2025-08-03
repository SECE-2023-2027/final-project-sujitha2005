import { NextResponse } from "next/server"

// Mock user storage (in production, use MongoDB)
const users = [{ id: "1", name: "John Writer", email: "john@example.com", password: "password123" }]

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Find user
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json({
      message: "Sign in successful",
      user: { id: user.id, name: user.name, email: user.email },
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
