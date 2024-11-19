import { findByText } from "@testing-library/preact";

import { getDonationPercent, getDonationUrl } from "../options";
import { findButtons, isCheckoutPage, getDonationAmount } from "./find";

import { main } from ".";

jest.mock("../options", () => ({
  getDonationPercent: jest.fn(),
  getDonationUrl: jest.fn(),
}));
jest.mock("./find");
jest.spyOn(console, "log").mockImplementation(() => {});

describe("main", () => {
  test("logs when loaded", () => {
    main();
    expect(console.log).toHaveBeenCalledWith("alu-smile loaded");
  });
  test("attaches checkboxes to button on the checkout page", async () => {
    document.body.innerHTML = `
      <span id="submitOrderButtonId">
        <span>
          <input name="placeYourOrder1" />
          <span>
            <span>
              Place your order
            </span>
          </span>
        </span>
      </span>
    `;

    const button = document
      .getElementById("submitOrderButtonId")
      .children.item(0)
      .children.item(1)
      .children.item(0);
    jest.mocked(isCheckoutPage).mockReturnValue(true);
    jest.mocked(getDonationPercent).mockResolvedValue(0.1);
    jest.mocked(getDonationAmount).mockReturnValue(10);
    jest.mocked(getDonationUrl).mockResolvedValue("http://example.com");
    jest.mocked(findButtons).mockReturnValue([button]);
    main();
    expect(
      await findByText(document.body, /please donate \$10.00/),
    ).not.toBeNull();
  });
  test("reattaches checkboxes when button is rerendered", async () => {
    document.body.innerHTML = `
      <span id="submitOrderButtonId">
        <span>
          <input name="placeYourOrder1" />
          <span>
            <span>
              Place your order
            </span>
          </span>
        </span>
      </span>
    `;

    let button = document
      .getElementById("submitOrderButtonId")
      .children.item(0)
      .children.item(1)
      .children.item(0);
    jest.mocked(isCheckoutPage).mockReturnValue(true);
    jest.mocked(getDonationPercent).mockResolvedValue(0.1);
    jest.mocked(getDonationAmount).mockReturnValue(10);
    jest.mocked(getDonationUrl).mockResolvedValue("http://example.com");
    jest.mocked(findButtons).mockReturnValue([button]);
    main();
    expect(
      await findByText(document.body, /please donate \$10.00/),
    ).not.toBeNull();

    document.body.innerHTML = `
      <span id="submitOrderButtonId">
        <span>
          <input name="placeYourOrder2" />
          <span id="submitOrderButtonId-announce">
            <span>
              Place your order
            </span>
          </span>
        </span>
      </span>
    `;

    button = document
      .getElementById("submitOrderButtonId")
      .children.item(0)
      .children.item(1)
      .children.item(0);
    jest.mocked(findButtons).mockReturnValue([button]);
    expect(
      await findByText(document.body, /please donate \$10.00/),
    ).not.toBeNull();
  });
});
