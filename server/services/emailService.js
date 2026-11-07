import nodemailer from 'nodemailer';

// Official Business Email constants
export const OFFICIAL_BUSINESS_EMAIL = 'rywebsphere@gmail.com';
export const OFFICIAL_SENDER_NAME = 'RY WebSphere';
export const OFFICIAL_SENDER_LINE = `"${OFFICIAL_SENDER_NAME}" <${OFFICIAL_BUSINESS_EMAIL}>`;

/**
 * Creates and configures the Nodemailer transporter for Gmail SMTP
 */
const getTransporter = () => {
  const emailUser = process.env.EMAIL_USER || OFFICIAL_BUSINESS_EMAIL;
  const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : null;

  if (!emailPass) {
    return null; // Signals simulation / development mode without active App Password
  }

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

/**
 * Base email wrapper providing luxury modern branding for RY WebSphere
 */
export const renderBrandedEmail = ({ preheader, title, badge, contentHtml, ctaText, ctaUrl }) => {
  const currentYear = new Date().getFullYear();
  const brandName = 'RY WebSphere';
  const tagline = 'Digital Engineering & Premium Web Development';
  const ownerName = 'Ranjan Yadav';
  const officialPhone = '+91 90264 02646';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || brandName}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #080b11;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e2e8f0;
      line-height: 1.6;
    }
    .email-container {
      max-width: 620px;
      margin: 30px auto;
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }
    .email-header {
      background: linear-gradient(180deg, #131d33 0%, #0f172a 100%);
      padding: 32px 30px 24px;
      text-align: center;
      border-bottom: 1px solid #1e293b;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.02em;
      margin: 0 0 4px;
    }
    .brand-title span {
      color: #06b6d4;
    }
    .brand-sub {
      font-size: 13px;
      color: #94a3b8;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 600;
    }
    .official-badge {
      display: inline-block;
      margin-top: 12px;
      padding: 4px 12px;
      border-radius: 999px;
      background-color: rgba(6, 182, 212, 0.12);
      border: 1px solid rgba(6, 182, 212, 0.3);
      color: #38bdf8;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.04em;
    }
    .email-body {
      padding: 32px 30px;
    }
    .card-box {
      background-color: #172033;
      border: 1px solid #25334c;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }
    .code-box {
      background: #042f2e;
      border: 2px dashed #0d9488;
      border-radius: 12px;
      padding: 18px 24px;
      text-align: center;
      margin: 24px 0;
    }
    .code-number {
      font-family: 'JetBrains Mono', Consolas, Monaco, monospace;
      font-size: 32px;
      font-weight: 800;
      letter-spacing: 6px;
      color: #5eead4;
      margin: 0;
    }
    .btn-action {
      display: inline-block;
      background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 15px;
      text-align: center;
      margin: 20px 0 10px;
      box-shadow: 0 4px 14px rgba(6, 182, 212, 0.3);
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 14px;
    }
    .details-table td {
      padding: 10px 12px;
      border-bottom: 1px solid #25334c;
    }
    .details-label {
      color: #94a3b8;
      width: 35%;
      font-weight: 500;
    }
    .details-value {
      color: #f1f5f9;
      font-weight: 600;
    }
    .progress-bar-container {
      background-color: #25334c;
      border-radius: 999px;
      height: 10px;
      width: 100%;
      overflow: hidden;
      margin: 10px 0;
    }
    .progress-bar-fill {
      background: linear-gradient(90deg, #0d9488 0%, #06b6d4 100%);
      height: 100%;
      border-radius: 999px;
    }
    .email-footer {
      background: #090e1a;
      border-top: 1px solid #1e293b;
      padding: 24px 30px;
      font-size: 12px;
      color: #64748b;
      text-align: center;
      line-height: 1.7;
    }
    .email-footer a {
      color: #38bdf8;
      text-decoration: none;
    }
    .footer-divider {
      height: 1px;
      background-color: #1e293b;
      margin: 16px 0;
    }
  </style>
</head>
<body>
  ${preheader ? `<div style="display:none;font-size:1px;color:#080b11;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</div>` : ''}

  <div class="email-container">
    <!-- Header -->
    <div class="email-header">
      <div class="brand-title">RY <span>WebSphere</span></div>
      <div class="brand-sub">${tagline}</div>
      <div class="official-badge">
        ${badge || 'Official Communication • rywebsphere@gmail.com'}
      </div>
    </div>

    <!-- Body -->
    <div class="email-body">
      ${contentHtml}

      ${ctaUrl && ctaText ? `
        <div style="text-align: center; margin-top: 24px;">
          <a href="${ctaUrl}" target="_blank" class="btn-action">${ctaText} &rarr;</a>
        </div>
      ` : ''}
    </div>

    <!-- Footer -->
    <div class="email-footer">
      <div><strong>${brandName}</strong> &bull; Founded & Directed by <strong>${ownerName}</strong></div>
      <div style="margin-top: 4px;">
        Official Business Email: <a href="mailto:${OFFICIAL_BUSINESS_EMAIL}">${OFFICIAL_BUSINESS_EMAIL}</a>
        &bull; WhatsApp: <a href="https://wa.me/${officialPhone.replace(/[^\d]/g, '')}">${officialPhone}</a>
      </div>
      <div class="footer-divider"></div>
      <div>
        This is an official automated transmission sent from <strong>${OFFICIAL_BUSINESS_EMAIL}</strong>.<br />
        If you did not initiate this request or have security questions, please reach out directly to ${OFFICIAL_BUSINESS_EMAIL}.
      </div>
      <div style="margin-top: 8px; color: #475569;">
        &copy; ${currentYear} RY WebSphere. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
};

/**
 * Core sendMail function
 */
export const sendEmail = async ({ to, subject, html, text, replyTo }) => {
  const fromAddress = process.env.EMAIL_FROM || OFFICIAL_SENDER_LINE;
  const targetEmail = Array.isArray(to) ? to.join(', ') : to;

  const transporter = getTransporter();

  if (!transporter) {
    console.log('\n============================================================');
    console.log(' [EMAIL SERVICE - SIMULATION MODE]');
    console.log(' Sender (From):', fromAddress);
    console.log(' Recipient (To):', targetEmail);
    console.log(' Subject:', subject);
    console.log(' Note: To transmit live emails, set EMAIL_PASS in server/.env');
    console.log('============================================================\n');
    return {
      success: true,
      simulated: true,
      message: 'Email logged in simulation mode (set EMAIL_PASS to send live).',
    };
  }

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to: targetEmail,
      replyTo: replyTo || OFFICIAL_BUSINESS_EMAIL,
      subject,
      text: text || 'Please view this email in an HTML-compatible email client.',
      html,
    });

    console.log(`[Email Service] Live email successfully sent from ${OFFICIAL_BUSINESS_EMAIL} to ${targetEmail} | Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[Email Service] Failed to send email to ${targetEmail}:`, err.message);
    throw err;
  }
};

