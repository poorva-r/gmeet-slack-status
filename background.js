// Relays MEETING_STARTED / MEETING_ENDED messages from any Meet tab
// to any open Slack tab. Does not make any network requests itself.

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type !== "MEETING_STARTED" && msg.type !== "MEETING_ENDED") return;

  console.log("[MeetSlackStatus] background received:", msg.type);

  // Find every currently open tab whose URL matches *.slack.com.
  chrome.tabs.query({ url: "https://*.slack.com/*" }, (tabs) => {
    console.log(
      "[MeetSlackStatus] Slack tabs found:",
      tabs.length,
      tabs.map((t) => t.url),
    );
    if (!tabs.length) {
      console.warn("[MeetSlackStatus] No open Slack tab found — skipping.");
      return;
    }
    for (const tab of tabs) {
      chrome.tabs.sendMessage(tab.id, { type: msg.type }, () => {
        if (chrome.runtime.lastError) {
          console.warn(
            "[MeetSlackStatus] Couldn't reach Slack tab (needs a manual refresh):",
            chrome.runtime.lastError.message,
            "Tab URL:",
            tab.url,
          );
        } else {
          console.log(
            "[MeetSlackStatus] Message delivered to Slack tab",
            tab.id,
          );
        }
      });
    }
  });
});

console.log("[MeetSlackStatus] background.js loaded.");
