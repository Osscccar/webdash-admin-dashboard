// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

// Parse admin users from environment variable
const parseAdminUsers = (): Record<
  string,
  { password: string; role: string }
> => {
  const usersStr = process.env.ADMIN_USERS || "";
  const users: Record<string, { password: string; role: string }> = {};

  // If not using new format, fall back to old credentials
  if (!usersStr) {
    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;
    if (validUsername && validPassword) {
      users[validUsername] = { password: validPassword, role: "admin" };
    }
    return users;
  }

  // Parse user:password:role format
  const userEntries = usersStr.split(",");
  userEntries.forEach((entry) => {
    const [username, password, role] = entry.split(":");
    if (username && password && role) {
      users[username] = { password, role };
    }
  });

  return users;
};

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Get admin users from server-side environment variables
    const users = parseAdminUsers();

    // Check if credentials are valid
    if (users[username] && users[username].password === password) {
      // Return user info without the password
      return NextResponse.json({
        success: true,
        user: {
          username,
          role: users[username].role,
        },
      });
    }

    // Invalid credentials
    return NextResponse.json(
      {
        success: false,
        message: "Invalid credentials",
      },
      { status: 401 }
    );
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Authentication failed",
      },
      { status: 500 }
    );
  }
}
