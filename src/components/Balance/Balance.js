import React from 'react'

const NEAR_NOMINATION = 10**18
// denomination of one near in minimal non divisible units (attoNears)

const Balance = (props) => {
    let amount = props.amount / NEAR_NOMINATION
    let style = {
        width: "1.2em",
        height: "1.2em",
        marginLeft: "4px", 
        bottom: "-2px",
        position: "relative"
    }
    return (<div>
        {(amount < 0.01) ?
            <div>{(amount*1000).toFixed(5)}<img style={style} src={props.milli} alt="" /></div> : <div>{amount} Ⓝ</div>}
    </div>)
}

export default Balance