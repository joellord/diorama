import React, { Component, cloneElement, createRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Swipe from 'react-easy-swipe';
import Keyboard from '../services/Keyboard';
import Navigation from './Navigation';
import PresenterNotes from './PresenterNotes';

import styles from './Deck.css';
import '../styles/styles.css';

export default class Deck extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    footer: PropTypes.node,
    navigation: PropTypes.bool,
    swipeToChange: PropTypes.bool,
    presenterNotes: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    footer: undefined,
    navigation: false,
    swipeToChange: true,
    presenterNotes: false,
  };

  state = {
    slide: Number(window.location.pathname.split('/')[1]) || 0,
  };

  presenterElementRef = createRef();

  constructor(props) {
    super(props);

    this.getPreviousSlide = ::this.getPreviousSlide;
    this.getNextSlide = ::this.getNextSlide;
    this.getSlide = ::this.getSlide;
    this.openPresenterNotes = ::this.openPresenterNotes;
  }

  componentWillMount() {
    this.KeyboardLeftListener = Keyboard.on('left', this.getPreviousSlide);
    this.KeyboardRightListener = Keyboard.on('right', this.getNextSlide);
    this.KeyboardUpListener = Keyboard.on('page up', this.getPreviousSlide);
    this.KeyboardDownListener = Keyboard.on('page down', this.getNextSlide);
  }

  componentDidMount() {
    const { presenterNotes } = this.props;

    if (presenterNotes) {
      this.openPresenterNotes();
    }
  }

  componentWillUnmount() {
    Keyboard.off(this.KeyboardLeftListener);
    Keyboard.off(this.KeyboardRightListener);
    Keyboard.off(this.KeyboardUpListener);
    Keyboard.off(this.KeyboardDownListener);
    Keyboard.off(this.KeyboardOpenPresenterListener);
  }

  getPreviousSlide() {
    const { slide } = this.state;
    const { children } = this.props;

    if (slide === 0) {
      return;
    }

    this.setState(state => ({ ...state, slide: slide - 1 }));

    window.history.pushState(undefined, undefined, slide - 1);
    this.updatePresenterNotes(children[slide - 1], children[slide]);
  }

  getNextSlide() {
    const { slide } = this.state;
    const { children } = this.props;

    if (slide === children.length - 1) {
      return;
    }

    this.setState(state => ({ ...state, slide: slide + 1 }));
    window.history.pushState(undefined, undefined, slide + 1);
  }

  getSlide(slideId) {
    this.setState(state => ({ ...state, slide: slideId }));
    window.history.pushState(undefined, undefined, slideId);
  }

  renderSlide = () => {
    const { slide } = this.state;
    const { children } = this.props;

    this.updatePresenterNotes(children[slide + 1], children[slide + 2]);

    return cloneElement(children[slide], {
      index: slide,
      navigate: this.getSlide,
    });
  };

  openPresenterNotes() {
    const { slide } = this.state;
    const { children } = this.props;

    this.presenterWindow = window.open(
      '',
      'Presenter notes',
      'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,width=1000,height=600',
    );

    if (!this.presenterWindow || this.presenterWindow.closed) {
      /* eslint-disable no-alert */
      window.alert('Please allow popups to open the presenter window.');
      /* eslint-enable no-alert */
    } else {
      this.renderPresenterNotes(children[slide], slide, children[slide + 1], children.length);
    }
  }

  updatePresenterNotes() {
    const { slide } = this.state;
    const { children } = this.props;

    if (this.presenterElementRef && this.presenterElementRef.current) {
      this.presenterElementRef.current.setState(state => ({
        ...state,
        slide: children[slide],
        current: slide + 1,
        notes: children[slide].props.notes,
        next: children[slide + 1],
      }));
    }

    if (this.presenterWindow) {
      this.presenterWindow.document.title = `[ Presenter notes - slide ${slide + 1}/${
        children.length
      } ] - ${document.title}`;
    }
  }

  renderPresenterNotes(currentSlide, currentSlideIndex, nextSlide, totalSlides) {
    if (this.presenterWindow) {
      const presenterNotesContainer = this.presenterWindow.document.createElement('div');
      const mainStyles = document.querySelectorAll('link[type="text/css"], style');

      ReactDOM.render(
        <PresenterNotes
          slide={currentSlide}
          next={nextSlide}
          notes={currentSlide.props.notes}
          current={currentSlideIndex + 1}
          total={totalSlides}
          ref={this.presenterElementRef}
          parentStyles={mainStyles}
          origin={`${window.location.protocol}//${window.location.hostname}${
            window.location.port ? `:${window.location.port}` : ''
          }`}
        />,
        presenterNotesContainer,
      );

      this.presenterWindow.document.title = `[ Presenter notes - slide ${currentSlideIndex
        + 1}/${totalSlides} ] - ${document.title}`;

      [].forEach.call(mainStyles, (style) => {
        this.presenterWindow.document.head.innerHTML += style.outerHTML;
      });

      this.presenterWindow.document.body.append(presenterNotesContainer);
    }
  }

  renderSlide() {
    const { slide } = this.state;
    const { children } = this.props;

    return cloneElement(children[slide], {
      index: slide,
      navigate: this.getSlide,
    });
  }

  render() {
    const {
      className, footer, navigation, swipeToChange,
    } = this.props;

    return (
      <Swipe
        className={`diorama-swipe-container ${styles.swipe}`}
        onSwipeLeft={swipeToChange ? this.getNextSlide : undefined}
        onSwipeRight={swipeToChange ? this.getPreviousSlide : undefined}
        allowMouseEvents
      >
        <div className={`diorama diorama-deck ${styles.deck} ${className}`}>
          {footer && footer}
          {navigation && (
            <Navigation onPreviousSlide={this.getPreviousSlide} onNextSlide={this.getNextSlide} />
          )}
          {this.renderSlide()}
        </div>
      </Swipe>
    );
  }
}
