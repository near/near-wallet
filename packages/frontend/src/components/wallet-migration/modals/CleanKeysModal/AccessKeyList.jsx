import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled, { css } from 'styled-components';

import classNames from '../../../../utils/classNames';
import Accordion from '../../../common/Accordion';
import Checkbox from '../../../common/Checkbox';
import Tooltip from '../../../common/Tooltip';
import ChevronIcon from '../../../svg/ChevronIcon';
import { ButtonsContainer, StyledButton } from '../../CommonComponents';

const AccessKeyListContainer = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;

    .title {
        text-align: center;
    }

    > .desc {
        text-align: center;
        font-weight: 12px;
        margin: 24px 0;
    }

    .access-key {
        display: flex;
        flex: 1;
        font-weight: 600;
        padding: 16px 0;
        border-bottom: 1px solid lightgray;

        .public-key {
            flex: 7;
            margin-left: 8px;
            display: flex;
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
            width: 100%;
            margin-left: 8px;
            .account-id {
                font-weight: bold;
                text-overflow: ellipsis;
                overflow: hidden;
            }

            .keys-to-remove {
                color: #de2e32;
            }
        }

        .expand-keys {
            flex: 1;
            padding: 16px 16px 0 0;
            cursor: pointer;
        }
    }
`;

const IconContainer = styled.div`
    transform: rotate(90deg);
    ${({ expanded }) => (expanded && css`
        transform: rotate(270deg);
    `)}
`;

const AccessKeyList = ({ account, onClose, onNext, selectKey, selectedKeys }) => {
    const [expanded, setExpanded] = useState(true);
    const keysToDelete = selectedKeys.reduce((keys, key) => ({ ...keys, [key]: true }), {});
    const accessKeys = account.accessKeys.map((accessKey) => ({
        ...accessKey,
        checked: !!keysToDelete[accessKey.publicKey],
    }));

    return (
        <AccessKeyListContainer>
            <h3 className='title'>
                <Translate id='walletMigration.cleanKeys.accountTitle' />
            </h3>
            <div className="desc">
                <Translate id='walletMigration.cleanKeys.accountDesc' />
            </div>
            <div
                className={classNames(['account', expanded ? 'open' : ''])}
                id='full-access-keys'
                onClick={() => setExpanded(!expanded)}
            >
                <div className='account-detail'>
                    <p className='account-id'>{account.accountId}</p>
                    <p className='keys-to-remove'>
                        {Object.values(selectedKeys).filter((enabled) => enabled).length}/{account.totalAccessKeys}
                        {' '}
                        <Translate id='walletMigration.cleanKeys.fullAccessKeys' />
                    </p>
                </div>
                <div className='expand-keys'>
                    <IconContainer expanded={expanded}>
                        <ChevronIcon color='#0072ce' />
                    </IconContainer>
                </div>
            </div>
            <Accordion
                trigger='full-access-keys'
                className='breakdown'
            >
                {accessKeys.map(({ kind, publicKey, checked }) => (
                    <div className='access-key' key={publicKey}>
                        <div className='public-key'>
                            <span className='key-prefix'>
                                {publicKey.replace('ed25519:', '').slice(0, 16)}
                            </span>
                            &nbsp;
                            (<Translate id={`walletMigration.cleanKeys.keyTypes.${kind}`} />)
                        </div>
                        <div className='remove-checkbox' onClick={() => selectKey(publicKey, !checked)}>
                            <Checkbox checked={checked} red />
                        </div>
                    </div>
                ))}
                <div className='access-key'>
                    <div className='public-key'>
                        <span className='key-prefix'>
                            Private Key
                        </span>
                        &nbsp;
                        (<Translate id='walletMigration.cleanKeys.keyTypes.rotatedKey' />)
                        <Tooltip translate="walletMigration.cleanKeys.rotatedKeyTooltip" />
                    </div>
                    <div className='remove-checkbox'>
                        <Checkbox disabled />
                    </div>
                </div>
                <div className='access-key'>
                    <div className='public-key'>
                        <span className='key-prefix'>
                            Private Key
                        </span>
                        &nbsp;
                        (<Translate id='walletMigration.cleanKeys.keyTypes.currentAccessKey' />)
                        <Tooltip translate="walletMigration.cleanKeys.currentAccessKeyTooltip" />
                    </div>
                    <div className='remove-checkbox'>
                        <Checkbox disabled />
                    </div>
                </div>
            </Accordion>
            <div className="desc">
                <Translate id='walletMigration.cleanKeys.accountDescTwo' />
            </div>
            <ButtonsContainer vertical>
                <StyledButton
                    onClick={onNext}
                    fullWidth
                    disabled={selectedKeys.length === 0}
                    data-test-id="cleanupKeys.continue"
                >
                    <Translate id='walletMigration.cleanKeys.removeKeys' />
                </StyledButton>
                <StyledButton
                    className='white-blue'
                    onClick={onClose}
                    fullWidth
                >
                    <Translate id='button.cancel' />
                </StyledButton>
            </ButtonsContainer>
        </AccessKeyListContainer>
    );
};

export default AccessKeyList;
