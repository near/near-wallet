import React from "react";
import { Translate } from "react-localize-redux";
import styled from "styled-components";

import FormButton from "../common/FormButton";
import Container from "../common/styled/Container.css";
import LandingBackground from "../landing/LandingBackground";

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

    svg {
        opacity: 0.4;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        z-index: -1;

        @media (max-width: 992px) {
            top: -120px;
        }

        @media (max-width: 470px) {
            top: -86px;
            width: 900px;
            left: unset;
        }
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
        font-size: 25vw;
        // opacity: 0.1;
        line-height: 1.2;
        // text-shadow: .03em .03em 0 hsla(230,40%,50%,1);
        background: url(https://near.org/wp-content/uploads/2021/10/CITY_02.jpg);
        background-size: 100%;
        background-position: 50% 50%;
        -webkit-background-clip: text;
        color: rgba(0,0,0,0.08);
        animation: zoomout 10s ease 500ms forwards;

        @media (max-width: 767px) {
            font-size: 45vw;
        }
    }

    @keyframes zoomout {
        from {
          background-size: 100%;
        }
        to {
          background-size: 40%;
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
      <LandingBackground/>
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
