import React from "react";
import { Translate } from "react-localize-redux";
import styled from "styled-components";

import textBackgroundImage  from "../../images/bg-landing-patterned.svg";
import FormButton from "../common/FormButton";
import Container from "../common/styled/Container.css";

const StyledContainer = styled(Container)`
  &&& {
    text-align: center;
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1.title {
      font-weight: 600;
    }

    h1.displayTitle{
        font-size: 20vw;
        line-height: 1.2;
        background: url(${textBackgroundImage});
        background-size: 200%;
        background-position: -56% 50%;
        -webkit-background-clip: text;
        color: rgba(0,0,0,0.08);

        @media (max-width: 767px) {
            font-size: 40vw;
        }
    
        @media (min-width: 1200px) {
            font-size: 240px;
        }
    }

    button {
        margin: 0;
        min-width: 200px;
    }
  }
`;

export function PageNotFound() {
  return (
    <StyledContainer>
        <h1 className="title">
            <Translate id="pageNotFound.title" />
        </h1>
        <h1 className="displayTitle">
            <Translate id="pageNotFound.displayTitle" />
        </h1>
        <FormButton linkTo="/">
            <Translate id="pageNotFound.returnToWallet" />
        </FormButton>
    </StyledContainer>
  );
}
