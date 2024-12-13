const Automation = require('../models/Automation');
const EmailLog = require('../models/EmailLog');
const { generateDraft } = require('./aiDrafts');
const { createDraft, sendEmailReply, forwardEmail, applyGmailLabel } = require('./gmail');
const twilio = require('twilio');

let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

async function categorizeAndApplyAutomations(user, email) {
  try {
    // Check if the email has already been processed
    const alreadyProcessed = await EmailLog.findOne({ emailId: email.id, userId: user._id });
    if (alreadyProcessed) {
      console.log(`Email already processed: "${email.subject}"`);
      return { label: 'Already Processed', actionsTaken: [] };
    }

    const automations = await Automation.find({ userId: user._id });

    for (let auto of automations) {
      const subjectMatch = auto.conditions.subjectContains.some((kw) =>
        email.subject.toLowerCase().includes(kw.toLowerCase())
      );
      const bodyMatch = auto.conditions.bodyContains.some((kw) =>
        email.body.toLowerCase().includes(kw.toLowerCase())
      );

      if (subjectMatch || bodyMatch) {
        console.log(`Email matched label: "${auto.label}" with subject "${email.subject}"`);

        const actionsTaken = [];

        // Mark as important
        if (auto.actions.markImportant) {
          actionsTaken.push('marked important');
          await applyGmailLabel(user, email.id, 'IMPORTANT'); // Apply "Important" label
        }

        // Auto Draft
        if (auto.actions.autoDraft) {
          try {
            const draftResponse = await generateDraft(
              email.subject,
              email.body,
              auto.actions.autoDraftInstructions || ''
            );
            await createDraft(user, email, draftResponse);
            actionsTaken.push('auto drafted');
          } catch (error) {
            console.error('Error creating draft:', error);
          }
        }

        // Auto Reply
        if (auto.actions.autoReply) {
          try {
            const replyBody = await generateDraft(
              email.subject,
              email.body,
              auto.actions.autoReplyInstructions || ''
            );
            await sendEmailReply(user, email, replyBody);
            actionsTaken.push('auto replied');
          } catch (error) {
            console.error('Error sending reply:', error);
          }
        }

        // Auto Forward
        if (auto.actions.autoForward && auto.actions.forwardTo) {
          try {
            await forwardEmail(user, email, auto.actions.forwardTo);
            actionsTaken.push('auto forwarded');
          } catch (error) {
            console.error('Error forwarding email:', error);
          }
        }

        // Apply Gmail Label
        try {
          await applyGmailLabel(user, email.id, auto.label);
          actionsTaken.push(`label "${auto.label}" applied`);
        } catch (error) {
          console.error(`Error applying label "${auto.label}":`, error);
        }

        // Text Notification
        if (auto.actions.textNotification && auto.actions.phoneNumber && twilioClient) {
          try {
            await twilioClient.messages.create({
              body: `You have a new email labeled "${auto.label}". Subject: ${email.subject}`,
              from: process.env.TWILIO_FROM_NUMBER,
              to: auto.actions.phoneNumber,
            });
            actionsTaken.push('texted user');
          } catch (error) {
            console.error('Error sending SMS notification:', error);
          }
        }

        // Log the processed email
        await EmailLog.create({
          userId: user._id,
          emailId: email.id, // Unique Gmail Message ID
          labelApplied: auto.label,
          actionsTaken,
          processedAt: new Date(),
        });

        return { label: auto.label, actionsTaken };
      }
    }

    return { label: 'General', actionsTaken: [] };
  } catch (error) {
    console.error('Error in categorizeAndApplyAutomations:', error);
    throw new Error('Failed to apply automations.');
  }
}

module.exports = { categorizeAndApplyAutomations };
