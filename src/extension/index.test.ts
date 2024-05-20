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
    const container = createElementFromHTML(`
      <span id="submitOrderButtonId">
        <span>
          <input name="placeYourOrder1" />
          <span id="submitOrderButtonId-announce">
            <span>
              Place your order
            </span>
          </span>
        </span>
      </span>
    `);
    const button = container.children.item(0).children.item(1).children.item(0);
    jest.mocked(isCheckoutPage).mockReturnValueOnce(true);
    jest.mocked(getDonationPercent).mockResolvedValueOnce(0.1);
    jest.mocked(getDonationAmount).mockReturnValue(10);
    jest.mocked(getDonationUrl).mockResolvedValue("http://example.com");
    jest.mocked(findButtons).mockReturnValue([button]);
    main();
    expect(await findByText(container, /please donate \$10.00/)).not.toBeNull();
  });
});

function createElementFromHTML(htmlString) {
  const div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstChild as HTMLElement;
}
