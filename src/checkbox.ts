function htmlToElement(html) {
  const template = document.createElement("template");
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

function getCheckbox(donationAmount, callback) {
  const input = htmlToElement(
    '<input id="alu-smile-checkbox-0" type="checkbox" name="" value="">',
  );
  input.addEventListener("change", function () {
    callback(this.checked);
  });
  const label = htmlToElement(`
      <label for="alu-smile-checkbox-0" style="display: inline;">
            Yes, please donate $$${donationAmount} to the Amazon Labor Union
      </label>
  `);
  const div = document.createElement("div");
  div.appendChild(input);
  div.appendChild(label);
  return div;
}

export { getCheckbox };
