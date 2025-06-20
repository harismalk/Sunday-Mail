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
    const subject = (email.subject || '').trim();

    // 🔥 IGNORE any reply emails
    if (subject.toLowerCase().startsWith('re:')) {
      return { label: 'Skipped (reply)', actionsTaken: [] };
    }
    // Skip if already processed
    const alreadyProcessed = await EmailLog.findOne({ emailId: email.id, userId: user._id });
    if (alreadyProcessed) {
      console.log(`Email already processed: "${email.subject}"`);
      return { label: 'Already Processed', actionsTaken: [] };
    }

    // Load this user's active automations only
    const automations = await Automation.find({ 
      userId: user._id,
      isActive: true 
    });

    // Log how many active automations were found
    console.log(`Found ${automations.length} active automations for user ${user.email}`);
    
    if (automations.length === 0) {
      console.log(`No active automations found for user ${user.email}, skipping email processing`);
      return { label: 'No Active Automations', actionsTaken: [] };
    }

    let matched = false;
    for (let auto of automations) {
      console.log(`Checking automation "${auto.label}" (ID: ${auto._id}) for email: "${subject}"`);
      
      const subjectMatch = auto.conditions.subjectContains.some(kw =>
        email.subject.toLowerCase().includes(kw.toLowerCase())
      );
      const bodyMatch = auto.conditions.bodyContains.some(kw =>
        email.body.toLowerCase().includes(kw.toLowerCase())
      );

      if (subjectMatch || bodyMatch) {
        console.log(`Email matched label: "${auto.label}" with subject "${email.subject}"`);
        const actionsTaken = [];

        // 1. Mark Important
        if (auto.actions.markImportant) {
          await applyGmailLabel(user, email.id, 'IMPORTANT');
          actionsTaken.push('marked important');
        }

        // 2. Auto Draft
        if (auto.actions.autoDraft) {
          try {
            // Fallback: If autoDraftInstructions is empty and this is an invoice, set a default thank you instruction
            let draftInstructions = auto.actions.autoDraftInstructions || '';
            const isInvoice = (
              email.subject.toLowerCase().includes('invoice') ||
              email.subject.toLowerCase().includes('payment') ||
              email.body.toLowerCase().includes('invoice') ||
              email.body.toLowerCase().includes('payment')
            );
            if (!draftInstructions && isInvoice) {
              draftInstructions = 'draft a professional thank you reply for the invoice';
            }
            // Extract sender's name from email.from (format: 'Name <email@domain.com>')
            let senderName = '';
            if (email.from) {
              const match = email.from.match(/^(.*?)(?:\s*<.*?>)?$/);
              senderName = match && match[1] ? match[1].trim() : email.from;
            }
            const draftBody = await generateDraft(
              email.subject,
              email.body,
              draftInstructions,
              senderName
            );
            await createDraft(user, email, draftBody);
            actionsTaken.push('auto drafted');
          } catch (err) {
            console.error('Error creating draft:', err);
          }
        }

        // 3. Auto Reply
        if (auto.actions.autoReply) {
          try {
            // Extract sender's name from email.from (format: 'Name <email@domain.com>')
            let senderName = '';
            if (email.from) {
              const match = email.from.match(/^(.*?)(?:\s*<.*?>)?$/);
              senderName = match && match[1] ? match[1].trim() : email.from;
            }
            const replyBody = await generateDraft(
              email.subject,
              email.body,
              auto.actions.autoReplyInstructions || '',
              senderName
            );
            await sendEmailReply(user, email, replyBody);
            actionsTaken.push('auto replied');
          } catch (err) {
            console.error('Error sending reply:', err);
          }
        }

        // 4. Auto Forward
        if (auto.actions.autoForward && auto.actions.forwardTo) {
          try {
            await forwardEmail(user, email, auto.actions.forwardTo);
            actionsTaken.push('auto forwarded');
          } catch (err) {
            console.error('Error forwarding email:', err);
          }
        }

        // 5. Apply Gmail Label
        try {
          await applyGmailLabel(user, email.id, auto.label);
          actionsTaken.push(`label "${auto.label}" applied`);
        } catch (err) {
          console.error(`Error applying label "${auto.label}":`, err);
        }

        // 6. Text Notification
        if (auto.actions.textNotification && auto.actions.phoneNumber && twilioClient) {
          try {
            await twilioClient.messages.create({
              body: `New email labeled "${auto.label}". Subject: ${email.subject}`,
              from: process.env.TWILIO_FROM_NUMBER,
              to: auto.actions.phoneNumber,
            });
            actionsTaken.push('texted user');
          } catch (err) {
            console.error('Error sending SMS notification:', err);
          }
        }

        // 7. Log the processed email, including sender and subject
        await EmailLog.create({
          userId:      user._id,
          emailId:     email.id,
          from:        email.from,
          subject:     email.subject,
          labelApplied: auto.label,
          actionsTaken,
          processedAt: new Date(),
        });
        matched = true;
        return { label: auto.label, actionsTaken };
      }
    }

    // If no automations matched, log the email with a default entry
    if (!matched) {
      await EmailLog.create({
        userId:      user._id,
        emailId:     email.id,
        from:        email.from,
        subject:     email.subject,
        labelApplied: 'None',
        actionsTaken: ['no automations matched'],
        processedAt: new Date(),
      });
      return { label: 'None', actionsTaken: ['no automations matched'] };
    }
  } catch (error) {
    console.error('Error in categorizeAndApplyAutomations:', error);
    throw new Error('Failed to apply automations.');
  }
}

module.exports = { categorizeAndApplyAutomations };