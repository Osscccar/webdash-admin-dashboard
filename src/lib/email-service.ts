import mailgun from "mailgun-js";

// Initialize Mailgun client
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY || "",
  domain: process.env.MAILGUN_DOMAIN || "",
});

// Sender email for all emails
const senderEmail = process.env.MAILGUN_FROM_EMAIL || "noreply@webdash.io";

/**
 * Sends a project phase update email to a client
 */
export async function sendProjectPhaseUpdateEmail(
  email: string,
  firstName: string,
  phaseName: string,
  phaseStatus: string,
  tasks: { name: string; completed: boolean }[]
) {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const data = {
    from: senderEmail,
    to: email,
    subject: `Your Website Project Has Been Updated - ${phaseName} Phase`,
    text: `Hello ${firstName}, Your website project has been updated. The ${phaseName} phase is now ${phaseStatus}. We've completed ${completedTasks} out of ${totalTasks} tasks in this phase.`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Project Phase Update</title>
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
              <h1 style="color: #F58327; margin-top: 0; margin-bottom: 20px; font-size: 24px; text-align: center;">Website Project Update</h1>
              
              <p style="margin-bottom: 25px; line-height: 1.6; font-size: 16px;">Hello ${firstName},</p>
              
              <p style="margin-bottom: 25px; line-height: 1.6; font-size: 16px;">
                We're excited to share an update on your website project! Your project has moved to the <strong>${phaseName}</strong> phase and is now <strong>${phaseStatus}</strong>.
              </p>
              
              <div style="background-color: #f8f9fa; padding: 25px; border-radius: 6px; margin: 30px 0; border-left: 4px solid #F58327;">
                <h3 style="margin-top: 0; color: #333; font-size: 18px;">${phaseName} Phase Progress:</h3>
                <div style="margin: 15px 0; background-color: #e0e0e0; border-radius: 10px; height: 20px; overflow: hidden;">
                  <div style="background-color: #F58327; width: ${progressPercentage}%; height: 100%; border-radius: 10px;"></div>
                </div>
                <p style="margin-bottom: 10px; font-size: 14px; text-align: center;">
                  <strong>${completedTasks} of ${totalTasks} tasks completed (${progressPercentage}%)</strong>
                </p>
                
                ${
                  tasks.length > 0
                    ? `<h4 style="margin-top: 20px; margin-bottom: 10px; font-size: 16px;">Tasks in this phase:</h4>
                  <ul style="padding-left: 20px; margin-bottom: 0;">
                    ${tasks
                      .map(
                        (task) =>
                          `<li style="margin-bottom: 5px; ${
                            task.completed
                              ? "text-decoration: line-through; color: #777;"
                              : ""
                          }">
                        ${task.name} ${task.completed ? "✓" : ""}
                      </li>`
                      )
                      .join("")}
                  </ul>`
                    : ""
                }
              </div>
              
              <p style="margin-bottom: 25px; line-height: 1.6; font-size: 16px;">
                We'll continue to keep you updated as your project progresses. If you have any questions about this phase or would like to discuss the project, please don't hesitate to contact our support team.
              </p>
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="https://app.webdash.io/dashboard" 
                  style="background-color: #F58327; color: white; padding: 14px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block; font-size: 16px; box-shadow: 0 2px 5px rgba(245, 131, 39, 0.3);">
                  View Project Details
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
  };

  try {
    const response = await mg.messages().send(data);
    console.log("Email sent successfully:", response);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email" };
  }
}

/**
 * Sends a website fulfillment email to a client
 */
export async function sendWebsiteFulfilledEmail(
  email: string,
  firstName: string,
  websiteUrl: string,
  additionalNotes?: string
) {
  const data = {
    from: senderEmail,
    to: email,
    subject: "Your Website is Live! 🎉",
    text: `Hello ${firstName}, Great news! Your website is now live and can be accessed at ${websiteUrl}.`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Website is Live!</title>
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
              <h1 style="color: #F58327; margin-top: 0; margin-bottom: 20px; font-size: 24px; text-align: center;">Your Website is Live! 🎉</h1>
              
              <p style="margin-bottom: 25px; line-height: 1.6; font-size: 16px;">Hello ${firstName},</p>
              
              <p style="margin-bottom: 25px; line-height: 1.6; font-size: 16px;">
                We're thrilled to inform you that your website is now <strong>live and ready to showcase your business to the world!</strong>
              </p>
              
              <div style="background-color: #f8f9fa; padding: 25px; border-radius: 6px; margin: 30px 0; border-left: 4px solid #F58327; text-align: center;">
                <h3 style="margin-top: 0; color: #333; font-size: 18px;">Your Website URL:</h3>
                <a href="${websiteUrl}" style="font-size: 20px; color: #F58327; font-weight: bold; text-decoration: none; word-break: break-all;">
                  ${websiteUrl}
                </a>
              </div>
              
              ${
                additionalNotes
                  ? `<div style="margin-bottom: 25px;">
                  <h3 style="color: #333; font-size: 18px;">Additional Information:</h3>
                  <p style="line-height: 1.6; font-size: 16px;">${additionalNotes}</p>
                </div>`
                  : ""
              }
              
              <p style="margin-bottom: 25px; line-height: 1.6; font-size: 16px;">
                Take some time to explore your new website and make sure everything looks good. Here are a few things you might want to check:
              </p>
              
              <ul style="margin-bottom: 25px; line-height: 1.6; font-size: 16px;">
                <li>All content is accurate and up-to-date</li>
                <li>Contact forms are working properly</li>
                <li>All links and buttons function as expected</li>
                <li>The website appears correctly on mobile devices</li>
              </ul>
              
              <p style="margin-bottom: 25px; line-height: 1.6; font-size: 16px;">
                If you find anything that needs adjustment or have any questions, please don't hesitate to contact our support team. We're here to ensure your complete satisfaction.
              </p>
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="${websiteUrl}" 
                  style="background-color: #F58327; color: white; padding: 14px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block; font-size: 16px; box-shadow: 0 2px 5px rgba(245, 131, 39, 0.3);">
                  Visit Your Website
                </a>
              </div>
              
              <div style="margin-top: 40px;">
                <p style="line-height: 1.6; font-size: 16px;">Thanks for choosing WebDash,<br>The WebDash Team</p>
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
  };

  try {
    const response = await mg.messages().send(data);
    console.log("Email sent successfully:", response);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email" };
  }
}
