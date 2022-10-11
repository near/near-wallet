import { useEffect, useRef } from 'react';

export default function useInterval(cb, interval, dependencies = []) {
    const callback = useRef();

    useEffect(() => {
        callback.current = cb;
    }, [callback, ...dependencies]);

    useEffect(() => {
        if (interval === null) {
            return;
        }

        function tick() {
            if (typeof callback.current === 'function') {
                callback.current();
            }
        }

        tick();

        const intervalId = setInterval(tick, interval);

        return () => clearInterval(intervalId);
    }, [interval, ...dependencies]);
}
