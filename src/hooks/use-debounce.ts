import { useRef } from "react";

export function useDebounce<T, R>(func: T, delay: number) {
    const timeoutRef = useRef<number | null>(null);

    return (args: R) => {
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
            if (typeof func === "function") func(args);
        }, delay);
    };
}
