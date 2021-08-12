import React from 'react';
import { styled } from '../../stitches.config';

const StyledButton = styled('button', {
  color: '$red500',
  fontSize: '14px',

  '&:hover': {
    color: 'black',
    fontSize: '14px',
  },
});

// const StyledButton = styled.button`
//   border-radius: 40px;
//   padding: 5px 32px;
//   outline: none;
//   font-size: 15px;
//   height: 56px;
//   font-weight: 600;
//   width: ${(props) => (props.fullWidth === true ? '100%' : 'auto')};
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   transition: all 150ms ease;
//   background-color: ${(props) =>
//     props.theme === 'secondary' ? '#ffffff' : '#0072CE'};
//   border: 2px solid
//     ${(props) => (props.theme === 'secondary' ? '#cccccc' : '#0072CE')};
//   color: ${(props) => (props.theme === 'secondary' ? '#888888' : 'white')};

//   @media (min-width: 768px) {
//     &:enabled {
//       &:hover {
//         background-color: ${(props) =>
//           props.theme === 'secondary' ? '#cccccc' : '#007fe6'};
//         color: white;
//       }
//     }
//   }

//   &:disabled {
//     opacity: 0.3;
//     cursor: not-allowed;
//   }
// `;

const Button = (props) => (
  <StyledButton
    {...props}
    onClick={props.onClick}
    title={props.title}
    fullWidth={props.fullWidth}
  >
    {props.children}
  </StyledButton>
);

// Button.propTypes = {
//   disabled: PropTypes.bool,
//   theme: PropTypes.oneOf(['primary', 'secondary']),
//   fullWidth: PropTypes.bool,
// };

Button.defaultProps = {
  fullWidth: true,
};

export default Button;
