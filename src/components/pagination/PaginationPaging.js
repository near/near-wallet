import React from 'react'

import { Button, List } from 'semantic-ui-react'

import ArrowDown from '../../images/icon-arrow-down.svg'
import styled from 'styled-components'

const PaginationPagingList = styled(List)`
   && .paging-dropdown-tr {
      width: 66px;
      height: 36px;
      border: 2px solid #e6e6e6;
      background-color: #fff;

      border-radius: 18px;
      background-position: 38px center;
      background-repeat: no-repeat;
      background-size: 12px auto;
      padding: 0 20px 0 0;
   }

   && .paging-dropdown {
      padding-top: 0px;
      width: 66px;
      min-height: 30px;

      border: 2px solid #e6e6e6;
      background: #fff;
      border-radius: 18px;

      position: absolute;
      z-index: 200;
      top: 6px;

      box-shadow: 0 0 10px #ddd;

      & > .item:first-child {
         padding-top: 7px;
      }

      & > .item > .content {
         font-size: 14px;
         font-weight: 600;
         padding-left: 6px;
      }
   }

   &&& .filter-by {
      padding-left: 10px;
      padding-right: 20px;
   }
`

const pagingTypes = [10, 20, 50, 100]

const PaginationFilter = ({
   handleOnClickPaging,
   pagingValue,
   pagingDropdown,
   handlePagingDropdownClick
}) => (
   <PaginationPagingList horizontal className='border-right-light'>
      <List.Item>
         <Button
            onClick={handleOnClickPaging}
            // onBlur={() => this.setState({ dropdown: !this.state.dropdown })}
            className='paging-dropdown-tr'
            style={{ backgroundImage: ` url(${ArrowDown})` }}
         >
            {pagingValue}
         </Button>

         <List
            selection
            verticalAlign='middle'
            className={`paging-dropdown ${pagingDropdown ? '' : 'hide'}`}
         >
            {pagingTypes.map((type, i) => (
               <List.Item
                  key={`page-${i}`}
                  onClick={() => handlePagingDropdownClick(type)}
               >
                  <List.Content verticalAlign='middle'>{type}</List.Content>
               </List.Item>
            ))}
         </List>
      </List.Item>
      <List.Item as='h6' className='filter-by'>
         PER PAGE
      </List.Item>
   </PaginationPagingList>
)

export default PaginationFilter
