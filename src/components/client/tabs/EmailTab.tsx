// src/components/client/tabs/EmailTab.tsx
"use client";

import React, { useState, useRef } from "react";
import { Send, FileText, Paperclip, X, ChevronDown } from "lucide-react";
import { UserData } from "@/types";

// Email templates remain the same as in your existing code
const emailTemplates = [
  {
    id: "standard",
    name: "Standard Template",
    subject: "Update from WebDash",
    content: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WebDash</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background-color: #f9f9f9;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color: #000000; text-align: center; padding: 20px 0;">
              <img src="https://app.webdash.io/image.png" alt="WebDash" style="max-width: 180px; height: auto;">
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
                <a href="https://app.webdash.io/dashboard" 
                  style="background-color: #F58327; color: white; padding: 14px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block; font-size: 16px; box-shadow: 0 2px 5px rgba(245, 131, 39, 0.3);">
                  View Dashboard
                </a>
              </div>
              
              <div style="margin-top: 40px;">
                <p style="line-height: 1.6; font-size: 16px;">Thanks,<br>The WebDash Team</p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f2f2f2; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0; font-size: 14px; color: #777; margin-bottom: 10px;">© ${new Date().getFullYear()} WebDash. All rights reserved.</p>
              <p style="margin: 0; font-size: 14px; color: #777;">Looking for more information? Visit our <a href="https://webdash.io" style="color: #F58327; text-decoration: none;">website</a>.</p>
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
    subject: "News from WebDash",
    content: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WebDash</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background-color: #f9f9f9;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(to right, #000000, #333333); text-align: center; padding: 30px 0;">
              <img src="https://app.webdash.io/image.png" alt="WebDash" style="max-width: 180px; height: auto;">
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
                      <a href="https://app.webdash.io/dashboard" 
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
                    <img src="https://app.webdash.io/image.png" alt="WebDash" style="max-width: 120px; height: auto; margin-bottom: 20px;">
                    <p style="margin: 0; font-size: 14px; color: #aaa; margin-bottom: 10px;">© ${new Date().getFullYear()} WebDash. All rights reserved.</p>
                    <p style="margin: 0; font-size: 14px; color: #aaa;">
                      <a href="https://webdash.io" style="color: #F58327; text-decoration: none;">Website</a> | 
                      <a href="mailto:support@webdash.io" style="color: #F58327; text-decoration: none;">Contact</a>
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
    subject: "A message from WebDash",
    content: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WebDash</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; background-color: #ffffff;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto;">
          <!-- Header -->
          <tr>
            <td style="padding: 30px 0; text-align: center; border-bottom: 1px solid #eaeaea;">
              <img src="https://app.webdash.io/image3.png" alt="WebDash" style="max-width: 140px; height: auto;">
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
                <a href="https://app.webdash.io/dashboard" 
                  style="color: #F58327; font-weight: bold; text-decoration: none; border-bottom: 2px solid #F58327; padding-bottom: 3px; font-size: 16px;">
                  Access your dashboard
                </a>
              </div>
              
              <p style="line-height: 1.6; font-size: 16px; color: #555; margin-top: 40px;">
                Best regards,<br>
                WebDash
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px; text-align: center; border-top: 1px solid #eaeaea;">
              <p style="margin: 0; font-size: 12px; color: #999;">© ${new Date().getFullYear()} WebDash</p>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #999;">
                <a href="https://webdash.io" style="color: #999; text-decoration: none;">webdash.io</a>
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  },
];

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
  const [messageText, setMessageText] = useState<string>("");

  // Track which template is applied
  const [appliedTemplate, setAppliedTemplate] = useState<string | null>(null);

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Apply a template
  const applyTemplate = (templateId: string) => {
    const template = emailTemplates.find((t) => t.id === templateId);
    if (!template) return;

    setSubject(template.subject);
    setAppliedTemplate(templateId);

    // Get selected client name if available
    const selectedClientData = clients.find(
      (client) => client.id === selectedClient
    );
    const clientName = selectedClientData
      ? `${selectedClientData.firstName || ""} ${
          selectedClientData.lastName || ""
        }`.trim() || "there"
      : "there";

    // Set default message text for editing
    setMessageText("Your message here");

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

  // Get client data
  const getClientById = (id: string) => {
    return clients.find((client) => client.id === id);
  };

  // Get selected client data
  const selectedClientData = getClientById(selectedClient);

  // Get the email address of the selected client
  const getSelectedClientEmail = () => {
    if (!selectedClient) return "";
    const client = getClientById(selectedClient);
    return client?.email || "";
  };

  // Generate the final HTML content to send
  const generateEmailContent = () => {
    if (!appliedTemplate) {
      // If no template is applied, just return the plain text
      return `<div style="font-family: Arial, sans-serif; color: #333333;">${messageText.replace(
        /\n/g,
        "<br>"
      )}</div>`;
    }

    const template = emailTemplates.find((t) => t.id === appliedTemplate);
    if (!template) return messageText;

    // Get client name
    const clientName = selectedClientData
      ? `${selectedClientData.firstName || ""} ${
          selectedClientData.lastName || ""
        }`.trim() || "there"
      : "there";

    // Replace placeholders in the template
    let emailContent = template.content
      .replace(/\[CLIENT_NAME\]/g, clientName)
      .replace(/\[SUBJECT_LINE\]/g, subject)
      .replace(/\[YOUR_MESSAGE_HERE\]/g, messageText.replace(/\n/g, "<br>"));

    return emailContent;
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

    if (!messageText) {
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
      formData.append("content", generateEmailContent());
      formData.append("clientEmail", getSelectedClientEmail());

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
        setMessageText("");
        setAppliedTemplate(null);
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
                {appliedTemplate
                  ? emailTemplates.find((t) => t.id === appliedTemplate)
                      ?.name || "Select Template"
                  : "Select Template"}
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

        {/* Simple Text Area */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message:
          </label>

          <div className="border border-gray-300 rounded-md">
            <textarea
              ref={textareaRef}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full p-4 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              placeholder="Write your message here..."
            />
          </div>

          {appliedTemplate && (
            <div className="mt-2 text-sm text-gray-500">
              Using {emailTemplates.find((t) => t.id === appliedTemplate)?.name}{" "}
              template. Your message will be formatted accordingly.
            </div>
          )}
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
