import { connect } from 'react-redux'

const accountId = localStorage.getItem('4:wallet:active_account_id_v2') || ''

export default (mapStateToProps, mapDispatchToProps) => {
    return connect(
        (state, ownProps) => {
            return {
                ...mapStateToProps(
                    state, 
                    accountId ? state[accountId] : {}, 
                    ownProps
                ),
            }
        },
        mapDispatchToProps
    )
}
