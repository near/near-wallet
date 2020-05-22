import React from 'react';
import styled from 'styled-components';
import Card from '../../common/styled/Card.css';
import FormButton from '../../common/FormButton';
import HardwareDeviceIcon from '../../svg/HardwareDeviceIcon';

const Container = styled(Card)`
    margin-top: 30px;

    .header {
        display: flex;
        align-items: center;

        h2 {
            line-height: normal;
        }

        svg {
            width: 28px;
            height: 28px;
            margin: -5px 10px 0 0;

            path {
                stroke: #CCCCCC;
            }
        }
    }

    .font-rounded {
        margin-top: 15px;
    }

    .device {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 2px solid #f8f8f8;
        margin: 20px -20px 0 -20px;
        padding: 20px 20px 0 20px;

        .name {
            font-weight: 600;
            color: #24272a;

            div {
                color: #5ACE84;
                margin-top: 3px;
            }
        }

        button {
            width: 100px !important;
            height: 40px !important;
            letter-spacing: 0.5px !important;
            margin: 0 !important;
            padding: 0;
        }
    }

    i {
        margin-top: 20px;
        display: block;
    }
`

const HardwareDevices = () => {
    return (
        <Container>
            <div className='header'>
                <HardwareDeviceIcon/>
                <h2>Hardware Devices</h2>
            </div>
            <div className='font-rounded'>
                Improve the security of your account by entrusting your keys to a hardware wallet.
            </div>
            <div className='device'>
                <div className='name'>
                    Ledger Hardware Wallet
                    {/*<div>Authorized</div>*/}
                </div>
                <FormButton linkTo='/setup-ledger'>Enable</FormButton>
            </div>
            {/*<i>In order to disable your ledger device, you must first enable an alternative recovery method.</i>*/}
        </Container>
    )
}

export default HardwareDevices;