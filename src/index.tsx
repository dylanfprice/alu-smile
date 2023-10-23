import { render } from "preact";
import { findButtons, isCheckoutPage, getDonationAmount } from "./find";

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
      const root = document.createElement("div");
      button.parentNode.parentNode.parentNode.appendChild(root);
      render(<App />, root);
    });
  }
}

function openDonationLink(donationAmount: number) {
  const donationLink = `https://secure.actblue.com/donate/alu-ont8election?express_lane=true&amount=${donationAmount}`;
  window.open(donationLink, "_blank");
}

function App() {
  return <div>Hello world!</div>;
}

main();
