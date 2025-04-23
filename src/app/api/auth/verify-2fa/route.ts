import { NextRequest, NextResponse } from "next/server";
import { verificationCodes } from "@/lib/verificationStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code } = body;

    // Always verify against admin email from environment variable
    const adminEmail: string =
      process.env.FA_ADMIN_EMAIL || "admin@example.com";

    // Check if we have a valid code for this email
    const storedData = verificationCodes.get(adminEmail);

    if (!storedData) {
      return NextResponse.json(
        {
          error: "No verification code found. Please request a new code.",
        },
        { status: 400 }
      );
    }

    // Check if code has expired
    if (Date.now() > storedData.expiresAt) {
      // Remove expired code
      verificationCodes.delete(adminEmail);

      return NextResponse.json(
        {
          error: "Verification code has expired. Please request a new code.",
        },
        { status: 400 }
      );
    }

    // Verify the code
    if (storedData.code !== code) {
      return NextResponse.json(
        {
          error: "Invalid verification code. Please try again.",
        },
        { status: 400 }
      );
    }

    // Code is valid, remove it so it can't be reused
    verificationCodes.delete(adminEmail);

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Verification successful",
    });

    // Set a cookie indicating 2FA is verified
    response.cookies.set({
      name: "2fa_verified",
      value: "true",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Error verifying 2FA code:", error);
    return NextResponse.json(
      { error: "Failed to verify code" },
      { status: 500 }
    );
  }
}

// For demonstration purposes in development, allow retrieving the current code
// Remove this in production!
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const adminEmail = process.env.FA_ADMIN_EMAIL || "admin@example.com";
  const code = verificationCodes.get(adminEmail);

  return NextResponse.json({
    code: code?.code || "No code found",
    expiresAt: code?.expiresAt || "N/A",
  });
}
