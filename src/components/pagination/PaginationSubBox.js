import React from 'react'

import AccessKeysDeauthorize from '../access-keys/AccessKeysDeauthorize'
import ContactsRemove from '../contacts/ContactsRemove'

import { List, Image } from 'semantic-ui-react'

import CloseImage from '../../images/icon-close.svg'
import MTransactionImage from '../../images/icon-m-transaction.svg'
import CheckBlueImage from '../../images/icon-check-blue.svg'

import styled from 'styled-components'

const CustomList = styled(List)`
    &&& {
        background: #fff;
        width: 100%;
        height: 100%;
        padding: 0 0;

        .deauthorize-box {
            .top {
                padding: 2em 1.5em;

                &.contacts {
                    padding: 2em 1.5em 0;
                }
                .details {
                    width: 100%;
                    margin-top: 1em;

                    h2 {
                        margin-top: -1em;
                    }
                    .publickey {
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                }
                .remove-connection {
                    padding-top: 0.5em;
                    padding-bottom: 0.5em;

                    button.red {
                        width: 100%;
                        margin-top: 12px;
                        margin-bottom: 6px;
                    }
                    .input {
                        width: 100%;
                    }
                    .confirm > button {
                        width: 45%;
                        margin-top: 8px;
                        margin-bottom: 6px;

                        :first-of-type {
                            margin-right: 10%;
                        }
                    }
                    .alert-info {
                        height: 14px;
                        font-size: 14px;
                        font-weight: 600;
                        margin: 8px 0 0 0;
                        text-align: center;
                        color: #ff585d;
                    }
                }
                .authorized-transactions {
                    background-color: #fff;
                    margin: 0;
                    padding-top: 0px;
                    
                    .title {
                        padding: 12px 0 0 24px !important;
                        background: url(${MTransactionImage}) no-repeat left 14px;
                        background-size: 12px auto;
                    }
                    .row {
                        margin: 0 0 0 24px;
                        padding: 12px 0 0 32px !important;
                        background: url(${CheckBlueImage}) no-repeat left 14px;
                        line-height: 32px;
                    }
                    .row:last-child {
                        border-bottom: 0px solid #e6e6e6;
                    }
                }
            }
            .recent-transactions {
                background-color: #f8f8f8;
                margin: 0;
                padding: 1em 1.5em;

                .title {
                    padding: 0 0 0 24px !important;
                    background: url(${MTransactionImage}) no-repeat left 2px;
                    background-size: 12px auto;
                }
                .row {
                    margin: 0 24px 0 24px;
                    padding: 12px 0 !important;
                    border-bottom: 2px solid #e6e6e6;
                }
                .row:last-child {
                    border-bottom: 0px solid #e6e6e6;
                }
            }
        }

        .img {
            width: 20px;
            position: absolute;
            top: 20px;
            right: 20px;
            padding: 0px;

            img {
                cursor: pointer;
            }
        }
        .text {
            margin: 0 10% 0 0;
            color: #24272a;
            float: left;

            .header {
                font-family: 'benton-sans', sans-serif;
            }
            .content {
                color: #999999;
                padding-top: 12px;
                line-height: 20px;
            }
        }
        
        .send {
            padding: 0 1.5em;
            
            button {
                width: 100%;
                margin-top: 1em;
            }
        }
        
        @media screen and (max-width: 991px) {
            .img {
                top: 6px;
                right: 6px;
            }
            .title {
                .item {
                    margin-left: 0;
                    text-align: center;
                }
            }
            .image {
                width: 100%;

                > div {
                    margin: 0 auto;
                }
            }
        }
        @media screen and (max-width: 767px) {
            border: 0px;
            position: absolute;
            min-height: 300px;
            top: -80px;

            .img {
                top: -12px;
                right: 8px;
            }
            .deauthorize-box {
                .top {
                    padding: 1em 0 1em 0;

                    &.contacts {
                        padding: 2em 0 0;
                    }

                    h2 {
                        font-size: 32px !important;
                    }
                    .title {
                        padding-bottom: 12px;
                        .image {
                            > div {
                                margin: 0 auto;
                            }
                        }
                    }
                    .remove-connection {
                        padding-top: 0px;
                        border-top: 2px solid #e6e6e6;
                    }
                }
                .recent-transactions {
                    margin: 0 -1em;
                    padding: 1em 1em;
                }
            }
            .send {
                padding: 0 0;
                
                button {
                    width: 100%;
                }
            }
        }
    }
`

const PaginationShowSubBox = ({ 
    toggleCloseSub,
    subPage,
    showSubData,
    handleDeauthorize,
    handleConfirm,
    handleConfirmSubmit,
    handleChange,
    handleConfirmClear,
    accountId,
    confirm,
    confirmStatus,
    formLoader
}) => (
    <CustomList className='box'>
        <List.Item className='img'>
            <Image
                onClick={() => toggleCloseSub()}
                src={CloseImage}
            />
        </List.Item>
        <List.Item>
            {subPage === 'access-keys' && showSubData ? (
                <AccessKeysDeauthorize 
                    showSubData={showSubData}
                    handleDeauthorize={handleDeauthorize}
                    handleConfirm={handleConfirm}
                    handleConfirmSubmit={handleConfirmSubmit}
                    handleChange={handleChange}
                    accountId={accountId}
                    confirm={confirm}
                    confirmStatus={confirmStatus}
                    handleConfirmClear={handleConfirmClear}
                    formLoader={formLoader}
                />
            ) : (
                <ContactsRemove
                    showSubData={showSubData}
                    handleDeauthorize={handleDeauthorize}
                />
            )}
        </List.Item>
    </CustomList>
)

export default PaginationShowSubBox
