// Runs only on meet.google.com
// Detects whether you're actively in a call by checking for the
// "Leave call" button, which only exists while you're in a meeting.
// Sends a message to background.js whenever that state changes.

(function () {
  let inMeeting = false;

  function checkMeetingState() {
    const leaveBtn =
      document.querySelector('button[aria-label*="Leave call" i]') ||
      document.querySelector('button[aria-label*="leave the call" i]');

    const nowInMeeting = !!leaveBtn;

    if (nowInMeeting !== inMeeting) {
      inMeeting = nowInMeeting;
      const type = nowInMeeting ? "MEETING_STARTED" : "MEETING_ENDED";
      console.log("[MeetSlackStatus] Meet state changed →", type);
      chrome.runtime.sendMessage({ type });
    }
  }

  const observer = new MutationObserver(checkMeetingState);
  observer.observe(document.body, { childList: true, subtree: true });
  setInterval(checkMeetingState, 3000);
  checkMeetingState();

  console.log("[MeetSlackStatus] content-meet.js loaded and watching.");
})();
