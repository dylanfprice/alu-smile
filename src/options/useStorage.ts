import { useEffect, useState } from "preact/hooks";
import browser from "webextension-polyfill";

function useStorage(key, default_ = undefined) {
  const [value, setValue] = useState();

  useEffect(() => {
    const get = async () => {
      const storedValue = await browser.storage.sync.get({ [key]: default_ });
      setValue(storedValue[key]);
    };
    get();
  }, []);
  const save = (newValue) => {
    browser.storage.sync.set({
      [key]: newValue,
    });
    setValue(newValue);
  };
  return {
    value,
    save,
  };
}

export { useStorage };
