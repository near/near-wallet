import styled from 'styled-components';

import Container from '../../common/styled/Container.css';

export const ModalContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;

    h3 {
        text-align: center;
    }

    .desc {
        text-align: left !important;
        padding: 0 !important;
    }

    .top-icon {
        height: 60px;
        width: 60px;
        margin-bottom: 40px;
    }

    .desc {
        padding: 0 45px;
        text-align: center;
        margin-top: 24px;
        p {
            margin: 0;
        }
    }

    button {
        align-self: stretch;
    }

    .link {
        margin-top: 16px !important;
        font-weight: normal !important;
    }

    .button-group {
        align-self: stretch;
    }

    .connect-with-application {
        margin: 20px auto 30px auto;
    }

    .transfer-amount {
        width: 100%;
    }

    .error-label {
        margin-top: 16px;
        color: #fc5b5b;
    }

    .wallet-url {
        color: #000;
        font-weight: bold;
    }
`;
