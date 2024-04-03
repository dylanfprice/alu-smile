import { render } from "preact";
import { signal } from "@preact/signals";

import { getDonationPercent, getDonationUrl } from "../options";

import Checkbox from "./Checkbox";
import { findButtons, isCheckoutPage, getDonationAmount } from "./find";

async function main() {
  console.log("alu-smile loaded");
  const { shouldDonate } = createState();
  if (isCheckoutPage()) {
    const donationPercent = await getDonationPercent();
    const donationAmount = getDonationAmount(donationPercent);
    const buttons = findButtons("Place your order");
    buttons.forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          if (shouldDonate.value) {
            openDonationLink(donationAmount);
          }
        },
        { capture: true },
      );
      const root = document.createElement("div");
      button.parentNode.parentNode.parentNode.appendChild(root);
      render(
        <Checkbox
          label={`Yes, please donate $${donationAmount.toFixed(
            2,
          )} to the Amazon Labor Union`}
          checked={shouldDonate}
          onClick={() => toggleShouldDonate(shouldDonate)}
        />,
        root,
      );
    });
  }
}

async function openDonationLink(donationAmount: number) {
  const donationUrl = await getDonationUrl();
  const donationLink = `${donationUrl}${donationAmount.toFixed(2)}`;
  window.open(donationLink, "_blank");
}

function createState() {
  const shouldDonate = signal(true);
  return { shouldDonate };
}

function toggleShouldDonate(shouldDonate) {
  shouldDonate.value = !shouldDonate.value;
}

export { main };