/* ==========================================================================
   CATEGORY 1: ACCOUNT & AUTHENTICATION EMAILS
   ========================================================================== */

/**
 * 1. Email Verification OTP
 */
export const sendVerificationOtpEmail = async ({ to, name, otp, expiresInMinutes = 10 }) => {
  const subject = `Your RY WebSphere Verification Code: ${otp}`;
  const html = renderBrandedEmail({
    preheader: `Your verification code is ${otp}. Valid for ${expiresInMinutes} minutes.`,
    badge: 'Email Verification',
    contentHtml: `
      <h2 style="color: #ffffff; margin-top: 0; font-size: 20px;">Verify Your Email Address</h2>
      <p style="color: #cbd5e1; font-size: 15px;">
        Hello <strong>${name || 'Valued User'}</strong>,
      </p>
      <p style="color: #94a3b8; font-size: 14px;">
        Please use the one-time verification code below to verify your email address on the RY WebSphere portal.
      </p>

      <div class="code-box">
        <div style="font-size: 12px; color: #5eead4; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; font-weight: 700;">
          One-Time Verification Code
        </div>
        <div class="code-number">${otp}</div>
        <div style="font-size: 12px; color: #94a3b8; margin-top: 6px;">
          Expires in ${expiresInMinutes} minutes &bull; Do not share this code with anyone
        </div>
      </div>

      <p style="color: #64748b; font-size: 13px;">
        If you did not request this verification code, please ignore this email or contact <a href="mailto:${OFFICIAL_BUSINESS_EMAIL}" style="color:#38bdf8;">${OFFICIAL_BUSINESS_EMAIL}</a> immediately.
      </p>
    `,
  });

  return sendEmail({
    to,
    subject,
    html,
    text: `Your RY WebSphere verification code is ${otp}. Valid for ${expiresInMinutes} minutes. Sent from ${OFFICIAL_BUSINESS_EMAIL}.`,
  });
};

/**
 * 2. Login OTP
 */
