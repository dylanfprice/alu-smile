import { render } from "preact";
import { signal } from "@preact/signals";

import { getDonationPercent, getDonationUrl } from "../options";

import Checkbox from "./Checkbox";
import { findButtons, isCheckoutPage, getDonationAmount } from "./find";

const CONTAINER_CLASS_NAME = "alu-smile-donation-checkbox";

async function main() {
  console.log("alu-smile loaded");

  const { shouldDonate } = createState();
  const donationPercent = await getDonationPercent();
  const onClick = () => {
    if (shouldDonate.value) {
      openDonationLink(getDonationAmount(donationPercent));
    }
  };

  const renderApp = () => {
    if (isCheckoutPage()) {
      const buttons = findButtons("Place your order");
      buttons.forEach((button) => {
        removeClickListener(button, onClick);
        addClickListener(button, onClick);
        removeCheckbox(button);
        renderCheckbox(
          button,
          <Checkbox
            label={`Yes, please donate $${getDonationAmount(
              donationPercent,
            ).toFixed(2)} to the Amazon Labor Union`}
            checked={shouldDonate}
            onClick={() => toggleShouldDonate(shouldDonate)}
          />,
        );
      });
    }
  };

  renderApp();
  const disconnect = onAddedNodeRun(renderApp);
  const tearDown = () => {
    const buttons = findButtons("Place your order");
    buttons?.forEach((button) => {
      removeClickListener(button, onClick);
      removeCheckbox(button);
    });
    disconnect();
  };
  return tearDown;
}

function removeClickListener(button, onClick) {
  button.removeEventListener("click", onClick, { capture: true });
}

function addClickListener(button, onClick) {
  button.addEventListener("click", onClick, { capture: true });
}

function removeCheckbox(button) {
  const parent: HTMLElement = button.parentNode.parentNode.parentNode;
  const existingContainers =
    parent.getElementsByClassName(CONTAINER_CLASS_NAME);
  for (const existingContainer of existingContainers) {
    existingContainer.remove();
  }
}

function renderCheckbox(button, checkbox) {
  const parent: HTMLElement = button.parentNode.parentNode.parentNode;
  const container = document.createElement("div");
  container.classList.add(CONTAINER_CLASS_NAME);
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

function onAddedNodeRun(func) {
  const observer = new MutationObserver((mutationList) => {
    const record = mutationList.find((record) => record.addedNodes.length > 0);
    const nodeWasAdded = record !== undefined;
    const isAluSmileNode =
      nodeWasAdded &&
      Array.from(record.addedNodes).some((addedNode: HTMLElement) =>
        addedNode.classList?.contains(CONTAINER_CLASS_NAME),
      );
    if (nodeWasAdded && !isAluSmileNode) {
      func();
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
  return () => observer.disconnect();
}

export { main };
