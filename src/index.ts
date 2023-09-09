import {
  isCheckoutPage,
  attachListenerToButtons,
  getDonationLink,
} from "./aluSmile";

if (isCheckoutPage()) {
  attachListenerToButtons("Apply", () =>
    window.open(getDonationLink(), "_blank"),
  );
}
