import React from 'react'
import styled from "styled-components";

let getSpacerSize = size => {
  switch (size) {
    case 'small':
      return '16px';
    case 'medium':
      return '32px';
    case 'large':
      return '56px';
    default:
      return '16px';
  }
};

const StyledBox = styled.div`
  height: ${(props) => getSpacerSize(props.size)};
  width: 100%;
`

const Spacer = (props) => (
  <StyledBox size={props.size}/>
)

export default Spacer;