import React from 'react'

// denomination of one near in minimal non divisible units (attoNears)
// const NEAR_NOMINATION = 10 ** 18
const NOMINATION = 18

const REG = /(?=(\B)(\d{3})+$)/g;

const Balance = (props) => {
    let style = {
        width: "1em",
        height: "1em",
        marginLeft: "3px",
        verticalAlign: "middle"
    }

    let amount = props.amount
    let zerosSmall = "0".repeat(NOMINATION - 3)
    let zeros = "0".repeat(NOMINATION)
    let amountShow = amount ? ((amount.length <= NOMINATION - 3) ?
        <div>{"0." + (zerosSmall.substring(amount.length) + amount).slice(0,5)}<img style={style} src={props.milli} alt="" /></div> :
        (amount.length <= NOMINATION) ? <div>{"0." + (zeros.substring(amount.length) + amount).slice(0,5)} Ⓝ</div> :
            <div>{convertToShow(amount)} Ⓝ</div>) :null

    return (<div>
        {amountShow}
    </div>)
}
const convertToShow = (string) => {
    console.log(string, typeof string, string.length)
    let len = string.length - NOMINATION
    let numInt = string.slice(0, len).replace(REG, ",")
    let numDec = string.slice(len, string.length)
    return numInt + "." + numDec.slice(0,5)
}

export default Balance