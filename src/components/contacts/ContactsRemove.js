import React from 'react'
import { Link } from 'react-router-dom'

import MainImage from '../common/MainImage'
import FormButton from '../common/FormButton'

import AccountGreyImage from '../../images/icon-account-grey.svg'

const ContactsRemove = () => (

    <div className='deauthorize-box'>
        <div className='top contacts'>
            <div>
                <div className='title'>
                    {false &&
                        <div className='image'>
                            <MainImage 
                                src={AccountGreyImage} 
                                size='medium'
                            />
                        </div>
                    }
                    <div className='details'>
                        <h2>
                            Alex Skidanov
                        </h2>
                        <h5>
                            @alex.near
                        </h5>
                    </div>
                </div>
            </div>
            <div className='remove-connection'>
                <FormButton
                    className='deauthorize'
                    color='red'
                >
                    REMOVE CONNECTION
                </FormButton>
            </div>
        </div>
        <div className='recent-transactions'>
            <h6 className='title border-top'>
                RECENT TRANSACTIONS
            </h6>
            <div className='row border-top'>
                <b className='color-black'>You sent 20 Ⓝ</b>
                <div>3h ago</div>
            </div>
            <div className='row border-top'>
                <b className='color-black'>Alex sent you 1020 Ⓝ</b>
                <div>3d ago</div>
            </div>
            <div className='row border-top'>
                <b className='color-black'>You and Alex played NEAR Chess</b>
                <div>1w ago</div>
            </div>
        </div>
        <div className='send'>
            <Link to='/send-money/marcin'>
                <FormButton
                    className='deauthorize'
                    color='green'
                >
                    SEND
                </FormButton>
            </Link>
        </div>
    </div>
)

export default ContactsRemove
