<<<<<<< HEAD
import React from "react";
import { Translate } from "react-localize-redux";

const TextInfoSuccess = ({ valueFrom, valueTo, symbol }) => {
    const isNear = symbol === "NEAR";
    const NEAR = "NEAR";
    const USN = "USN";
=======
import React from 'react';
import { Translate } from 'react-localize-redux';

const TextInfoSuccess = ({ valueFrom, valueTo, symbol }) => {
    const isNear = symbol === 'NEAR';
    const NEAR = 'NEAR';
    const USN = 'USN';
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872

    return (
        <div className="text_info_success">
            <>
                <Translate id="swap.success.complete" />
            </>
            <br />
            <>
<<<<<<< HEAD
                <Translate id="swap.success.youSwap" /> {valueFrom}{" "}
=======
                <Translate id="swap.success.youSwap" /> {valueFrom}{' '}
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
                {isNear ? NEAR : USN}
            </>
            <br />
            <>
                <Translate id="swap.to" /> {valueTo} {isNear ? USN : NEAR}
            </>
        </div>
    );
};

<<<<<<< HEAD
const comparisonFn = (prev, next) => prev.valueTo !== next.valueTo
=======
const comparisonFn = (prev, next) => prev.valueTo !== next.valueTo;
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872

export default React.memo(TextInfoSuccess, comparisonFn);
