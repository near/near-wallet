import React from 'react'

import { Grid, Image } from 'semantic-ui-react'

import MainImage from '../common/MainImage'

import ArrowRight from '../../images/icon-arrow-right.svg'
import ArrowBlkImage from '../../images/icon-arrow-blk.svg'

import styled from 'styled-components'

const CustomGridRow = styled(Grid.Row)`
    &&& {
        margin-left: 20px;
        border-left: 4px solid #f8f8f8;
        cursor: pointer;

        .col-image {
            margin-left: -33px;
            width: 40px;
            flex: 0 0 40px;
            padding-left: 0px;

            > div {
                margin: 0 24px 0 18px;
            }
        }

        &.wide {
            margin-left: 0px;
            border-left: 0px;

            .col-image {
                margin-left: 6px;
                width: 56px;
                flex: 0 0 56px;

                > div {
                    margin: 0 24px 0 0;    
                }
            }
        }

        .main-row-title {
            font-weight: 500;
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

        @media screen and (max-width: 991px) {
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

            &.wide {

                .col-image {
                    margin-left: 12px;
                }
            }
        }
    }
`

const ListItem = ({
    row,
    i,
    wide = false,
    showSub = false,
    toggleShowSub,
    showSubOpen
}) => (
    <CustomGridRow
        verticalAlign='middle'
        className={`${wide ? `wide` : ``} ${
            showSub && showSubOpen === i ? `dropdown-down` : ``
        } ${showSub ? `showsub` : ``}`}
        onClick={() => wide && toggleShowSub(i, row)}
    >
        <Grid.Column
            computer={wide ? 15 : 16}
            tablet={wide ? 14 : 16}
            mobile={wide ? 14 : 16}
        >
            <Grid verticalAlign='middle'>
                {false &&
                    <Grid.Column className='col-image'>
                        <MainImage 
                            src={row[0]} 
                            size={wide ? `medium` : `tiny`}
                        />
                    </Grid.Column>
                }
                <Grid.Column className='main-row-title'>
                    contractId: <span className='color-black'>{row[1]}</span>
                    {row[2] != null && (
                        <span className='font-small'>
                            <br />
                            amount:
                            <span className='color-black'>{row[2]}Ⓝ</span>, publicKey:{' '}
                            <span className='color-black'>{row[3]}</span>
                        </span>
                    )}
                </Grid.Column>
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
)

export default ListItem
