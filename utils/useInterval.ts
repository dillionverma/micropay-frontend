import { useEffect, useRef } from "react";

export const useInterval = (callback: any, delay: number | null) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    // @ts-ignore
    const tick = () => savedCallback?.current();
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
