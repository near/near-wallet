declare module Wallet {
    // @todo App is using different formats in different places.
    // We have to make one global format for such interfaces.
    declare interface Token {
        // * for example one place has "contractName" in the object, but not in another.
        contractName?: string;
        balance: string;
        onChainFTMetadata: {
            decimals: number;
            icon: string;
            name: string;
            reference: string | null;
            reference_hash: string | null;
            spec: string;
            symbol: string;
        };
        fiatValueMetadata: {
            last_updated_at: number;
            usd: number;
        };
    }
}
