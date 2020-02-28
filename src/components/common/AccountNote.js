import React from 'react'
import { List } from 'semantic-ui-react'
import { Translate } from 'react-localize-redux'

import styled from 'styled-components'

const CustomList = styled(List)`
    &&& {
        margin: 26px 0 0 1rem;
        padding-left: 30px;
        border-left: 4px solid #f8f8f8;

        .title {
            letter-spacing: 2px;
            font-weight: 600;
            line-height: 20px;
            color: #4a4f54;
        }

        @media screen and (max-width: 991px) {
            margin: 26px 0 0 -1rem;
            padding-left: 30px;
            border-left: 4px solid #f8f8f8;

            .title {
                letter-spacing: 2px;
                font-weight: 600;
                line-height: 20px;
                color: #4a4f54;
            }
        }

        @media screen and (max-width: 767px) {
            font-size: 12px;
            padding-left: 1rem;
        }
    }
`

const AccountNote = () => (
    <CustomList>
        <List.Item className='title'><Translate id='createAccount.note.title' /></List.Item>
        <List.Item>
            <Translate id='createAccount.note.one' />
        </List.Item>
        <List.Item>• <Translate id='createAccount.note.two' /></List.Item>
        <List.Item>• <Translate id='createAccount.note.three' /></List.Item>
        <List.Item>• <Translate id='createAccount.note.four' /></List.Item><br></br>
        <List.Item>
            <Translate id='createAccount.note.five' />
        </List.Item>
        <List.Item>• <Translate id='createAccount.note.six' /></List.Item>
    </CustomList>
)

export default AccountNote
