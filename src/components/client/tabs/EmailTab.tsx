"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Image, FileText, Paperclip, X, ChevronDown } from "lucide-react";
import { UserData } from "@/types";

// Email templates
const emailTemplates = [
  {
    id: "standard",
    name: "Standard Template",
    subject: "Update from Lumix Digital",
    content: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lumix Digital</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background-color: #f9f9f9;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color: #000000; text-align: center; padding: 20px 0;">
              <img src="https://app.lumixdigital.com.au/image.png" alt="Lumix Digital" style="max-width: 180px; height: auto;">
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h1 style="color: #F58327; margin-top: 0; margin-bottom: 20px; font-size: 24px; text-align: center;">Important Update</h1>
              
              <p style="margin-bottom: 25px; line-height: 1.6; font-size: 16px;">Hello [CLIENT_NAME],</p>
              
              <p style="margin-bottom: 25px; line-height: 1.6; font-size: 16px;">
                We're reaching out to provide you with an important update regarding your website project.
              </p>
              
              <p style="margin-bottom: 25px; line-height: 1.6; font-size: 16px;">
                [YOUR_MESSAGE_HERE]
              </p>
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="https://app.lumixdigital.com.au/dashboard" 
                  style="background-color: #F58327; color: white; padding: 14px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block; font-size: 16px; box-shadow: 0 2px 5px rgba(245, 131, 39, 0.3);">
                  View Dashboard
                </a>
              </div>
              
              <div style="margin-top: 40px;">
                <p style="line-height: 1.6; font-size: 16px;">Thanks,<br>The Lumix Digital Team</p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f2f2f2; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0; font-size: 14px; color: #777; margin-bottom: 10px;">© ${new Date().getFullYear()} Lumix Digital. All rights reserved.</p>
              <p style="margin: 0; font-size: 14px; color: #777;">Looking for more information? Visit our <a href="https://lumixdigital.com.au" style="color: #F58327; text-decoration: none;">website</a>.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  },
  {
    id: "modern",
    name: "Modern Template",
    subject: "News from Lumix Digital",
    content: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lumix Digital</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background-color: #f9f9f9;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(to right, #000000, #333333); text-align: center; padding: 30px 0;">
              <img src="https://app.lumixdigital.com.au/image.png" alt="Lumix Digital" style="max-width: 180px; height: auto;">
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 40px 30px;">
                    <h1 style="color: #333; margin-top: 0; margin-bottom: 30px; font-size: 28px; text-align: left; border-left: 4px solid #F58327; padding-left: 15px;">[SUBJECT_LINE]</h1>
                    
                    <p style="margin-bottom: 25px; line-height: 1.8; font-size: 16px;">Hello [CLIENT_NAME],</p>
                    
                    <p style="margin-bottom: 25px; line-height: 1.8; font-size: 16px;">
                      [YOUR_MESSAGE_HERE]
                    </p>
                    
                    <div style="text-align: left; margin: 35px 0;">
                      <a href="https://app.lumixdigital.com.au/dashboard" 
                        style="background-color: #F58327; color: white; padding: 16px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">
                        Open Dashboard
                      </a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #333; padding: 30px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="text-align: center;">
                    <img src="https://app.lumixdigital.com.au/image.png" alt="Lumix Digital" style="max-width: 120px; height: auto; margin-bottom: 20px;">
                    <p style="margin: 0; font-size: 14px; color: #aaa; margin-bottom: 10px;">© ${new Date().getFullYear()} Lumix Digital. All rights reserved.</p>
                    <p style="margin: 0; font-size: 14px; color: #aaa;">
                      <a href="https://lumixdigital.com.au" style="color: #F58327; text-decoration: none;">Website</a> | 
                      <a href="mailto:support@lumixdigital.com.au" style="color: #F58327; text-decoration: none;">Contact</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  },
  {
    id: "minimal",
    name: "Minimal Template",
    subject: "A message from Lumix Digital",
    content: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lumix Digital</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; background-color: #ffffff;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto;">
          <!-- Header -->
          <tr>
            <td style="padding: 30px 0; text-align: center; border-bottom: 1px solid #eaeaea;">
              <img src="https://app.lumixdigital.com.au/image.png" alt="Lumix Digital" style="max-width: 140px; height: auto;">
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 20px;">
              <p style="margin-bottom: 25px; line-height: 1.6; font-size: 16px; color: #555;">Hello [CLIENT_NAME],</p>
              
              <p style="margin-bottom: 25px; line-height: 1.6; font-size: 16px; color: #555;">
                [YOUR_MESSAGE_HERE]
              </p>
              
              <div style="margin: 40px 0 30px 0;">
                <a href="https://app.lumixdigital.com.au/dashboard" 
                  style="color: #F58327; font-weight: bold; text-decoration: none; border-bottom: 2px solid #F58327; padding-bottom: 3px; font-size: 16px;">
                  Access your dashboard
                </a>
              </div>
              
              <p style="line-height: 1.6; font-size: 16px; color: #555; margin-top: 40px;">
                Best regards,<br>
                Lumix Digital Team
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px; text-align: center; border-top: 1px solid #eaeaea;">
              <p style="margin: 0; font-size: 12px; color: #999;">© ${new Date().getFullYear()} Lumix Digital</p>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #999;">
                <a href="https://lumixdigital.com.au" style="color: #999; text-decoration: none;">lumixdigital.com.au</a>
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  },
];

