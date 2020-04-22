import React from 'react'
import { BN } from 'bn.js'
import Balance from './Balance'
import { connect } from 'react-redux'

const AccountBalance = (props) => {
    const { 
        amount,
        locked,
        storageUsage,
        type
    } = props
    
    const minimum = new BN('1059799993200009639475150') // TODO: storageUsage (bytes) * cost per byte
    const staked = new BN(locked)
    const availableBalance = new BN(amount).sub(staked.add(minimum))

    let balance = amount

    if (type === 'minimum')
        balance = minimum
    else if (type === 'staked')
        balance = staked
    else if (type === 'available')
        balance = availableBalance

    return (
        <Balance amount={balance.toString()}/>
    )
}

const mapStateToProps = ({ account }) => ({
    ...account
})

export default connect(mapStateToProps)(AccountBalance)