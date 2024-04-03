import { render } from "preact";

import OptionsForm from "./OptionsForm";
import { getDonationPercent, getDonationUrl } from "./options";

function main() {
  render(<OptionsForm />, document.body);
}

export { main, getDonationPercent, getDonationUrl };
