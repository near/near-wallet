import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { useFungibleTokensIncludingNEAR } from '../../hooks/fungibleTokensIncludingNEAR';
import { checkAccountAvailable } from '../../redux/actions/account';
import { clearLocalAlert, showCustomAlert } from '../../redux/actions/status';
import NonFungibleTokens, { NFT_TRANSFER_GAS } from '../../services/NonFungibleTokens';
import isMobile from '../../utils/isMobile';
import { EXPLORER_URL } from '../../utils/wallet';
import { formatNearAmount } from '../common/balance/helpers';
import FormButton from '../common/FormButton';
import Modal from '../common/modal/Modal';
import ModalFooter from '../common/modal/ModalFooter';
import SafeTranslate from '../SafeTranslate';
import ReceiverInputWithLabel from '../send/components/ReceiverInputWithLabel';
import EstimatedFees from '../transfer/EstimatedFees';


const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 0 30px 0;

    img {
        width: 100% !important;
        max-width: 300px;
        border-radius: 8px;
        margin-bottom: 16px;
    }

    .transfer-txt {
        margin-top: 16px;
    }

    .confirm-txt {
        margin-bottom: 4px !important; 
    }

    .confirm-img {
        width: 172px;
    }

    .confirm-nft-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;

        width: 375px;
        margin-top: 16px;

        background: #FFFFFF;
        box-shadow: 0px 45px 56px rgba(0, 0, 0, 0.07), 0px 10.0513px 12.5083px rgba(0, 0, 0, 0.0417275), 0px 2.99255px 3.72406px rgba(0, 0, 0, 0.0282725);
        border-radius: 8px;

        .from-box {
            position: relative;
            width: 375px;
            height: 74px;
            border-top: 1px solid #F0F0F1;
        }

        .to-box {
            position: relative;
            width: 375px;
            height: 53px;
            border-top: 1px solid #F0F0F1;
        }

    }

    .confirm-txt {
        font-family: Inter;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 150%;
        /* identical to box height, or 21px */
        
        font-feature-settings: 'zero' on;
        
        /* gray/neutral/600 */
        
        color: #72727A;

        margin-left: 16px !important;
    }


    .h-right {
        position: absolute;
        right: 16px;
        text-align: right;
    }

    .estimate-fee-card {
        display: flex;
        flex-direction: column;
        position: relative;

        width: 375px;
        height: 78px;
        margin-top: 16px;

        border: 1px solid #F0F0F1;
        box-sizing: border-box;
        border-radius: 8px;
    }

    .account-id {
        font-family: Inter;
        font-style: normal;
        font-weight: bold;
        font-size: 14px;
        line-height: 150%;
        /* identical to box height, or 21px */
        
        text-align: right;
        font-feature-settings: 'zero' on;
        
        /* gray/neutral/800 */
        
        color: #272729;
    }

    h3 {
        font-family: Inter;
        font-style: normal;
        font-weight: 900;
        font-size: 20px;
        line-height: 130%;
        /* identical to box height, or 26px */

        text-align: center;

        color: #24272A;
    }

    .success {
        > p {
            font-family: Inter;
            font-style: normal;
            font-weight: 500;
            font-size: 20px;
            line-height: 150%;
            /* or 30px */
            
            text-align: center;
            font-feature-settings: 'zero' on;
            
            /* gray/neutral/700 */
            
            color: #3F4045;

            margin-bottom: 0px;
        }
    }

    p {
        font-family: Inter;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 150%;
        /* or 21px */

        text-align: center;
        font-feature-settings: 'zero' on;

        /* gray/neutral/600 */

        color: #72727A;
    }

    .buttons {
        margin-left: auto;
        margin-right: 0px;
    }

    .next-btn {
        margin-left: 44px !important;
    }

    .receiver-input {
      width: 100%;
    }

    .amount-grey {
        font-family: Inter;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 150%;
        /* identical to box height, or 21px */

        font-feature-settings: 'zero' on;

        /* gray/neutral/500 */

        color: #A2A2A8;
    }

    .v-center {
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
    }

    .icon {
        margin-bottom: 20px !important;
    }

    form {
        width: 100%;
    }


    .modal-footer {
        display: flex;
        align-items: right;
        justify-content: flex-end;

        > button {
            width: 136px;
            height: 56px;

            margin-top: 0px !important;

            &.link {
                margin: 20px 35px;
            }
            
            &.blue {
                padding: 0 35px;
            }
        }
    }

    .success-footer {
        border-top: 1px solid #F0F0F1;
        margin-top: 60px;

        > button {
            width: 185px;
        }
    }
