import { useState, useCallback } from "react";

interface CheckInOutState {
  [key: string]: {
    checkedIn: string | null;
    checkedOut: string | null;
  };
}

const STORAGE_KEY = "veryable-checkinout";

function loadState(): CheckInOutState {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveState(state: CheckInOutState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useCheckInOut() {
  const [state, setState] = useState<CheckInOutState>(() => loadState());

  const getKey = (opId: number, operatorId: number) => `${opId}-${operatorId}`;

  const getStatus = useCallback(
    (opId: number, operatorId: number) => {
      const key = getKey(opId, operatorId);
      return state[key] || { checkedIn: null, checkedOut: null };
    },
    [state]
  );

  const checkIn = useCallback(
    (opId: number, operatorId: number) => {
      const key = getKey(opId, operatorId);
      const updated = {
        ...state,
        [key]: {
          ...state[key],
          checkedIn: new Date().toISOString(),
          checkedOut: null,
        },
      };
      setState(updated);
      saveState(updated);
    },
    [state]
  );

  const checkOut = useCallback(
    (opId: number, operatorId: number) => {
      const key = getKey(opId, operatorId);
      const updated = {
        ...state,
        [key]: {
          ...state[key],
          checkedOut: new Date().toISOString(),
        },
      };
      setState(updated);
      saveState(updated);
    },
    [state]
  );

  return { getStatus, checkIn, checkOut };
}
