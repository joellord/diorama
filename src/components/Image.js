import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './Image.css';

const Image = ({
  alt, src, style, full, color, className, contain,
}) => {
  const containerClasses = classnames(
    styles.container,
    {
      [styles.full]: full,
    },
    'diorama-image-container',
  );
  const imageClasses = classnames(
    styles.image,
    {
      [styles.full]: full,
      [styles.contain]: contain,
      [className]: className !== '',
    },
    'diorama-image',
  );

  return (
    <div className={containerClasses}>
      {color && (
        <div
          className={`${styles.overlay} diorama-image-overlay`}
          style={{ backgroundColor: color }}
        />
      )}
      <img className={imageClasses} src={src} style={style} alt={alt} />
    </div>
  );
};

Image.propTypes = {
  alt: PropTypes.string.isRequired,
  color: PropTypes.string,
  className: PropTypes.string,
  contain: PropTypes.bool,
  full: PropTypes.bool,
  style: PropTypes.shape({}),
  src: PropTypes.string.isRequired,
};

Image.defaultProps = {
  color: undefined,
  className: '',
  contain: false,
  full: false,
  style: {},
};

export default Image;
