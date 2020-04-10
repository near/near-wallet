import React from 'react'
import { Translate } from 'react-localize-redux'

import { Grid, Image } from 'semantic-ui-react'

import ArrowRight from '../../images/icon-arrow-right.svg'
import ArrowBlkImage from '../../images/icon-arrow-blk.svg'

import styled from 'styled-components'
import Balance from '../common/Balance'

// TODO: Refactor common code with KeyListItem
const CustomGridRow = styled(Grid.Row)`
    &&& {
        margin-left: 20px;
        border-left: 4px solid #f8f8f8;
        cursor: pointer;

        &.wide {
            margin-left: 0px;
            border-left: 0px;
        }

        .main-row-title {
            font-weight: 600;
            width: auto;
            padding-right: 0px;
            flex: 1;
            word-break: break-all;
        }

        .dropdown-image-right {
            width: 10px;
            margin: 0;
        }
        .dropdown-image {
            float: right;
        }

        &.dropdown-down {
            background-color: #f8f8f8;

            .dropdown-image-right {
                width: 10px;
                top: 0px;
                left: 12px;
            }
        }

        &.showsub {
            .dropdown-image-right {
                left: -24px;
            }
        }
        &.showsub.dropdown-down {
            .dropdown-image-right {
                left: -6px;
            }
        }

        @media screen and (max-width: 767px) {
            &.showsub {
                .dropdown-image-right {
                    left: -14px;
                }
            }
            &.showsub.dropdown-down {
                .dropdown-image-right {
                    left: 4px;
                }
            }

            .main-row-title {
                a {
                    font-size: 14px;
                }
            }
        }
    }
`

const KeyListItem = ({
    accessKey,
    i,
    wide = false,
    showSub = false,
    toggleShowSub,
    showSubOpen
}) => {
    let { access_key, public_key: publicKey, meta } = accessKey
    let { permission: { FunctionCall } } = access_key || { permission: {} };
    let { receiver_id: contractId, allowance } = FunctionCall || {};

    return <CustomGridRow
        verticalAlign='middle'
        className={`${wide ? `wide` : ``} ${
            showSub && showSubOpen === i ? `dropdown-down` : ``
        } ${showSub ? `showsub` : ``}`}
        onClick={() => wide && toggleShowSub(i, accessKey)}
    >
        <Grid.Column
            computer={wide ? 15 : 16}
            tablet={wide ? 14 : 16}
            mobile={wide ? 14 : 16}
        >
            <Grid verticalAlign='middle'>
                {FunctionCall
                    // TODO: Use more reasonable markup like <b> instead of <span className='color-black'>
                    ? <Grid.Column className='main-row-title'>
                            <span className='color-black'>{contractId}</span>
                            <span className='font-small'>
                                <br/>
                                <Translate id='authorizedApps.feeAllowance' />:{' '}
                                <span className='color-black'>{allowance ? <Balance amount={allowance} /> : 'N/A'}</span>
                                <br/>
                                <Translate id='authorizedApps.publicKey' />:{' '}
                                <span className='color-black'>{publicKey}</span>
                            </span>
                        </Grid.Column>
                    : <Grid.Column className='main-row-title'>
                            <span className='font-small'>
                                <Translate id='authorizedApps.publicKey' />:{' '}
                                <span className='color-black'>{publicKey}</span>
                            </span>
                            {meta.type === 'ledger' ? <p><Translate id='authorizedApps.ledger' /></p> : null}
                        </Grid.Column>
                }
            </Grid>
        </Grid.Column>
        {wide && (
            <Grid.Column
                computer={1}
                tablet={2}
                mobile={2}
                textAlign='right'
            >
                <Image
                    src={showSub && showSubOpen === i ? ArrowBlkImage : ArrowRight}
                    className='dropdown-image dropdown-image-right'
                />
                {/* <span className='font-small'>{row[3]}</span> */}
            </Grid.Column>
        )}
    </CustomGridRow>
}

export default KeyListItem
