import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import GiftBoxLineIcon from '../../images/gift-box-line.svg';
import GiftBoxIcon from '../../images/gift-box.svg';
import StarsIcon from '../../images/star.svg';
import { selectAccountId } from '../../redux/reducers/account';
import { getReleaseNotesClosed, setReleaseNotesClosed } from '../../utils/localStorage';
import FormButton from '../common/FormButton';
import Modal from '../common/modal/Modal';

const Header = styled.div`
    text-align: center;
    padding: 20px 0 50px;
    
    > div {
        width: 100%;
        height: 53px;
        background: url(${props => props.icon}) center top no-repeat;
    }
    > h2 {
        font-weight: bold;
        font-size: 20px;
        color: #24272A;
        padding: 60px 0 24px 0;
    }
    > span {
        background-color: #F0F0F1;
        padding: 10px 16px;
        border-radius: 4px;
        color: #72727A;
        
        font-family: 'IBM Plex Mono', monospace;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
    }

    @media (max-width: 649px) {
        padding: 0px 0 30px;

        > h2 {
            padding: 20px 0 24px 0;
        }
    }
`;

const SubHeader = styled.div`
    display: flex;
    font-size: 16px;
    color: #272729;
    font-weight: 600;
    margin-top: 48px;

    :before {
        content: '';
        background: url(${props => props.icon}) center top no-repeat;
        display: block;
        width: 24px;
        height: 25px;
        margin-right: 12px;
        margin-top: -5px;
        
    }
`;

const Container = styled.div`
    padding: 15px 0;

    ul {
        padding-inline-start: 24px;
    }

    li {
        color: #72727A;
        margin: 10px 0;
    }

    .text {
        margin-top: 25px;
    }

    &&& button {
        margin: 0;
        float: right;
    }

    @media (min-width: 650px) {
        padding: 30px 20px;
    }

    @media (max-width: 649px) {
        .text {
            margin-top: 0px;
        }
    }
`;

const RELEASE_NOTES_MODAL_VERSION = 'v0.01.2';

const ReleaseNotesModal = () => {
    const accountId = useSelector(state => selectAccountId(state));
    const [open, setOpen] = useState(!getReleaseNotesClosed(RELEASE_NOTES_MODAL_VERSION));
    
    const onClose = () => {
        setReleaseNotesClosed(RELEASE_NOTES_MODAL_VERSION);
        setOpen(false);
    };
    
    return (accountId && open)
        ? (
            <Modal
                id='release-notes-modal'
                isOpen={open}
                onClose={onClose}
                closeButton='true'
            >
                <Container>
                    <Header icon={GiftBoxIcon}>
                        <div />
                        <h2><Translate id="releaseNotesModal.title" /></h2>
                        <span>{RELEASE_NOTES_MODAL_VERSION}</span>
                    </Header>
                    <div className='text'><Translate id="releaseNotesModal.desc" /></div>

                    <SubHeader icon={GiftBoxLineIcon}>
                        <Translate id="releaseNotesModal.subTitle1" />
                    </SubHeader>
                    <ul>
                        <li><Translate id="releaseNotesModal.subText1" /></li>
                    </ul>

                    <SubHeader icon={StarsIcon}>
                        <Translate id="releaseNotesModal.subTitle2" />
                    </SubHeader>
                    <ul>
                        <li><Translate id="releaseNotesModal.subText2" /></li>
                    </ul>

                    <FormButton 
                        onClick={onClose}
                        size='small'
                    >
                        <Translate id="button.continue" />
                    </FormButton>
                </Container>
            </Modal>
        )
        : null;
};

export default ReleaseNotesModal;