export const sendLoginOtpEmail = async ({ to, name, otp, expiresInMinutes = 5 }) => {
  const subject = `Your RY WebSphere Login Code: ${otp}`;
  const html = renderBrandedEmail({
    preheader: `Login security OTP: ${otp}. Valid for ${expiresInMinutes} minutes.`,
    badge: 'Security Authentication',
    contentHtml: `
      <h2 style="color: #ffffff; margin-top: 0; font-size: 20px;">Two-Factor Login Authentication</h2>
      <p style="color: #cbd5e1; font-size: 15px;">
        Hello <strong>${name || 'Team Member'}</strong>,
      </p>
      <p style="color: #94a3b8; font-size: 14px;">
        A sign-in attempt was initiated for your account. Enter the verification code below to complete your login securely:
      </p>

      <div class="code-box">
        <div style="font-size: 12px; color: #5eead4; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; font-weight: 700;">
          One-Time Login Code
        </div>
        <div class="code-number">${otp}</div>
        <div style="font-size: 12px; color: #94a3b8; margin-top: 6px;">
          Valid for ${expiresInMinutes} minutes &bull; Keep confidential
        </div>
      </div>

      <div class="card-box" style="margin-top: 15px;">
        <div style="font-size: 13px; color: #cbd5e1;">
          <strong>Security Notice:</strong> RY WebSphere staff will never ask for this code. If you did not attempt this login, your credentials may be compromised. Please notify <a href="mailto:${OFFICIAL_BUSINESS_EMAIL}" style="color:#38bdf8;">${OFFICIAL_BUSINESS_EMAIL}</a> immediately.
        </div>
      </div>
    `,
  });

  return sendEmail({
    to,
    subject,
    html,
    text: `Your RY WebSphere login authentication code is ${otp}. Valid for ${expiresInMinutes} minutes.`,
  });
};

/**
 * 3. Password Reset / Account Recovery OTP Email
 */
export const sendPasswordResetOtpEmail = async ({ to, name, otp, expiresInMinutes = 15 }) => {
  const subject = `Password Reset Request — RY WebSphere Account Recovery [${otp}]`;
  const html = renderBrandedEmail({
    preheader: `Password reset code: ${otp}. Valid for ${expiresInMinutes} minutes.`,
    badge: 'Account Recovery',
    contentHtml: `
      <h2 style="color: #ffffff; margin-top: 0; font-size: 20px;">Password Reset Request</h2>
      <p style="color: #cbd5e1; font-size: 15px;">
        Hello <strong>${name || 'User'}</strong>,
      </p>
      <p style="color: #94a3b8; font-size: 14px;">
        We received a request to reset the password for your RY WebSphere account associated with <strong>${to}</strong>.
      </p>

      <div class="code-box">
        <div style="font-size: 12px; color: #5eead4; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; font-weight: 700;">
          Password Reset OTP
        </div>
        <div class="code-number">${otp}</div>
        <div style="font-size: 12px; color: #94a3b8; margin-top: 6px;">
          Valid for ${expiresInMinutes} minutes &bull; Use on the password reset screen
        </div>
      </div>

      <div class="card-box">
        <div style="font-size: 13px; color: #94a3b8; line-height: 1.6;">
          <strong>Didn't request this?</strong><br />
          If you did not request a password reset, no action is needed — your account remains completely secure. However, we recommend reviewing your account security if you suspect unauthorized activity.
        </div>
      </div>
    `,
  });

  return sendEmail({
    to,
    subject,
    html,
    text: `Your RY WebSphere password reset code is ${otp}. Valid for ${expiresInMinutes} minutes. Sent from ${OFFICIAL_BUSINESS_EMAIL}.`,
  });
};

/**
 * 4. Password Reset Success & Security Notification
 */
export const sendPasswordResetSuccessEmail = async ({ to, name }) => {
  const subject = `Security Alert: Your RY WebSphere Password Was Successfully Changed`;
  const html = renderBrandedEmail({
    badge: 'Security Notification',
    contentHtml: `
      <h2 style="color: #ffffff; margin-top: 0; font-size: 20px;">Password Successfully Updated</h2>
      <p style="color: #cbd5e1; font-size: 15px;">
        Hello <strong>${name || 'User'}</strong>,
      </p>
      <p style="color: #94a3b8; font-size: 14px;">
        The password for your RY WebSphere account (<strong>${to}</strong>) was changed on <strong>${new Date().toUTCString()}</strong>.
      </p>

      <div class="card-box" style="border-left: 4px solid #10b981;">
        <div style="color: #10b981; font-weight: 700; margin-bottom: 4px;">Security Confirmation</div>
        <div style="color: #cbd5e1; font-size: 13px;">
          Your account is secured with the new password. All active sessions have been updated.
        </div>
      </div>

      <p style="color: #ef4444; font-size: 13px;">
        <strong>Important:</strong> If you did NOT make this change, please contact agency director Ranjan Yadav at <a href="mailto:${OFFICIAL_BUSINESS_EMAIL}" style="color:#38bdf8;">${OFFICIAL_BUSINESS_EMAIL}</a> immediately.
      </p>
    `,
  });

  return sendEmail({ to, subject, html });
};

/**
 * 5. Staff Access Requested (Applicant Confirmation)
 */
