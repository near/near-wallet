import React, {
    FC,
    ComponentPropsWithoutRef,
    useCallback,
    useState
} from 'react';

import EyeIcon from '../EyeIcon';
import {
    Wrapper,
    InputContent,
    InputElement,
    IconClickArea,
    ErrorTextWrapper,
} from './ui';


type InputProps = ComponentPropsWithoutRef<'input'> & {
    valid?: boolean;
    error?: string;
    placeholder?: string;
}

const Input: FC<InputProps> = (props) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleEyeClick = useCallback(() => {
        setShowPassword(!showPassword);
    }, [showPassword]);

    return (
        <Wrapper>
            <InputContent>
                <InputElement
                    {...props}
                    placeholder={props.placeholder}
                    error={Boolean(props.error)}
                    type={showPassword ? 'text': 'password'} />
                <IconClickArea onClick={handleEyeClick}>
                    <EyeIcon open={showPassword} fill='#9ba1a6'/>
                </IconClickArea>
            </InputContent>
            <ErrorTextWrapper show={Boolean(props.error)}>
                {props.error}
            </ErrorTextWrapper>
        </Wrapper>
    );
};

export default Input;
