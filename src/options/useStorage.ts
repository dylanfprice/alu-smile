import { useEffect, useState } from "preact/hooks";
import browser from "webextension-polyfill";

function useStorage(key, default_ = undefined) {
  const [value, setValue] = useState();

  useEffect(() => {
    const get = async () => {
      const storedValue = await browser.storage.sync.get({ [key]: default_ });
      console.log("get", storedValue);
      setValue(storedValue[key]);
    };
    get();
  }, []);
  const save = async (newValue) => {
    browser.storage.sync.set({
      [key]: newValue,
    });
    console.log("set", { [key]: newValue });
    setValue(newValue);
  };
  return {
    loading: value === undefined,
    value,
    save: value === undefined ? undefined : save,
  };
}

export { useStorage };
