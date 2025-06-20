# Natural Language Instructions for Email Automation

This feature allows users to create email automations using natural language instructions, which automatically populate action dialogs with the appropriate settings.

## How It Works

### 1. Natural Language Input
Users can describe their automation needs in plain English through the CreateLabelDialog component:

```
"Label all invoices as 'Finance' and draft a professional thank you reply"
"Mark urgent emails as important and forward them to manager@company.com"
"Auto-reply to meeting requests with my availability and send me a text notification"
```

### 2. AI Processing
The system uses OpenAI's GPT-4 to parse natural language instructions and extract:
- Automation labels and descriptions
- Email matching conditions (subject/body keywords)
- Action requirements (mark important, auto-draft, auto-reply, etc.)
- Custom instructions for each action
- Email addresses for forwarding
- Phone numbers for notifications

### 3. Automatic Action Population
The AI-generated automation rules automatically populate the ActionsDialog with:
- ✅ Enabled/disabled states for each action
- 📝 Custom instructions for drafting, replying, and forwarding
- 📧 Email addresses for forwarding
- 📱 Phone numbers for text notifications

## Supported Actions

| Action | Description | Natural Language Keywords |
|--------|-------------|---------------------------|
| Mark Important | Marks emails as important | "important", "urgent", "priority" |
| Auto Draft | Creates draft replies | "draft", "compose", "write" |
| Auto Reply | Sends automatic replies | "reply", "respond", "answer" |
| Auto Forward | Forwards emails to others | "forward", "send to", "route to" |
| Text Notification | Sends SMS notifications | "text", "SMS", "notify me" |

## Example Instructions and Generated Actions

### Example 1: Invoice Processing
**Instruction:** "Label all invoices as 'Finance' and draft a professional thank you reply"

**Generated Actions:**
- ✅ Auto Draft: true
- 📝 Auto Draft Instructions: "professional thank you reply"
- ❌ Mark Important: false
- ❌ Auto Reply: false
- ❌ Auto Forward: false
- ❌ Text Notification: false

### Example 2: Urgent Email Handling
**Instruction:** "Mark urgent emails as important and forward them to manager@company.com"

**Generated Actions:**
- ✅ Mark Important: true
- ✅ Auto Forward: true
- 📧 Forward To: "manager@company.com"
- ❌ Auto Draft: false
- ❌ Auto Reply: false
- ❌ Text Notification: false

### Example 3: Meeting Requests
**Instruction:** "Auto-reply to meeting requests with my availability and send me a text notification"

**Generated Actions:**
- ✅ Auto Reply: true
- 📝 Auto Reply Instructions: "with my availability"
- ✅ Text Notification: true
- ❌ Mark Important: false
- ❌ Auto Draft: false
- ❌ Auto Forward: false

## Implementation Details

### Backend Processing
- **Route:** `POST /api/automations/rebuild`
- **AI Model:** GPT-4 with structured prompt
- **Validation:** Ensures proper action structure and extracts missing data
- **Error Handling:** Provides detailed error messages for invalid instructions

### Frontend Components
- **CreateLabelDialog:** Enhanced with natural language input and examples
- **ActionsDialog:** Shows visual indicators for configured actions
- **NaturalLanguageDemo:** Demonstrates the feature functionality

### Key Features
- 🎯 **Smart Parsing:** Extracts email addresses and phone numbers from instructions
- 🎨 **Visual Feedback:** Shows action status with icons and badges
- 📋 **Example Instructions:** Provides clickable examples for users
- ⚡ **Real-time Preview:** Shows what actions will be configured
- 🔄 **Automatic Population:** Actions are pre-configured based on instructions

## Usage

1. Open the Create Label Dialog
2. Check "Use Natural Language Instructions"
3. Enter your automation requirements in plain English
4. Click "Save" to process the instructions
5. View the automatically configured actions in the Actions Dialog

The system will automatically:
- Create the automation with appropriate conditions
- Enable relevant actions based on your instructions
- Populate custom instructions for drafting/replying
- Extract and set email addresses and phone numbers
- Provide visual feedback on the configured actions 