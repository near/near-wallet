import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'

import { Grid, List, Image, Button } from 'semantic-ui-react'

import TransactionFilter from '../../images/icon-m-filter.svg'
import CloseImage from '../../images/icon-close.svg'
import AccountGreyImage from '../../images/icon-account-grey.svg'
import MTransactionImage from '../../images/icon-m-transaction.svg'
import CheckBlueImage from '../../images/icon-check-blue.svg'

import { PaginationTab } from './PaginationTab'
import PaginationPaging from './PaginationPaging'
import PaginationSummary from './PaginationSummary'
import Search from '../common/Search'

import PaginationSortBy from './PaginationSortBy'

import styled from 'styled-components'

const PaginationBlockGrid = styled(Grid)`
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
      padding: 0 0 0 0;
      margin-top: -16px;
   }

   &&& .sub-list {
      background: #fff;
      width: 100%;
      height: 100%;
      padding: 0 0;

      > .item {
         padding: 18px 20px;
      }

      .img {
         width: 20px;
         position: absolute;
         top: 20px;
         right: 20px;
         padding: 0px;

         img {
            cursor: pointer;
         }
      }

      .text {
         margin: 0 10% 0 0;
         color: #24272a;
         float: left;

         .header {
            font-family: 'benton-sans', sans-serif;
         }
         .content {
            color: #999999;
            padding-top: 12px;
            line-height: 20px;
         }
      }
      .main-image {
         border: 0px;
         padding: 0 10px;
         width: 48px;
         height: 48px;
         background: #e6e6e6;
         border-radius: 32px;
         margin: 0 0 0 0;

         img {
            padding-top: 10px;
         }
      }

      .remove-connection {
         > button {
            width: 100%;
            background-color: #ff585d;
            border: 2px solid #ff585d;
            border-radius: 25px;
            color: #fff;
            font-weight: 600;

            :hover {
               background: #fff;
               color: #ff585d;
            }
         }
      }
      .recent-transactions {
         background-color: #f8f8f8;
         margin: 0 0 0 0;
      }
      .recent-transactions-title {
         padding: 0 0 0 24px;
         background: url(${MTransactionImage}) no-repeat left 2px;
         background-size: 12px auto;
      }
      .recent-transactions-row {
         margin: 0 0 0 24px;
         padding: 12px 0;
         border-bottom: 2px solid #e6e6e6;
      }
      .recent-transactions-row:last-child {
         border-bottom: 0px solid #e6e6e6;
      }

      .authorized-transactions {
         background-color: #fff;
         margin: 0 0 0 0;
         padding-top: 0px;
      }
      .authorized-transactions-title {
         padding: 12px 0 0 24px;
         background: url(${MTransactionImage}) no-repeat left 14px;
         background-size: 12px auto;
      }
      .authorized-transactions-row {
         margin: 0 0 0 24px;
         padding: 12px 0 0 32px;
         background: url(${CheckBlueImage}) no-repeat left 14px;
         line-height: 32px;
      }
      .authorized-transactions-row:last-child {
         border-bottom: 0px solid #e6e6e6;
      }

      .send-money {
         > .button {
            width: 100%;
            background-color: #5ace84;
            border: 2px solid #5ace84;
            border-radius: 25px;
            color: #fff;
            font-weight: 600;

            :hover {
               background-color: #fff;
               color: #5ace84;
            }
         }
      }
   }
   @media screen and (max-width: 991px) {
      &&& .sub-list {
         .img {
            top: 6px;
            right: 6px;
         }

         .main-image {
            display: none;
         }
      }
   }

   @media screen and (max-width: 767px) {
      &&& {
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
      dropdownType: this.props.type ? this.props.filterTypes[this.props.type].img : TransactionFilter,
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
      //    pageNumber: pageNumber,
      //    loader: true,
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
      const { filterTypes, type, pageNumber = 0, showSub = false, subPage, showSubData, toggleCloseSub, handleDeauthorize } = this.props

      const { dropdownType, dropdown, search, pagingValue, pagingDropdown } = this.state

      const { totalRecords = 1100, pageLimit = 10, initialPage = 0, onPageChanged = () => {}, pageNeighbors = 1 } = this.props

      const filterTypesByType = type ? [filterTypes[type]] : filterTypes

      return (
         <PaginationBlockGrid className='border-top-bold border-bottom-bold' stackable columns={2}>
            <Grid.Row className='border-bottom-light'>
               {false && (
                  <Grid.Column width={10} verticalAlign='middle' className='pagination-block-top'>
                     <PaginationSortBy filterTypesByType={filterTypesByType} handleOnClick={this.handleOnClick} dropdownType={dropdownType} handleDropdownClick={this.handleDropdownClick} dropdown={dropdown} />
                  </Grid.Column>
               )}
               {false && (
                  <Grid.Column width={6} textAlign='right' floated='right' verticalAlign='middle' className='pagination-block-top-search'>
                     <Search handleSubmit={this.handleSubmit} handleChange={this.handleChange} search={search} />
                  </Grid.Column>
               )}
            </Grid.Row>
            <Grid.Row>
               <Grid.Column computer={showSub ? 10 : 16} className={showSub ? `mobile-hide` : ``}>
                  <Grid>{this.props.children}</Grid>
               </Grid.Column>
               <Grid.Column computer={6} className={`show-sub ${showSub ? `` : `hide`}`}>
                  <List className='box sub-list'>
                     <List.Item className='img'>
                        <Image onClick={() => toggleCloseSub()} src={CloseImage} />
                     </List.Item>

                     {subPage === 'authorized-apps' && showSubData ? (
                        <Fragment>
                           <List.Item>
                              <List horizontal>
                                 <List.Item>
                                    <div className='main-image' style={{ backgroundColor: '#fff' }}>
                                       <Image src={showSubData[0]} align='left' />
                                    </div>
                                 </List.Item>
                                 <List.Item>
                                    <List.Header as='h2'>{showSubData[1]}</List.Header>

                                    <List.Item as='h5' className='color-blue'>
                                       <span className='color-black'>amount:</span>
                                       {showSubData[2]}Ⓝ
                                    </List.Item>
                                 </List.Item>
                              </List>
                           </List.Item>
                           <List.Item className='remove-connection border-top'>
                              <Button onClick={handleDeauthorize}>DEAUTHORIZE</Button>
                           </List.Item>
                           {false && (
                              <List.Item className='authorized-transactions'>
                                 <List.Item as='h6' className='authorized-transactions-title border-top'>
                                    AUTHORIZED TO
                                 </List.Item>
                                 <List.Item className='authorized-transactions-row color-black'>View your Account Name</List.Item>
                                 <List.Item className='authorized-transactions-row color-black'>Do something else on your behalf</List.Item>
                              </List.Item>
                           )}
                           {false && (
                              <List.Item className='recent-transactions'>
                                 <List.Item as='h6' className='recent-transactions-title border-top'>
                                    RECENT TRANSACTIONS
                                 </List.Item>
                                 <List.Item className='recent-transactions-row border-top'>
                                    <List.Header>Another thing here</List.Header>
                                    <List.Item>3h ago</List.Item>
                                 </List.Item>
                                 <List.Item className='recent-transactions-row border-top'>
                                    <List.Header>Another Thing Happened</List.Header>
                                    <List.Item>3d ago</List.Item>
                                 </List.Item>
                                 <List.Item className='recent-transactions-row border-top'>
                                    <List.Header>In-app purchase: 20 Ⓝ</List.Header>
                                    <List.Item>1w ago</List.Item>
                                 </List.Item>
                                 <List.Item className='recent-transactions-row border-top'>
                                    <List.Header>Staked: 10 Ⓝ</List.Header>
                                    <List.Item>2w ago</List.Item>
                                 </List.Item>
                                 <List.Item className='recent-transactions-row border-top'>
                                    <List.Header>Authorized</List.Header>
                                    <List.Item>2w ago</List.Item>
                                 </List.Item>
                              </List.Item>
                           )}
                        </Fragment>
                     ) : (
                        <Fragment>
                           <List.Item>
                              <List horizontal>
                                 <List.Item>
                                    <div className='main-image'>
                                       <Image src={AccountGreyImage} align='left' />
                                    </div>
                                 </List.Item>
                                 <List.Item>
                                    <List.Header as='h2'>Alex Skidanov</List.Header>
                                    <List.Item as='h5'>@alex.near</List.Item>
                                 </List.Item>
                              </List>
                           </List.Item>
                           <List.Item className='remove-connection border-top'>
                              <Button>REMOVE CONNECTION</Button>
                           </List.Item>
                           <List.Item className='recent-transactions'>
                              <List.Item as='h6' className='recent-transactions-title border-top'>
                                 RECENT TRANSACTIONS
                              </List.Item>
                              <List.Item className='recent-transactions-row border-top'>
                                 <List.Header>You sent 20 Ⓝ</List.Header>
                                 <List.Item>3h ago</List.Item>
                              </List.Item>
                              <List.Item className='recent-transactions-row border-top'>
                                 <List.Header>Alex sent you 1020 Ⓝ</List.Header>
                                 <List.Item>3d ago</List.Item>
                              </List.Item>
                              <List.Item className='recent-transactions-row border-top'>
                                 <List.Header>You and Alex played NEAR Chess</List.Header>
                                 <List.Item>1w ago</List.Item>
                              </List.Item>
                           </List.Item>
                           <List.Item className='send-money border-top'>
                              <Button as={Link} to='/send-money/marcin'>
                                 SEND MONEY
                              </Button>
                           </List.Item>
                        </Fragment>
                     )}
                  </List>
               </Grid.Column>
            </Grid.Row>
            {false && (
               <Grid.Row className='border-top-light'>
                  <Grid.Column width={8} verticalAlign='middle' className='pagination-block-top-paging'>
                     <List horizontal verticalAlign='middle'>
                        <List.Item width={6}>
                           <PaginationPaging handleOnClickPaging={this.handleOnClickPaging} pagingValue={pagingValue} pagingDropdown={pagingDropdown} handlePagingDropdownClick={this.handlePagingDropdownClick} />
                        </List.Item>
                        <List.Item width={6} as='h6' className='pagination-block-top-paging-summary'>
                           <PaginationSummary pageNumber={pageNumber} pageLimit={pageLimit} totalRecords={totalRecords} />
                        </List.Item>
                     </List>
                  </Grid.Column>
                  <Grid.Column width={8} className='pagination-block-paging' textAlign='right'>
                     <PaginationTab totalRecords={totalRecords} pageLimit={pageLimit} initialPage={initialPage} onPageChanged={onPageChanged} pageNeighbors={pageNeighbors} />
                  </Grid.Column>
               </Grid.Row>
            )}
         </PaginationBlockGrid>
      )
   }
}

export default PaginationBlock
