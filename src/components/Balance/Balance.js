import React from 'react'

// denomination of one near in minimal non divisible units (attoNears)
const NEAR_NOMINATION = 10**18

const REG = /(?=(\B)(\d{3})+$)/g;

const Balance = (props) => {
    let amount = props.amount / NEAR_NOMINATION
    let style = {
        width: "1em",
        height: "1em",
        marginLeft: "3px", 
        verticalAlign: "middle"
    }
    return (<div>
        {(amount < 0.01) ?
            <div>{(amount * 1000).toFixed(5)}<img style={style} src={props.milli} alt="" /></div> : 
            (amount < 1 ? <div>{amount.toFixed(5)} Ⓝ</div> : 
            (amount < 1000 ? <div>{amount.toFixed(5)} Ⓝ</div> : <div>{toThousands(amount)} Ⓝ</div>)
            )}
    </div>)
}

const toThousands = (num) => {
    let num_i = parseInt(num)
    let num_d = num - num_i
    num_d = num_d.toFixed(5).toString().slice(1,)
    return num_i.toString().replace(REG,",") + num_d
    
} 

export default Balance
