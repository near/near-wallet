import React from 'react';
import { Segment } from 'semantic-ui-react';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';
import AddBlueImage from '../../images/icon-add-blue.svg';
import ArrowDownImage from '../../images/icon-arrow-down.svg';
import ArrowUpImage from '../../images/icon-arrow-up.svg';
import { DISABLE_CREATE_ACCOUNT } from '../../utils/wallet';

const CustomSegment = styled(Segment)`
    &&& {
        position: relative;
        width: 100%;
        height: 50px;
        padding: 0px;

        &.disabled {
            cursor: not-allowed;

            .item {
                :hover {
                    cursor: not-allowed !important;
                    color: #24272a !important;
                }
            }
        }

        .segment {
            padding: 0px;
            position: absolute;
            width: 100%;
            min-height: 46px;
            bottom: 0px;
            border: 2px solid #24272a;
            border-radius: 3px;
            background: #fff;

        .item {
            height: 46px;
            color: #24272a;
            padding: 0 0 0 12px;
            font-size: 18px;
            font-weight: 600;
            text-overflow: ellipsis;
            overflow: hidden;
            cursor: pointer;
            transition: 100ms;
            display: flex;
            align-items: center;

            :hover {
                color: #0072ce;
            }
        }

        .list-title {
            border-bottom: 2px solid #f2f2f2;
            display: flex;
            align-items: center;
            justify-content: space-between;

            > div {
                float: left;
                text-overflow: ellipsis;
                overflow: hidden;
                width: 82%;
            }
            .arrow {
                float: right;
                width: 48px;
                height: 100%;
                background-image: url(${ArrowDownImage});
                background-repeat: no-repeat;
                background-position: center center;
                background-size: 16px auto;

                &.up {
                    background-image: url(${ArrowUpImage});
                }
            }
        }
        .list-scroll {
            max-height: 140px;
            overflow: auto;

            .item {
                border-top: 2px solid #f2f2f2;

               :first-of-type {
                    border-top: 0px solid #f2f2f2;
                }
            }
        }
        .list-create {
            background: #24272a;
            text-transform: uppercase;
            color: #24272a;
            padding: 0 0 0 60px;
            background-image: url(${AddBlueImage});
            background-position: 12px center;
            background-repeat: no-repeat;
            background-size: 24px 24px;
        }
    }
}
`

const SelectAccountDropdown = ({
    handleOnClick,
    account,
    availableAccounts,
    dropdown,
    handleSelectAccount,
    redirectCreateAccount,
    disabled
    }) => (
    <Translate>
        {({ translate }) => (
            <CustomSegment
                basic
                onClick={!disabled ? handleOnClick : () => { }}
                className={disabled && 'disabled'}
                title={!dropdown ? (!disabled ? translate('selectAccountDropdown.switchAccount') : translate('selectAccountDropdown.switchAccounthNotAllowed')) : ''}
            >
                <Segment basic>
                    <div className='item list-title'>
                        {dropdown ? translate('button.close') : <div>{account.accountId}</div>}
                        <div className='arrow' />
                    </div>
                    <div className={`${dropdown ? '' : 'hide'}`}>
                        <div className='list-scroll'>
                            {availableAccounts
                                .filter(a => a !== account.accountId)
                                .map(a => (
                                    <div
                                        onClick={() => handleSelectAccount(a)}
                                        className='item'
                                        key={a}
                                        title={translate('selectAccountDropdown.selectAccount')}
                                    >{a}</div>
                                ))}
                            {availableAccounts.length < 2 &&
                                <div className='item'>{translate('selectAccountDropdown.noOtherAccounts')}</div>
                            }
                        </div>
                        {!DISABLE_CREATE_ACCOUNT &&
                            <div
                                onClick={redirectCreateAccount}
                                className='item list-create color-seafoam-blue'
                                title={translate('selectAccountDropdown.createAccount')}
                            >
                                {translate('selectAccountDropdown.createAccount')}
                            </div>
                        }
                    </div>
                </Segment>
            </CustomSegment>
        )}
    </Translate>
)

export default SelectAccountDropdown;
