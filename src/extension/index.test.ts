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
          <span id="submitOrderButtonId-announce">
            <span>
              Place your order
            </span>
          </span>
        </span>
      </span>
    `;
    await findByText(document.body, /Place your order/);
    console.error("here", document.body.outerHTML);
    const button = document.body.children
      .item(0)
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
  xtest("reattaches checkboxes when button is rerendered", async () => {
    const container = createElementFromHTML(`
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
    `);
    let button = container.children.item(0).children.item(1).children.item(0);
    jest.mocked(isCheckoutPage).mockReturnValue(true);
    jest.mocked(getDonationPercent).mockResolvedValue(0.1);
    jest.mocked(getDonationAmount).mockReturnValue(10);
    jest.mocked(getDonationUrl).mockResolvedValue("http://example.com");
    jest.mocked(findButtons).mockReturnValue([button]);
    main();
    expect(await findByText(container, /please donate \$10.00/)).not.toBeNull();
    const newChild = createElementFromHTML(`
      <span>
        <input name="placeYourOrder2" />
        <span>
          <span>
            Place your order
          </span>
        </span>
      </span>
    `);
    button = newChild.children.item(1).children.item(0);
    jest.mocked(findButtons).mockReturnValue([button]);
    container.replaceChildren(newChild);
    expect(await findByText(container, /please donate \$10.00/)).not.toBeNull();
  });
});

function createElementFromHTML(htmlString: string): HTMLElement {
  const div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstChild as HTMLElement;
}
