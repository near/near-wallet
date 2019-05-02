import React from 'react'

import { Link } from 'react-router-dom'

import { Grid, Image } from 'semantic-ui-react'

import ArrowDown from '../../images/icon-arrow-down.svg'
import ArrowRight from '../../images/icon-arrow-right.svg'

import styled from 'styled-components'

const CustomGridRow = styled(Grid.Row)`
   &&& {
      margin-left: 20px;
      border-left: 4px solid #f8f8f8;

      .col-image {
         margin-left: -33px;
         width: 40px;
         flex: 0 0 40px;
         padding-left: 0px;

         .main-image {
            border: 1px solid #e6e6e6;
            background: #fff;
            border-radius: 14px;
            padding: 5px;
            width: 26px;
            height: 26px;
            margin: 0 24px 0 18px;
            overflow: hidden;

            img {
               margin: 0 0 0 0;
            }
         }
      }

      &.wide {
         margin-left: 0px;
         border-left: 0px;

         .col-image {
            margin-left: 6px;
            width: 56px;
            flex: 0 0 56px;
         }

         .main-image {
            border: 0px;
            padding: 0 10px;
            width: 48px;
            height: 48px;
            background: #e6e6e6;
            border-radius: 32px;
            margin: 0 24px 0 0;

            img {
               padding-top: 10px;
            }
         }
      }

      .main-row-title {
         font-weight: 600;
         width: auto;
         padding-right: 0px;
         flex: 1;
      }

      .dropdown-image-right {
         width: 10px;
         margin: 0 0 0 0;
         cursor: pointer;
      }
      .dropdown-image {
         float: right;
      }

      &.dropdown-down {
         background-color: #f8f8f8;

         .dropdown-image-right {
            width: 10px;
            top: 0px;
            left: 12px;
            cursor: pointer;
         }
      }

      &.showsub {
         .dropdown-image-right {
            left: -24px;
         }
      }
      &.showsub.dropdown-down {
         .dropdown-image-right {
            left: -6px;
         }
      }

      @media screen and (max-width: 991px) {
      }

      @media screen and (max-width: 767px) {
         &.showsub {
            .dropdown-image-right {
               left: -14px;
            }
         }
         &.showsub.dropdown-down {
            .dropdown-image-right {
               left: 4px;
            }
         }
      }
   }
`

const ListItem = ({
   row,
   i,
   wide = false,
   showSub = false,
   toggleShowSub,
   showSubOpen
}) => (
   <CustomGridRow
      verticalAlign='middle'
      className={`border-bottom-light ${wide ? `wide` : ``} ${
         showSub && showSubOpen === i ? `dropdown-down` : ``
      } ${showSub ? `showsub` : ``}`}
   >
      <Grid.Column computer={8} tablet={wide ? 14 : 8} mobile={wide ? 14 : 10}>
         <Grid verticalAlign='middle'>
            <Grid.Column className='col-image'>
               <div className='main-image'>
                  <Image src={row[0]} className='' align='left' />
               </div>
            </Grid.Column>
            <Grid.Column className='main-row-title'>
               <Link to='' className='color-black'>
                  {row[1]}
               </Link>
               {row[2] && (
                  <span className='font-small'>
                     <br />
                     <Link to=''>{row[2]}</Link>
                  </span>
               )}
            </Grid.Column>
         </Grid>
      </Grid.Column>
      <Grid.Column
         computer={8}
         tablet={wide ? 2 : 8}
         mobile={wide ? 2 : 6}
         textAlign='right'
      >
         {wide ? (
            <Image
               onClick={() => toggleShowSub(i)}
               src={ArrowRight}
               className='dropdown-image dropdown-image-right'
            />
         ) : (
            <span className='font-small'>{row[3]}</span>
         )}
      </Grid.Column>
   </CustomGridRow>
)

export default ListItem
