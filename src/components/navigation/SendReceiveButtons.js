import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../common/FormButton';
import DownArrowIcon from '../svg/DownArrowIcon';
import SendIcon from '../svg/SendIcon';

const Container = styled.div`
    &&& {
        @media (max-width: 1199px) {
            display: none;
        }
    
        border-radius: 40px;
        margin: 0px 0px 0px 20px;
        display: flex;
    
        button {
            &.dark-gray {
                display: flex;
                align-items: center;
                justify-content: center;
                flex: 1;
                border: 0;
                padding: 6px 20px;
                height: 40px;
                width: auto;
                font-weight: 400;
                margin: 0;
                border-radius: 0;
        
                > svg {
                    margin: 0 8px 0 0;
                    min-width: 16px;
                    width: 16px;
                    height: 16px;
        
                    path {
                        stroke: #A2A2A8;
                    }
                }
        
                :nth-of-type(1) {
                    border-top-left-radius: 40px;
                    border-bottom-left-radius: 40px;
                    border-right: 1px solid #3F4045;
                }
        
                :nth-of-type(2) {
                    border-top-right-radius: 40px;
                    border-bottom-right-radius: 40px;
                }
            }
        }
    }
`;

const SendReceiveButtons = () => (
    <Container>
        <FormButton linkTo='/send-money' color='dark-gray' className='small'>
            <SendIcon/>
            <Translate id='button.send'/>
        </FormButton>
        <FormButton linkTo='receive-money' color='dark-gray' className='small'>
            <DownArrowIcon/>
            <Translate id='button.receive'/>
        </FormButton>
    </Container>
);

export default SendReceiveButtons;