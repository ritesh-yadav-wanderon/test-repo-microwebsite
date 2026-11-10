import { describe, expect, it, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePersistentState } from "./usePersistentState";

// Every test uses its own key: the hook's module-level cache (needed so
// getSnapshot returns a referentially stable value for useSyncExternalStore
// — see usePersistentState.ts) is keyed by storage key and persists across
// tests in this file, so key reuse would leak state between cases the same
// way real components sharing a key are meant to.
let keyCounter = 0;
function uniqueKey() {
  return `test:persistent-state:${++keyCounter}`;
}

beforeEach(() => {
  localStorage.clear();
});

describe("usePersistentState", () => {
  it("returns the fallback when nothing is stored yet", () => {
    const { result } = renderHook(() => usePersistentState(uniqueKey(), ["default"]));
    expect(result.current.value).toEqual(["default"]);
  });

  it("persists a value and reflects it on the next read", () => {
    const key = uniqueKey();
    const { result } = renderHook(() => usePersistentState<string[]>(key, []));
    act(() => result.current.setValue(["a", "b"]));
    expect(result.current.value).toEqual(["a", "b"]);
    expect(JSON.parse(localStorage.getItem(key)!)).toEqual(["a", "b"]);
  });

  it("accepts an updater function, reading the real current stored value", () => {
    const key = uniqueKey();
    const { result } = renderHook(() => usePersistentState<string[]>(key, []));
    act(() => result.current.setValue((prev) => [...prev, "x"]));
    act(() => result.current.setValue((prev) => [...prev, "y"]));
    expect(result.current.value).toEqual(["x", "y"]);
  });

  it("keeps two hook instances on the same key in sync within the same tab", () => {
    const key = uniqueKey();
    const a = renderHook(() => usePersistentState<string[]>(key, []));
    const b = renderHook(() => usePersistentState<string[]>(key, []));

    act(() => a.result.current.setValue(["from-a"]));

    expect(a.result.current.value).toEqual(["from-a"]);
    expect(b.result.current.value).toEqual(["from-a"]);
  });

  it("removes the key when set to null/undefined, same as writeJSON", () => {
    const key = uniqueKey();
    const { result } = renderHook(() => usePersistentState<string[] | null>(key, null));
    act(() => result.current.setValue(["something"]));
    expect(localStorage.getItem(key)).not.toBeNull();

    act(() => result.current.setValue(null));
    expect(localStorage.getItem(key)).toBeNull();
    expect(result.current.value).toBeNull();
  });

  it("reports ready in a browser environment", () => {
    const { result } = renderHook(() => usePersistentState(uniqueKey(), []));
    expect(result.current.ready).toBe(true);
  });

  it("keeps separate keys fully independent", () => {
    const keyA = uniqueKey();
    const keyB = uniqueKey();
    const a = renderHook(() => usePersistentState(keyA, "a-default"));
    const b = renderHook(() => usePersistentState(keyB, "b-default"));
    act(() => a.result.current.setValue("a-value"));
    expect(a.result.current.value).toBe("a-value");
    expect(b.result.current.value).toBe("b-default");
  });
});
