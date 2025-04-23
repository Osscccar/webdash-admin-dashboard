import { NextRequest, NextResponse } from "next/server";
import formData from "form-data";
import Mailgun from "mailgun.js";
import { verificationCodes } from "@/lib/verificationStore";

// Generate a random 6-digit code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Always send to specific admin email from environment variable
    const adminEmail = process.env.FA_ADMIN_EMAIL || "admin@example.com";

    // Generate a 6-digit verification code
    const verificationCode = generateVerificationCode();

    // Store the code with 10-minute expiration
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    verificationCodes.set(adminEmail, { code: verificationCode, expiresAt });

    // Initialize Mailgun (only if not in test mode)
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY || "",
    });

    // Send the verification code via Mailgun
    const data = {
      from: process.env.MAILGUN_FROM_EMAIL || "noreply@lumixdigital.co.uk",
      to: adminEmail,
      subject: "Your Lumix Digital Admin 2FA Code",
      text: `Your verification code for the Lumix Digital admin dashboard is: ${verificationCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #333; padding: 20px; text-align: center;">
            <h1 style="color: #ff9800; margin: 0;">Lumix Digital Admin</h1>
          </div>
          <div style="padding: 20px; background-color: #f5f5f5;">
            <h2 style="color: #333;">Authentication Required</h2>
            <p>Your verification code for accessing the admin dashboard is:</p>
            <div style="background-color: #333; color: #ff9800; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">
              ${verificationCode}
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please secure your account immediately.</p>
          </div>
          <div style="background-color: #333; padding: 15px; text-align: center; font-size: 12px; color: #888;">
            <p>&copy; ${new Date().getFullYear()} Lumix Digital. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    try {
      await mg.messages.create(process.env.MAILGUN_DOMAIN || "", data);
    } catch (mailError) {
      console.error("Mailgun error:", mailError);
      return NextResponse.json(
        {
          error: "Failed to send email, but code was generated",
          email: adminEmail,
          // Only return code in development for testing
          code:
            process.env.NODE_ENV === "development"
              ? verificationCode
              : undefined,
        },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      email: adminEmail,
      message: "Verification code sent",
      // Only return code in development for testing
      code:
        process.env.NODE_ENV === "development" ? verificationCode : undefined,
    });
  } catch (error) {
    console.error("Error sending 2FA code:", error);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    );
  }
}