export const sendStaffAccessRequestedEmail = async ({ to, name, title }) => {
  const subject = `Staff Access Request Received — RY WebSphere`;
  const html = renderBrandedEmail({
    badge: 'Staff Access Application',
    contentHtml: `
      <h2 style="color: #ffffff; margin-top: 0; font-size: 20px;">Access Request Received</h2>
      <p style="color: #cbd5e1; font-size: 15px;">
        Hello <strong>${name}</strong>,
      </p>
      <p style="color: #94a3b8; font-size: 14px;">
        Thank you for submitting your staff access request for the position of <strong>${title || 'Staff Specialist'}</strong> at <strong>RY WebSphere</strong>.
      </p>

      <div class="card-box">
        <table class="details-table">
          <tr>
            <td class="details-label">Applicant:</td>
            <td class="details-value">${name}</td>
          </tr>
          <tr>
            <td class="details-label">Registered Email:</td>
            <td class="details-value">${to}</td>
          </tr>
          <tr>
            <td class="details-label">Requested Role:</td>
            <td class="details-value">${title || 'Staff Specialist'}</td>
          </tr>
          <tr>
            <td class="details-label">Status:</td>
            <td class="details-value" style="color: #f59e0b;">Pending Owner Review</td>
          </tr>
        </table>
      </div>

      <p style="color: #94a3b8; font-size: 14px;">
        Agency founder <strong>Ranjan Yadav</strong> will review your request. As soon as your account is approved, you will receive an official activation email sent from <strong>${OFFICIAL_BUSINESS_EMAIL}</strong>.
      </p>
    `,
  });

  return sendEmail({ to, subject, html });
};

/**
 * 6. Staff Access Approved Email
 */
export const sendStaffAccessApprovedEmail = async ({ to, name, title, loginUrl }) => {
  const subject = `Welcome to the Team! Your RY WebSphere Staff Access is Approved`;
  const portalUrl = loginUrl || 'http://localhost:5173/admin/login';

  const html = renderBrandedEmail({
    badge: 'Account Approved & Activated',
    title: 'Staff Access Approved',
    contentHtml: `
      <h2 style="color: #ffffff; margin-top: 0; font-size: 20px;">Welcome to RY WebSphere!</h2>
      <p style="color: #cbd5e1; font-size: 15px;">
        Hello <strong>${name}</strong>,
      </p>
      <p style="color: #94a3b8; font-size: 14px;">
        Great news! Your staff account has been approved and activated by agency owner <strong>Ranjan Yadav</strong>. You now have official access to the RY WebSphere Staff & CRM Dashboard.
      </p>

      <div class="card-box" style="border-left: 4px solid #06b6d4;">
        <table class="details-table">
          <tr>
            <td class="details-label">Team Member:</td>
            <td class="details-value">${name}</td>
          </tr>
          <tr>
            <td class="details-label">Assigned Title:</td>
            <td class="details-value">${title || 'Staff Member'}</td>
          </tr>
          <tr>
            <td class="details-label">Login Email:</td>
            <td class="details-value">${to}</td>
          </tr>
          <tr>
            <td class="details-label">Account Status:</td>
            <td class="details-value" style="color: #10b981;">Active & Approved</td>
          </tr>
        </table>
      </div>

      <p style="color: #cbd5e1; font-size: 14px;">
        Click below to access the staff gateway using your email and password:
      </p>
    `,
    ctaText: 'Sign In to Staff Dashboard',
    ctaUrl: portalUrl,
  });

  return sendEmail({ to, subject, html });
};

/* ==========================================================================
   CATEGORY 2: CLIENT SERVICE REQUESTS & TRACKING NOTIFICATIONS
   ========================================================================== */

/**
 * 7. New Service Request / Consultation Confirmation to Client
 */
