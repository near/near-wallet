import { useMemo } from 'react';

export function useTokenBlacklist({ tokens }) {
    // TODO: make list dynamic, fetch from db
    const blacklistedTokens = ['kusama-airdrop.near'];

    const allowedTokens = useMemo(() => {
        if (!tokens) {
            return tokens;
        }

        return tokens.filter((token) => !blacklistedTokens.includes(token.contractName));
    }, [tokens]);

    return { blacklistedTokens, allowedTokens };
}
