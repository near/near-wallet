import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Container from '../../components/common/styled/Container.css';
import { selectAccountId } from '../../redux/slices/account';
import { wallet } from '../../utils/wallet';
import { SwapProvider } from './model/Swap';
import SwapWrapper from './ui/SwapWrapper';
import useTokens from './utils/hooks/useTokens';

export default function TokenSwap({ history }) {
    const accountId = useSelector(selectAccountId);
    const [account, setAccount] = useState(null);
    const tokensConfig = useTokens();

    useEffect(() => {
        let mounted = true;

        if (accountId) {
            const updateAccount = async () => {
                const instance = await wallet.getAccount(accountId, true);

                if (mounted) {
                    setAccount(instance);
                }
            };

            updateAccount();
        }

        return () => {
            mounted = false;
        };
    }, [accountId]);

    return (
        <Container className="small-centered">
            <SwapProvider>
                <SwapWrapper
                    history={history}
                    account={account}
                    tokensConfig={tokensConfig}
                />
            </SwapProvider>
        </Container>
    );
};
