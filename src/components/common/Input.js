import React from 'react';

const Input = (props) => (
    <input
        type={props.type}
        value={props.value}
        onChange={props.onChange}
        placeHolder={props.placeHolder}
    />
)

export default Input;