import React from 'react';
import { shallow, configure, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Balance from './Balance'

configure({adapter: new Adapter()});

describe('<Balance.js>', ()=>{
    const contextNull = '123456'
    const contextSmall = "1"+"0".repeat(13) 
    const contextBig = "1234567"+"0".repeat(15)

    it('balance should return properly for non 0 for 0.0987',()=>{
        let wrapper = shallow(<Balance amount={contextNull} />)
        expect(wrapper.contains("<0.00001")).toEqual(true)
    })

    it('balance should return properly for small number',()=>{
        let wrapper = shallow(<Balance amount={contextSmall} />)
        expect(wrapper.contains("0.00001")).toEqual(true);
    })

    it('balance should return properly',()=>{
        let wrapper = shallow(<Balance amount={contextBig} />)
        expect(wrapper.contains("1,234.56700")).toEqual(true);
    })
})
