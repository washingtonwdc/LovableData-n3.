import { useMemo, useCallback } from "react";

/**
 * Custom hook for debounced values
 * Delays updating the value until after the specified delay
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

/**
 * Custom hook for memoized callbacks with dependencies
 */
export function useStableCallback<T extends (...args: any[]) => any>(
    callback: T,
    deps: React.DependencyList
): T {
    return useCallback(callback, deps);
}

/**
 * Custom hook for optimized filtering
 * Returns a memoized filtered array
 */
export function useFilteredArray<T>(
    array: T[],
    filterFn: (item: T) => boolean,
    deps: React.DependencyList = []
): T[] {
    return useMemo(() => array.filter(filterFn), [array, ...deps]);
}

/**
 * Import React for hooks
 */
import * as React from "react";
