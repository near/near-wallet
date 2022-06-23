import { useEffect, useRef } from 'react';

export default (callback, delay = 1000) => {
    const callbackFunc = useRef(callback);
    const timerHandle = useRef(null);
    const shouldPoll = useRef(true);

    // Without this, we could have overlapping executions of  async`callback` running if `delay` changes
    // while there is an existing pending promise
    const isPending = useRef(false);

    useEffect(() => {
        callbackFunc.current = callback;
    }, [callback]);

    useEffect(() => {
        const handleTick = async () => {
            if (
                // async CB is still pending, don't do anything here because it will re-schedule itself when it resolves
                isPending.current === true ||
                // If component was un-mounted, don't run this iteration
                shouldPoll.current !== true
            ) {
                return;
            }

            try {
                isPending.current = true;
                await callbackFunc.current();
            } finally {
                isPending.current = false;
            }

            // Component was unmounted while we were resolving CB; don't re-schedule anything
            if (shouldPoll.current !== true) {
                return;
            }

            timerHandle.current = setTimeout(handleTick, delay);
        };

        setTimeout(handleTick, delay);

        return () => {
            // Ensure that future scheduled iteration is cancelled
            clearTimeout(timerHandle.current);
            // If a promise is pending, ensure that we don't re-schedule a new timer when it finishes
            shouldPoll.current = false;
        };
    }, [delay]);
};
