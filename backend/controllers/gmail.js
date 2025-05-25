const { google } = require('googleapis');

function getOAuth2Client(user) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    `${process.env.BACKEND_URL}/api/auth/google/callback`
  );
  oauth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });
  return oauth2Client;
}

async function createGmailLabel(user, labelName) {
  const oauth2Client = getOAuth2Client(user);
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  try {
    const response = await gmail.users.labels.create({
      userId: 'me',
      requestBody: {
        name: labelName,
        labelListVisibility: 'labelShow',
        messageListVisibility: 'show',
      },
    });
    console.log(`Gmail label created: ${labelName}`);
    return response.data;
  } catch (error) {
    if (error.code === 409) {
      console.log(`Gmail label "${labelName}" already exists.`);
    } else {
      console.error(`Error creating Gmail label "${labelName}":`, error);
      throw error;
    }
  }
}

async function applyGmailLabel(user, emailId, labelName) {
  const oauth2Client = getOAuth2Client(user);
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  try {
    // Fetch label ID
    const labelsResponse = await gmail.users.labels.list({ userId: 'me' });
    const label = labelsResponse.data.labels.find((l) => l.name === labelName);

    if (!label) {
      console.log(`Label "${labelName}" does not exist. Creating it.`);
      const createdLabel = await createGmailLabel(user, labelName);
      labelId = createdLabel.id;
    } else {
      labelId = label.id;
    }

    // Apply label to the email
    await gmail.users.messages.modify({
      userId: 'me',
      id: emailId,
      requestBody: {
        addLabelIds: [labelId],
      },
    });
    console.log(`Label "${labelName}" applied to email ID: ${emailId}`);
  } catch (error) {
    console.error(`Error applying Gmail label "${labelName}" to email ID "${emailId}":`, error);
    throw error;
  }
}

async function fetchEmails(user) {
  const oauth2Client = getOAuth2Client(user);
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  const res = await gmail.users.messages.list({ userId: 'me', maxResults: 10 });
  const messages = res.data.messages || [];
  const emails = [];

  for (let msg of messages) {
    const msgRes = await gmail.users.messages.get({ userId: 'me', id: msg.id });
    const headers = msgRes.data.payload.headers;
    const subjectHeader = headers.find(h => h.name === 'Subject');
    const fromHeader = headers.find(h => h.name === 'From');
    const dateHeader = headers.find(h => h.name === 'Date');

    let body = '';
    if (msgRes.data.payload.parts) {
      const part = msgRes.data.payload.parts.find(p => p.mimeType === 'text/plain');
      if (part && part.body && part.body.data) {
        body = Buffer.from(part.body.data, 'base64').toString('utf-8');
      }
    } else if (msgRes.data.payload.body && msgRes.data.payload.body.data) {
      body = Buffer.from(msgRes.data.payload.body.data, 'base64').toString('utf-8');
    }

    emails.push({
      id: msg.id,
      threadId: msg.threadId,
      subject: subjectHeader ? subjectHeader.value : '',
      from: fromHeader ? fromHeader.value : '',
      body,
      date: dateHeader ? dateHeader.value : '',
    });
  }

  return emails;
}

async function sendEmailReply(user, email, replyBody) {
  try {
    const oauth2Client = getOAuth2Client(user);
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const message = [
      `From: ${user.email}`,
      `To: ${email.from}`,
      `Subject: Re: ${email.subject}`,
      `In-Reply-To: ${email.id}`,
      `References: ${email.id}`,
      ``,
      replyBody
    ].join('\n');

    const encodedMessage = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
    await gmail.users.messages.send({ userId: 'me', requestBody: { raw: encodedMessage } });

  } catch (error) {
    console.error('Error sending email reply:', error.message);
    throw error;
  }
}

async function forwardEmail(user, email, forwardTo) {
  try {
    const oauth2Client = getOAuth2Client(user);
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const message = [
      `From: ${user.email}`,
      `To: ${forwardTo}`,
      `Subject: Fwd: ${email.subject}`,
      ``,
      `Forwarded message:`,
      `From: ${email.from}`,
      `Subject: ${email.subject}`,
      ``,
      email.body
    ].join('\n');

    const encodedMessage = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
    await gmail.users.messages.send({ userId: 'me', requestBody: { raw: encodedMessage } });

  } catch (error) {
    console.error('Error forwarding email:', error.message);
    throw error;
  }
}

async function modifyEmailLabels(user, emailId, labelsToAdd = [], labelsToRemove = []) {
  try {
    const oauth2Client = getOAuth2Client(user);
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const response = await gmail.users.messages.modify({
      userId: 'me',
      id: emailId,
      requestBody: {
        addLabelIds: labelsToAdd,
        removeLabelIds: labelsToRemove,
      },
    });

    console.log('Email labels modified successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error modifying email labels:', error.message);
    throw error;
  }
}

async function createDraft(user, email, draftBody) {
  try {
    const oauth2Client = getOAuth2Client(user);
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Construct the raw email content with proper threading headers
    const rawMessage = [
      `From: ${user.email}`,
      `To: ${email.from}`, // Reply to the sender of the original email
      `Subject: Re: ${email.subject}`, // Ensure it's a reply
      `In-Reply-To: ${email.id}`, // Reference the original email's ID
      `References: ${email.id}`, // Maintain threading in Gmail
      ``,
      draftBody, // The draft body content
    ].join('\r\n');

    // Encode the raw message in base64url
    const rawEncodedMessage = Buffer.from(rawMessage)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    // Call Gmail's drafts.create API
    const response = await gmail.users.drafts.create({
      userId: 'me',
      requestBody: {
        message: {
          raw: rawEncodedMessage,
          threadId: email.threadId, // Ensure the draft belongs to the same thread
        },
      },
    });

    console.log('Draft created successfully in the same thread:', response.data);
    return response.data; // Return the created draft's details
  } catch (error) {
    console.error('Error creating draft in the same thread:', error.message);
    throw error;
  }
}

module.exports = { fetchEmails, sendEmailReply, forwardEmail, createDraft, modifyEmailLabels, createGmailLabel, applyGmailLabel };
