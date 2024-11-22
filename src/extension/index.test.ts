import {
  fireEvent,
  findByRole,
  getByRole,
  queryByRole,
  waitFor,
} from "@testing-library/preact";

import { getDonationPercent, getDonationUrl } from "../options";
import { findButtons, isCheckoutPage, getDonationAmount } from "./find";

import { main } from ".";

jest.mock("../options", () => ({
  getDonationPercent: jest.fn(),
  getDonationUrl: jest.fn(),
}));
jest.mock("./find");
jest.spyOn(console, "log").mockImplementation(() => {});
jest.spyOn(window, "open").mockImplementation(() => window);

function buttonHtml(name = "placeYourOrder1") {
  return `
    <span id="submitOrderButtonId">
      <span>
        <input name="${name}" type="submit" />
        <span>
          <span>
            Place your order
          </span>
        </span>
      </span>
    </span>
  `;
}

describe("main", () => {
  test("logs when loaded", async () => {
    await main();
    expect(console.log).toHaveBeenCalledWith("alu-smile loaded");
  });
  test("does nothing when not checkout page", async () => {
    document.body.innerHTML = buttonHtml();

    jest.mocked(getDonationPercent).mockResolvedValue(0.1);
    jest.mocked(getDonationAmount).mockReturnValue(10);
    jest.mocked(getDonationUrl).mockResolvedValue("http://example.com");
    jest.mocked(isCheckoutPage).mockReturnValue(false);
    await main();
    expect(queryByRole(document.body, "checkbox")).toBeNull();
  });
  test("attaches checkboxes to button on the checkout page", async () => {
    document.body.innerHTML = buttonHtml();

    const button = getByRole(document.body, "button");
    jest.mocked(getDonationPercent).mockResolvedValue(0.1);
    jest.mocked(getDonationAmount).mockReturnValue(10);
    jest.mocked(getDonationUrl).mockResolvedValue("http://example.com");
    jest.mocked(isCheckoutPage).mockReturnValue(true);
    jest.mocked(findButtons).mockReturnValue([button]);
    await main();
    expect(await findByRole(document.body, "checkbox")).toHaveAccessibleName(
      /please donate \$10.00/,
    );
  });
  test("reattaches checkboxes when button is rerendered", async () => {
    document.body.innerHTML = buttonHtml();

    let button = getByRole(document.body, "button");
    jest.mocked(getDonationPercent).mockResolvedValue(0.1);
    jest.mocked(getDonationAmount).mockReturnValue(10);
    jest.mocked(getDonationUrl).mockResolvedValue("http://example.com");
    jest.mocked(isCheckoutPage).mockReturnValue(true);
    jest.mocked(findButtons).mockReturnValue([button]);
    await main();
    expect(await findByRole(document.body, "checkbox")).toHaveAccessibleName(
      /please donate \$10.00/,
    );

    document.body.innerHTML = buttonHtml("placeYourOrder2");

    button = getByRole(document.body, "button");
    jest.mocked(findButtons).mockReturnValue([button]);
    expect(await findByRole(document.body, "checkbox")).toHaveAccessibleName(
      /please donate \$10.00/,
    );
  });
  test("only donates once even after multiple renders", async () => {
    document.body.innerHTML = buttonHtml("placeYourOrder1");

    const button = getByRole(document.body, "button");
    jest.mocked(getDonationPercent).mockResolvedValue(0.1);
    jest.mocked(getDonationAmount).mockReturnValue(10);
    jest.mocked(getDonationUrl).mockResolvedValue("http://example.com");
    jest.mocked(isCheckoutPage).mockReturnValue(true);
    jest.mocked(findButtons).mockReturnValue([button]);
    await main();
    // TODO:
    // 1. Fix test as-is
    // 2. Append elements to the DOM to trigger re-renders, then test button only fires once.
    fireEvent.click(button);
    await waitFor(() => expect(window.open).toHaveBeenCalledTimes(1));
  });
});
