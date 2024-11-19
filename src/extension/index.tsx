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
    const observer = new MutationObserver(() => {
      console.log("mutation observer callback");
      observer.disconnect();
      main();
    });
    buttons.forEach((button) => {
      addClickListener(button, () => {
        if (shouldDonate.value) {
          openDonationLink(donationAmount);
        }
      });
      renderCheckbox(
        button,
        <Checkbox
          label={`Yes, please donate $${donationAmount.toFixed(
            2,
          )} to the Amazon Labor Union`}
          checked={shouldDonate}
          onClick={() => toggleShouldDonate(shouldDonate)}
        />,
      );
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}

function addClickListener(button, onClick) {
  button.removeEventListener("click", onClick, { capture: true });
  button.addEventListener("click", onClick, { capture: true });
}

function renderCheckbox(button, checkbox) {
  const parent: HTMLElement = button.parentNode.parentNode.parentNode;
  const existingContainers = parent.getElementsByClassName(
    "alu-smile-donation-checkbox",
  );
  for (const existingContainer of existingContainers) {
    existingContainer.remove();
  }
  const container = document.createElement("div");
  container.classList.add("alu-smile-donation-checkbox");
  parent.appendChild(container);
  render(checkbox, container);
  return container;
}

function createState() {
  const shouldDonate = signal(true);
  return { shouldDonate };
}

async function openDonationLink(donationAmount: number) {
  const donationUrl = await getDonationUrl();
  const donationLink = `${donationUrl}${donationAmount.toFixed(2)}`;
  window.open(donationLink, "_blank");
}

function toggleShouldDonate(shouldDonate) {
  shouldDonate.value = !shouldDonate.value;
}

export { main };
