import useLocalStorage from "@rehooks/local-storage";
import { Updater, VisibilityState } from "@tanstack/react-table";
import { useCallback } from "react";

export const useVisibilityStatePersistent = (key: string, defaultValue?: VisibilityState) => {
  const [visibilityState, setVisibilityState] = 
    useLocalStorage<VisibilityState>(`visibility-state-${key}`, defaultValue ?? {});
  
  const onVisibilityChange = useCallback((updater: Updater<VisibilityState>) => {
    if (typeof updater === 'function') {
      setVisibilityState(updater(visibilityState))
    } else {
      setVisibilityState(updater)
    }
  }, [visibilityState, setVisibilityState]);

  return [visibilityState, onVisibilityChange] as const;
};
