import { findButtons, isCheckoutPage, getDonationAmount } from "./find";
import { getCheckbox } from "./checkbox";

function main() {
  console.log("alu-smile loaded");
  if (isCheckoutPage()) {
    const donationAmount = getDonationAmount(0.1);

    const buttons = findButtons("Place your order");
    buttons.forEach((button) => {
      button.addEventListener(
        "click",
        openDonationLink.bind(this, donationAmount),
        { capture: true },
      );
      button.parentNode.parentNode.parentNode.appendChild(
        getCheckbox(donationAmount, (checked) => {
          console.log("checked", checked);
        }),
      );
    });
  }
}

function openDonationLink(donationAmount: number) {
  const donationLink = `https://secure.actblue.com/donate/alu-ont8election?express_lane=true&amount=${donationAmount}`;
  window.open(donationLink, "_blank");
}

main();
