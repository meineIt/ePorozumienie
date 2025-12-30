import { useState } from 'react';

export function useShake() {
    const [shake, setShake] = useState(false);

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 500);
    };
    return { shake, triggerShake };
}