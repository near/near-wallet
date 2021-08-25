import React from 'react';
import { Translate } from 'react-localize-redux';

import Balance from '../common/balance/Balance';
import FormButton from '../common/FormButton';
import AccessKeysDeauthorizeConfirm from './AccessKeysDeauthorizeConfirm';

const AccessKeysDeauthorize = ({
    showSubData, 
    handleDeauthorize,
    accountId,
    confirm,
    confirmStatus,
    handleConfirm,
    handleConfirmSubmit,
    handleChange,
    handleConfirmClear,
    mainLoader
}) => (
    <div className='deauthorize-box'>
        <div className='top'>
            <div>
                <div className='title'>
                    <div className='details'>
                        {showSubData.access_key.permission.FunctionCall
                            ? <>
                                <h2>
                                    {showSubData.access_key.permission.FunctionCall.receiver_id}
                                </h2>
                                <h5 className='color-blue'>
                                    <span className='color-black'><Translate id='amount' />: </span>
                                    <Balance amount={showSubData.access_key.permission.FunctionCall.allowance} showBalanceInUSD={false}/>
                                </h5>
                            </>
                            : null
                        }
                        <div className='publickey color-blue'>
                            {showSubData.public_key}
                        </div>
                    </div>
                </div>
            </div>
            <div className='remove-connection'>
                {confirm ? (
                    <AccessKeysDeauthorizeConfirm 
                        handleConfirmSubmit={handleConfirmSubmit}
                        handleChange={handleChange}
                        accountId={accountId}
                        confirmStatus={confirmStatus}
                        handleConfirmClear={handleConfirmClear}
                        mainLoader={mainLoader}
                    />
                ) : (
                    <FormButton
                        className='deauthorize'
                        color='red'
                        sending={mainLoader}
                        onClick={showSubData.access_key.permission === 'FullAccess' ? handleConfirm : handleDeauthorize}
                        sendingString='button.deAuthorizing'
                    >
                        <Translate id='button.deauthorize' />
                    </FormButton>
                )}
            </div>
            <div className='authorized-transactions'>
                <h6 className='title border-top'>
                    <Translate id='fullAccessKeys.authorizedTo' />
                </h6>
                <div className='row color-black'>
                    <Translate id='fullAccessKeys.viewYourAccountName' />
                </div>
                {showSubData.access_key.permission === 'FullAccess'
                    ? <div className='row color-black'>
                        <Translate id='fullAccessKeys.submitAnyTransaction' />
                    </div>
                    : null
                }
                {showSubData.access_key.permission.FunctionCall
                    ? <div className='row color-black'>
                        <Translate id='fullAccessKeys.useContract' data={{ receiverId: showSubData.access_key.permission.FunctionCall.receiver_id }} />
                    </div>
                    : null
                }
            </div>
        </div>
    </div>
);

export default AccessKeysDeauthorize;
