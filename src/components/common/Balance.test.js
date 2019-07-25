import React from 'react';
import { shallow, mount, configure, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Balance from './Balance'
import milli from '../../images/n-1000.svg'

configure({adapter: new Adapter()});

describe('<Balance.js>', ()=>{
    const contextSmall = "1"+"0".repeat(10) 
    const contextBig = "1"+"0".repeat(21)

    it('balance should return properly for small number',()=>{
        let wrapper = shallow(<Balance amount={contextSmall} />)
        expect(wrapper.contains("0.00001")).toEqual(true);
    })

    it('balance should return properly',()=>{
        let wrapper = render(<Balance amount={contextBig} />)
        expect(wrapper.text()).toEqual("1,000.00000 Ⓝ");
    })
})