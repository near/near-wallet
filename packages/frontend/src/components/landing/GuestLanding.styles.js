import {Link} from 'react-router-dom';
import styled from 'styled-components';

import PlusIcon from '../../images/plus-icon.png';

export const StyledContainer = styled.div`

    &&& {
        margin: 35px auto 100px auto;
        max-width: 1224px;
        position: relative;

        @media (max-width: 767px) {
            margin: 0;
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

        h1 {
            font-weight: 500;
            font-size: 72px;
            padding-bottom: 40px;
            margin: 0;
            letter-spacing: -1.08px;
            line-height: 100%;
            @media(max-width: 768px) {
                font-size: 60px;
            }
        }
        
        h2 {
            @media(max-width: 768px) {
                font-size: 45px;
            }
            
            @media(max-width: 576px) {
                font-size: 40px;
            }
        }

        h3 {
            font-size: 20px;
            font-weight: 400 !important;
            line-height: 130%;
            letter-spacing: 0.3px;
            padding-bottom: 48px;

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

        .img-wrapper {
            min-height: 300px;

            @media (min-width: 768px) {
                min-height: 600px;
            }
        }

        img {
            margin-top: 65px;
            margin-bottom: 50px;
            width: 500px;
            height: auto;

            @media (min-width: 768px) {
                width: 675px;
                margin-bottom: 75px;
            }
        }

        .email-subscribe {
            margin-top: -140px;
            margin-bottom: 50px;
            padding-top: 80px;

            @media (max-width: 767px) {
                margin-bottom: 0;
                margin-top: -100px;
            }
        }
    }
`;

export const Section = styled.div`
    width: 100%;
    position: relative;
    background-color: #F2F1EA;
    padding: 100px 0 60px 0;
    @media(max-width: 768px) {
        padding: 50px 30px;
    }
    h2 {
        color: #000000;
        font-size: 56px;
        font-style: normal;
        font-weight: 500;
        line-height: 130%;
        padding-bottom: 42px;
    }
    h3 {
        color: #000000;
        padding-bottom: 120px;
        @media(max-width: 768px) {
            padding-bottom: 50px;
        }
        font-size: 30px;
        font-style: normal;
        font-weight: 400;
        line-height: 130%;
    }
`;

export const MainContainer = styled.div`
    background-image: url(${PlusIcon});
    background-size: 100px 95px;
    min-height: 680px;
    display: flex;
    width: 100%;
    -webkit-box-align: center;
    align-items: center;
    background-repeat: repeat;
    background-position: center top;
    @media(max-width: 768px) {
        min-height: calc(100vh - 20px);
        margin-bottom: 20px;
    }
`;

export const MainSection = styled.div`
    padding: 1rem;
    max-width: 675px;
    margin: 0 auto;
    background-color: #FFFFFF;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    min-height: 260px;
    @media(max-width: 768px) {
        flex-wrap: wrap;
    }
`;

export const MainSectionInfo = styled.div`
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    flex-flow: column;
    text-align: center;
`;

export const DefaultContainer = styled.div`
    max-width: 1224px;
    margin: 0 auto;
    position: relative;
`;

export const FlexBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;  
  padding-bottom: 120px;  
  @media(max-width: 768px) {
      flex-wrap: wrap;
      row-gap: 50px;
      padding-bottom: 50px;
  }  
`;

export const FlexItem = styled.div`
    width: 100%;
  h4 {
      margin: 0;
      font-size: 24px;
      font-style: normal;
      font-weight: 600;
      line-height: 150%;
      padding-bottom: 32px;
  }
  p {
      margin: 0;
      font-size: 16px;
      font-style: normal;
      font-weight: 450;
      line-height: 150%;
      letter-spacing: 0.32px;
      color: #000000;
      max-width: ${(props) => props.accountFound ? '430px' : '100%'};
      padding-bottom: 48px;
      @media(max-width: 768px) {
          max-width: 100%;
      }
  }
`;

export const InfoSection = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  padding-bottom: 60px;
  @media(max-width: 768px) {
      flex-wrap: wrap;
      row-gap: 50px;
  }  
`;

export const SecondaryTitle = styled.h4`
    margin: 0;
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: 130%;
    padding-bottom: 32px;
`;

export const SecondaryText = styled.p`
    margin: 0;
    font-size: 16px;
    font-style: normal;
    font-weight: 450;
    line-height: 150%;
    letter-spacing: 0.32px;
    color: #000000;
`;

export const FormButtonContainer = styled.div`
    min-width: 500px;
    text-align: right;
    @media(max-width: 768px) {
        min-width: 100%;
    }
`;

export const CardsSection = styled.div`
    position: relative;
    margin-bottom: 60px;
`;

export const CardContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: minmax(100px, auto); 
    gap: 24px; 
    min-width: 300px;
    @media (max-width: 600px) {
        grid-template-columns: 1fr;
    }
`;

export const SingleCard = styled(Link)`
  border: 1px solid #1B1B18;
  transition: all .4s;
  border-radius: 8px;
  padding: 32px;                                  
  cursor: pointer;
  outline: none;
    &:hover {                   
        background-color: #E3E3E0;
        text-decoration: none;
    }                                     
    img {
        width: 52px;
        padding-bottom: 32px;
    }
      h3 {
          margin: 0;
          padding: 0;
          font-size: 20px;
          font-style: normal;
          font-weight: 500;
          line-height: 130%;
          letter-spacing: 0.3px;
          padding-bottom: 24px;
      }
    p {
        margin: 0;
        padding: 0;
        font-size: 14px;
        font-style: normal;
        font-weight: 450;
        line-height: 150%;
        letter-spacing: 0.14px;
        color: black;
    }
`;
export const TransferSection = styled.div`
    background-color: #000000;
    color: #FFFFFF;
    padding: 80px 0;
    @media(max-width: 768px) {
        padding: 50px 30px;
    }
`;

export const TransferSectionWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: end;
    @media(max-width: 768px) {
        flex-wrap: wrap;
        row-gap: 50px;
    }
    h4 {
      margin: 0;
      font-size: 24px;
      font-style: normal;
      font-weight: 500;
      line-height: 130%;
      padding-bottom: 32px;
      color: #FFFFFF;
    }
    p {
      margin: 0;
      font-size: 16px;
      font-style: normal;
      font-weight: 450;
      line-height: 150%;
      letter-spacing: 0.32px;
    }
`;

export const MainSectionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 24px;
`;
