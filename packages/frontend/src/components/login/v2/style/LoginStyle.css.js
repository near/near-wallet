import styled from 'styled-components';

export default styled.div`
    &&& {
        h3, .desc {
            text-align: center;
        }
    
        h3 {
            color: black;
            word-break: break-all;
            line-height: 150%;
        }
    
        .desc {
            color: #72727A;
            line-height: 150%;
            margin: 15px 0 30px 0;
    
            b {
                color: #3F4045;
            }
        }

        &.full-access {
            .desc {
                b {
                    color: #FC5B5B;
                }
            }
        }
    
        &.confirm-login {
            .desc {
                margin-bottom: 50px;
            }
        }
    
        .button-group {
            margin-top: 30px;
        }
    
        .swap-graphic {
            margin: 0 auto 35px auto;
            display: block;
        }
    
        .alert-banner {
            margin: 55px 0 -15px 0;

            > div {
                font-style: normal;
            }
        }

        .deposit-near-banner {
            margin: 40px 0 -15px 0;
        }

        .connect-with-application {
            margin: 0 auto;
        }

        .loading-dots {
            transform: rotate(90deg);
            margin: 30px 0;
        }

        &.invalid-contract {
            > button {
                width: 100%;
            }
        }
    }
`;
