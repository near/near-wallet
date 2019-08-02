import React from 'react';
import { shallow, configure, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Balance from './Balance'
import milli from '../../images/n-1000.svg'

configure({adapter: new Adapter()});

describe('<Balance.js>', ()=>{
    const contextNull = '.0987'
    const contextSmall = "1"+"0".repeat(10) 
    const contextBig = "1234567"+"0".repeat(15)

    it('balance should return properly for non 0 for 0.0987',()=>{
        let wrapper = shallow(<Balance amount={contextNull} milli={milli}/>)
        expect(wrapper.contains("0.00000")).toEqual(true)
    })

    it('balance should return properly for small number',()=>{
        let wrapper = shallow(<Balance amount={contextSmall} milli={milli}/>)
        expect(wrapper.contains("0.00001")).toEqual(true);
        expect(wrapper.find("img").prop("src")).toEqual(milli);
    })

    it('balance should return properly',()=>{
        let wrapper = render(<Balance amount={contextBig} />)
        expect(wrapper.text()).toEqual("1,234.56700 Ⓝ");
    })
})
