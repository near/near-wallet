import React, { Component } from 'react'

import { Grid, List } from 'semantic-ui-react'

import TransactionFilter from '../../images/icon-m-filter.svg'

import PaginationShowSubBox from './PaginationSubBox'
import { PaginationTab } from './PaginationTab'
import PaginationPaging from './PaginationPaging'
import PaginationSummary from './PaginationSummary'
import Search from '../common/Search'

import PaginationSortBy from './PaginationSortBy'

import styled from 'styled-components'

const PaginationBlockGrid = styled(Grid)`
    &&& {
        border-bottom: 2px solid #e6e6e6;
        padding-bottom: 1rem;

        .list-item {
            > .row {
                border-top: 1px solid #e6e6e6;

                :first-of-type {
                    border-top: 0;
                }
            }
        }
    }

    & > .row:first-child {
        ${'' /* min-height: 70px; */}
        padding-top: 0px;
    }

    &&& .pagination-block-paging {
        padding: 0px;
    }

    &&& .pagination-block-top {
        padding-left: 0px;

        &-paging-summary {
            padding-left: 20px;
        }

        &-search {
            padding: 0px;
        }

        &-paging {
            padding-left: 0px;
        }
    }

    &&& .show-sub {
        padding: 0;
        margin-top: -16px;
    }

    @media screen and (max-width: 991px) {
        
    }
    @media screen and (max-width: 767px) {
        &&& {
            padding-bottom: 0;
            margin-top: 0px;
            
            .mobile-hide {
                display: none;
            }
            .main-image {
                display: block;
            }
        }
    }
`

class PaginationBlock extends Component {
    static defaultProps = {
        onPageChanged: () => {}
    }

    state = {
        search: '',
        dropdown: false,
        dropdownType: this.props.type
            ? this.props.filterTypes[this.props.type].img
            : TransactionFilter,
        pagingDropdown: false,
        pagingValue: 10,

        buttonRadio: false
    }

    handleOnClick = () => {
        this.setState({
            dropdown: !this.state.dropdown
        })
    }

    handleOnClickPaging = () => {
        this.setState({
            pagingDropdown: !this.state.pagingDropdown
        })
    }

    handleChange = (e, { name, value }) => {
        this.setState(() => ({ [name]: value }))
    }

    handleSubmit = () => {
        console.log('not ready yet')
    }

    handleDropdownClick = dropdownType => {
        this.setState({
            dropdownType,
            dropdown: !this.state.dropdown
        })
    }

    handlePagingDropdownClick = pagingValue => {
        this.setState({
            pagingValue,
            pagingDropdown: !this.state.pagingDropdown
        })

        this.props.onPageChanged(1, pagingValue)
    }

    handleTabChange(pageNumber) {
        // this.setState({
        //     pageNumber: pageNumber,
        //     loader: true,
        // })
        // this.updateBlock(pageNumber)
        // return pageNumber
    }

    buttonRadioClick = () => {
        this.setState(state => ({
            buttonRadio: !state.buttonRadio
        }))
    }

    render() {
        const {
            filterTypes,
            type,
            pageNumber = 0,
            showSub = false,
            subPage,
            showSubData,
            toggleCloseSub,
            handleDeauthorize,
            handleConfirm, 
            handleConfirmSubmit, 
            handleChange,
            handleConfirmClear,
            accountId,
            confirm,
            confirmStatus,
            formLoader
        } = this.props

        const {
            dropdownType,
            dropdown,
            search,
            pagingValue,
            pagingDropdown
        } = this.state

        const {
            totalRecords = 1100,
            pageLimit = 10,
            initialPage = 0,
            onPageChanged = () => {},
            pageNeighbors = 1
        } = this.props

        const filterTypesByType = type ? [filterTypes[type]] : filterTypes

        return (
            <PaginationBlockGrid
                stackable
                columns={2}
            >
                {false && (
                    <Grid.Row className='border-bottom-light'>
                        <Grid.Column
                            width={10}
                            verticalAlign='middle'
                            className='pagination-block-top'
                        >
                            <PaginationSortBy
                                filterTypesByType={filterTypesByType}
                                handleOnClick={this.handleOnClick}
                                dropdownType={dropdownType}
                                handleDropdownClick={this.handleDropdownClick}
                                dropdown={dropdown}
                            />
                        </Grid.Column>
                        <Grid.Column
                            width={6}
                            textAlign='right'
                            floated='right'
                            verticalAlign='middle'
                            className='pagination-block-top-search'
                        >
                            <Search
                                handleSubmit={this.handleSubmit}
                                handleChange={this.handleChange}
                                search={search}
                            />
                        </Grid.Column>
                    </Grid.Row>
                )}
                <Grid.Row>
                    <Grid.Column
                        computer={showSub ? 10 : 16}
                        className={showSub ? `mobile-hide` : ``}
                    >
                        <Grid className='list-item'>{this.props.children}</Grid>
                    </Grid.Column>

                    <Grid.Column
                        computer={6}
                        className={`show-sub ${showSub ? `` : `hide`}`}
                    >
                        <PaginationShowSubBox
                            toggleCloseSub={toggleCloseSub}
                            subPage={subPage}
                            showSubData={showSubData}
                            handleDeauthorize={handleDeauthorize}
                            handleConfirm={handleConfirm}
                            handleConfirmSubmit={handleConfirmSubmit}
                            handleChange={handleChange}
                            accountId={accountId}
                            confirm={confirm}
                            confirmStatus={confirmStatus}
                            handleConfirmClear={handleConfirmClear}
                            formLoader={formLoader}
                        />
                    </Grid.Column>
                </Grid.Row>
                {false && (
                    <Grid.Row className='border-top-light'>
                        <Grid.Column
                            width={8}
                            verticalAlign='middle'
                            className='pagination-block-top-paging'
                        >
                            <List horizontal verticalAlign='middle'>
                                <List.Item width={6}>
                                    <PaginationPaging
                                        handleOnClickPaging={this.handleOnClickPaging}
                                        pagingValue={pagingValue}
                                        pagingDropdown={pagingDropdown}
                                        handlePagingDropdownClick={
                                            this.handlePagingDropdownClick
                                        }
                                    />
                                </List.Item>
                                <List.Item
                                    width={6}
                                    as='h6'
                                    className='pagination-block-top-paging-summary'
                                >
                                    <PaginationSummary
                                        pageNumber={pageNumber}
                                        pageLimit={pageLimit}
                                        totalRecords={totalRecords}
                                    />
                                </List.Item>
                            </List>
                        </Grid.Column>
                        <Grid.Column
                            width={8}
                            className='pagination-block-paging'
                            textAlign='right'
                        >
                            <PaginationTab
                                totalRecords={totalRecords}
                                pageLimit={pageLimit}
                                initialPage={initialPage}
                                onPageChanged={onPageChanged}
                                pageNeighbors={pageNeighbors}
                            />
                        </Grid.Column>
                    </Grid.Row>
                )}
            </PaginationBlockGrid>
        )
    }
}

export default PaginationBlock
