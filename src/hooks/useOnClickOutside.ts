import { RefObject, useEffect } from "react";

export default function useOnClickOutside<T extends Node = Node>(
  ref: RefObject<T> | null,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled || !ref) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref as RefObject<T> | null;
      if (!el || !el.current) return;
      if (el.current.contains(event.target as Node)) return;
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, enabled]);
}
