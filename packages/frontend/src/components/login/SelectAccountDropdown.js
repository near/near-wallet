import { filter } from "lodash";
import React, { useEffect, useState } from "react";
import { Translate } from "react-localize-redux";
import { Segment } from "semantic-ui-react";
import styled from "styled-components";

import AddBlueImage from "../../images/icon-add-blue.svg";
import ArrowDownImage from "../../images/icon-arrow-down.svg";
import ArrowUpImage from "../../images/icon-arrow-up.svg";
import classNames from "../../utils/classNames";
import { DISABLE_CREATE_ACCOUNT } from "../../utils/wallet";

const CustomSegment = styled(Segment)`
    &&& {
        position: relative;
        width: 100%;
        height: 50px;
        padding: 0px;
        &.disabled {
            cursor: not-allowed;
            .item {
                :hover {
                    cursor: not-allowed !important;
                    color: #24272a !important;
                }
            }
        }
        .segment {
            padding: 0px;
            position: absolute;
            width: 100%;
            min-height: 46px;
            bottom: 0px;
            border: 2px solid #24272a;
            border-radius: 3px;
            background: #fff;
            .item {
                height: 46px;
                color: #24272a;
                padding: 0 0 0 12px;
                font-size: 18px;
                font-weight: 600;
                text-overflow: ellipsis;
                overflow: hidden;
                cursor: pointer;
                transition: 100ms;
                display: flex;
                align-items: center;
                :hover {
                    color: #0072ce;
                }
            }
            .list-title {
                border-bottom: 2px solid #f2f2f2;
                display: flex;
                align-items: center;
                justify-content: space-between;
                > div {
                    float: left;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    width: 82%;
                }
                .arrow {
                    float: right;
                    width: 48px;
                    height: 100%;
                    background-image: url(${ArrowDownImage});
                    background-repeat: no-repeat;
                    background-position: center center;
                    background-size: 16px auto;
                    &.up {
                        background-image: url(${ArrowUpImage});
                    }
                }
                .dots {
                    color: #24272a;
                    :after {
                        content: ".";
                        animation: link 1s steps(5, end) infinite;
                        @keyframes link {
                            0%,
                            20% {
                                color: rgba(0, 0, 0, 0);
                                text-shadow: 0.3em 0 0 rgba(0, 0, 0, 0),
                                    0.6em 0 0 rgba(0, 0, 0, 0);
                            }
                            40% {
                                color: #24272a;
                                text-shadow: 0.3em 0 0 rgba(0, 0, 0, 0),
                                    0.6em 0 0 rgba(0, 0, 0, 0);
                            }
                            60% {
                                text-shadow: 0.3em 0 0 #24272a,
                                    0.6em 0 0 rgba(0, 0, 0, 0);
                            }
                            80%,
                            100% {
                                text-shadow: 0.3em 0 0 #24272a,
                                    0.6em 0 0 #24272a;
                            }
                        }
                    }
                }
            }
            .list-scroll {
                max-height: 140px;
                overflow: auto;
                .item {
                    border-top: 2px solid #f2f2f2;
                    :first-of-type {
                        border-top: 0px solid #f2f2f2;
                    }
                }
            }
            .list-create {
                background: #24272a;
                text-transform: uppercase;
                color: #24272a;
                padding: 0 0 0 60px;
                background-image: url(${AddBlueImage});
                background-position: 12px center;
                background-repeat: no-repeat;
                background-size: 24px 24px;
            }
        }
    }
`;

const SelectAccountDropdown = ({
    handleOnClick,
    account,
    availableAccounts,
    dropdown,
    handleSelectAccount,
    redirectCreateAccount,
    disabled,
}) => {
    const [filteredAvailableAccounts, setFilteredAvailableAccounts] = useState(
        availableAccounts
    );
    const [currentFilter, setCurrentFilter] = useState("");

    useEffect(() => {
        if (availableAccounts.length > 0) {
            setFilteredAvailableAccounts(availableAccounts);
        }
    }, [availableAccounts]);

    useEffect(() => {
        setFilteredAvailableAccounts(
            availableAccounts.filter(
                (f) => f.includes(currentFilter) || currentFilter === ""
            )
        );
    }, [currentFilter]);

    return (
        <Translate>
            {({ translate }) => (
                <CustomSegment
                    basic
                    className={disabled && "disabled"}
                    title={
                        !dropdown
                            ? !disabled
                                ? translate(
                                      "selectAccountDropdown.switchAccount"
                                  )
                                : translate(
                                      "selectAccountDropdown.switchAccounthNotAllowed"
                                  )
                            : ""
                    }
                >
                    <Segment basic>
                        <div className="item list-title"
                        onClick={!disabled ? handleOnClick : () => {}}
                        >
                            {dropdown ? (
                                translate("button.close")
                            ) : (
                                <div
                                    className={classNames({
                                        dots: !account.accountId,
                                    })}
                                >
                                    {account.accountId}
                                </div>
                            )}
                            <div className="arrow" />
                        </div>
                        <div className={`${dropdown ? "" : "hide"}`}>
                            <input
                                id="filter"
                                name="filter"
                                type="text"
                                placeholder={'Search For Accounts'}
                                value={currentFilter}
                                onChange={(event) =>
                                    setCurrentFilter(event.target.value)
                                }
                            />
                            <div className="list-scroll"
                            onClick={!disabled ? handleOnClick : () => {}}
                            >
                                {filteredAvailableAccounts
                                    .filter((a) => a !== account.accountId)
                                    .map((a) => (
                                        <div
                                            onClick={() => {
                                                !disabled && handleOnClick
                                                handleSelectAccount(a)
                                            }
                                                
                                            }
                                            className="item"
                                            key={a}
                                            title={translate(
                                                "selectAccountDropdown.selectAccount"
                                            )}
                                        >
                                            {a}
                                        </div>
                                    ))}
                                {availableAccounts.length < 2 && (
                                    <div className="item">
                                        {translate(
                                            "selectAccountDropdown.noOtherAccounts"
                                        )}
                                    </div>
                                )}
                            </div>
                            {!DISABLE_CREATE_ACCOUNT && (
                                <div
                                    onClick={redirectCreateAccount}
                                    className="item list-create color-seafoam-blue"
                                    title={translate(
                                        "selectAccountDropdown.createAccount"
                                    )}
                                >
                                    {translate(
                                        "selectAccountDropdown.createAccount"
                                    )}
                                </div>
                            )}
                        </div>
                    </Segment>
                </CustomSegment>
            )}
        </Translate>
    );
};

export default SelectAccountDropdown;