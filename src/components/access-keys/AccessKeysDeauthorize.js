import React from 'react'
import { Translate } from 'react-localize-redux'

import MainImage from '../common/MainImage'
import FormButton from '../common/FormButton'
import Balance from '../common/Balance'

import { List, Button, Input, Form } from 'semantic-ui-react'

const AccessKeysDeauthorize = ({
    showSubData, 
    handleDeauthorize,
    accountId,
    confirm,
    confirmStatus,
    handleConfirm,
    handleConfirmSubmit,
    handleChange,
    handleConfirmClear
}) => (
    // TODO: Simplify layout as seems too much unnecessary nesting, while can use simple html tags, etc
    <List>
        <List.Item>
            <List horizontal className='title'>
                {false &&
                    <List.Item className='image'>
                        <MainImage
                            src={showSubData.image}
                            size='big'
                        />
                    </List.Item>
                }
                <List.Item>
                    {showSubData.access_key.permission.FunctionCall
                        ? <React.Fragment>
                            <List.Header as='h2'>
                                {showSubData.access_key.permission.FunctionCall.receiver_id}
                            </List.Header>
                            <List.Item as='h5' className='color-blue'>
                                <span className='color-black'><Translate id='amount' />: </span>
                                <Balance amount={showSubData.access_key.permission.FunctionCall.allowance} />
                            </List.Item>
                        </React.Fragment>
                        : null
                    }
                    <List.Item as='h5' className='color-blue' style={{
                        // TODO: Better way to fit public key
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        width: '30em'
                    }}>
                        {showSubData.public_key}
                    </List.Item>
                </List.Item>
            </List>
        </List.Item>
        <List.Item className='remove-connection'>
            {confirm ? (
                <Form onSubmit={(e) => handleConfirmSubmit(e)}>
                    <Translate>
                        {({ translate }) => (
                            <Input 
                                name='accountId'
                                value={accountId}
                                onChange={handleChange}
                                className={confirmStatus ? (confirmStatus === 'success' ? 'success' : 'problem') : ''}
                                placeholder={translate('login.confirm.username')}
                                maxLength='32'
                                required
                                autoComplete='off'
                                autoCorrect='off'
                                autoCapitalize='off'
                                spellCheck='false'
                                tabIndex='1'
                                autoFocus={true}
                            />
                        )}
                    </Translate>
                    <div className='alert-info'>
                        {confirmStatus === 'problem' && `Account name doesn't match`}
                    </div>
                    <div className='confirm'>
                        <FormButton
                            color='gray-white'
                            onClick={handleConfirmClear}
                            size='small'
                            type='button'
                        >
                            <Translate id='button.cancel' />
                        </FormButton>

                        <FormButton
                            color='blue'
                            disabled={confirmStatus !== 'problem' && accountId ? false : true}
                            size='small'
                            type='submit'
                        >
                            <Translate id='button.confirm' />
                        </FormButton>
                    </div>
                </Form>
            ) : (
                <Button className='deauthorize' onClick={showSubData.access_key.permission === 'FullAccess' ? handleConfirm : handleDeauthorize}>
                    <Translate id='button.deauthorize' />
                </Button>
            )}
        </List.Item>
        <List.Item className='authorized-transactions'>
            <List.Item
                as='h6'
                className='authorized-transactions-title border-top'
            >
                <Translate id='fullAccessKeys.authorizedTo' />
            </List.Item>
            <List.Item className='authorized-transactions-row color-black'>
                <Translate id='fullAccessKeys.viewYourAccountName' />
            </List.Item>
            {showSubData.access_key.permission === 'FullAccess'
                ? <List.Item className='authorized-transactions-row color-black'>
                    <Translate id='fullAccessKeys.submitAnyTransaction' />
                </List.Item>
                : null
            }
            {showSubData.access_key.permission.FunctionCall
                ? <List.Item className='authorized-transactions-row color-black'>
                    <Translate id='fullAccessKeys.useContract' data={{ receiverId: showSubData.access_key.permission.FunctionCall.receiver_id }} />
                </List.Item>
                : null
            }
        </List.Item>
        {false && (
            <List.Item className='recent-transactions'>
                <List.Item
                    as='h6'
                    className='recent-transactions-title border-top'
                >
                    RECENT TRANSACTIONS
                </List.Item>
                <List.Item className='recent-transactions-row border-top'>
                    <List.Header>
                        Another thing here
                    </List.Header>
                    <List.Item>3h ago</List.Item>
                </List.Item>
                <List.Item className='recent-transactions-row border-top'>
                    <List.Header>
                        Another Thing Happened
                    </List.Header>
                    <List.Item>3d ago</List.Item>
                </List.Item>
                <List.Item className='recent-transactions-row border-top'>
                    <List.Header>
                        In-app purchase: 20 Ⓝ
                    </List.Header>
                    <List.Item>1w ago</List.Item>
                </List.Item>
                <List.Item className='recent-transactions-row border-top'>
                    <List.Header>Staked: 10 Ⓝ</List.Header>
                    <List.Item>2w ago</List.Item>
                </List.Item>
                <List.Item className='recent-transactions-row border-top'>
                    <List.Header>Authorized</List.Header>
                    <List.Item>2w ago</List.Item>
                </List.Item>
            </List.Item>
        )}
    </List>
)

export default AccessKeysDeauthorize
