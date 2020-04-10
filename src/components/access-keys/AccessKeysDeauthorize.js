import React from 'react'
import { Translate } from 'react-localize-redux'

import MainImage from '../common/MainImage'
import Balance from '../common/Balance'
import AccessKeysDeauthorizeConfirm from './AccessKeysDeauthorizeConfirm'
import FormButton from '../common/FormButton'

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
    formLoader
}) => (
    <div className='deauthorize-box'>
        <div className='top'>
            <div>
                <div className='title'>
                    {false &&
                        <div className='image'>
                            <MainImage
                                src={showSubData.image}
                                size='big'
                            />
                        </div>
                    }
                    <div className='details'>
                        {showSubData.access_key.permission.FunctionCall
                            ? <>
                                <h2>
                                    {showSubData.access_key.permission.FunctionCall.receiver_id}
                                </h2>
                                <h5 className='color-blue'>
                                    <span className='color-black'><Translate id='amount' />: </span>
                                    <Balance amount={showSubData.access_key.permission.FunctionCall.allowance} />
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
                        formLoader={formLoader}
                    />
                ) : (
                    <FormButton
                        className='deauthorize'
                        color='red'
                        sending={formLoader}
                        onClick={showSubData.access_key.permission === 'FullAccess' ? handleConfirm : handleDeauthorize}
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
        {false && (
            <div className='recent-transactions'>
                <h6 className='title border-top'>
                    RECENT TRANSACTIONS
                </h6>
                <div className='row border-top'>
                    <b className='color-black'>Another thing here</b>
                    <div>3h ago</div>
                </div>
                <div className='row border-top'>
                    <b className='color-black'>Another Thing Happened</b>
                    <div>3d ago</div>
                </div>
                <div className='row border-top'>
                    <b className='color-black'>In-app purchase: 20 Ⓝ</b>
                    <div>1w ago</div>
                </div>
                <div className='row border-top'>
                    <b className='color-black'>Staked: 10 Ⓝ</b>
                    <div>2w ago</div>
                </div>
                <div className='row border-top'>
                    <b className='color-black'>Authorized</b>
                    <div>2w ago</div>
                </div>
            </div>
        )}
    </div>
)

export default AccessKeysDeauthorize
