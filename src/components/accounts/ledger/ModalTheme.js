import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`

    .modal {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px 25px !important;

        h2 {
            text-align: center;

            @media (max-width: 500px) {
                max-width: 85%
            }
        }

        @media (min-width: 500px) {
            padding: 40px 75px !important;
        }

        ol, p {

            @media (min-width: 500px) {
                max-width: 400px;
            }
        }

        li {
            padding-left: 10px;
            margin-top: 20px;
        }

        p {
            text-align: center;
            
            :first-of-type {
                margin-top: 30px;
            }
        }

        button {
            width: 100%;

            @media (min-width: 500px) {
                width: 300px;
            }

            .blue, .primary-gray {
                margin-top: 30px;
            }

            :last-of-type {
                margin-top: 25px;
            }
        }
    }

    #ledger-confirm-action-modal {
        svg {
            margin: 20px 0;
        }
    }
`;