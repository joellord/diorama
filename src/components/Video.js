import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './Video.css';

const Video = ({
  src, color, full, autoplay, loop, style, className,
}) => {
  const classes = classnames(
    styles.video,
    {
      [styles.full]: full,
    },
    className,
    'diorama-video-container',
  );

  return (
    <div className={classes} style={style}>
      <video src={src} autoPlay={autoplay} loop={loop} muted className="diorama-video-player" />
      {color ? (
        <div
          className={`${styles.overlay} diorama-video-overlay`}
          style={{
            backgroundColor: color,
          }}
        />
      ) : null}
    </div>
  );
};

Video.propTypes = {
  autoplay: PropTypes.bool,
  loop: PropTypes.bool,
  full: PropTypes.bool,
  color: PropTypes.string,
  style: PropTypes.shape({}),
  src: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Video.defaultProps = {
  autoplay: false,
  loop: false,
  full: false,
  color: undefined,
  style: {},
  className: '',
};

export default Video;
