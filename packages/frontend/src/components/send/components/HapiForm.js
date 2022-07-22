import React, { useCallback, useEffect } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { HAPI_RISK_SCORING } from '../../../../../../features';
import iconWarning from '../../../images/icon-warning.svg';
import HapiService from '../../../services/HapiService';

const HapiContainer = styled.div`
    margin-top: 20px;
    margin-bottom: -25px;
`;

const HapiWarning = styled.div`
    background: #FFEFEF;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 16px 12px;
    gap: 10px;
    color: #CD2B31;
    font-size: 12px;
    line-height: 16px;
`;

const HapiConsent = styled.div`
    margin-top: 38px;
    line-height: 20px;
    color: #000000;
    display: flex;
    padding-left: 26px;

    & label {
      user-select: none;
      display: flex;
      gap: 0 12px;
      
      & input {
        width: inherit;
        height: inherit;
        border: none;
        appearance: auto;
        position: inherit;
        margin: 0;
        background: none;
        box-shadow: none;
      }
    }
`;

const HapiForm = ({ accountId, accountIdIsValid, setAccountIdIsValid, isHAPIWarn, setIsHAPIWarn, setIsHAPIConsentEnabled }) => {

    useEffect(() => {
        async function checkAccountWithHapi() {
            try {
                const hapiStatus =  await HapiService.checkAddress({accountId});
                if (hapiStatus && hapiStatus[0] !== 'None') { 
                    setAccountIdIsValid(false);
                    setIsHAPIWarn(true);
                }
            } catch (e) {
                // continue work
            }
        }

        if (accountIdIsValid && HAPI_RISK_SCORING) {
            checkAccountWithHapi();
        } else {
            setIsHAPIWarn(false);
        }
    }, [accountId, accountIdIsValid]);

    const onCheckboxChange = useCallback((e) => {
        setIsHAPIConsentEnabled(e.target.checked);
    }, []);

    return isHAPIWarn ? (
        <HapiContainer className="hapi">
            <HapiWarning>
                <img src={iconWarning} alt="Warning"/>
                <div>
                    <Translate id='hapi.scamWarning' />
                </div>
            </HapiWarning>
            <HapiConsent>
                <label>
                    <input type="checkbox" onChange={onCheckboxChange}/>
                    <Translate id='hapi.checkbox' />
                </label>
            </HapiConsent>
        </HapiContainer>
    ) : <></>;
};

export default HapiForm;
