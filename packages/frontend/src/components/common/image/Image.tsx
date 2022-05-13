import PropTypes from 'prop-types';
import React from 'react';

type ImageProps ={
  className: string;
  src: string;
  alt: string;
}

const Image = (props:ImageProps)=>{
 return <img alt={props.alt} {...props}/>;
};


Image.defaultProps = {
  alt: '',
};

export default Image;
