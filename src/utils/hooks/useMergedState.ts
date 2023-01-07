import { useCallback, useLayoutEffect, useRef, useState } from "react";

function useMergedState<T, R = T>(
  defaultStateValue: T | (() => T),
  option?: {
    defaultValue?: T | (() => T);
    value?: T;
    onChange?: (value: T, preValue: T) => void;
    postState?: (value: T) => T;
  }
): [R, (updater: T | ((origin: T) => T)) => void] {
  // ======================= Init =======================
  const { defaultValue, value, onChange, postState } = option || {};
  const [innerValue, setInnerValue] = useState<T>(() => {
    if (value !== undefined) return value;
    if (defaultValue !== undefined) {
      return typeof defaultValue === "function"
        ? (defaultValue as () => T)()
        : defaultValue!;
    }
    return typeof defaultStateValue === "function"
      ? (defaultStateValue as () => T)()
      : defaultStateValue;
  });

  const mergedValue = value !== undefined ? value : innerValue;
  const postMergedValue = postState ? postState(mergedValue) : mergedValue;

  // ====================== Change ======================
  const [prevValue, setPrevValue] = useState<[T]>([mergedValue]);

  useLayoutEffect(() => {
    const prev = prevValue[0];
    if (innerValue !== prev) {
      onChange?.(innerValue, prev);
    }
  }, [prevValue]);

  // Sync value back to `undefined` when it from control to un-control
  // useLayoutEffect(() => {
  //   if (value === undefined) {
  //     setInnerValue(value);
  //   }
  // }, [value]);

  const triggerChangeRef = useRef<Function>();
  triggerChangeRef.current = (updater: T | ((origin: T) => T)) => {
    setInnerValue(updater);
    setPrevValue([mergedValue]);
  };

  // ====================== Update ======================
  const triggerChange = useCallback((updater: T | ((origin: T) => T)) => {
    triggerChangeRef.current?.(updater);
  }, []);

  return [postMergedValue as unknown as R, triggerChange];
}

export default useMergedState;
