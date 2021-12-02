import React from "react";
import { Translate } from "react-localize-redux";
import styled from "styled-components";

import FormButton from "../common/FormButton";
import Container from "../common/styled/Container.css";

const StyledContainer = styled.div`
  &&& {
    margin: 35px 5px 0 5px;
    position: relative;
    text-align: center;

    @media (max-width: 767px) {
      margin: 0;
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

    h1 {
      font-weight: 600;
    }

    h3 {
      font-weight: 400 !important;
      line-height: 150%;

      span {
        span {
          font-weight: 500;
        }
      }

      @media (max-width: 767px) {
        font-size: 16px !important;
      }
    }

    .buttons {
      margin-top: 30px;
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

      .link {
        text-decoration: none;
        padding: 0;
        :hover {
          background-color: transparent;
          text-decoration: underline;
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
        <h1>
          <Translate id="pageNotFound.title" />
        </h1>
        <h3>
          <Translate id="pageNotFound.desc" />
        </h3>
        <div className="buttons">
          <FormButton linkTo="/">
            <Translate id="pageNotFound.returnToWallet" />
          </FormButton>
        </div>
      </Container>
    </StyledContainer>
  );
}
