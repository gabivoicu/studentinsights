import PropTypes from 'prop-types';
import React from 'react';
import {HelpEmail} from '../components/PublicLinks';


// Send an error notification via Rollbar, and tell the user how to reach
// out more directly.
export default class NotifyAboutError extends React.Component {
  componentDidMount() {
    const {src} = this.props;
    this.rollbarErrorFn('NotifyAboutError', {src});
  }

  rollbarErrorFn(msg, obj = {}) {
    if (this.props.rollbarErrorFn) return this.props.rollbarErrorFn(msg, obj);
    if (window.Rollbar.error) return window.Rollbar.error(msg, obj);
    console.error('NotifyAboutError#rollbarErrorFn could not find function for reporting error:', msg, obj);
  }

  render() {
    const {style} = this.props;
    return (
      <div style={style}>
        An error notification has been sent automatically, but if you need help right away please reach out to <HelpEmail style={{fontWeight: 'bold'}} />.
      </div>
    );
  }
}
NotifyAboutError.propTypes = {
  src: PropTypes.string.isRequired,
  style: PropTypes.object,
  rollbarErrorFn: PropTypes.func
};
