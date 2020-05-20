import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`

    .modal {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px 25px !important;
        font-family: BwSeidoRound !important;

        h2 {
            text-align: center;

            @media (max-width: 500px) {
                max-width: 70%
            }
        }

        @media (min-width: 500px) {
            padding: 40px 75px !important;
        }

        ol {

            @media (min-width: 500px) {
                max-width: 400px;
            }

            li {
                padding-left: 10px;
                margin-top: 20px;
            }
        }

        button {
            width: 100%;

            @media (min-width: 500px) {
                width: 300px;
            }

            &.gray-white {
                margin-top: 30px;
            }
        }
    }
`;