
import React from 'react'

// denomination of one near in minimal non divisible units (attoNears)
const NEAR_NOMINATION = 10 ** 18

const REG = /(?=(\B)(\d{3})+$)/g;

const Balance = (props) => {
    let style = {
        width: "1em",
        height: "1em",
        marginLeft: "3px",
        verticalAlign: "middle"
    }

    let amount = Number(props.amount) / NEAR_NOMINATION
    let amountShow = (amount < 0.01) ?
        <div>{(amount * 1000).toFixed(5).toString()}<img style={style} src={props.milli} alt="" /></div> :
        (amount < 1 ? <div>{amount.toFixed(5).toString()} Ⓝ</div> :
            (amount < 1000 ? <div>{amount.toFixed(5).toString()} Ⓝ</div> : <div>{toThousands(amount)} Ⓝ</div>)
        )
    
    return (<div>
        {amountShow}
    </div>)
}

const toThousands = (num) => {
    let numInt = parseInt(num)
    let numDec = num - numInt
    numDec = numDec.toFixed(5).toString().slice(1)
    return numInt.toString().replace(REG, ",") + numDec

}

export default Balance