export const sendServiceRequestConfirmationEmail = async ({ to, enquiry, clientUrl = 'http://localhost:5173' }) => {
  const trackingCode = enquiry.trackingCode || `RY-${(enquiry._id || '').toString().slice(-5).toUpperCase()}`;
  const trackUrl = `${clientUrl}/track/${trackingCode}`;
  const subject = `Service Request Received [Tracking Code: ${trackingCode}] — RY WebSphere`;

  const html = renderBrandedEmail({
    badge: `Tracking Code: ${trackingCode}`,
    title: `Service Request Received`,
    contentHtml: `
      <h2 style="color: #ffffff; margin-top: 0; font-size: 22px;">Thank You For Choosing RY WebSphere!</h2>
      <p style="color: #cbd5e1; font-size: 15px;">
        Hello <strong>${enquiry.fullName}</strong>,
      </p>
      <p style="color: #94a3b8; font-size: 14px;">
        We have received your service request for <strong>${enquiry.businessName}</strong>. Our engineering and digital consulting team is reviewing your project requirements.
      </p>

      <div class="code-box">
        <div style="font-size: 12px; color: #5eead4; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; font-weight: 700;">
          Your Official Tracking Code
        </div>
        <div class="code-number">${trackingCode}</div>
        <div style="font-size: 12px; color: #94a3b8; margin-top: 6px;">
          Use this code to check your live project milestones anytime
        </div>
      </div>

      <div class="card-box">
        <div style="color: #38bdf8; font-weight: 700; font-size: 14px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em;">
          Project Details Summary
        </div>
        <table class="details-table">
          <tr>
            <td class="details-label">Business Name:</td>
            <td class="details-value">${enquiry.businessName}</td>
          </tr>
          <tr>
            <td class="details-label">Required Service:</td>
            <td class="details-value">${enquiry.requiredService}</td>
          </tr>
          <tr>
            <td class="details-label">Selected Package:</td>
            <td class="details-value">${enquiry.selectedPackage || 'Custom Scope'}</td>
          </tr>
          <tr>
            <td class="details-label">Estimated Budget:</td>
            <td class="details-value">${enquiry.budget || 'Flexible / Discussion'}</td>
          </tr>
          <tr>
            <td class="details-label">Initial Phase:</td>
            <td class="details-value" style="color: #06b6d4;">${enquiry.projectPhase || 'Discovery & Planning'}</td>
          </tr>
          <tr>
            <td class="details-label">Preferred Contact:</td>
            <td class="details-value">${enquiry.preferredContactMethod || 'WhatsApp'}</td>
          </tr>
        </table>
      </div>

      <div style="color: #cbd5e1; font-size: 14px; margin: 20px 0;">
        <strong>What Happens Next?</strong>
        <ol style="color: #94a3b8; padding-left: 20px; margin-top: 8px; line-height: 1.7;">
          <li>Founder <strong>Ranjan Yadav</strong> or a dedicated lead engineer will review your requirements.</li>
          <li>We will contact you via your preferred method (${enquiry.preferredContactMethod || 'WhatsApp'}) within <strong>2 to 4 business hours</strong>.</li>
          <li>You can follow real-time progress on our website using your tracking code.</li>
        </ol>
      </div>
    `,
    ctaText: 'Track Your Project Live',
    ctaUrl: trackUrl,
  });

  return sendEmail({
    to,
    subject,
    html,
    text: `Thank you ${enquiry.fullName}! Your service request for ${enquiry.requiredService} has been received. Your tracking code is: ${trackingCode}. Track live at: ${trackUrl}`,
  });
};

/**
 * 8. Re-send Tracking Number Email
 */
export const sendTrackingNumberEmail = async ({ to, enquiry, clientUrl = 'http://localhost:5173' }) => {
  const trackingCode = enquiry.trackingCode || `RY-${(enquiry._id || '').toString().slice(-5).toUpperCase()}`;
  const trackUrl = `${clientUrl}/track/${trackingCode}`;
  const subject = `Your Project Tracking Number: ${trackingCode} — RY WebSphere`;

  const html = renderBrandedEmail({
    badge: 'Project Reference Code',
    contentHtml: `
      <h2 style="color: #ffffff; margin-top: 0; font-size: 20px;">Your Project Tracking Number</h2>
      <p style="color: #cbd5e1; font-size: 15px;">
        Hello <strong>${enquiry.fullName}</strong>,
      </p>
      <p style="color: #94a3b8; font-size: 14px;">
        Here is the reference tracking number for your project (<strong>${enquiry.businessName} &bull; ${enquiry.requiredService}</strong>):
      </p>

      <div class="code-box">
        <div class="code-number">${trackingCode}</div>
        <div style="font-size: 12px; color: #94a3b8; margin-top: 6px;">
          Live Client Portal Access Code
        </div>
      </div>

      <p style="color: #cbd5e1; font-size: 14px;">
        You can check the live progress, active milestones, and development stage at any time by clicking the button below:
      </p>
    `,
    ctaText: 'View Live Project Tracker',
    ctaUrl: trackUrl,
  });

  return sendEmail({ to, subject, html });
};

/**
 * 9. Project Status & Progress Update Email
 */
