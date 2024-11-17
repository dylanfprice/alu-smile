import * as find from "./find";
const { findOrderTotal, findButtons, isCheckoutPage, getDonationAmount } = find;

describe("findButtons", () => {
  test("returns button based on button text", () => {
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
    expect(findButtons("Place your order")).toHaveLength(1);
  });
  test("returns button even when text has newlines", () => {
    document.body.innerHTML = `
      <span id="submitOrderButtonId">
        <span>
          <input name="placeYourOrder1" />
          <span id="submitOrderButtonId-announce">
            <span>
              Place    
              your 
              order
            </span>
          </span>
        </span>
      </span>
    `;
    expect(findButtons("Place your order")).toHaveLength(1);
  });
  test("returns multiple buttons if there is more than one", () => {
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
    expect(findButtons("Place your order")).toHaveLength(2);
  });
  test("does not return buttons which are disabled", () => {
    document.body.innerHTML = `
      <span id="submitOrderButtonId">
        <span>
          <input name="placeYourOrder1" disabled />
          <span id="submitOrderButtonId-announce">
            <span>
              Place your order
            </span>
          </span>
        </span>
      </span>
    `;
    expect(findButtons("Place your order")).toHaveLength(0);
  });
});

describe("findOrderTotal", () => {
  test("returns null when no grand-total-price class", () => {
    document.body.innerHTML = `
      <table>
        <td>
          $22.22
        </td>
      </table>
    `;
    expect(findOrderTotal()).toBeNull();
  });
  test("returns parsed order total", () => {
    document.body.innerHTML = `
      <table>
        <td class="grand-total-price">
          $22.22
        </td>
      </table>
    `;
    expect(findOrderTotal()).toEqual("22.22");
  });
  test("returns parsed order total when multiple classes", () => {
    document.body.innerHTML = `
      <table>
        <td class="a-class grand-total-price b-class">
          $22.22
        </td>
      </table>
    `;
    expect(findOrderTotal()).toEqual("22.22");
  });
});

describe("isCheckoutPage", () => {
  test("returns false when no checkout page header", () => {
    document.body.innerHTML = "<h1>Not the page!</h1>";
    expect(isCheckoutPage()).toBeFalsy();
  });
  test("returns true when normal checkout page header", () => {
    // Copied from actual amazon checkout page.
    document.body.innerHTML = `
      <h1>
          Checkout
          <span>
              (
              <span>
                  <span>
                      <span>1 item</span>
                  </span>
              </span>
              )
          </span>
      </h1>
    `;
    expect(isCheckoutPage()).toBeTruthy();
  });
  test("returns true when new checkout page header", () => {
    // Copied from https://www.amazon.com/checkout/p/* style page
    document.body.innerHTML = `
        <h1>
            <a href="javascript:void(0)" role="button">
                Secure checkout
                <div>
                    <span></span>
                </div>
            </a>
        </h1>
    `;
    expect(isCheckoutPage()).toBeTruthy();
  });
});

describe("getDonationAmount", () => {
  let spy;
  beforeEach(() => {
    spy = jest.spyOn(find, "findOrderTotal");
  });
  test("returns 0 when order total is null", () => {
    spy.mockReturnValueOnce(null);
    expect(getDonationAmount(0.5)).toEqual(0);
  });
  test("returns percentage of parsed amount when there is an order total", () => {
    spy.mockReturnValueOnce("22.22");
    expect(getDonationAmount(0.5)).toEqual(11.11);
  });
});
