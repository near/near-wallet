import BN from 'bn.js';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';

import Balance from './Balance';

configure({adapter: new Adapter()});

describe('<Balance.js>', ()=>{
    const contextZero = '0';
    const contextTiny = '123456';
    const contextSmall = "1"+"0".repeat(19);
    const contextBig = "1234567"+"0".repeat(21);

    it('balance should return properly for 0',()=>{
        let wrapper = shallow(<Balance symbol={false} amount={contextZero} showBalanceInUSD={false} />);
        expect(wrapper.text()).toEqual("0");
    });

    it('balance should return properly for 0 BN',()=>{
        let wrapper = shallow(<Balance symbol={false} amount={new BN(0)} showBalanceInUSD={false} />);
        expect(wrapper.text()).toEqual("0");
    });

    it('balance should return properly for non 0 for 0.0987',()=>{
        let wrapper = shallow(<Balance symbol={false} amount={contextTiny} showBalanceInUSD={false} />);
        expect(wrapper.text()).toEqual("<0.00001");
    });

    it('balance should return properly for small number',()=>{
        let wrapper = shallow(<Balance symbol={false} amount={contextSmall} showBalanceInUSD={false} />);
        expect(wrapper.text()).toEqual("0.00001");
    });

    it('balance should return properly',()=>{
        let wrapper = shallow(<Balance symbol={false} amount={contextBig} showBalanceInUSD={false} />);
        expect(wrapper.text()).toEqual("1,234.567");
    });

    it('balance should return balance w/ NEAR symbol',()=>{
        let wrapper = shallow(<Balance amount={contextBig} showBalanceInUSD={false}/>);
        expect(wrapper.text()).toEqual("1,234.567\u00a0NEAR");
    });
});
