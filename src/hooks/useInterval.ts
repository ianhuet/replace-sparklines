import { useEffect, useRef } from 'react';

type CallbackFunc = () => void

export function useInterval(callback: CallbackFunc, delay: number | null) {
  const savedCallback = useRef<CallbackFunc>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      if (savedCallback.current) savedCallback.current()
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
