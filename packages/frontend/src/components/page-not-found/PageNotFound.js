import React from "react";
import { Translate } from "react-localize-redux";
import styled from "styled-components";

import textBackgroundImage  from "../../images/bg-landing-patterned.svg";
import FormButton from "../common/FormButton";
import Container from "../common/styled/Container.css";



const StyledContainer = styled.div`
  &&& {
    margin: 35px 5px 0 5px;
    position: relative;
    text-align: center;

    @media (max-width: 767px) {
      margin: 0;
      padding: 0 20px;
      overflow: hidden;
      margin-top: -13px;
    }

    .small-centered {
      padding-top: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    h1.title {
      font-weight: 600;
    }

    h1.displayTitle{
        position:relative;
        font-size: 20vw;
        line-height: 1.2;
        background: url(${textBackgroundImage});
        background-size: 200%;
        background-position: -56% 50%;
        -webkit-background-clip: text;
        color: rgba(0,0,0,0.08);

        @media (max-width: 767px) {
            font-size: 45vw;
        }
    }

    .buttons {
      margin-top: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 1;

      .blue {
        font-weight: 500 !important;
        margin: 0;
        text-transform: none;

        :not(.link) {
          min-width: 200px;
          max-width: 220px;
          height: auto;
          text-transform: none;
          padding: 12px 6px;
        }
      }
      }

      span {
        margin: 20px;
      }

      @media (min-width: 768px) {
        flex-direction: row;
      }
    }
  }
`;

export function PageNotFound() {
  return (
    <StyledContainer>
      <Container className="small-centered">
        <h1 className="title">
          <Translate id="pageNotFound.title" />
        </h1>
        <h1 className="displayTitle">
            <Translate id="pageNotFound.displayTitle" />
        </h1>
        <div className="buttons">
          <FormButton linkTo="/">
            <Translate id="pageNotFound.returnToWallet" />
          </FormButton>
        </div>
      </Container>
    </StyledContainer>
  );
}
