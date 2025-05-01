import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sendWebsiteFulfilledEmail } from "@/lib/email-service";

export async function POST(request: NextRequest) {
  try {
    const { userId, websiteUrl, sendEmail = false } = await request.json();

    if (!userId || !websiteUrl) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the user document to check if it exists and get current data
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    // Update the user document with the website URL and notes
    await updateDoc(userRef, {
      websiteUrl,
    });

    // Send email notification if requested and the user has an email
    if (sendEmail && userData.email) {
      await sendWebsiteFulfilledEmail(
        userData.email,
        userData.firstName || "there",
        websiteUrl
      );
    }

    return NextResponse.json({
      success: true,
      message: "Website URL updated successfully",
    });
  } catch (error) {
    console.error("Error updating website URL:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while updating website URL",
      },
      { status: 500 }
    );
  }
}
