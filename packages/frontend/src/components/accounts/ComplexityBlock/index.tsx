import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import {
    getLevelsFromComplexity,
    PasswordComplexity
} from './lib/complexity';
import { Content, Level, Wrapper, Description, LevelWrapper } from './ui';

type ComplexityBlockProps = {
    complexity: PasswordComplexity;
}

export const renderComplexityTrans = (
    complexity: PasswordComplexity
): string => {
    const { t } = useTranslation();
    switch (complexity) {
        case 'none':
            return null;
        case 'week':
            return t('setupPasswordProtection.week');
        case 'average':
            return t('setupPasswordProtection.average');
        case 'strong':
            return t('setupPasswordProtection.strong');
    }
};

const ComplexityBlock: FC<ComplexityBlockProps> = (props) => {
    return (
        <Wrapper>
            <Content>
                <LevelWrapper>
                    {
                        Array(getLevelsFromComplexity(props.complexity))
                            .fill(undefined)
                            .map((_, index) =>
                                <Level key={index} level={index + 1} />
                            )
                    }
                </LevelWrapper>
                <Description>
                    {renderComplexityTrans(props.complexity)}
                </Description>
            </Content>
        </Wrapper>
    );
};

export default ComplexityBlock;
