import { useState, useEffect } from "react";

import { Mixpanel } from "../mixpanel";
import * as nearpayUtils from "../utils/nearpay";

export function useBuyWithNearpay(accountId) {
    const [nearpay, setNearpayState] = useState({
        isAvailable: null,
        url: null,
    });

    const checkNearpay = async () => {
        await Mixpanel.withTracking(
            "Wallet Check Nearpay available",
            async () => {
                const isAvailable = await nearpayUtils.isNearpayAvailable();
                setNearpayState({ ...nearpay, isAvailable });
                if (isAvailable) {
                    const url = await nearpayUtils.getSignedUrl(
                        accountId,
                        window.location.origin
                    );
                    setNearpayState({ ...nearpay, url });
                }
            },
            (e) => console.warn("Error checking Nearpay", e)
        );
    };

    useEffect(() => {
        if (!accountId) {
            return;
        }

        checkNearpay();
    }, [accountId]);

    return nearpay;
}
