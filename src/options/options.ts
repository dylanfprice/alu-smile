import browser from "webextension-polyfill";

import { useStorage } from "./useStorage";

const DEFAULT_DONATION_PERCENT = 10;
const DEFAULT_DONATION_LINK = `https://secure.actblue.com/donate/alu-ont8election?express_lane=true&amount=`;

function useDonationPercent() {
  return useStorage("donationPercent", DEFAULT_DONATION_PERCENT);
}

function useDonationUrl() {
  return useStorage("donationUrl", DEFAULT_DONATION_LINK);
}

async function getDonationPercent() {
  const { donationPercent } = await browser.storage.sync.get({
    donationPercent: DEFAULT_DONATION_PERCENT,
  });
  return donationPercent / 100;
}

async function getDonationUrl() {
  const { donationUrl } = await browser.storage.sync.get({
    donationUrl: DEFAULT_DONATION_LINK,
  });
  return donationUrl;
}

export {
  useDonationPercent,
  useDonationUrl,
  getDonationPercent,
  getDonationUrl,
};
