import browser from "webextension-polyfill";
import { act, waitFor, renderHook } from "@testing-library/preact";

import { useStorage } from "./useStorage";

jest.mock("webextension-polyfill", () => ({
  __esModule: true,
  default: {
    storage: {
      sync: {
        get: jest.fn(),
        set: jest.fn(),
      },
    },
  },
}));

const sync = browser.storage.sync;

describe("useStorage", () => {
  test("returns undefined value when no value is set", () => {
    sync.get.mockResolvedValueOnce({});
    const { result } = renderHook(() => useStorage("test-key"));
    expect(result.current.value).toBeUndefined();
  });
  test("returns default when no value is set and default is provided", async () => {
    sync.get.mockResolvedValueOnce({ "test-key": "default-value" });
    const { result } = renderHook(() =>
      useStorage("test-key", "default-value"),
    );
    await waitFor(() => expect(result.current.value).toEqual("default-value"));
  });
  test("returns value when a value is set", async () => {
    sync.get.mockResolvedValueOnce({ "test-key": "test-value" });
    const { result } = renderHook(() => useStorage("test-key"));
    await waitFor(() => expect(result.current.value).toEqual("test-value"));
  });
  test("returns save function to save a value", async () => {
    sync.get.mockResolvedValueOnce({});
    const { result } = renderHook(() => useStorage("test-key"));
    act(() => result.current.save("new-value"));
    expect(result.current.value).toEqual("new-value");
    expect(sync.set).toHaveBeenCalledWith({ "test-key": "new-value" });
  });
});
