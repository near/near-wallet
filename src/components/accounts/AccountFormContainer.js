import React from 'react'
import PropTypes from 'prop-types'
import { Container, Grid } from 'semantic-ui-react'

import Disclaimer from '../common/Disclaimer'

import styled from 'styled-components'

const CustomContainer = styled(Container)`
    &&&& {
        .page-title {
            padding-right: 0px;
            padding-top: 48px;
            padding-bottom: 0px;

            .column {
                padding: 0 14px 48px 0;
            }
            h2 {
                color: #4a4f54 !important;

                span {
                    color: #24272a;
                    background: #f8f8f8;
                    padding: 8px 12px;
                }
            }
        }
        
        @media screen and (max-width: 767px) {
            .page-title {
                padding-top: 0px;
                text-align: left;

                .column {
                    padding: 0 0 6px 0;
                }
                h1 {
                    margin-bottom: 0px;
                }
                h2 {
                    font-size: 14px !important;
                    color: #999 !important;
                    padding-bottom: 12px;
                    margin-top: 0px;

                    span {
                        padding: 4px 12px;
                    }
                }
                .column.add {
                    text-align: left;
                    padding-top: 0px !important;
                }
            }
        }
    }
`

/* eslint-disable jsx-a11y/accessible-emoji */
const AccountFormContainer = ({ title, text, children, wide, disclaimer = true }) => (
    <CustomContainer>
        <Grid stackable>
          <Grid.Row columns={wide ? `1` : `2`} className='page-title'>
                <Grid.Column computer={wide ? 16 : 9} tablet={wide ? 16 : 8} mobile={16}>
                    <h1>{title}</h1>
                    <h2>{text}</h2>
                </Grid.Column>
            </Grid.Row>
        </Grid>

        {children}

        {disclaimer && <Disclaimer />}
    </CustomContainer>
)

AccountFormContainer.propTypes = {
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]),
    text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]),
    children: PropTypes.element,
    wide: PropTypes.bool,
    disclaimer: PropTypes.bool
}

export default AccountFormContainer