`;

function successSVG() {
    return (
        <svg width="78" height="78" viewBox="0 0 78 78" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_426:652)">
            <path d="M53.625 77.3036V61.2857L66.1607 36.2143V24.0268H59.8929V33.4286L53.625 45.9643H47.3572C47.3572 45.9643 47.3572 52.2321 41.0893 52.2321C34.8215 52.2321 33.8465 44.85 33.8465 44.85V64.5589H18.3857C18.3857 64.5589 19.709 71.0357 24.1661 71.0357C28.6232 71.0357 28.6232 68.0411 28.6232 68.0411V77.3036H53.625Z" fill="#F0EC73"/>
            <path d="M17.0624 25.9768C16.2963 25.9768 15.5302 25.7678 14.8338 25.2803C9.12307 21.2411 9.19272 16.6446 9.26236 15.8786C9.40164 12.9536 11.282 10.6554 13.5802 10.4464C14.7641 10.3071 15.9481 10.7946 16.8534 11.7C16.9231 11.7696 16.9927 11.8393 17.0624 11.9089C17.132 11.8393 17.2016 11.7696 17.2713 11.7C18.1766 10.7946 19.3606 10.3768 20.5445 10.4464C22.8427 10.6554 24.7231 13.0232 24.8624 15.8786C24.932 16.6446 25.0016 21.2411 19.2909 25.2803C18.5945 25.7678 17.8284 25.9768 17.0624 25.9768Z" fill="#F0EC73"/>
            <path d="M76.6066 75.2143H52.9281V60.9375L65.3245 36.1446C65.3941 35.9357 65.4638 35.7268 65.4638 35.5179V17.4107C67.2745 17.2714 68.6674 15.8089 68.6674 13.9286V9.75C68.6674 7.8 67.1352 6.26786 65.1852 6.26786C64.4191 6.26786 63.6531 6.54643 63.0959 6.96429C62.5388 6.54643 61.7727 6.26786 61.0066 6.26786C60.2406 6.26786 59.4745 6.54643 58.9174 6.96429C58.3602 6.54643 57.5941 6.26786 56.8281 6.26786C54.8781 6.26786 53.3459 7.8 53.3459 9.75V13.9286C53.3459 14.6946 53.6245 15.4607 54.0424 16.0179C53.6245 16.575 53.3459 17.3411 53.3459 18.1071C53.3459 19.9179 54.7388 21.3804 56.4799 21.5196C56.4102 21.6589 56.4102 21.7982 56.4102 21.9375V32.3839L50.6995 43.875H47.3566C50.7691 41.2982 52.9977 37.2589 52.9977 32.7321V26.4643C52.9977 18.8036 46.7299 12.5357 39.0691 12.5357C31.4084 12.5357 25.1406 18.8036 25.1406 26.4643V32.7321C25.1406 33.4982 25.7674 34.125 26.5334 34.125C27.2995 34.125 27.9263 33.4982 27.9263 32.7321V26.4643C27.9263 26.3946 27.9263 26.325 27.9263 26.325C28.4834 26.4643 29.0406 26.4643 29.6674 26.4643C31.6174 26.4643 33.4281 25.9071 34.8906 24.8625C36.9102 28.3446 40.1834 30.9214 44.0834 32.1054C43.9441 32.3143 43.8745 32.5232 43.8745 32.7321C43.8745 33.0804 44.0138 33.4286 44.2924 33.7071C44.5709 33.9857 44.9191 34.125 45.2674 34.125C45.337 34.125 45.4763 34.125 45.5459 34.125C45.6156 34.125 45.6852 34.0554 45.8245 34.0554C45.8941 34.0554 45.9638 33.9857 46.0334 33.9161C46.1031 33.8464 46.1727 33.8464 46.2424 33.7768C46.5209 33.4286 46.6602 33.0804 46.6602 32.7321C46.6602 32.6625 46.6602 32.6625 46.6602 32.5929C47.2174 32.6625 47.8441 32.7321 48.4013 32.7321C48.9584 32.7321 49.5852 32.6625 50.1424 32.6625V32.7321C50.1424 38.8607 45.1281 43.875 38.9995 43.875C38.2334 43.875 37.6067 44.5018 37.6067 45.2679C37.6067 46.0339 38.2334 46.6607 38.9995 46.6607C40.7406 46.6607 42.3424 46.3125 43.8745 45.7554C43.5959 48.1929 41.5763 50.1429 38.9995 50.1429C36.2834 50.1429 34.1245 47.9839 34.1245 45.2679V39C34.1245 38.2339 33.4977 37.6071 32.7317 37.6071H18.6638C17.8977 37.6071 17.2709 38.2339 17.2709 39V47.9839C13.9977 49.725 12.5352 56.9679 12.5352 59.0571C12.5352 60.6589 13.0924 62.1911 14.0674 63.3054C14.0674 63.3054 14.0674 63.3054 14.0674 63.375L17.6192 69.7125C17.6888 69.8518 17.7584 69.9214 17.8281 69.9911C18.9424 71.1054 20.4049 71.6625 21.937 71.6625C23.0513 71.6625 24.0959 71.3143 25.0013 70.8268V75.1446H1.39237C0.626299 75.1446 -0.000486664 75.7714 -0.000486664 76.5375C-0.000486664 77.3036 0.626299 77.9304 1.39237 77.9304H76.6066C77.3727 77.9304 77.9995 77.3036 77.9995 76.5375C77.9995 75.7714 77.3727 75.2143 76.6066 75.2143ZM64.4888 9.75C64.4888 9.33214 64.7674 9.05357 65.1852 9.05357C65.6031 9.05357 65.8816 9.33214 65.8816 9.75V13.9286C65.8816 14.3464 65.6031 14.625 65.1852 14.625C64.7674 14.625 64.4888 14.3464 64.4888 13.9286V9.75ZM60.3102 9.75C60.3102 9.33214 60.5888 9.05357 61.0066 9.05357C61.4245 9.05357 61.7031 9.33214 61.7031 9.75V13.9286C61.7031 14.3464 61.4245 14.625 61.0066 14.625C60.5888 14.625 60.3102 14.3464 60.3102 13.9286V9.75ZM56.1316 9.75C56.1316 9.33214 56.4102 9.05357 56.8281 9.05357C57.2459 9.05357 57.5245 9.33214 57.5245 9.75V13.9286C57.5245 14.3464 57.2459 14.625 56.8281 14.625C56.4102 14.625 56.1316 14.3464 56.1316 13.9286V9.75ZM56.1316 18.1071C56.1316 17.6893 56.4102 17.4107 56.8281 17.4107H61.0066C61.4245 17.4107 61.7031 17.6893 61.7031 18.1071C61.7031 18.525 61.4245 18.8036 61.0066 18.8036H56.8281C56.4102 18.8036 56.1316 18.525 56.1316 18.1071ZM15.3209 59.0571C15.3209 57.0375 16.2959 54.0429 17.2709 52.1625V54.0429C17.2709 54.8089 17.8977 55.4357 18.6638 55.4357C20.4745 55.4357 22.0067 57.0375 22.0067 59.0571C22.0067 61.0768 20.4745 62.6786 18.6638 62.6786C16.8531 62.6786 15.3209 61.0768 15.3209 59.0571ZM25.0709 65.8821C25.0709 67.5536 23.6781 68.9464 22.0067 68.9464C21.2406 68.9464 20.5442 68.6679 19.987 68.1804L18.4549 65.4643C18.5245 65.4643 18.5245 65.4643 18.5942 65.4643H25.0709V65.8821ZM50.1424 60.5893V75.2143H27.8567V65.4643H32.7317C33.4977 65.4643 34.1245 64.8375 34.1245 64.0714V51.1875C35.4477 52.3018 37.1192 52.9286 38.9995 52.9286C42.7602 52.9286 45.8941 50.2125 46.5209 46.6607H51.5352C52.0924 46.6607 52.5799 46.3821 52.7888 45.8946L59.0566 33.3589C59.1263 33.15 59.1959 32.9411 59.1959 32.7321V21.9375C59.1959 21.7982 59.1959 21.7286 59.1263 21.5893H61.0066C61.6334 21.5893 62.1906 21.45 62.6781 21.1714V35.2393L50.2816 59.9625C50.212 60.1714 50.1424 60.3804 50.1424 60.5893ZM31.5477 33.4982C31.6174 33.5679 31.687 33.6375 31.687 33.7071C32.0352 33.9857 32.3834 34.125 32.7317 34.125C32.8013 34.125 32.9406 34.125 33.0102 34.125C33.0799 34.125 33.1495 34.0554 33.2888 34.0554C33.3584 34.0554 33.4281 33.9857 33.4977 33.9161C33.5674 33.8464 33.637 33.8464 33.7067 33.7768C33.7763 33.7071 33.8459 33.6375 33.8459 33.5679C33.9156 33.4982 33.9156 33.4286 33.9852 33.3589C33.9852 33.2893 34.0549 33.2196 34.0549 33.0804C34.0549 33.0107 34.0549 32.8714 34.0549 32.8018C34.0549 32.7321 34.0549 32.5929 34.0549 32.5232C34.0549 32.4536 33.9852 32.3839 33.9852 32.2446C33.9852 32.175 33.9156 32.1054 33.8459 31.9661C33.7763 31.8964 33.7067 31.8268 33.7067 31.7571C33.637 31.6875 33.5674 31.6179 33.4977 31.6179C33.4281 31.5482 33.3584 31.5482 33.2888 31.4786C33.2192 31.4089 33.1495 31.4089 33.0102 31.4089C32.8013 31.3393 32.662 31.3393 32.4531 31.4089C32.3834 31.4089 32.3138 31.4786 32.1745 31.4786C32.1049 31.4786 32.0352 31.5482 31.9656 31.6179C31.8959 31.6875 31.8263 31.6875 31.7567 31.7571C31.4781 32.0357 31.3388 32.3839 31.3388 32.7321C31.3388 32.8018 31.3388 32.9411 31.3388 33.0107C31.3388 33.0804 31.4084 33.15 31.4084 33.2893C31.4781 33.3589 31.5477 33.4286 31.5477 33.4982ZM42.1334 39H35.8656C35.8656 40.7411 37.2584 42.1339 38.9995 42.1339C40.7406 42.1339 42.1334 40.7411 42.1334 39ZM11.6299 24.9321C12.4656 25.4893 13.3709 25.7679 14.2763 25.7679C15.1817 25.7679 16.1567 25.4893 16.9227 24.9321C23.8174 20.0571 23.6781 14.5554 23.6084 13.65C23.3995 10.1679 21.1709 7.3125 18.3852 7.03393C16.9924 6.89464 15.5995 7.45179 14.4852 8.56607C14.4156 8.63571 14.2763 8.775 14.2067 8.84464C14.137 8.775 13.9977 8.63571 13.9281 8.56607C12.8138 7.45179 11.4209 6.96429 10.0281 7.03393C7.24237 7.3125 5.0138 10.0982 4.80487 13.65C4.80487 14.4857 4.73523 20.0571 11.6299 24.9321ZM8.63523 13.9982C8.63523 13.9286 8.63523 13.9286 8.63523 13.8589C8.70487 12.2571 9.61023 10.6554 10.3763 10.5857C10.7245 10.5161 11.0727 10.725 11.4209 11.0036C11.9781 11.5607 12.3263 13.0232 12.3263 14.0679C12.3263 15.1821 13.162 16.0875 14.2067 16.0875C15.2513 16.0875 16.087 15.1821 16.087 14.0679C16.087 13.0232 16.4352 11.5607 16.9924 11.0036C17.3406 10.6554 17.6888 10.5161 18.037 10.5857C18.8031 10.6554 19.7084 12.1875 19.7781 13.8589C19.7781 13.9286 19.7781 13.9286 19.7781 13.9982C19.7781 14.0679 20.0567 18.3857 14.7638 22.1464C14.4156 22.425 13.9281 22.425 13.5102 22.1464C8.56558 18.525 8.63523 14.3464 8.63523 13.9982ZM74.0299 48.1929C71.5924 57.525 65.6031 65.3946 57.2459 70.2696C56.5495 70.6875 56.3406 71.5232 56.7584 72.15C57.037 72.5679 57.4549 72.8464 57.9424 72.8464C58.1513 72.8464 58.4299 72.7768 58.6388 72.6375C67.6227 67.3447 74.0299 58.9179 76.6763 48.8893C79.3227 38.7911 77.8602 28.275 72.637 19.2911C72.2191 18.5946 71.3834 18.3857 70.7566 18.8036C70.0602 19.2214 69.8513 20.0571 70.2691 20.6839C75.1441 29.0411 76.4674 38.7911 74.0299 48.1929ZM67.9709 26.9518C67.2745 27.2304 66.8566 27.9964 67.1352 28.7625C71.662 41.0893 67.4834 55.1571 56.9674 63.0268C56.3406 63.5143 56.2013 64.35 56.6888 64.9768C56.9674 65.325 57.3852 65.5339 57.8031 65.5339C58.0816 65.5339 58.3602 65.4643 58.6388 65.2554C70.1299 56.6893 74.7263 41.2982 69.7816 27.7875C69.5031 27.0214 68.6674 26.6732 67.9709 26.9518ZM10.7942 65.2554C11.1424 65.2554 11.4209 65.1161 11.6995 64.9071C12.2567 64.4196 12.3263 63.5143 11.8388 62.9571C3.76023 53.8339 0.835227 40.8107 4.17808 29.0411C4.38701 28.275 3.96916 27.5089 3.20308 27.3C2.43701 27.0911 1.67094 27.5089 1.46201 28.275C-2.15942 40.95 1.04416 54.9482 9.74951 64.7679C10.0281 65.1161 10.3763 65.2554 10.7942 65.2554ZM9.19237 29.25C8.4263 29.0411 7.66023 29.4589 7.4513 30.225C5.43166 37.4679 5.9888 45.1982 8.98344 52.0929C9.19237 52.65 9.74951 52.9286 10.237 52.9286C10.4459 52.9286 10.5852 52.8589 10.7942 52.7893C11.4906 52.5107 11.8388 51.675 11.4906 50.9786C8.77451 44.7107 8.28701 37.6071 10.0977 30.9911C10.3763 30.225 9.8888 29.4589 9.19237 29.25ZM38.9995 9.05357C39.7656 9.05357 40.3924 8.42679 40.3924 7.66071V1.39286C40.3924 0.626786 39.7656 0 38.9995 0C38.2334 0 37.6067 0.626786 37.6067 1.39286V7.66071C37.6067 8.42679 38.2334 9.05357 38.9995 9.05357ZM49.0281 8.98393C49.1674 9.05357 49.3066 9.05357 49.4459 9.05357C50.0031 9.05357 50.5602 8.70536 50.7691 8.07857L52.8584 1.81071C53.0674 1.11429 52.7191 0.278571 51.9531 0.0696429C51.187 -0.139286 50.4209 0.208929 50.212 0.975L48.1227 7.24286C47.9138 7.93929 48.262 8.70536 49.0281 8.98393ZM27.2299 8.07857C27.4388 8.63571 27.9959 9.05357 28.5531 9.05357C28.6924 9.05357 28.8317 9.05357 28.9709 8.98393C29.6674 8.775 30.0852 7.93929 29.8763 7.24286L27.787 0.975C27.5781 0.278571 26.7424 -0.139286 26.0459 0.0696429C25.3495 0.278571 24.9317 1.11429 25.1406 1.81071L27.2299 8.07857Z" fill="#24272A"/>
            </g>
            <defs>
            <clipPath id="clip0_426:652">
            <rect width="78" height="78" fill="white"/>
            </clipPath>
            </defs>
        </svg>
    );
}



export default function NFTTransferModal({ open, onClose, nft, setNftOwner, accountId }) {
    const [ receiverId, setReceiverId ] = useState();
    const [ result, setResult ] = useState();
    const [ sending, setSending ] = useState(false);
    const [ viewType, setViewType ] = useState('transfer');
    const [ accountIdIsValid, setAccountIdIsValid] = useState(false);
    const nearBalance = useFungibleTokensIncludingNEAR()[0].balance;
    const balanceToShow = formatNearAmount(nearBalance);
    const dispatch = useDispatch();

    const { localAlert } = useSelector(({ status }) => status);

    function onTransferSuccess(result, nft) {
        setResult(result);
        setNftOwner(nft.ownerId);
        console.log(result.transaction.hash);
        setViewType('success');
    }

    async function sendNFT (nft, receiverId, onSuccess) {
        console.log('sending nft', nft, receiverId);
        setSending(true);
        try {
            const { contractId, tokenId, ownerId } = nft;
            const res = await NonFungibleTokens.transfer({
                accountId: ownerId,
                contractId,
                tokenId,
                receiverId
            });

            console.log('sent nft');
            console.log(res);
            onSuccess(res, Object.assign({}, nft, { ownerId: receiverId }));
        } catch (err) {
            dispatch(showCustomAlert({
                success: false,
                messageCodeHeader: 'error',
                messageCode: 'walletErrorCodes.sendNonFungibleToken.error',
                errorMessage: err.message,
            }));
        } finally {
            setSending(false);
        }
    }

    return (
        <Modal
            id='nft-transfer-modal'
            isOpen={nft}
            onClose={onClose}
            closeButton={false}
            modalSize='md'
        >
            {viewType === 'transfer' &&
            <StyledContainer className='small-centered'>
                <img className='transfer-img' src={nft.metadata.media} alt='NFT'/>

                <h3><Translate id='NFTTransfer.transfer-nft'/></h3>
                <p className='transfer-txt'><Translate id='NFTTransfer.enter-receipt'/></p>

                <form>
                    <div className='receiver-input'>
                        <ReceiverInputWithLabel
                            receiverId={receiverId}
                            handleChangeReceiverId={receiverId => setReceiverId(receiverId)}
                            checkAccountAvailable={accountId => dispatch(checkAccountAvailable(accountId))}
                            localAlert={localAlert}
                            autoFocus={!isMobile()}
                            clearLocalAlert={() => dispatch(clearLocalAlert())}
                            setAccountIdIsValid={setAccountIdIsValid}
                        />
                    </div>

                    <ModalFooter>
                        <div className='buttons'>
                            <FormButton
                                className='link'
                                type='button'
                                onClick={onClose}
                                color='gray'
                            >
                            <Translate id='NFTTransfer.cancel'/>
                            </FormButton>
                            <FormButton
                                className='next-btn'
                                type='submit'
                                disabled={!accountIdIsValid}
                                onClick={() => setViewType('confirm')}
                            >
                            <Translate id='NFTTransfer.next'/>
                            </FormButton>
                        </div>
                    </ModalFooter>
                </form>
            </StyledContainer>
            }

            {viewType === 'confirm' &&
                <StyledContainer className='small-centered'>
                    <p className='confirm-txt'><Translate id='NFTTransfer.confirm-transaction'/></p>
                    <h3><Translate id='NFTTransfer.transfer-nft'/></h3>

                    <div className='confirm-nft-card'>
                        <div className='confirm-img'>
                            <img src={nft.metadata.media} alt='NFT'/>
                        </div>

                        <div className='line'></div>
                        <div className='from-box'>
                            <span className='confirm-txt v-center'><Translate id='transfer.from'/></span>
                            <span className='h-right v-center'>
                                <span className='account-id'>{accountId}</span>
                                <div className='amount-grey'>{balanceToShow} NEAR</div>
                            </span>
                        </div>
                        <div className='line'></div>
                        <div className='to-box'>
                            <span className='confirm-txt v-center'><Translate id='transfer.to' /></span>
                            <span className='h-right v-center account-id'>{receiverId}</span>
                        </div>
                    </div>

                    <div className='estimate-fee-card'>
                        <EstimatedFees gasFeeAmount={NFT_TRANSFER_GAS}/>
                    </div>

                    <div className='buttons'>
                        <FormButton
                            className='link'
                            type='button'
                            onClick={onClose}
                            color='gray'
                        >
                            <Translate id='NFTTransfer.cancel'/>
                        </FormButton>
                        <FormButton
                            className='next-btn'
                            type='submit'
                            sending={sending}
                            onClick={() => sendNFT(nft, receiverId, onTransferSuccess)}
                        >
                            <Translate id='NFTTransfer.confirm'/>
                        </FormButton>
                    </div>
                </StyledContainer>
            }

            {viewType === 'success' &&
                <StyledContainer className='small-centered'>
                    <div className='icon'>
                        {successSVG()}
                    </div>
                    <div className='success'>
                        <p><Translate id='NFTTransfer.transaction-complete' /></p>
                        <p>
                        <SafeTranslate id='NFTTransfer.you-sent' 
                            //   data={{
                            //       title: nft.metadata.title,
                            //       receiverId
                            //   }}
                            data={{
                                title: "some nft",
                                receiverId: 'abc.testnet'
                            }}
                        />
                        </p>
                    </div>

                    <div className='success-footer'>
                            <FormButton
                                type='button'
                                // linkTo={`${EXPLORER_URL}/transactions/${result.transaction.hash}`}
                                color='gray-black'
                            >
                                <Translate id='NFTTransfer.view-receipt' />
                            </FormButton>
                            <FormButton
                                className='next-btn'
                                type='submit'
                                onClick={onClose}
                            >
                                <Translate id='NFTTransfer.continue' />
                            </FormButton>
                    </div>
                </StyledContainer>
            }
        </Modal>
    );
}
