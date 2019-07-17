import React from 'react'

const BALANCE = 1000000000000000000

const Balance = (props) => {
    let amount = props.amount / BALANCE
    let style = {
        width: "1.2em",
        height: "1.2em",
        marginLeft: "4px", 
        bottom: "-2px",
        position: "relative"
    }
    return (<div>
        {(amount < 0.01) ?
            <div>{amount.toFixed(4)}<img style={style} src={props.milli} alt="" /></div> : <div>{amount} Ⓝ</div>}
    </div>)
}

export default Balance