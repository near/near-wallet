import React from 'react'
import AccountId from '../common/AccountId'

const UserName = ({ accountId }) => (
    <div className='user-name'>
        <AccountId accountId={accountId}/>
    </div>
)

export default UserName;