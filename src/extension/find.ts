import * as find from "./find";

function findNodes(xpath): Node[] {
  const result = document.evaluate(
    xpath,
    document.body,
    null,
    //XPathResult.ORDERED_NODE_ITERATOR_TYPE,
    XPathResult.ANY_TYPE,
    null,
  );
  const nodes = [];
  let node = result.iterateNext();
  while (node) {
    nodes.push(node);
    node = result.iterateNext();
  }
  return nodes;
}

function findButtons(buttonText) {
  return findNodes(
    `
      .//span[contains(
        normalize-space(translate(text(), '\n', ' ')),
        '${buttonText}')
      ]/../..//input[not(@disabled)]
    `,
  );
}

function findOrderTotal() {
  const nodes = findNodes(
    `//td[contains(concat(' ',normalize-space(@class),' '),' grand-total-price ')]`,
  );
  const regex = /\$(?<amount>\d+\.\d+)/;
  const orderNode = nodes.find((node) => regex.test(node.textContent));
  if (orderNode) {
    return regex.exec(orderNode.textContent).groups.amount;
  }
  return null;
}

function isCheckoutPage() {
  return (
    findNodes(`.//h1[contains(text(), 'Checkout')]`).length > 0 ||
    findNodes(`.//h1/a[contains(text(), 'checkout')]`).length > 0
  );
}

function getDonationAmount(percentage) {
  const total = find.findOrderTotal();
  if (total) {
    return parseFloat(total) * percentage;
  }
  return 0;
}

export { findOrderTotal, findButtons, isCheckoutPage, getDonationAmount };
