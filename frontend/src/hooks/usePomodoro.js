import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { tickTimer } from "../features/focus/focusSlice";

export const usePomodoro = ({ onElapsed }) => {
  const dispatch = useDispatch();
  const activeSession = useSelector((state) => state.focus.activeSession);
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (!activeSession || activeSession.isPaused || activeSession.isFinished) {
      return undefined;
    }

    // Keep the timer reducer as the single source of truth so the UI and controls stay in sync.
    const interval = window.setInterval(() => {
      dispatch(tickTimer());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [activeSession, dispatch]);

  useEffect(() => {
    if (!activeSession) {
      notifiedRef.current = false;
      return;
    }

    if (activeSession.remainingSeconds === 0 && !notifiedRef.current) {
      notifiedRef.current = true;
      onElapsed?.(activeSession);
    }
  }, [activeSession, onElapsed]);
};
