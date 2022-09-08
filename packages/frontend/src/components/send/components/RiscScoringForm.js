import React, { useCallback, useEffect, useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { HAPI_RISK_SCORING } from '../../../../../../features';
import iconWarning from '../../../images/icon-warning.svg';
import { Mixpanel } from '../../../mixpanel/index';
import { checkAddress } from '../../../services/RiscScoring';
import Checkbox from '../../common/Checkbox';

const RSContainer = styled.div`
    margin-top: 20px;
    margin-bottom: -25px;
`;

const RSWarning = styled.div`
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

const RSConsent = styled.div`
    margin-top: 20px;
    line-height: 20px;
    color: #026bdd;
    background-color: #f5faff;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    padding: 20px;

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

export function useRiskScoringCheck(accountId) {
    const [isRSWarned, setIsRSWarned] = useState(false);
    const [isRSIgnored, setIsRSIgnored] = useState(false);
    // track RiskScoring execution status, useful for loaders
    // or indeterminate state
    const [isRSFinished, setIsRSFinished] = useState(true);

    useEffect(() => {
        setIsRSWarned(false);
        setIsRSIgnored(false);

        let isActive = true;

        async function checkAccountWithHapi() {
            try {
                setIsRSFinished(false);
                const hapiStatus = await checkAddress({ accountId });
                if (isActive && hapiStatus && hapiStatus[0] !== 'None') {
                    setIsRSWarned(true);
                    Mixpanel.track('HAPI scammed address', {
                        accountId,
                        statusMsg: hapiStatus[0],
                        statusCode: hapiStatus[1]
                    });
                }
            } catch (e) {
                // continue work
            } finally {
                if (isActive) {
                    setIsRSFinished(true);
                }
            }
        }

        if (HAPI_RISK_SCORING && accountId) {
            checkAccountWithHapi();
        } else {
            setIsRSWarned(false);
        }

        return () => { // prevent race condition
            isActive = false;
        };
    }, [accountId]);

    return { isRSWarned, isRSIgnored, isRSFinished, setIsRSIgnored };
}


const RiscScoringForm = ({ setIsRSIgnored, isIgnored }) => {
    const onCheckboxChange = useCallback((e) => {
        setIsRSIgnored(e.target.checked);
    }, []);

    return (
        <RSContainer className="risk-scoring-warning">
            <RSWarning>
                <img src={iconWarning} alt="Warning" />
                <div>
                    <Translate id='riscScoring.scamWarning' />
                </div>
            </RSWarning>
            <RSConsent>
                <label>
                    <Checkbox checked={isIgnored} onChange={onCheckboxChange} />
                    <Translate id='riscScoring.checkbox' />
                </label>
            </RSConsent>
        </RSContainer>
    );
};

export default RiscScoringForm;
