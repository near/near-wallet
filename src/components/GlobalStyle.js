import { createGlobalStyle } from 'styled-components'
import 'semantic-ui-css/semantic.min.css'
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
            font-size: 14px !important;
            -webkit-overflow-scrolling: touch;
        }
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
        background-color: transparent;
        outline: none;
        border: 0;

        @media (min-width: 768px) {
            &:hover {
                text-decoration: underline;
            }
        }
    }

    .underline {
        text-decoration: underline;
    }

    body, p, h1, h2, h3, h4, h5, h6, button, .button, input, select, textarea {
        font-family: "Inter", Lato, "Lucida Grande", Tahoma, Sans-Serif !important;
    }

    h1, .h1 {
        font-weight: 900 !important;
        color: #24272a;
        font-size: calc(28px + (40 - 28) * ((100vw - 300px) / (1600 - 300))) !important;
        word-wrap: break-word;

        @media (max-width: 300px) {
            h1 {
                font-size: 28px;
            }
        }

        .symbol {
            font-weight: 900 !important;
        }
    }
    h2, .h2 {
        font-size: 24px !important;
        font-weight: 900 !important;
        color: #24272a !important;
        margin: 0px;

        @media (max-width: 767px) {
            font-size: 18px !important;
        }
    }
    h3, .h3 {
        font-size: 18px !important;
        font-weight: 900 !important;
        color: #24272a !important;
        margin: 0px;
    }
    h4, .h4 {
        font-size: 16px;
        font-weight: 500;
        color: #24272a;
        margin: 0px;
    }

    h5, .h5 {
        font-size: 13px !important;
        font-weight: 500;
        color: #999999 !important;
        margin: 0px;
        letter-spacing: 1.8px;
    }

    h6, .h6 {
        font-size: 12px !important;
        font-weight: 500;
        color: #999999;
        margin: 0px !important;
        letter-spacing: 1.5px !important;
    }

    .font-small {
        font-size: 12px !important;
        color: #999 !important;
        font-weight: 400 !important;

        a {
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
        font-size: 16px !important;
        width: 100% !important;
        height: 48px !important;
        border: 2px solid #f8f8f8 !important;
        padding: 0 0 0 15px !important;
        color: #4a4f54 !important;
        font-weight: 300 !important;
        background-color: #f8f8f8 !important;
        position: relative !important;
        margin-top: 8px !important;
        outline: none;
        appearance: none;
        border-radius: 8px !important;

        ::placeholder {
            color: #999999;
        }

        :focus {
            border-color: #e6e6e6 !important;
            background-color: #fff !important;
        }

        &.amount-input {
            background: none !important;
            border: 2px solid #E4E4E6 !important;
            font-size: 38px !important;
            margin: 0 !important;
            font-weight: 600 !important;
            height: 62px !important;

            ::placeholder {
                color: #CCCCCC;
                opacity: 1;
            }

            &.error {
                color: #ff585d !important;
            }
        }
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    input[type=number] {
        -moz-appearance:textfield;
    }

    .input-validation-label {
        font-weight: 500;
        margin-top: 10px;

        &.success {
            color: #6AD1E3;
        }

        &.error {
            color: #ff585d;
        }
    }

    .input-sub-label {
        font-size: 12px;
        font-style: italic;
        text-align: left;
        margin-top: 10px;
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


    button, .button {
        cursor: pointer;
        outline: none;
        font-weight: 400 !important;
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

    .ui.popup>.header, .ui.popup {
        color: white;
    }
    .ui.popup {
        border: 0;
        background-color: #292526;

        :before {
            display: none;
        }
    }
    .ui.left.center.popup:before {
        box-shadow: 1px -1px 0 0 #eee;
    }
    .ui.top.center.popup:before {
        box-shadow: 1px 1px 0px 0px #eee;
    }
    .ui.bottom.right.popup:before {
        box-shadow: -1px -1px 0 0 #eee;
    }

    @media screen and (max-width: 767px) {
        h1, .h1 {
            font-size: 28px !important;
            font-weight: 500;
            color: #24272a;
        }
        h2, .h2 {
            font-size: 18px !important;
            font-weight: 600;
            margin: 0px;
        }
        h3, .h3 {
            font-size: 16px !important;
            font-weight: 500;
            margin: 0px;
        }
        .box .column {
            padding: 16px 18px !important;
        }
    }

    .ui {
        &.dimmer {
            .modal {
                line-height: 140%;
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

    .send-theme {

        > button {
            width: 100% !important;
        }

        .header-button {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 30px 0 15px 0;

            h4 {
                margin: 0;
            }

            button {
                margin: 0 !important;
                width: auto !important;
                text-decoration: none !important;
                font-weight: 500 !important;
                text-transform: capitalize !important;
            }
        }

        .arrow-circle {
            display: block;
            margin: 50px auto 20px auto;
        }

        .ui {
            &.input {
                width: 100%;
                margin-top: 10px;
                input {
                    background: none !important;
                    border: 2px solid #E4E4E6 !important;
                }
            }
        }
    }
`
