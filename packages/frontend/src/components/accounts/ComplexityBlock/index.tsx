import React, { FC } from 'react';
import { Translate } from 'react-localize-redux';

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
): React.ReactElement => {
    switch (complexity) {
        case 'none':
            return null;
        case 'week':
            return <Translate id='setupPasswordProtection.week' />;
        case 'average':
            return <Translate id='setupPasswordProtection.average' />;
        case 'strong':
            return <Translate id='setupPasswordProtection.strong' />;
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
