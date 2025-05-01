// src/lib/parse-form.ts
import { NextRequest } from "next/server";
import * as fs from "fs";
import { mkdir, stat } from "fs/promises";
import path from "path";
import os from "os";

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
export async function parseForm(
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
          // Handle file uploads - explicitly check if it's a File object
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
