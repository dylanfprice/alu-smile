import { render } from "preact";
import { useState } from "preact/hooks";

import Checkbox from "./components/Checkbox";

function main() {
  render(<OptionsForm />, document.body);
}

function OptionsForm() {
  const [value, setValue] = useState(10);
  return (
    <form onSubmit={this.onSubmit}>
      <label style={{ display: "block" }}>
        Donate <span> </span>
        <input
          type="number"
          min={0}
          max={100}
          value={value}
          onChange={(event) =>
            setValue(parseFloat((event.target as HTMLInputElement).value))
          }
          style={{ width: "3em" }}
        />
        % of the shopping cart total
      </label>
      <Checkbox
        label="Test mode (load example.com instead of actblue)"
        checked={true}
        onClick={() => {}}
      />
    </form>
  );
}

main();