export const sendProjectStatusUpdateEmail = async ({ to, enquiry, clientUrl = 'http://localhost:5173' }) => {
  const trackingCode = enquiry.trackingCode || `RY-${(enquiry._id || '').toString().slice(-5).toUpperCase()}`;
  const trackUrl = `${clientUrl}/track/${trackingCode}`;
  const progressPercent = enquiry.projectProgressPercent || 25;
  const subject = `Project Update: ${enquiry.requiredService} [${trackingCode}] — RY WebSphere`;

  const html = renderBrandedEmail({
    badge: `Progress: ${progressPercent}%`,
    title: 'Project Status Update',
    contentHtml: `
      <h2 style="color: #ffffff; margin-top: 0; font-size: 20px;">Milestone Progress Update</h2>
      <p style="color: #cbd5e1; font-size: 15px;">
        Hello <strong>${enquiry.fullName}</strong>,
      </p>
      <p style="color: #94a3b8; font-size: 14px;">
        We have an update regarding your project <strong>${enquiry.businessName} &bull; ${enquiry.requiredService}</strong>.
      </p>

      <div class="card-box">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="color: #94a3b8; font-size: 13px; font-weight: 600;">Overall Progress:</span>
          <span style="color: #06b6d4; font-size: 14px; font-weight: 800;">${progressPercent}%</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
        </div>

        <table class="details-table" style="margin-top: 15px;">
          <tr>
            <td class="details-label">Current Phase:</td>
            <td class="details-value" style="color: #38bdf8;">${enquiry.projectPhase || 'In Progress'}</td>
          </tr>
          <tr>
            <td class="details-label">Project Status:</td>
            <td class="details-value">${enquiry.status || 'Active'}</td>
          </tr>
          ${enquiry.estimatedCompletionDate ? `
            <tr>
              <td class="details-label">Est. Completion:</td>
              <td class="details-value">${new Date(enquiry.estimatedCompletionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
            </tr>
          ` : ''}
        </table>

        ${enquiry.projectStatusNote ? `
          <div style="margin-top: 12px; padding: 12px; background: #0f172a; border-radius: 8px; border-left: 3px solid #06b6d4;">
            <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Latest Note From Engineering:</div>
            <div style="color: #e2e8f0; font-size: 13px; font-style: italic;">"${enquiry.projectStatusNote}"</div>
          </div>
        ` : ''}
      </div>

      <p style="color: #cbd5e1; font-size: 14px;">
        Visit your live tracker for full details and milestone history:
      </p>
    `,
    ctaText: 'Check Live Milestones',
    ctaUrl: trackUrl,
  });

  return sendEmail({ to, subject, html });
};

/**
 * 10. Project Completed & Deployed Confirmation Email
 */
export const sendProjectCompletedEmail = async ({ to, enquiry, clientUrl = 'http://localhost:5173' }) => {
  const trackingCode = enquiry.trackingCode || `RY-${(enquiry._id || '').toString().slice(-5).toUpperCase()}`;
  const trackUrl = `${clientUrl}/track/${trackingCode}`;
  const subject = `🎉 Project Completed & Delivered! [${trackingCode}] — RY WebSphere`;

  const html = renderBrandedEmail({
    badge: 'Milestone: 100% Completed',
    title: 'Project Delivered',
    contentHtml: `
      <h2 style="color: #10b981; margin-top: 0; font-size: 22px;">Congratulations, Your Project is Complete!</h2>
      <p style="color: #cbd5e1; font-size: 15px;">
        Hello <strong>${enquiry.fullName}</strong>,
      </p>
      <p style="color: #94a3b8; font-size: 14px;">
        We are thrilled to inform you that your project <strong>${enquiry.businessName} &bull; ${enquiry.requiredService}</strong> has been successfully built, tested, and completed!
      </p>

      <div class="card-box" style="border-left: 4px solid #10b981;">
        <table class="details-table">
          <tr>
            <td class="details-label">Project:</td>
            <td class="details-value">${enquiry.requiredService}</td>
          </tr>
          <tr>
            <td class="details-label">Client:</td>
            <td class="details-value">${enquiry.businessName} (${enquiry.fullName})</td>
          </tr>
          <tr>
            <td class="details-label">Tracking Ref:</td>
            <td class="details-value">${trackingCode}</td>
          </tr>
          <tr>
            <td class="details-label">Final Status:</td>
            <td class="details-value" style="color: #10b981; font-weight: 800;">Completed & Handed Over</td>
          </tr>
        </table>

        ${enquiry.projectStatusNote ? `
          <div style="margin-top: 10px; color: #cbd5e1; font-size: 13px;">
            <strong>Handover Note:</strong> ${enquiry.projectStatusNote}
          </div>
        ` : ''}
      </div>

      <p style="color: #94a3b8; font-size: 14px;">
        Thank you for trusting <strong>RY WebSphere</strong> with your digital engineering. Our warranty and post-deployment support are in effect. Please let us know if you need any adjustments or future updates.
      </p>
    `,
    ctaText: 'Review Final Project Report',
    ctaUrl: trackUrl,
  });

  return sendEmail({ to, subject, html });
};

/**
 * 11. Project Cancelled / Archived Notification
 */
export const sendProjectCancelledEmail = async ({ to, enquiry, reason, clientUrl = 'http://localhost:5173' }) => {
  const trackingCode = enquiry.trackingCode || `RY-${(enquiry._id || '').toString().slice(-5).toUpperCase()}`;
  const subject = `Service Request Status Update [${trackingCode}] — RY WebSphere`;

  const html = renderBrandedEmail({
    badge: 'Status: Closed / Cancelled',
    contentHtml: `
      <h2 style="color: #ffffff; margin-top: 0; font-size: 20px;">Service Request Notice</h2>
      <p style="color: #cbd5e1; font-size: 15px;">
        Hello <strong>${enquiry.fullName}</strong>,
      </p>
      <p style="color: #94a3b8; font-size: 14px;">
        This email is to notify you that the service request for <strong>${enquiry.businessName} &bull; ${enquiry.requiredService}</strong> [${trackingCode}] has been marked as closed/cancelled.
      </p>

      ${reason || enquiry.projectStatusNote ? `
        <div class="card-box">
          <div style="color: #94a3b8; font-size: 13px;">
            <strong>Note / Reason:</strong><br />
            ${reason || enquiry.projectStatusNote}
          </div>
        </div>
      ` : ''}

      <p style="color: #94a3b8; font-size: 14px;">
        If you wish to reopen this project or start a new consultation, please reach out anytime via <a href="mailto:${OFFICIAL_BUSINESS_EMAIL}" style="color:#38bdf8;">${OFFICIAL_BUSINESS_EMAIL}</a> or WhatsApp at <strong>+91 90264 02646</strong>.
      </p>
    `,
  });

  return sendEmail({ to, subject, html });
};

/**
 * 12. Custom Follow-up / Direct Client Email
 */
export const sendCustomClientEmail = async ({ to, name, subject, message, trackingCode, clientUrl = 'http://localhost:5173' }) => {
  const trackUrl = trackingCode ? `${clientUrl}/track/${trackingCode}` : null;

  const html = renderBrandedEmail({
    badge: trackingCode ? `Ref: ${trackingCode}` : 'Client Communication',
    contentHtml: `
      <h2 style="color: #ffffff; margin-top: 0; font-size: 20px;">Message from RY WebSphere</h2>
      <p style="color: #cbd5e1; font-size: 15px;">
        Hello <strong>${name || 'Valued Client'}</strong>,
      </p>
      <div class="card-box" style="color: #e2e8f0; font-size: 14px; white-space: pre-wrap; line-height: 1.7;">${message}</div>
    `,
    ctaText: trackUrl ? 'View Project Tracker' : null,
    ctaUrl: trackUrl,
  });

  return sendEmail({ to, subject, html, text: message });
};

/* ==========================================================================
   CATEGORY 4: ADMIN NOTIFICATIONS (Sent to rywebsphere@gmail.com)
   ========================================================================== */

/**
 * 13. Admin Alert: New Service Request / Consultation Enquiry
 */
export const sendAdminNewEnquiryAlert = async ({ enquiry, clientUrl = 'http://localhost:5173' }) => {
  const adminTarget = process.env.ADMIN_NOTIFICATION_EMAIL || OFFICIAL_BUSINESS_EMAIL;
  const trackingCode = enquiry.trackingCode || `RY-${(enquiry._id || '').toString().slice(-5).toUpperCase()}`;
  const subject = `🔔 New Service Request [${trackingCode}]: ${enquiry.businessName} — ${enquiry.requiredService}`;

  const html = renderBrandedEmail({
    badge: 'Admin Alert • New Client Lead',
    title: 'New Service Request',
    contentHtml: `
      <h2 style="color: #38bdf8; margin-top: 0; font-size: 20px;">New Consultation Request Received!</h2>
      <p style="color: #cbd5e1; font-size: 14px;">
        A new client enquiry has just been submitted on the RY WebSphere website.
      </p>

      <div class="card-box">
        <table class="details-table">
          <tr>
            <td class="details-label">Client Name:</td>
            <td class="details-value">${enquiry.fullName}</td>
          </tr>
          <tr>
            <td class="details-label">Business:</td>
            <td class="details-value">${enquiry.businessName} (${enquiry.businessCategory || 'General'})</td>
          </tr>
          <tr>
            <td class="details-label">Email:</td>
            <td class="details-value"><a href="mailto:${enquiry.email}" style="color:#38bdf8;">${enquiry.email}</a></td>
          </tr>
          <tr>
            <td class="details-label">Phone:</td>
            <td class="details-value"><a href="tel:${enquiry.phone}" style="color:#38bdf8;">${enquiry.phone}</a></td>
          </tr>
          <tr>
            <td class="details-label">Service:</td>
            <td class="details-value" style="color: #06b6d4;">${enquiry.requiredService}</td>
          </tr>
          <tr>
            <td class="details-label">Package:</td>
            <td class="details-value">${enquiry.selectedPackage || 'Custom'}</td>
          </tr>
          <tr>
            <td class="details-label">Budget:</td>
            <td class="details-value">${enquiry.budget || 'Scope Based'}</td>
          </tr>
          <tr>
            <td class="details-label">Tracking Code:</td>
            <td class="details-value" style="color: #5eead4; font-family: monospace;">${trackingCode}</td>
          </tr>
          <tr>
            <td class="details-label">Preferred Contact:</td>
            <td class="details-value">${enquiry.preferredContactMethod || 'WhatsApp'}</td>
          </tr>
        </table>

        <div style="margin-top: 14px; padding: 12px; background: #090e1a; border-radius: 8px;">
          <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Project Description:</div>
          <div style="color: #f1f5f9; font-size: 13px; white-space: pre-wrap;">${enquiry.projectDescription}</div>
        </div>
      </div>
    `,
    ctaText: 'Open Admin CRM Dashboard',
    ctaUrl: `${clientUrl}/admin/enquiries`,
  });

  return sendEmail({
    to: adminTarget,
    subject,
    html,
    text: `New Service Request from ${enquiry.fullName} (${enquiry.businessName}) for ${enquiry.requiredService}. Email: ${enquiry.email}, Phone: ${enquiry.phone}, Tracking: ${trackingCode}`,
  });
};

/**
 * 14. Admin Alert: New Staff Access Application
 */
export const sendAdminNewStaffRequestAlert = async ({ staff, adminUrl = 'http://localhost:5173/admin/team' }) => {
  const adminTarget = process.env.ADMIN_NOTIFICATION_EMAIL || OFFICIAL_BUSINESS_EMAIL;
  const subject = `👥 New Staff Access Request: ${staff.name} (${staff.title || 'Specialist'})`;

  const html = renderBrandedEmail({
    badge: 'Owner Action Required',
    title: 'Staff Access Request',
    contentHtml: `
      <h2 style="color: #ffffff; margin-top: 0; font-size: 20px;">New Staff Access Application</h2>
      <p style="color: #cbd5e1; font-size: 14px;">
        An applicant has registered for staff dashboard access and is awaiting your review and approval:
      </p>

      <div class="card-box">
        <table class="details-table">
          <tr>
            <td class="details-label">Full Name:</td>
            <td class="details-value">${staff.name}</td>
          </tr>
          <tr>
            <td class="details-label">Applicant Email:</td>
            <td class="details-value"><a href="mailto:${staff.email}" style="color:#38bdf8;">${staff.email}</a></td>
          </tr>
          <tr>
            <td class="details-label">Phone:</td>
            <td class="details-value">${staff.phone || 'N/A'}</td>
          </tr>
          <tr>
            <td class="details-label">Requested Title:</td>
            <td class="details-value">${staff.title || 'Staff Specialist'}</td>
          </tr>
        </table>
      </div>

      <p style="color: #94a3b8; font-size: 13px;">
        As agency owner, only you can approve or reject this request. Click below to manage team members in your admin portal:
      </p>
    `,
    ctaText: 'Review & Approve Staff Member',
    ctaUrl: adminUrl,
  });

  return sendEmail({ to: adminTarget, subject, html });
};

/**
 * 15. Admin Alert: Security Alert
 */
export const sendAdminSecurityAlert = async ({ action, userEmail, ip, details }) => {
  const adminTarget = process.env.ADMIN_NOTIFICATION_EMAIL || OFFICIAL_BUSINESS_EMAIL;
  const subject = `⚠️ Security Notification: ${action} on RY WebSphere`;

  const html = renderBrandedEmail({
    badge: 'Portal Security Alert',
    contentHtml: `
      <h2 style="color: #ef4444; margin-top: 0; font-size: 20px;">Security Event Detected</h2>
      <p style="color: #cbd5e1; font-size: 14px;">
        An important security event occurred on the RY WebSphere system:
      </p>

      <div class="card-box" style="border-left: 4px solid #ef4444;">
        <table class="details-table">
          <tr>
            <td class="details-label">Action:</td>
            <td class="details-value" style="color: #ef4444;">${action}</td>
          </tr>
          <tr>
            <td class="details-label">Target Account:</td>
            <td class="details-value">${userEmail || 'N/A'}</td>
          </tr>
          <tr>
            <td class="details-label">IP Address:</td>
            <td class="details-value">${ip || 'Unknown'}</td>
          </tr>
          <tr>
            <td class="details-label">Timestamp:</td>
            <td class="details-value">${new Date().toUTCString()}</td>
          </tr>
        </table>

        ${details ? `
          <div style="margin-top: 10px; color: #cbd5e1; font-size: 13px;">
            <strong>Details:</strong> ${details}
          </div>
        ` : ''}
      </div>
    `,
  });

  return sendEmail({ to: adminTarget, subject, html });
};
