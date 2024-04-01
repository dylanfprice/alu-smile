import { useStorage } from "./useStorage";

const DEFAULT_DONATION_LINK = `https://secure.actblue.com/donate/alu-ont8election?express_lane=true&amount=`;

function OptionsForm() {
  const {
    loading: percentLoading,
    value: percent,
    save: savePercent,
  } = useStorage("donationPercent", 10);
  const {
    loading: urlLoading,
    value: url,
    save: saveUrl,
  } = useStorage("donationUrl", DEFAULT_DONATION_LINK);

  const loading = percentLoading || urlLoading;

  const labelStyle = {
    display: "block",
    marginBottom: "1em",
  };

  return (
    <form onSubmit={this.onSubmit}>
      <label style={labelStyle}>
        Donate{" "}
        <input
          type="number"
          min={0}
          max={100}
          value={percent}
          onChange={(event) =>
            savePercent(parseFloat((event.target as HTMLInputElement).value))
          }
          style={{ width: "3em" }}
          disabled={loading}
        />
        % of the shopping cart total
      </label>
      <label style={labelStyle}>
        Dontaion URL:{" "}
        <input
          type="text"
          value={url}
          onInput={(event) => saveUrl((event.target as HTMLInputElement).value)}
          style={{
            width: "100%",
          }}
          disabled={loading}
        />
      </label>
    </form>
  );
}

export default OptionsForm;
