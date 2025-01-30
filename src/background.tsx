import browser from "webextension-polyfill";

const requiredPermissions = {
  origins: [
    "https://www.amazon.com/gp/buy/*",
    "https://www.amazon.com/checkout/*",
  ],
};

async function checkPermissions() {
  const hasPermissions =
    await browser.permissions.contains(requiredPermissions);

  if (!hasPermissions) {
    console.debug("Missing permissions");
    browser.tabs.create({
      url: "public/missing-permissions.html",
      active: true,
    });
  }
}

async function requestPermissions() {
  await browser.permissions.request(requiredPermissions);
}

browser.permissions.onRemoved.addListener(checkPermissions);
browser.action.onClicked.addListener(requestPermissions);

// Check when the extension loads
checkPermissions();
