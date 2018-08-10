import React, { Component } from 'react';
import { shallowEqualImmutable } from 'react-immutable-render-mixin';
import PropTypes from 'prop-types';

/**
 * all customized component should extends BaseComponent
 */
export default class BaseComponent extends Component {
  
  // override shouldComponentUpdate
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqualImmutable(this.props, nextProps)
      || !shallowEqualImmutable(this.state, nextState);
  }

  //bind this context
  bind(...methods) {
    methods.map(method => (this[method] = this[method].bind(this)));
  }
}
