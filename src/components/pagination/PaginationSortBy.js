import React from 'react'

import { Button, List } from 'semantic-ui-react'

import ArrowDown from '../../images/icon-arrow-down.svg'

import styled from 'styled-components'

const PaginationFilterList = styled(List)`
   && .sortby-dropdown-tr {
      width: 210px;
      border: 2px solid #e6e6e6;
      background-color: #fff;
      border-radius: 18px;
      background-position: 180px center;
      background-repeat: no-repeat;
      background-size: 12px auto;
      background-image: url(${ArrowDown});
      text-align: left;
      padding-top: 0px;
      padding-bottom: 0px;
      letter-spacing: 1.8px;
   }

   && .sortby-dropdown {
      padding-top: 0px;
      width: 210px;
      min-height: 30px;
      border: 2px solid #e6e6e6;
      background: #fff;
      border-radius: 18px;
      position: absolute;
      z-index: 200;
      top: 2px;
      box-shadow: 0 0 10px #ddd;

      & > .item:first-child {
         padding-top: 10px;
      }

      .item {
         height: 36px !important;

         img {
            width: 18px !important;
            margin: 0 10px !important;
         }
         .content {
            margin: 2px 0 0 0 !important;
         }
      }
   }

   &&& .sortby {
      padding-left: 10px;
      padding-right: 0px;
   }
`

const PaginationFilter = ({
   filterTypesByType,
   handleOnClick,
   handleDropdownClick,
   dropdown
}) => (
   <PaginationFilterList horizontal>
      <List.Item as='h6' className='sortby'>
         SORT BY
      </List.Item>
      <List.Item>
         <Button
            onClick={handleOnClick}
            // onBlur={() => this.setState({ dropdown: !this.state.dropdown })}
            className='sortby-dropdown-tr'
         >
            RECENTLY ADDED
         </Button>

         <List
            selection
            verticalAlign='middle'
            className={`sortby-dropdown ${dropdown ? '' : 'hide'}`}
         >
            {filterTypesByType.map((type, i) => (
               <List.Item
                  key={`sortby-${i}`}
                  onClick={() => handleDropdownClick(type.img)}
               >
                  <List.Content as='h6'>{type.name}</List.Content>
               </List.Item>
            ))}
         </List>
      </List.Item>
   </PaginationFilterList>
)

export default PaginationFilter
