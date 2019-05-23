import React from 'react'

import { Image, Button, List } from 'semantic-ui-react'

import ArrowDown from '../../images/icon-arrow-down.svg'

import styled from 'styled-components'

const PaginationFilterList = styled(List)`
   && .filter-dropdown-tr {
      width: 76px;
      height: 36px;
      border: 2px solid #e6e6e6;
      background-color: #fff;
      border-radius: 18px;
      background-position: 17px center, 44px center;
      background-repeat: no-repeat;
      background-size: 18px auto, 12px auto;
   }

   && .filter-dropdown {
      padding-top: 0px;
      width: 230px;
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

   &&& .filter-by {
      padding-left: 10px;
      padding-right: 20px;
   }
`

const PaginationFilter = ({
   filterTypesByType,
   handleOnClick,
   dropdownType,
   handleDropdownClick,
   dropdown
}) => (
   <PaginationFilterList horizontal className='border-right-light'>
      <List.Item>
         <Button
            onClick={handleOnClick}
            // onBlur={() => this.setState({ dropdown: !this.state.dropdown })}
            className='filter-dropdown-tr'
            style={{
               backgroundImage: `url(${dropdownType}), url(${ArrowDown})`
            }}
         />

         <List
            selection
            verticalAlign='middle'
            className={`filter-dropdown ${dropdown ? '' : 'hide'}`}
         >
            {filterTypesByType.map((type, i) => (
               <List.Item
                  key={`filter-${i}`}
                  onClick={() => handleDropdownClick(type.img)}
               >
                  <Image src={type.img} />
                  <List.Content as='h6'>{type.name}</List.Content>
               </List.Item>
            ))}
         </List>
      </List.Item>
      <List.Item as='h6' className='filter-by'>
         FILTER BY TYPE
      </List.Item>
   </PaginationFilterList>
)

export default PaginationFilter
