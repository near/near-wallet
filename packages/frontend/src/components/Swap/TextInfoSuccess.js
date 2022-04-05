import React from "react";
import { Translate } from "react-localize-redux";

const TextInfoSuccess = ({ valueFrom, valueTo, symbol }) => {
    const isNear = symbol === "NEAR";
    const NEAR = "NEAR";
    const USN = "USN";

    return (
        <div className="text_info_success">
            <>
                <Translate id="swap.success.complete" />
            </>
            <br />
            <>
                <Translate id="swap.success.youSwap" /> {valueFrom}{" "}
                {isNear ? NEAR : USN}
            </>
            <br />
            <>
                <Translate id="swap.to" /> {valueTo} {isNear ? USN : NEAR}
            </>
        </div>
    );
};

const comparisonFn = (prev, next) => prev.valueTo !== next.valueTo

export default React.memo(TextInfoSuccess, comparisonFn);
