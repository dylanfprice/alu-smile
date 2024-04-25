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
  test("returns null when no order total", () => {
    document.body.innerHTML = `
      <span>
        Order total:
      </span>
    `;
    expect(findOrderTotal()).toBeNull();
  });
  test("returns parsed order total", () => {
    document.body.innerHTML = `
      <span>
        Order total:<span></span>$22.22
      </span>
    `;
    expect(findOrderTotal()).toEqual("22.22");
  });
});

describe("isCheckoutPage", () => {
  test("returns false when no checkout page header", () => {
    document.body.innerHTML = "<h1>Not the page!</h1>";
    expect(isCheckoutPage()).toBeFalsy();
  });
  test("returns true when checkout page header", () => {
    // Copied from actual amazon checkout page.
    document.body.innerHTML = `
      <h1 style="scroll-behavior: unset;">
          Checkout
          <span class="a-size-large" style="scroll-behavior: unset;">
              (
              <span class="a-declarative" data-action="a-popover" data-a-popover='{"closeButton":"false","name":"amzn-cart-link-popover","popoverLabel":"1 item","activate":"onclick"}' style="scroll-behavior: unset;">
                  <span class="a-declarative" data-action="ue-count" data-ue-count='{"countFlag":"checkout:spp-cart-link:popover-show","countValue":1}' style="scroll-behavior: unset;">
                      <span class="a-color-link clickable-heading" style="scroll-behavior: unset;">1 item</span>
                  </span>
              </span>
              )
          </span>
          <div class="a-popover-preload" id="a-popover-amzn-cart-link-popover" style="scroll-behavior: unset;">
              <div class="a-row a-spacing-base" style="scroll-behavior: unset;">
                  Are you sure you want to return to your Shopping Cart?
              </div>
              <div class="a-row" style="scroll-behavior: unset;">
                  <div class="a-column a-span6" style="scroll-behavior: unset;">
                      <span class="a-declarative" data-action="a-popover-close" data-a-popover-close="{}" style="scroll-behavior: unset;">
                          <span class="a-declarative" data-action="ue-count" data-ue-count='{"countFlag":"checkout:spp-cart-link:stay-checkout","countValue":1}' style="scroll-behavior: unset;">
                              <span class="a-button a-button-span12 a-button-base" id="a-autoid-2" style="scroll-behavior: unset;">
                                  <span class="a-button-inner" style="scroll-behavior: unset;">
                                      <input class="a-button-input" type="submit" aria-labelledby="a-autoid-2-announce" style="scroll-behavior: unset;" />
                                      <span class="a-button-text" aria-hidden="true" id="a-autoid-2-announce" style="scroll-behavior: unset;">Stay in checkout</span>
                                  </span>
                              </span>
                          </span>
                      </span>
                  </div>
                  <div class="a-column a-span6 a-span-last" style="scroll-behavior: unset;">
                      <span class="a-button a-button-span12 a-button-primary a-float-right" id="a-autoid-3" style="scroll-behavior: unset;">
                          <span class="a-button-inner" style="scroll-behavior: unset;">
                              <a href="https://www.amazon.com/gp/cart/view.html/ref=chk_cart_link_return_to_cart" class="a-button-text" role="button" id="a-autoid-3-announce" style="scroll-behavior: unset;">
                                  Return to Cart
                              </a>
                          </span>
                      </span>
                  </div>
              </div>
          </div>
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
