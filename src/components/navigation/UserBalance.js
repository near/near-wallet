import React from 'react';
import Balance from '../common/Balance';
import { selectProfileBalance } from '../../reducers/selectors/balance';
import { Translate } from 'react-localize-redux';

const UserBalance = ({ balance }) => {
    const profileBalance = selectProfileBalance(balance)
    return (
        <div style={{ color: '#8FD6BD'}} className='user-balance'>
            {profileBalance ? <Balance amount={profileBalance.totalBalance}/> : <Translate id='loading'/>}
        </div>
    )
}

export default UserBalance;