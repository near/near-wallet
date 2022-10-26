import React, { useCallback, useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';

import { selectAccountId } from '../../../redux/slices/account';
import isMobile from '../../../utils/isMobile';
import FormButton from '../../common/FormButton';
import Modal from '../../common/modal/Modal';
import { Container, Description, Title } from './ui';

const ConfirmDisableMethod = ({
    title,
    description,
    acccountId,
    isOpen,
    isProcessing,
    onClose,
    onSubmit
}) => {
    const [value, setValue] = useState('');
    const onChangeHandler = useCallback((e) => {
        setValue(e.target.value);
    }, [setValue]);

    const accountId = useSelector(selectAccountId);
    const accountIdConfirmed = accountId === value;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            modalSize='sm'
        >
            <Container>
                <Title>{title}</Title>
                <Description>{description}</Description>
                <Translate>
                    {({ translate }) => (
                        <input
                            placeholder={translate('recoveryMgmt.disableInputPlaceholder')}
                            onChange={onChangeHandler}
                            value={value}
                            autoCapitalize='off'
                            spellCheck='false'
                            autoFocus={!isMobile()}
                        />
                    )}
                </Translate>
                <FormButton
                    color='red'
                    type='submit'
                    sendingString='button.disabling'
                    sending={isProcessing}
                    disabled={!accountIdConfirmed}
                    onClick={onSubmit}
                >
                    <Translate id='button.disable' />
                </FormButton>
                <FormButton
                    className='link'
                    onClick={onClose}>
                    <Translate id='button.cancel' />
                </FormButton>
            </Container>
        </Modal>
    );
};

export default ConfirmDisableMethod;
