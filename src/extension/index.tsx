import { render } from "preact";
import { signal } from "@preact/signals";

import Checkbox from "../components/Checkbox";
import { findButtons, isCheckoutPage, getDonationAmount } from "./find";

//const DONATION_LINK = `https://secure.actblue.com/donate/alu-ont8election?express_lane=true&amount=`;
const DONATION_LINK = `https://example.com/donate/alu-ont8election?express_lane=true&amount=`;

function main() {
  console.log("alu-smile loaded");
  const { shouldDonate } = createState();
  if (isCheckoutPage()) {
    const donationAmount = getDonationAmount(0.1);
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

function openDonationLink(donationAmount: number) {
  const donationLink = `${DONATION_LINK}${donationAmount.toFixed(2)}`;
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
