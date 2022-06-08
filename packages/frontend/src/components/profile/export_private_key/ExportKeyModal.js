import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import CheckMarkNoBorderIcon from '../../../images/icon-check-no-border.svg';
import { selectAccountId } from '../../../redux/slices/account';
import isMobile from '../../../utils/isMobile';
import ClickToCopy from '../../common/ClickToCopy';
import FormButton from '../../common/FormButton';
import Modal from '../../common/modal/Modal';

const Container = styled.div`
    &&&&& {
        padding: 15px 0 10px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        h3 {
            margin: 15px 0;
            font-size: 18px;
            font-weight: 700;
        }

        p {
            line-height: 1.5;
            font-size: 14px;
        }

        label {
            text-align: left;
            display: flex;
            background-color: #F5FAFF;
            margin: 25px -25px 0 -25px;
            padding: 15px 25px;
            line-height: 1.5;

            > div {
                > div {
                    border-color: #0081F1;
                }
            }

            > span {
                margin-left: 10px;
                word-break: break-word;
                color: #006ADC;
            }

            b {
                color: #272729;
            }
        }

        > button {
            margin-top: 32px;
            width: 100%;
        }

        .link {
          margin-top: 20px;
        }

        .text-select-display {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          padding: 20px;

          background: #272729;
          border-radius: 8px;

          word-break: break-word;
          text-align: left;
        }

        input.success {
          background: url(${CheckMarkNoBorderIcon}) no-repeat right;
          background-position: 97%;
        }

        form {
          width: 100%
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          > button {
            margin-top: 32px;
            width: 100%;
          }

          .link {
            margin-top: 20px;
          }
        }
    }
`;

const VIEWS = {
  ACCOUNT_ID_CONFIRMATION: 'accountIdConfirmation',
  VIEW_PRIVATE_KEY: 'viewPrivateKey'
};

export default ({
    isOpen,
    onClose,
    secretKey
}) => {
  const [currentView, setCurrentView] = useState(VIEWS.ACCOUNT_ID_CONFIRMATION);

    return (
        <Modal
            id='remove-account-modal'
            isOpen={isOpen}
            onClose={onClose}
            modalSize='sm'
        >
            <Container>
                <h3><Translate id='exportPrivateKey.title' /></h3>
                <p><Translate id='exportPrivateKey.desc' /></p>
                <ExportKeyModalBody 
                  currentView={currentView} 
                  setCurrentView={setCurrentView} 
                  onClose={onClose} 
                  secretKey={secretKey}
                />
            </Container>
        </Modal>
    );
};

const ExportKeyModalBody = ({ currentView, setCurrentView, onClose, secretKey }) => {
  switch (currentView) {
    case VIEWS.ACCOUNT_ID_CONFIRMATION: 
      return (
        <ConfirmationScreen setCurrentView={setCurrentView} onClose={onClose} />
      );
    case VIEWS.VIEW_PRIVATE_KEY:
      return (
        <>
          <ClickToCopy copy={secretKey}>
            <div className='text-select-display'>
              {secretKey}
            </div>
          </ClickToCopy>
          <FormButton onClick={onClose}>
            <Translate id='button.dismiss' />
          </FormButton>
        </>
      );
  }
};
 
const ConfirmationScreen = ({ setCurrentView, onClose }) => {
  const [typedAccountId, setTypedAccountId] = useState('');
  const accountId = useSelector(selectAccountId);
  const accountIdConfirmed = accountId === typedAccountId;

  return (
    <form onSubmit={() => setCurrentView(VIEWS.VIEW_PRIVATE_KEY)}>
      <p><Translate id='exportPrivateKey.enterAccountAddress' /></p>
      <Translate>
          {({ translate }) => (
              <input
                  placeholder={translate('input.accountId.placeholder')}
                  onChange={(e) => setTypedAccountId(e.target.value)}
                  value={typedAccountId}
                  autoCapitalize='off'
                  spellCheck='false'
                  autoFocus={!isMobile()}
                  className={accountIdConfirmed ? 'success' : undefined}
              />
          )}
      </Translate>
      <FormButton
          disabled={!accountIdConfirmed}
          type='submit'
      >
          <Translate id='button.viewPrivateKey' />
      </FormButton>
      <FormButton
          className='link'
          onClick={onClose}>
          <Translate id='button.cancel' />
      </FormButton>
    </form>
  );
};
