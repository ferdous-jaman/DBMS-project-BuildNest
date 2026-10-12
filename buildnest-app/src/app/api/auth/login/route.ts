import { NextRequest, NextResponse } from "next/server";
import { prisma, isDatabaseAvailable } from "@/lib/prisma";
import { encrypt } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    let user = null;
    if (await isDatabaseAvailable()) {
      try {
        user = await prisma.users.findUnique({
          where: { Username: username },
        });
      } catch (dbError) {
        console.warn("Database query error, falling back to default admin check:", dbError);
      }
    }

    if (user) {
      const isValid = await bcrypt.compare(password, user.Password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }
    } else {
      // Fallback: check against default admin credentials
      if (username === (process.env.ADMIN_USERNAME || "admin") && password === (process.env.ADMIN_PASSWORD || "buildnest@2024")) {
        user = {
          UserID: 1,
          Username: username,
          Role: "Admin",
        };
      } else {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }
    }

    // Create session token
    const token = await encrypt({
      userId: user.UserID,
      username: user.Username,
      role: user.Role,
    });

    // Set cookie
    const response = NextResponse.json(
      { message: "Login successful", user: { username: user.Username, role: user.Role } },
      { status: 200 }
    );

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
