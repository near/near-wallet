import PropTypes from 'prop-types';
import React from 'react';


const Image = (props)=>{
 return <img alt={props.alt} {...props}/>;
};


Image.propTypes = {
  /** Additional classes. */
  className: PropTypes.string,

  /** Image source. */
  src: PropTypes.string,
};

Image.defaultProps = {
  alt: '',
};

export default Image;
