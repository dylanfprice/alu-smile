import * as find from "./find";

function findNodes(xpath): Node[] {
  const result = document.evaluate(
    xpath,
    document.body,
    null,
    XPathResult.ORDERED_NODE_ITERATOR_TYPE,
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

function findByClass(clazz) {
  return findNodes(
    `//*[contains(concat(' ',normalize-space(@class),' '), ' ${clazz} ')]`,
  );
}

function findOrderTotal() {
  let nodes = findByClass("grand-total-price");
  if (nodes.length === 0) {
    nodes = findByClass("grand-total-cell");
  }
  if (nodes.length === 0) {
    nodes = findByClass("order-summary-line-definition");
    if (nodes.length !== 0) {
      nodes = [nodes[nodes.length - 1]];
    }
  }
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
