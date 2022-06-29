import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { onKeyDown } from '../../../hooks/eventListeners';
import DropDown from '../../common/DropDown';
import FormButton from '../../common/FormButton';
import ChevronIcon from '../../svg/ChevronIcon';
import SettingsIcon from '../../svg/SettingsIcon';

const Container = styled.div`
    width: 100%;
    margin: 10px 0 30px 0;

    .ledger-dropdown-content {
        padding: 20px 15px;
        text-align: left;

        .title {
            font-weight: 600;
            color: #24272a;
        }

        .desc {
            margin-top: 10px;
            font-weight: 500;
        }

        button {
            &.blue {
                width: 100%;
                
                :focus {
                    box-shadow: 0 0 0 3pt #c8e3fc !important;
                }
            }
        }
    }

    .path-wrapper {
        display: flex;
        align-items: center;
        margin: 30px 0 10px 0;

        > span {
            color: #e0e0e0;
            font-weight: 600;
            margin: 0 10px;
        }
    }

    .default-paths {
        background-color: #F0F0F1;
        padding: 12.5px 14px;
        border-radius: 4px;
        font-weight: 600;
        color: #909090;
    }

    .custom-path {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px solid #F0F0F1;
        padding: 3px 3px 3px 12px;
        border-radius: 4px;
        min-width: 55px;
        font-weight: 600;

        .buttons-wrapper {
            margin-left: 10px;
        }

        .arrow-btn {
            border: 1px solid #F0F0F1;
            border-radius: 2px;
            width: 18px;
            height: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;

            :hover {
                svg {
                    path {
                        stroke: #0072ce;
                    }
                }
            }

            svg {
                width: 10px;
                height: 10px;
            }

            &.increment {
                svg {
                    transform: rotate(-90deg);
                }
            }

            &.decrement {
                svg {
                    transform: rotate(90deg);
                }
            }
        }
    }
`;
/**
 * @param {Object} props
 * @param {"import" | "export"} props.type - curently only affects copy
 */
export const HDPathSelect = ({ handleConfirmHdPath, path, setPath, type = 'import' }) => {

    onKeyDown((e) => {
        const dropdownElement = document.getElementById('hd-paths-dropdown');
        const dropdownOpenIfRendered = dropdownElement === null || document.getElementById('hd-paths-dropdown').classList.contains('open');
        if (dropdownOpenIfRendered) {
            if (e.keyCode === 38) {
                increment();
                e.preventDefault();
            } else if (e.keyCode === 40) {
                decrement();
                e.preventDefault();
            }
        }
    });

    const increment = () => {
        setPath(path + 1);
    };

    const decrement = () => {
        if (path > 0) {
            setPath(path - 1);
        }
    };

    return (
        <Container>
            <div className='ledger-dropdown-content'>
                <div className='title'><Translate id='signInLedger.advanced.subTitle'/></div>
                <div className='desc'><Translate id={`signInLedger.advanced.${type === 'export' ? 'exportDesc' : 'desc'}`}/></div>
                <div className='path-wrapper'>
                    <div className='default-paths'>44 / 397 / 0 / 0</div>
                    <span>&ndash;</span>
                    <div className='custom-path'>
                        {path}
                        <div className='buttons-wrapper'>
                            <div className='arrow-btn increment' role='button' onClick={increment}>
                                <ChevronIcon/>
                            </div>
                            <div className='arrow-btn decrement' role='button' onClick={decrement}>
                                <ChevronIcon/>
                            </div>
                        </div>
                    </div>
                </div>
                {handleConfirmHdPath ? (
                    <FormButton
                        className='hd-paths-dropdown-toggle'
                        onClick={() => handleConfirmHdPath(path)}
                    >
                        <Translate id='signInLedger.advanced.setPath' />
                    </FormButton>
                ) : null}
            </div>
        </Container>
    );
};

export default function LedgerHdPaths({ 
    confirmedPath,
    setConfirmedPath
}) {
    const [path, setPath] = useState(confirmedPath || 1);

    return (
        <Container>
            <DropDown
                name='hd-paths-dropdown'
                icon={<SettingsIcon/>}
                title={<Translate id='signInLedger.advanced.title'/>}
                content={<HDPathSelect handleConfirmHdPath={setConfirmedPath} path={path} setPath={setPath} />}
                maxHeight={false}
            />
        </Container>
    );
}
