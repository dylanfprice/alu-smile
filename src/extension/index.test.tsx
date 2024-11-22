import { fireEvent, render, waitFor } from "@testing-library/preact";

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

function TestButton({ name = "placeYourOrder1" }) {
  return (
    <span id="submitOrderButtonId">
      <span>
        <input name={name} type="submit" />
        <span>
          <span>Place your order</span>
        </span>
      </span>
    </span>
  );
}

describe("main", () => {
  beforeEach(() => {
    jest.mocked(getDonationPercent).mockResolvedValue(0.1);
    jest.mocked(getDonationAmount).mockReturnValue(10);
    jest.mocked(getDonationUrl).mockResolvedValue("http://example.com?amount=");
    jest.mocked(isCheckoutPage).mockReturnValue(false);
  });
  test("logs when loaded", async () => {
    const tearDown = await main();
    expect(console.log).toHaveBeenCalledWith("alu-smile loaded");
    tearDown();
  });
  test("does not render checkbox when not checkout page", async () => {
    const { queryByRole } = render(<TestButton />);
    const tearDown = await main();
    expect(queryByRole("checkbox")).toBeNull();
    tearDown();
  });
  test("renders checkbox when checkout page", async () => {
    const { findByRole, getByRole } = render(<TestButton />);

    const button = getByRole("button");
    jest.mocked(isCheckoutPage).mockReturnValue(true);
    jest.mocked(findButtons).mockReturnValue([button]);
    const tearDown = await main();
    expect(await findByRole("checkbox")).toHaveAccessibleName(
      /please donate \$10.00/,
    );
    tearDown();
  });
  test("rerenders checkbox when button is rerendered", async () => {
    const { container, findByRole, getByRole } = render(<TestButton />);

    let button = getByRole("button");
    jest.mocked(isCheckoutPage).mockReturnValue(true);
    jest.mocked(findButtons).mockReturnValue([button]);
    const tearDown = await main();
    expect(await findByRole("checkbox")).toHaveAccessibleName(
      /please donate \$10.00/,
    );

    container.remove();
    render(<TestButton name="placeYourOrder2" />);

    button = getByRole("button");
    jest.mocked(findButtons).mockReturnValue([button]);
    expect(await findByRole("checkbox")).toHaveAccessibleName(
      /please donate \$10.00/,
    );
    tearDown();
  });
  test("submits donation when button clicked", async () => {
    const { getByRole } = render(<TestButton />);

    const button = getByRole("button");
    jest.mocked(isCheckoutPage).mockReturnValue(true);
    jest.mocked(findButtons).mockReturnValue([button]);
    const tearDown = await main();
    fireEvent.click(button);
    await waitFor(() =>
      expect(window.open).toHaveBeenCalledWith(
        "http://example.com?amount=10.00",
        "_blank",
      ),
    );
    tearDown();
  });
  test("submits only one donation when page changes", async () => {
    // There was a bug where after changing shipping options clicking the
    // button would open multiple donation windows.
    const { getByRole } = render(<TestButton />);

    const button = getByRole("button");
    jest.mocked(isCheckoutPage).mockReturnValue(true);
    jest.mocked(findButtons).mockReturnValue([button]);
    const tearDown = await main();

    render(<div></div>);

    fireEvent.click(button);
    await waitFor(() => expect(window.open).toHaveBeenCalledTimes(1));
    tearDown();
  });
});
