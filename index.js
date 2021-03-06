'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var focusScope = require('a11y-focus-scope');
var focusStore = require('a11y-focus-store');

var applicationElement;

function setApplicationElement(element) {
  applicationElement = element;
}

function setFocusOn(element) {
  focusStore.storeFocus();
  if (applicationElement) applicationElement.setAttribute('aria-hidden', 'true');
  focusScope.scopeFocus(element);
}

function resetFocus() {
  focusScope.unscopeFocus();
  if (applicationElement) applicationElement.removeAttribute('aria-hidden');
  focusStore.restoreFocus();
}

module.exports = React.createClass({
  displayName: 'ReactModal2',

  statics: {
    setApplicationElement: setApplicationElement
  },

  propTypes: {
    onClose: React.PropTypes.func.isRequired,

    closeOnEsc: React.PropTypes.bool,
    closeOnBackdropClick: React.PropTypes.bool,

    backdropClassName: React.PropTypes.string,
    backdropStyles: React.PropTypes.object,

    modalClassName: React.PropTypes.string,
    modalStyles: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      closeOnEsc: true,
      closeOnBackdropClick: true
    };
  },

  componentDidMount: function() {
    setFocusOn(this.refs.modal);
    document.addEventListener('keydown', this.handleDocumentKeydown);
  },

  componentWillUnmount: function() {
    resetFocus();
    document.removeEventListener('keydown', this.handleDocumentKeydown);
  },

  handleDocumentKeydown: function(event) {
    if (this.props.closeOnEsc && event.keyCode === 27) {
      this.props.onClose();
    }
  },

  handleBackdropClick: function() {
    if (this.props.closeOnBackdropClick) {
      this.props.onClose();
    }
  },

  handleModalClick: function(event) {
    event.stopPropagation();
  },

  render: function() {
    return React.createElement('div', {
      ref: 'backdrop',
      className: this.props.backdropClassName,
      style: this.props.backdropStyles,
      onClick: this.handleBackdropClick
    },
      React.createElement('div', {
        ref: 'modal',
        className: this.props.modalClassName,
        style: this.props.modalStyles,
        onClick: this.handleModalClick,
        tabIndex: '-1'
      },
        this.props.children
      )
    );
  }
});
