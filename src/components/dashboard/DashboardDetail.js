import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-localize-redux'
import { withRouter } from 'react-router-dom'
import { wallet } from '../../utils/wallet'
import { getAccessKeys, getTransactions, getTransactionStatus } from '../../actions/account'
import DashboardSection from './DashboardSection'
import DashboardActivity from './DashboardActivity'
import PageContainer from '../common/PageContainer'
import FormButton from '../common/FormButton'
import Balance from '../common/Balance'

import activityGreyImage from '../../images/icon-activity-grey.svg'
import AuthorizedGreyImage from '../../images/icon-authorized-grey.svg'
import AccessKeysIcon from '../../images/icon-keys-grey.svg'

import DashboardKeys from './DashboardKeys'

import { TRANSACTIONS_REFRESH_INTERVAL, EXPLORER_URL } from '../../utils/wallet'

class DashboardDetail extends Component {
    state = {
        loader: false,
        notice: false
    }

    componentDidMount() {
        this.refreshAccessKeys()
        this.refreshTransactions()

        this.interval = setInterval(() => {
            !document.hidden && this.refreshTransactions()
        }, TRANSACTIONS_REFRESH_INTERVAL)

        this.setState(() => ({
            loader: true
        }))
    }

    componentWillUnmount = () => {
        clearInterval(this.interval)
    }

    refreshTransactions() {
        this.props.getTransactions()
    }

    refreshAccessKeys = () => {
        this.setState(() => ({
            loader: true
        }))

        this.props.getAccessKeys().then(() => {
            this.setState(() => ({
                loader: false
            }))
        })
    }

    handleNotice = () => {
        this.setState(state => ({
            notice: !state.notice
        }))
    }

    render() {
        const { loader, notice } = this.state

        const { 
            authorizedApps, 
            fullAccessKeys, 
            transactions,
            accountId, 
            formLoader, 
            getTransactionStatus, 
            balance 
        } = this.props

        return (
            <PageContainer
                title={(
                    balance
                        ? <Fragment>
                            <span className='balance'><Translate id='balance.balance' />: </span>
                            <Balance amount={balance.total}/> 
                        </Fragment>
                        : <Translate id='balance.balanceLoading' />
                )}
                additional={(
                    <FormButton 
                        linkTo='/send-money'
                        color='green-white-arrow'
                    >
                        <Translate id='button.send' />
                    </FormButton>
                )}
            >
                <DashboardSection
                    notice={notice}
                    handleNotice={this.handleNotice}
                >
                    <DashboardActivity
                        loader={loader}
                        image={activityGreyImage}
                        title={<Translate id='dashboard.activity' />}
                        to={`${EXPLORER_URL}/accounts/${accountId}`}
                        transactions={transactions}
                        accountId={accountId}
                        formLoader={formLoader}
                        getTransactionStatus={getTransactionStatus}
                    />
                    <DashboardKeys
                        image={AuthorizedGreyImage}
                        title={<Translate id='authorizedApps.pageTitle' />}
                        to='/authorized-apps'
                        empty={<Translate id='authorizedApps.dashboardNoApps' />}
                        accessKeys={authorizedApps}
                    />
                    <DashboardKeys
                        image={AccessKeysIcon}
                        title={<Translate id='fullAccessKeys.pageTitle' />}
                        to='/full-access-keys'
                        empty={<Translate id='fullAccessKeys.dashboardNoKeys' />}
                        accessKeys={fullAccessKeys}
                    />
                </DashboardSection>
            </PageContainer>
        )
    }
}

const mapDispatchToProps = {
    getAccessKeys,
    getTransactions,
    getTransactionStatus
}

const mapStateToProps = ({ account }) => ({
    ...account
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(DashboardDetail))
