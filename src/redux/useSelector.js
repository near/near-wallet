import { useSelector as useSelectorReactRedux, useDispatch } from 'react-redux';
import { wallet } from '../utils/wallet'

export const useSelector = (selector) => 
    useSelectorReactRedux((state) => 
        selector(
            wallet.accountId
                ? state[wallet.accountId]
                : {}
        )
    )

