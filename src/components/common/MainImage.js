import React from 'react'
import PropTypes from 'prop-types'

import { Image } from 'semantic-ui-react'

import styled from 'styled-components'

const CustomDiv = styled(`div`)`
   &&& {
      border: 1px solid #e6e6e6;
      background: #fff;
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      &.tiny {
         width: 26px;
         height: 26px;

         img {
            width: 20px;
         }
      }
      &.small {
         border: 0px;
         background: #e6e6e6;
         width: 32px;
         height: 32px;

         img {
            width: 22px;
         }
      }
      &.medium {
         border: 0px;
         background: #e6e6e6;
         width: 48px;
         height: 48px;

         img {
            width: 30px;
         }
      }
      &.big {
         border: 0px;
         background: #e6e6e6;
         width: 72px;
         height: 72px;

         img {
            width: 48px;
         }
      }
      &.huge {
         border: 0px;
         background: #e6e6e6;
         width: 120px;
         height: 120px;

         img {
            width: 100px;
         }
      }
   }
`

const MainImage = ({ 
   src, 
   size = 'medium' 
}) => (
   <CustomDiv className={size}>
      <Image src={src} />
   </CustomDiv>
)

MainImage.propTypes = {
   src: PropTypes.string,
   size: PropTypes.string
}

export default MainImage
