import React from 'react';
import styled from 'styled-components';

import classNames from '../../utils/classNames';
import SafeTranslate from '../SafeTranslate';

const LocalAlertBoxContainer = styled.div`
    font-weight: 500;
    margin-top: -25px;
    padding-bottom: 9px;
    line-height: 16px;

    &.problem {
        color: #ff585d;
    }
    &.success {
        color: #00C08B;
    }

    &.dots {
        color: #4a4f54;

        :after {
            content: '.';
            animation: link 1s steps(5, end) infinite;
        
            @keyframes link {
                0%, 20% {
                    color: rgba(0,0,0,0);
                    text-shadow:
                        .3em 0 0 rgba(0,0,0,0),
                        .6em 0 0 rgba(0,0,0,0);
                }
                40% {
                    color: #4a4f54;
                    text-shadow:
                        .3em 0 0 rgba(0,0,0,0),
                        .6em 0 0 rgba(0,0,0,0);
                }
                60% {
                    text-shadow:
                        .3em 0 0 #4a4f54,
                        .6em 0 0 rgba(0,0,0,0);
                }
                80%, 100% {
                    text-shadow:
                        .3em 0 0 #4a4f54,
                        .6em 0 0 #4a4f54;
                }
            }
        }
    }

    @media screen and (max-width: 991px) {
        font-size: 12px;
    }
  }
`;
/**
 * Renders request status.
 *
 * @param localAlert {object} request status, can be null in case not completed yet / no outgoing request
 * @param localAlert.success {boolean} true if request was succesful
 * @param localAlert.messageCode {string} localization code of status message to display
 */

type LocalAlertBoxProps = { 
    localAlert: {
        show:string;
        messageCode:string;
        success:string; 
    }
    accountId: string;
    dots: string; 
}

const LocalAlertBox = ({ localAlert, accountId, dots }:LocalAlertBoxProps) => (
    localAlert?.show ?
        <LocalAlertBoxContainer className={classNames(['alert-info', {'success': localAlert.success}, {'problem': !localAlert.success}, {'dots': dots}])}>
            <SafeTranslate id={localAlert.messageCode} data={{ accountId: accountId }}> </SafeTranslate>
        </LocalAlertBoxContainer>
        : null
);

export default LocalAlertBox;
