// Runs only on *.slack.com
(function () {
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function findByText(selector, text) {
    return Array.from(document.querySelectorAll(selector)).find((el) =>
      el.textContent.trim().toLowerCase().includes(text.toLowerCase()),
    );
  }

  function pressEscape() {
    const target = document.activeElement || document;
    target.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        code: "Escape",
        keyCode: 27,
        which: 27,
        bubbles: true,
        cancelable: true,
      }),
    );
  }

  async function openProfileMenu() {
    const avatarBtn =
      document.querySelector('[data-qa="user-button"]') ||
      document.querySelector('button[aria-label*="account" i]') ||
      document.querySelector('button[aria-label*="profile" i]');

    console.log("[MeetSlackStatus] avatarBtn found:", avatarBtn);
    if (!avatarBtn) {
      console.warn("[MeetSlackStatus] Couldn't find the account button.");
      return false;
    }
    avatarBtn.click();
    await sleep(400);
    return true;
  }

  async function openStatusModal() {
    const opened = await openProfileMenu();
    if (!opened) return false;

    const statusItem = findByText(
      '[role="menuitem"], div[role="button"], button',
      "status",
    );
    console.log("[MeetSlackStatus] statusItem found:", statusItem);
    if (!statusItem) {
      console.warn("[MeetSlackStatus] Couldn't find the status menu item.");
      return false;
    }
    statusItem.click();
    await sleep(400);
    return true;
  }

  async function clickSaveInDialog() {
    const saveBtn = document.querySelector(
      '[data-qa="custom_status_input_go"]',
    );
    console.log("[MeetSlackStatus] saveBtn found:", saveBtn);
    if (saveBtn) {
      saveBtn.click();
      return true;
    }
    console.warn("[MeetSlackStatus] Couldn't find the Save button.");
    return false;
  }

  async function setStatusText(text) {
    console.log("[MeetSlackStatus] setStatusText called with:", text);
    const opened = await openStatusModal();
    if (!opened) return;

    const recentMatch = Array.from(
      document.querySelectorAll('[data-qa="custom_status_text"]'),
    ).find((el) => el.textContent.trim().toLowerCase() === text.toLowerCase());
    console.log("[MeetSlackStatus] recentMatch found:", recentMatch);

    if (!recentMatch) {
      console.warn(
        `[MeetSlackStatus] "${text}" not found in recent statuses — set it manually once so it's saved there.`,
      );
      pressEscape();
      return;
    }

    const row =
      recentMatch.closest('[role="button"]') || recentMatch.parentElement;
    console.log("[MeetSlackStatus] clicking recent row:", row);
    row.click();
    await sleep(300);
    await clickSaveInDialog();
  }

  async function clearStatus() {
    console.log("[MeetSlackStatus] clearStatus called");
    const opened = await openProfileMenu();
    if (!opened) return;

    const clearBtn = document.querySelector(
      'button[aria-label="Clear status"]',
    );
    console.log("[MeetSlackStatus] clearBtn found:", clearBtn);
    if (clearBtn) {
      clearBtn.click();
      await sleep(300);~
      pressEscape();~
      await sleep(200);~
      document.body.click(); // fallback: simulate clicking outside the popup
      return;
    }

    console.warn("[MeetSlackStatus] No status currently set — closing menu.");
    pressEscape();
  }

  chrome.runtime.onMessage.addListener((msg) => {
    console.log(
      "[MeetSlackStatus] content-slack.js received message:",
      msg.type,
    );
    if (msg.type === "MEETING_STARTED") {
      setStatusText("In a meeting");
    } else if (msg.type === "MEETING_ENDED") {
      clearStatus();
    }
  });

  console.log("[MeetSlackStatus] content-slack.js loaded and listening.");
})();
