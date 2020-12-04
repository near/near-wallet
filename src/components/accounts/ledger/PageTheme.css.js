import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
    display: flex;
    flex-direction: column;
    align-items: center;

    svg {
        margin: 20px 0;
    }

    button {

        &.link {
            margin-top: 25px;
        }

        &.blue {
            width: 100% !important;
        }

        &.remove-all-keys {
            min-height: 48px;
            height: auto;
            line-height: 140%;
        }
    }

`;