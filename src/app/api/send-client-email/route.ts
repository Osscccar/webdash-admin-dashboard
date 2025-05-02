// src/app/api/send-client-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import mailgun from "mailgun-js";
import * as fs from "fs";
import { mkdir, stat } from "fs/promises";
import path from "path";
import os from "os";

// Initialize Mailgun client
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY || "",
  domain: process.env.MAILGUN_DOMAIN || "",
});

// Sender email for all emails
const senderEmail = process.env.MAILGUN_FROM_EMAIL || "noreply@webdash.io";

// FormidableFile type definition
interface FormidableFile {
  filepath: string;
  originalFilename?: string;
  mimetype?: string;
  size: number;
}

type FormidableFiles = {
  [key: string]: FormidableFile | FormidableFile[];
};

type FormidableFields = {
  [key: string]: string | string[];
};

// Parse form data function
async function parseForm(
  request: NextRequest
): Promise<{ fields: FormidableFields; files: FormidableFiles }> {
  return new Promise(async (resolve, reject) => {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(os.tmpdir(), "uploads");
    try {
      await stat(uploadDir);
    } catch (e: any) {
      if (e.code === "ENOENT") {
        await mkdir(uploadDir, { recursive: true });
      } else {
        console.error("Error checking upload directory:", e);
        reject(e);
        return;
      }
    }

    try {
      const formData = await request.formData();
      const fields: FormidableFields = {};
      const files: FormidableFiles = {};

      // Process all form data entries
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          // Handle file uploads
          const tempFilePath = path.join(
            uploadDir,
            `${Date.now()}-${value.name}`
          );

          // Save the file
          const buffer = Buffer.from(await value.arrayBuffer());
          fs.writeFileSync(tempFilePath, buffer);

          // Create a FormidableFile-like object
          const formidableFile: FormidableFile = {
            filepath: tempFilePath,
            originalFilename: value.name,
            size: value.size,
            mimetype: value.type,
          };

          // Add to files object
          if (files[key]) {
            // If key already exists, convert to array
            if (Array.isArray(files[key])) {
              (files[key] as FormidableFile[]).push(formidableFile);
            } else {
              files[key] = [files[key] as FormidableFile, formidableFile];
            }
          } else {
            files[key] = formidableFile;
          }
        } else {
          // Handle regular form fields
          if (fields[key]) {
            if (Array.isArray(fields[key])) {
              (fields[key] as string[]).push(value.toString());
            } else {
              fields[key] = [fields[key] as string, value.toString()];
            }
          } else {
            fields[key] = value.toString();
          }
        }
      }

      resolve({ fields, files });
    } catch (error) {
      console.error("Error parsing form data:", error);
      reject(error);
    }
  });
}

// POST handler for the API route
export async function POST(request: NextRequest) {
  try {
    // Parse the form data
    const { fields, files } = await parseForm(request);

    // Extract data from fields
    const clientId = fields.clientId as string;
    const subject = fields.subject as string;
    const content = fields.content as string;

    // Get client email from form data
    const clientEmail = fields.clientEmail as string;

    if (!clientEmail) {
      return NextResponse.json(
        { success: false, message: "Client email is required" },
        { status: 400 }
      );
    }

    // Configure mail attachment format expected by Mailgun
    interface MailgunAttachment {
      filename?: string;
      contentType?: string;
      data: Buffer;
    }

    // Prepare email attachments
    const attachments: MailgunAttachment[] = [];

    if (files.attachments) {
      const attachmentFiles = Array.isArray(files.attachments)
        ? files.attachments
        : [files.attachments];

      for (const file of attachmentFiles) {
        // Read file content as buffer
        const fileContent = fs.readFileSync(file.filepath);

        attachments.push({
          filename: file.originalFilename,
          contentType: file.mimetype,
          data: fileContent,
        });
      }
    }

    // Prepare email data
    const emailData: any = {
      from: `"WebDash" <${senderEmail}>`,
      to: clientEmail,
      subject: subject,
      html: content,
    };

    // Only add attachments if there are any
    if (attachments.length > 0) {
      emailData.attachment = attachments;
    }

    // Send the email
    const response = await mg.messages().send(emailData);
    console.log("Email sent successfully:", response);

    // Clean up temporary files
    if (files.attachments) {
      const attachmentFiles = Array.isArray(files.attachments)
        ? files.attachments
        : [files.attachments];

      for (const file of attachmentFiles) {
        try {
          fs.unlinkSync(file.filepath);
        } catch (error) {
          console.error("Error deleting temporary file:", error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error in email API:", error);

    return NextResponse.json(
      { success: false, message: "Failed to send email" },
      { status: 500 }
    );
  }
}
