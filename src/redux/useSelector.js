import { useSelector, useDispatch } from 'react-redux';
import { wallet } from '../utils/wallet'

// TODO: ultimately change the name to useSelector 
export const useSelectorActiveAccount = (selector) => 
    useSelector((state) => 
        selector(state[wallet.accountId])
    )

