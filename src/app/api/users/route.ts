// src/app/api/users/route.ts
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// ✅ Create a connection pool (better than single connection)
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "campusconnect",
});

// ✅ GET: Fetch all users
export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM students"); // <-- table must exist
    return NextResponse.json(rows);
  } catch (err: any) {
    console.error("GET /api/users error:", err);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// ✅ POST: Add new student
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, name, age, department } = body;

    if (!studentId || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await pool.query(
      "INSERT INTO students (studentId, name, age, department) VALUES (?, ?, ?, ?)",
      [studentId, name, age, department]
    );

    return NextResponse.json({ message: "Student added successfully" });
  } catch (err: any) {
    console.error("POST /api/users error:", err);
    return NextResponse.json(
      { error: "Failed to add student" },
      { status: 500 }
    );
  }
}
