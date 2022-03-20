import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';

import Button from '../../common/Button';
import Card from '../../common/styled/Card.css';

const Container = styled(Card)`
    margin-top: 30px;
    padding: 16px;
    
    p{
        font-size: 14px;
        line-height: 150%;
        color: #A2A2A8;
    }
    .topSection {
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        div{
            .ttl{
                font-size: 14px;
                line-height: 150%;
                color: #3F4045;
            }
            .desc{
                margin-top: 4px;
            }
        }

        button {
            height: 40px;
            width: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            margin: 0;
            color: #0072CE;
            background: #F0F0F1;
            font-size: 14px;
            border: none;
        }
    }
`;

const BrowserPassword = () => {
    return (
        <Container>
            <header className="topSection">
                <div>
                    <h4 className="ttl">Brave Browser</h4>
                    <p className="desc">Desktop • v23.13</p>
                </div>

                <Link to="/security/change-password">
                    <Button>
                        Change
                    </Button>
                </Link>
            </header>
            <p>Enabled Jan 08, 2020</p>
        </Container>
    );
};

export default BrowserPassword;

