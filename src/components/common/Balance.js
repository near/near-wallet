import React from 'react'

// denomination of one near in minimal non divisible units (attoNears)
// const NEAR_NOMINATION = 10 ** 18
const NOMINATION = 18

const REG = /(?=(\B)(\d{3})+$)/g;

const Balance = (props) => {
    let index = props.amount ? props.amount.indexOf(".") : null
    let amount = index > 0 ? props.amount.slice(0, index) : props.amount
    let amountShow = amount ? ((amount.length <= NOMINATION - 3) ? 
                    convertToShowMilli(amount,props.milli) : convertToShow(amount))
                    : null

    return (<div>
        {amountShow}
    </div>)
}

const convertToShowMilli = (amount, milli) => {
    let style = {
        width: "1em",
        height: "1em",
        marginLeft: "3px",
        verticalAlign: "middle"
    }
    let zerosSmall = "0".repeat(NOMINATION - 3)
    return (<div>{"0." + (zerosSmall.substring(amount.length) + amount).slice(0, 5)}<img style={style} src={milli} alt="" /></div>)
}

const convertToShow = (amount) => {
    if (amount.length <= NOMINATION) {
        let zeros = "0".repeat(NOMINATION)
        return (<div>{"0." + (zeros.substring(amount.length) + amount).slice(0, 5)} Ⓝ</div>)
    }else{
        let len = amount.length - NOMINATION
        let numInt = len>3 ? amount.slice(0, len).replace(REG, ",") : amount.slice(0, len)
        let numDec = amount.slice(len, amount.length)
        let num = numInt + "." + numDec.slice(0, 5)
        return (<div>{num} Ⓝ</div>)
    }
    
}

export default Balance