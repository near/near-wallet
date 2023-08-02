import { useMemo } from 'react';

/**
 * Determine whether a fungible token contract should be included given a token blacklist
 * @param token {string} token contract name under consideration
 * @param blacklist {string[]} list of blacklisted tokens; either the full name or a leading wildcard ('*')
 * @returns {boolean}
 */
export function isTokenIncluded(tokenContract, blacklist) {
    for (let blacklistedToken of blacklist) {
        if (tokenContract === blacklistedToken) {
            return false;
        }

        // e.g. *.mallory.near would exclude a.mallory.near and b.mallory.near
        if (blacklistedToken.startsWith('*') && tokenContract.endsWith(blacklistedToken.slice(1))) {
            return false;
        }
    }

    return true;
}

export function useTokenBlacklist({ tokens }) {
    // TODO: make list dynamic, fetch from db
    const blacklistedTokens = [
        'kusama-airdrop.near',
        '*.laboratory.jumpfinance.near',
    ];

    const allowedTokens = useMemo(() => {
        if (!tokens) {
            return tokens;
        }

        return tokens.filter((token) => isTokenIncluded(token.contractName, blacklistedTokens));
    }, [tokens]);

    return { blacklistedTokens, allowedTokens };
}
