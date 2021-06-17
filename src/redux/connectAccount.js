import { connect } from 'react-redux'
import { wallet } from '../utils/wallet'

export default (mapStateToProps, mapDispatchToProps) => {
    return connect(
        (state, ownProps) => {
            return {
                ...mapStateToProps(state, state[wallet.accountId], ownProps),
            }
        },
        mapDispatchToProps
    )
}