// Simple toolbar options for our editor
const ToolbarButton: React.FC<{
  command: string;
  icon: React.ReactNode;
  title: string;
  value?: string;
}> = ({ command, icon, title, value }) => {
  const handleClick = () => {
    document.execCommand(command, false, value);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
      title={title}
    >
      {icon}
    </button>
  );
};

interface EmailTabProps {
  clients: UserData[];
  currentClient?: UserData;
}

const EmailTab: React.FC<EmailTabProps> = ({ clients, currentClient }) => {
  // State for selected client
  const [selectedClient, setSelectedClient] = useState<string>(
    currentClient ? currentClient.id || "" : ""
  );

  // State for email subject and content
  const [subject, setSubject] = useState<string>("");
  const [messageHtml, setMessageHtml] = useState<string>("");

  // State for managing file attachments
  const [attachments, setAttachments] = useState<File[]>([]);

  // State for showing template selector
  const [showTemplates, setShowTemplates] = useState<boolean>(false);

  // State for send button loading
  const [sending, setSending] = useState<boolean>(false);

  // State for success/error feedback
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Initialize editor content observer
  useEffect(() => {
    if (editorRef.current) {
      const observer = new MutationObserver(() => {
        if (editorRef.current) {
          setMessageHtml(editorRef.current.innerHTML);
        }
      });

      observer.observe(editorRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
      });

      return () => observer.disconnect();
    }
  }, []);

  // Apply a template to the editor
  const applyTemplate = (templateId: string) => {
    const template = emailTemplates.find((t) => t.id === templateId);
    if (!template) return;

    setSubject(template.subject);

    // Extract the editable body
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = template.content;

    // Replace placeholders
    const clientNamePlaceholder = currentClient
      ? `${currentClient.firstName || ""} ${
          currentClient.lastName || ""
        }`.trim() || "there"
      : "[CLIENT_NAME]";

    // Set editor content with client name filled in
    let editableContent = template.content
      .replace(/\[CLIENT_NAME\]/g, clientNamePlaceholder)
      .replace(/\[SUBJECT_LINE\]/g, template.subject);

    // Set the HTML content
    if (editorRef.current) {
      editorRef.current.innerHTML = "[YOUR_MESSAGE_HERE]"; // Just set the editable part
      setMessageHtml(editableContent);
    }

    setShowTemplates(false);
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAttachments([...attachments, ...newFiles]);
    }
  };

  // Remove an attachment
  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // Helper function to apply formatting
  const applyFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value);

    // Focus back on the editor
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  // Send the email
  const sendEmail = async () => {
    if (!selectedClient) {
      setFeedback({ message: "Please select a client", type: "error" });
      return;
    }

    if (!subject) {
      setFeedback({ message: "Please add a subject", type: "error" });
      return;
    }

    if (!messageHtml || messageHtml === "<p></p>" || messageHtml === "<br>") {
      setFeedback({
        message: "Please add content to your email",
        type: "error",
      });
      return;
    }

    setSending(true);

    try {
      // Create FormData for file uploads
      const formData = new FormData();
      formData.append("clientId", selectedClient);
      formData.append("subject", subject);
      formData.append("content", messageHtml);

      // Add each attachment
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      // Send the email
      const response = await fetch("/api/send-client-email", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setFeedback({ message: "Email sent successfully!", type: "success" });
        // Reset the form
        setMessageHtml("");
        if (editorRef.current) {
          editorRef.current.innerHTML = "";
        }
        setSubject("");
        setAttachments([]);
      } else {
        setFeedback({
          message: data.message || "Failed to send email",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setFeedback({
        message: "An error occurred while sending the email",
        type: "error",
      });
    } finally {
      setSending(false);

      // Clear feedback after 5 seconds
      setTimeout(() => {
        setFeedback(null);
      }, 5000);
    }
  };

  const insertLink = () => {
    const url = prompt("Enter the URL:");
    if (url) {
      // Only proceed if the user entered a URL
      document.execCommand("createLink", false, url);
    }
  };

  // Get client data by ID
  const getClientById = (id: string) => {
    return clients.find((client) => client.id === id);
  };

  // Get selected client data
  const selectedClientData = getClientById(selectedClient);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <h2 className="text-lg font-medium text-gray-800">Compose Email</h2>
      </div>

      {/* Email Form */}
      <div className="p-6">
        {/* Client Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Send To:
          </label>
          <div className="relative">
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.firstName} {client.lastName} ({client.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Templates Dropdown */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Template:
            </label>
            <div className="relative">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                onClick={() => setShowTemplates(!showTemplates)}
              >
                Select Template
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>

              {showTemplates && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  {emailTemplates.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 last:border-0"
                      onClick={() => applyTemplate(template.id)}
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subject Line */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject:
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
            placeholder="Email subject"
          />
        </div>

        {/* Simple Text Editor */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message:
          </label>

          {/* Text Editor Toolbar */}
          <div className="border border-gray-300 border-b-0 rounded-t-md bg-gray-50 p-2 flex flex-wrap gap-1">
            <ToolbarButton
              command="bold"
              icon={<strong>B</strong>}
              title="Bold"
            />
            <ToolbarButton command="italic" icon={<em>I</em>} title="Italic" />
            <ToolbarButton
              command="underline"
              icon={<u>U</u>}
              title="Underline"
            />
            <ToolbarButton
              command="strikeThrough"
              icon={<span className="line-through">S</span>}
              title="Strikethrough"
            />

            <div className="border-l border-gray-300 mx-2 h-6"></div>

            <ToolbarButton
              command="formatBlock"
              value="h1"
              icon={<span className="font-bold">H1</span>}
              title="Heading 1"
            />
            <ToolbarButton
              command="formatBlock"
              value="h2"
              icon={<span className="font-bold">H2</span>}
              title="Heading 2"
            />
            <ToolbarButton
              command="formatBlock"
              value="h3"
              icon={<span className="font-bold">H3</span>}
              title="Heading 3"
            />
            <ToolbarButton
              command="formatBlock"
              value="p"
              icon={<span>¶</span>}
              title="Paragraph"
            />

            <div className="border-l border-gray-300 mx-2 h-6"></div>

            <ToolbarButton
              command="insertUnorderedList"
              icon={<span>• List</span>}
              title="Bullet List"
            />
            <ToolbarButton
              command="insertOrderedList"
              icon={<span>1. List</span>}
              title="Numbered List"
            />

            <div className="border-l border-gray-300 mx-2 h-6"></div>

            <button
              type="button"
              onClick={insertLink}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
              title="Insert Link"
            >
              <span>🔗</span>
            </button>
            <ToolbarButton
              command="foreColor"
              value="#F58327"
              icon={<span style={{ color: "#F58327" }}>A</span>}
              title="Orange Text"
            />
            <ToolbarButton
              command="foreColor"
              value="#2563EB"
              icon={<span style={{ color: "#2563EB" }}>A</span>}
              title="Blue Text"
            />
            <ToolbarButton
              command="foreColor"
              value="#000000"
              icon={<span>A</span>}
              title="Black Text"
            />
          </div>

          {/* Editable Content Area */}
          <div
            ref={editorRef}
            className="border border-gray-300 rounded-b-md p-4 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            contentEditable={true}
            dangerouslySetInnerHTML={{ __html: "" }}
            style={{
              backgroundColor: "white",
              color: "#333",
              fontSize: "16px",
              lineHeight: "1.6",
            }}
            onInput={() => setMessageHtml(editorRef.current?.innerHTML || "")}
          />
        </div>

        {/* Attachments */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Attachments:
            </label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded flex items-center"
            >
              <Paperclip className="h-3.5 w-3.5 mr-1" />
              Add Files
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              multiple
            />
          </div>

          {/* Attachment List */}
          {attachments.length > 0 && (
            <div className="border border-gray-200 rounded-md bg-gray-50 p-3">
              <ul className="divide-y divide-gray-200">
                {attachments.map((file, index) => (
                  <li
                    key={index}
                    className="py-2 first:pt-0 last:pb-0 flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700 truncate max-w-xs">
                        {file.name}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Feedback message */}
        {feedback && (
          <div
            className={`p-3 mb-6 rounded-md ${
              feedback.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Send Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={sendEmail}
            disabled={sending}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {sending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailTab;
