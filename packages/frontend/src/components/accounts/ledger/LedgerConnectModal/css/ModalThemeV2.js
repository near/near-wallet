import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`

    
    .modal {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0px !important;
        width: 500px !important;
        line-height: 21px;
        && {
            border-radius: 16px;
        }
        
        .content {
            text-align: center;
            padding: 36px 48px !important;
        }

        && {
            .buttons {
                display: flex;
                justify-content: flex-end;
                
                width: 100%;
                border-top: 1px solid #F0F0F1;
                padding: 24px;

                button {
                    margin: 0px;
                    width: auto;
                    padding: 18px 38px;

                    :last-of-type {
                        margin-left: 48px;  
                    }
                }
            }
        }

        svg {
            margin: 20px 0 60px -30px;
        }

        .error svg {
            margin: 20px 0 60px;
        }

        .input {
            width: 100%;
        }
        h4 {
            margin-top: 2rem;
            text-align: center;
        }

        h2 {
            @media (max-width: 500px) {
                max-width: 85%
            }

            &.dots {
                &:after {
                    content: '.';
                    animation: link 1s steps(5, end) infinite;
                
                    @keyframes link {
                        0%, 20% {
                            color: rgba(0,0,0,0);
                            text-shadow:
                                .3em 0 0 rgba(0,0,0,0),
                                .6em 0 0 rgba(0,0,0,0);
                        }
                        40% {
                            color: #4a4f54;
                            text-shadow:
                                .3em 0 0 rgba(0,0,0,0),
                                .6em 0 0 rgba(0,0,0,0);
                        }
                        60% {
                            text-shadow:
                                .3em 0 0 #4a4f54,
                                .6em 0 0 rgba(0,0,0,0);
                        }
                        80%, 100% {
                            text-shadow:
                                .3em 0 0 #4a4f54,
                                .6em 0 0 #4a4f54;
                        }
                    }
                }
            }
        }

        ol {
            margin: 15px 0 35px 0;
        }

        li {
            padding-left: 10px;
            margin-top: 20px;
        }

        p {
            text-align: center;
            
            
        }
    }
`;
