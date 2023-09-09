function findNodes(xpath) {
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

function attachListenerToButtons(buttonText, callback) {
  const nodes = findNodes(
    `.//span[contains(text(), '${buttonText}')]/../..//input[not(@disabled)]`,
  );
  nodes.forEach((node) => {
    node.addEventListener("click", callback, { capture: true });
  });
}

function isCheckoutPage() {
  return findNodes(`.//h1[contains(text(), 'Checkout')]`).length > 0;
}

function findOrderTotal() {
  const nodes = findNodes(`.//span[contains(text(), 'Order total')]`);
  const regex = /Order total:\$(?<amount>\d+\.\d+)/;
  const orderNode = nodes.find((node) => regex.test(node.textContent));
  if (orderNode) {
    return regex.exec(orderNode.textContent).groups.amount;
  }
  return null;
}

function getDonationLink() {
  const total = findOrderTotal();
  let donation = "";
  if (total) {
    donation = String(parseFloat(total) * 0.1);
  }
  return `https://secure.actblue.com/donate/alu-ont8election?express_lane=true&amount=${donation}`;
}

export { isCheckoutPage, attachListenerToButtons, getDonationLink };
