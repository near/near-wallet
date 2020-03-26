import React from 'react'
import { Form, Grid, Responsive } from 'semantic-ui-react'

import RequestStatusBox from '../common/RequestStatusBox'
import AccountNote from '../common/AccountNote'

import styled from 'styled-components'

const CustomForm = styled(Form)`
    &&&& {
        margin-left: -1rem;

        h4.column {
            padding-bottom: 0;
        }
        h4.digit-code {
            margin-bottom: -10px;
        }
        .username-row {
            padding-bottom: 0px;
            margin-left: -1rem;
        }
        .form-row {
            margin-left: -1rem;
        }
        .recover {
            margin-top: 12px;
            color: #24272a;
            line-height: 24px;
            font-weight: 600;

            a {
                text-decoration: underline;

                :hover {
                    text-decoration: none;
                }
            }
        }
        .toggle-backup {
            margin-top: 10px;
            width: fit-content;
        }
        .input {
            width: 100%;
        }
        .input.sms {
            width: 122px;
            margin-right: 24px;
        }
        .create {
            position: relative;
            margin-bottom: 0px;
            .react-phone-number-input__country {
                position: absolute;
                top: 24px;
                left: 12px;
                z-index: 1;

                &-select-arrow {
                    display: none;
                }
            }
        }

        .react-phone-number-input__phone {
            padding-left: 34px !important;
        }
        
        .react-phone-number-input__icon {
            padding: 0;
        }

        h4 {
            margin-bottom: 0px;
        }

        @media screen and (max-width: 991px) {
            .input.sms {
                width: 288px;
                margin-top: 0px;
            }
            h4.digit-code {
                margin-bottom: 0px;
            }
        }
        @media screen and (max-width: 767px) {
            margin-left: 0;
            
            .username-row {
                margin-left: 0;
            }
            .form-row {
                padding-top: 6px;
                margin-left: 0;
            }
            .input.sms {
                width: 100%;
                margin-right: 0px;
                display: block;
                margin-top: 0px;
            }
            h4 {
                font-size: 14px;
            }
            h4.digit-code.empty {
                padding: 0px;
                height: 0px;
                margin: -24px 0 0 0;
            }
            
        }
    }
`

const AccountFormSection = ({ handleSubmit, requestStatus, location, children }) => (
    <CustomForm autoComplete='off' onSubmit={(e) => {handleSubmit(); e.preventDefault();}}>
        <Grid>
            <Grid.Column computer={8} tablet={8} mobile={16}>
                {children}
            </Grid.Column>
            <Grid.Column computer={7} tablet={8} mobile={16}>
                {location && <AccountNote />}
            </Grid.Column>
        </Grid>
    </CustomForm>
)

export default AccountFormSection
