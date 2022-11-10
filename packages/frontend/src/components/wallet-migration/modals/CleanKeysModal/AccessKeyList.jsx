import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import classNames from '../../../../utils/classNames';
import Accordion from '../../../common/Accordion';
import Checkbox from '../../../common/Checkbox';
import ChevronIcon from '../../../svg/ChevronIcon';

const AccessKeyListContainer = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;

    .access-key {
        display: flex;
        flex: 1;
        font-weight: 600;
        padding: 16px 0;
        border-bottom: 1px solid lightgray;

        .public-key {
            flex: 7;

            .key-prefix {
                font-family: monospace;
            }
        }

        .remove-checkbox {
            flex: 1;
        }
    }

    .account {
        background-color: #fafafa;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        flex: 1;
        flex-direction: row;
        width: 100%;

        .account-detail {
            flex: 7;

            .account-id {
                font-weight: bold;
                text-overflow: ellipsis;
            }

            .keys-to-remove {
                color: #de2e32;
            }
        }

        .expand-keys {
            flex: 1;
            padding: 16px 0 0 0;
        }
    }
`;

const AccessKeyList = ({ account, selectKey, selectedKeys }) => {
    const [expanded, setExpanded] = useState(true);
    return (
        <AccessKeyListContainer>
            <div
                className={classNames(['account', expanded ? 'open' : ''])}
                id='full-access-keys'
                onClick={() => setExpanded(!expanded)}
            >
                <div className='account-detail'>
                    <p className='account-id'>{account.accountId}</p>
                    <p className='keys-to-remove'>
                        {account.accessKeys.length}/{account.totalAccessKeys}
                        <Translate id='walletMigration.cleanKeys.fullAccessKeys' />
                    </p>
                </div>
                <div className='expand-keys'>
                    <ChevronIcon color='#0072ce' />
                </div>
            </div>
            <Accordion
                trigger='full-access-keys'
                className='breakdown'
            >
                {account.accessKeys.map(({ kind, publicKey }) => (
                    <div className='access-key' key={publicKey}>
                        <div className='public-key'>
                            <span className='key-prefix'>
                                {publicKey.replace('ed25519:', '').slice(0, 16)}
                            </span>
                            &nbsp;
                            (<Translate id={`walletMigration.cleanKeys.keyTypes.${kind}`} />)
                        </div>
                        <div className='remove-checkbox' onClick={() => selectKey(publicKey)}>
                            <Checkbox checked={selectedKeys[publicKey]} />
                        </div>
                    </div>
                ))}
            </Accordion>
        </AccessKeyListContainer>
    );
};

export default AccessKeyList;
