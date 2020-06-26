import React, { useState } from 'react';
import FormButton from '../../common/FormButton';
import { Translate } from 'react-localize-redux';

const TwoFactorMethod = () => {
    return (
        <div className='method'>
            <div className='top'>
                <div>
                    <div className='title'><Translate id='twoFactor.email'/></div>
                    <div>hello@je.com</div>
                </div>
                <FormButton className='gray-red'><Translate id='button.disable'/></FormButton>
            </div>
            <div className='bottom'>
                <span className='color-green'><Translate id='twoFactor.active'/></span> since Jan 08, 2020
            </div>
        </div>
    )
}

export default TwoFactorMethod;