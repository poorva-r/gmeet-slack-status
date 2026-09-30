# GMeet Slack Status

A Chrome extension that automatically syncs Slack status with Google Meet call status.

### How it works

* **`content-meet.js`** - Runs on Google Meet and watches for the Leave Call button. When the call starts or ends, it sends a message.
* **`background.js`** - Receives the message and forwards it to the open Slack tab.
* **`content-slack.js`** - Runs on Slack and updates the status by interacting with the Slack UI.

### Flow

```text
Google Meet
     ↓
content-meet.js
     ↓
background.js
     ↓
content-slack.js
     ↓
Slack status
```

The extension uses Chrome's internal messaging and DOM interactions. It does not use any external server, API, or AI.

### Installation

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select this project folder
5. Open/refresh your Google Meet and Slack tabs

After making changes to the content scripts, reload the extension and refresh the respective tabs.
