import React from 'react';
import { Translate } from 'react-localize-redux';

import FormButton from '../../../common/FormButton';
import SkeletonLoading from '../../../common/SkeletonLoading';
import { Container, Description, Main, Title, TitleWrapper } from './ui';

const RecoveryMethod = ({
    title,
    description,
    skeleton,
    methodEnabled,
    canDisable,
    onEnable,
    onDisable
}) => {
    if (skeleton) {
        return (
            <SkeletonLoading
                height={skeleton}
                show
            />
        );
    }

    return (
        <Container>
            <Main>
                <TitleWrapper>
                    <Title>{title}</Title>
                </TitleWrapper>
                <FormButton
                    type='submit'
                    color={methodEnabled ? 'gray-red small' : 'blue small'}
                    onClick={methodEnabled ? onDisable : onEnable}
                >
                    <Translate id={methodEnabled ? 'button.disable' : 'button.enable' }/>
                </FormButton>
            </Main>
            {description && (<Description>{description}</Description>)}
        </Container>
    );
};

export default RecoveryMethod;
