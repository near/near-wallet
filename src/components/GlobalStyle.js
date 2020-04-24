import { createGlobalStyle } from 'styled-components'

import ProblemsImage from '../images/icon-problems.svg'
import CheckBlueImage from '../images/icon-check-blue.svg'
import EmailIconGray from '../images/email-icon-gray.svg'
import CloseBtn from '../images/close-btn.svg'

export default createGlobalStyle`
  
  * {
        box-sizing: inherit;
    }

   #root {
        min-height: 100vh;
        position: relative;
   }
   html {
        box-sizing: border-box;
        min-height: 100vh;
        height: auto !important;

        body {
            margin: 0;
            padding: 0;
            min-height: 100vh !important;

            position: relative;
            color: #999;
            font-family: "benton-sans",sans-serif;
            font-weight: 500;
            font-size: 14px !important;
            -webkit-overflow-scrolling: touch;
        }
   }

    .grecaptcha-badge {
        visibility: hidden;
    }

    a {
        color: #0072ce;
    }
    a:hover {
        color: #0072ce;
        text-decoration: underline;
    }

    .link {
        color: #0072ce;
        cursor: pointer;

        @media (min-width: 768px) {
            &:hover {
                text-decoration: underline;
            }
        }
    }

    h1, .h1 {
        font-family: BwSeidoRound !important;
        font-size: 48px !important;
        font-weight: 500 !important;
        line-height: 100px;
        color: #24272a;
    }
    h2, .h2 {
        font-family: BwSeidoRound !important;
        font-size: 24px !important;
        font-weight: 500 !important;
        line-height: 1.4;
        color: #24272a !important;
        margin: 0px;
    }
    h3, .h3 {
        font-family: BwSeidoRound !important;
        font-size: 18px !important;
        font-weight: 500 !important;
        line-height: 24px !important;
        color: #24272a !important;
        margin: 0px;
    }
    h4, .h4 {
        font-family: BwSeidoRound !important;
        font-size: 16px;
        font-weight: 500;
        line-height: 1.33;
        color: #24272a;
        margin: 0px;
    }

    h5, .h5 {
        font-family: "benton-sans",sans-serif !important;
        font-size: 13px !important;
        line-height: 26px;
        font-weight: 500;
        color: #999999 !important;
        margin: 0px;
        letter-spacing: 1.8px;
    }

    h6, .h6 {
        font-family: "benton-sans",sans-serif !important;
        font-size: 12px !important;
        line-height: 18px;
        font-weight: 600;
        color: #999999;
        margin: 0px !important;
        letter-spacing: 1.5px !important;
    }

    .font-benton {
        font-family: "benton-sans",sans-serif !important;
    }

    .font-small {
        font-family: "benton-sans",sans-serif !important;
        font-size: 12px !important;
        color: #999 !important;
        font-weight: 500 !important;

        a {
            font-family: "benton-sans",sans-serif !important;
            font-size: 12px !important;
            color: #999 !important;
            font-weight: 500 !important;
        }

        a:hover {
            color: #999 !important;
        }
    }

    .username-input-icon {
        position: relative;
      
        &:after {
            content: '';
            background: url(${EmailIconGray}) center no-repeat;
            display: inline-block;
            height: 17px;
            width: 17px;
            position: absolute;
            left: 15px;
            top: calc(50% - -4px);
            transform: translateY(-50%);
            pointer-events: none;
        }
        input {
            padding-left: 37px !important;
        }
    }

    input {
        font-family: "benton-sans",sans-serif !important;
        font-size: 16px !important;
        width: 100% !important;
        height: 48px !important;
        border: 2px solid #f8f8f8 !important;
        padding: 0 0 0 20px !important;
        color: #4a4f54 !important;
        font-weight: 400 !important;
        background-color: #f8f8f8 !important;
        position: relative !important;
        margin-top: 8px !important;
        outline: none;
        appearance: none;
        border-radius: 4px;

        ::placeholder {
            color: #999999;
        }

        :focus {
            border-color: #e6e6e6 !important;
            background-color: #fff !important;
        }

        ::-webkit-input-placeholder {
            line-height: normal !important;
        }
    }

    .spinner {
        margin-right: 10px !important;
        :before,
        :after {
            top: 28px !important;
            width: 24px !important;
            height: 24px !important;
        }
    }
    .problem > .input > input,
    .problem > .input > input:focus,
    .problem > input {
        border: 2px solid #ff585d !important;
    }

    .success > .input > input,
    .success > .input > input:focus,
    .success > input {
        border: 2px solid #6ad1e3 !important;
    }


    b {
        font-weight: 600 !important;
    }


    .color-seafoam-blue {
        color: #6ad1e3 !important;
    }
    .color-blue {
        color: #0072ce !important;
    }
    .color-brown-grey {
        color: #999;
    }
    .color-charcoal-grey {
        color: #4a4f54 !important;
    }
    .color-black {
        color: #24272a !important;

        :hover {
            color: #24272a;
        }
    }
    .color-red {
        color: #ff585d !important;
    }
    .color-green {
        color: #5ace84 !important;
    }

    .ui.popup > .header {
        font-weight: 600 !important;
        color: #24272a !important;
    }

    .border-bottom {
        border-bottom: 2px solid #f8f8f8 !important;
    }
    .border-bottom-bold {
        border-bottom: 4px solid #e6e6e6 !important;
    }
    .border-bottom-light {
        border-bottom: 1px solid #f8f8f8 !important;
    }

    .border-top {
        border-top: 2px solid #f8f8f8 !important;
    }

    .border-top-bold {
        border-top: 4px solid #e6e6e6 !important;
    }
    .border-top-light {
        border-top: 1px solid #f8f8f8 !important;
    }

    .border-left-bold {
        border-left: 4px solid #f8f8f8 !important;
    }


    .border-right {
        border-right: 2px solid #e6e6e6;
    }
    .border-right-light {
        border-right: 1px solid #e6e6e6;
    }
    .background-lg {
        background: #f8f8f8;
    }


    .button {
        font-family: "benton-sans",sans-serif !important;
        line-height: normal !important;
    }
   


    .box {
        border: 2px solid #e6e6e6;
        border-radius: 8px;
        margin-bottom: 0px;
        position: relative;
        min-height: 100px;
        position: relative;

        .row {
            padding: 0px !important;
        }
        .column {
            padding: 16px 18px !important;
            word-wrap: break-word;
        }
        .segment {
            padding: 30px 0 20px 0 !important;
        }
        .list {
            > .item {
                > img {
                    top: -4px;
                    margin: 0 10px;
                }
                > img.transarrow {
                    width: 11px !important;
                }
            }
            > h5.item {
                top: -4px;
            }
        } 
    }


    .copy-image {
        width: 18px !important;
        margin: 0px 10px 0 0px !important;
        top: -4px !important;
    }


    .balance-image {
        font-size: 20px !important;
        font-weight: 100 !important;

        &-big {
            font-size: 32px !important;
            font-weight: 100 !important;
        }
    }
   

    .transactions-block .item {
        margin-left: 10px !important;
    }


    .hide {
        display: none !important;
    }


    .App-section {
        width: 860px;
        margin: auto;
        margin-top: 10px;
        margin-bottom: 20px;
    }

    .App-error-message {
        width: 100%;
        text-align: center;
        display: inline-block;
        margin: auto;
    }

    .ui.list .list>.item .header, .ui.list>.item .header {
        font-family: "benton-sans",sans-serif;
        
    }
    .ui.popup>.header, .ui.popup {
        color: #999;
        font-family: "benton-sans",sans-serif;
        font-weight: 500;
        font-size: 14px !important;
    }
    .ui.popup {
        border: 1px solid #eee;
    }
    .ui.left.center.popup:before {
        box-shadow: 1px -1px 0 0 #eee;
    }
    .ui.bottom.right.popup:before {
        box-shadow: -1px -1px 0 0 #eee;
    }

    .font-benton {
        font-family: "benton-sans",sans-serif !important;
    }

    @media screen and (max-width: 767px) {
        h1, .h1 {
            font-size: 28px !important;
            font-weight: 500;
            line-height: 50px;
            color: #24272a;
        }
        h2, .h2 {
            font-size: 22px !important;
            font-weight: 600;
            line-height: 1.33;
            margin: 0px;
        }
        h3, .h3 {
            font-size: 18px !important;
            font-weight: 500;
            line-height: 1.33;
            margin: 0px;
        }
        .box .column {
            padding: 16px 18px !important;
        }
    }

    .ui {
        &.dimmer {
            .modal {
                line-height: normal;
                padding: 25px;

                .close {
                    top: 10px !important;
                    right: 10px !important;
                    background: url(${CloseBtn}) center no-repeat;
                    background-size: 100%;
                    height: 25px;
                    width: 25px;
                    padding: 0;
                    margin: 0;

                    :before {
                        display: none;
                    }
                }
            }
        }
    }
`
