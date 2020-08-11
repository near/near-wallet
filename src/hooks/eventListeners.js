import { useEffect } from 'react'

export const onKeyDown = (callback) => {
    useEffect(() => {
        document.addEventListener('keydown', callback);
        return () => document.removeEventListener('keydown', callback);
    }, [callback]);
};
