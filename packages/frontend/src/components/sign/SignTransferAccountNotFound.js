import React from "react";
import { Translate } from "react-localize-redux";
import styled from "styled-components";

import AccountNotFound from "../../images/icon-account-not-found.svg";
import ArrowUpImage from "../../images/icon-arrow-up-green.svg";
import FormButton from "../common/FormButton";
import Container from "../common/styled/Container.css";
import SafeTranslate from "../SafeTranslate";

const CustomContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #25282a;
    text-align: center;

    .title {
        margin-top: 23px;

        h2 {
            font-weight: 900;
            font-size: 22px;
            color: #24272a;
        }
    }

    && .text {
        color: #72727a;
        margin-top: 24px;
    }

    .buttons {
        display: flex;
        width: 100%;
        margin-top: 40px;

        button {
            flex: 1;

            &:last-of-type {
                margin-left: 30px;

                @media (min-width: 768px) {
                    margin-left: 50px;
                }
            }
        }
    }

    .fees {
        width: 100%;
        border: 1px solid #f0f0f1;
        padding: 15px;
        border-radius: 8px;
        margin-top: 30px;
        color: #72727a;

        b {
            color: #25282a;
        }

        .fees-line {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 12px;

            .tgas {
                color: #00c08b;
                position: relative;

                :after {
                    content: "";
                    position: absolute;
                    background: url(${ArrowUpImage}) center top no-repeat;
                    width: 16px;
                    height: 17px;
                    left: -22px;
                    top: 1px;
                }
            }
        }
    }
`;

const SignTransferAccountNotFound = ({
    handleCancel,
    signCallbackUrl,
    submittingTransaction,
    signTransactionSignerId,
}) => (
    <CustomContainer className="small-centered">
        <div className="icon">
            <img src={AccountNotFound} alt="Retry" />
        </div>
        <div className="title">
            <h2>
                <Translate id="sign.accountNotFound.title" />
            </h2>
        </div>
        <div className="text">
            <SafeTranslate
                id="sign.accountNotFound.body"
                data={{ signCallbackUrl, signTransactionSignerId }}
            />
        </div>
        <div className="buttons">
            <FormButton
                onClick={handleCancel}
                disabled={submittingTransaction}
                color="gray-blue"
            >
                <Translate id="button.cancel" />
            </FormButton>
            <FormButton
                linkTo="/recover-account"
                disabled={submittingTransaction}
                sending={submittingTransaction}
            >
                <Translate id="button.importAccount" />
            </FormButton>
        </div>
    </CustomContainer>
);

export default SignTransferAccountNotFound;
