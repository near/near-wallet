import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Translate } from 'react-localize-redux'

import FormButton from '../common/FormButton'
import IconMCopy from '../../images/IconMCopy'

import styled from 'styled-components'

const CustomDiv = styled(`div`)`
    .buttons-row {
        display: flex;

        button {
            width: 250px !important;
        }
        a > button {
            margin-left: 24px !important;
        }
    }
    #seed-phrase {
        flex-wrap: wrap;
        user-select: all;

        .single-phrase {
            background: #f8f8f8;
            padding: 9px 12px;
            margin: 0 6px;
            line-height: 48px;
            
            .number {
                user-select: none;
                color: #999;
                padding-right: 12px;
                font-size: 12px;
            }
            .h4 {
                letter-spacing: 2px;
            }
        }
    }
`

const SetupSeedPhraseForm = ({
    seedPhrase,
    handleCopyPhrase,
    match
}) => (
    <CustomDiv>
        <div id='seed-phrase'>
            {seedPhrase.split(' ').map((word, i) => (
                <span className='single-phrase' key={`phrase-${i}`}>
                    <span className='number'>{i+1}</span>
                    <span className='h4'>{word} </span>
                </span>
            ))}
        </div>
        <div className='buttons-row'>
            <FormButton
                onClick={handleCopyPhrase}
                color='seafoam-blue-white'
            >
                <Translate id='button.copyPhrase' />
                <IconMCopy color='#6ad1e3' />
            </FormButton>
            <Link to={`${match.url}${match.url.substr(-1) === '/' ? '' : '/'}verify`}>
                <FormButton color='blue'>
                    <Translate id='button.continue' />
                </FormButton>
            </Link>
        </div>
    </CustomDiv>
)

export default withRouter(SetupSeedPhraseForm)
