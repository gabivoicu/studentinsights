import React from 'react';
import PropTypes from 'prop-types';


export function Website(props) {
  return <a {...props} href="https://www.studentinsights.org">www.studentinsights.org</a>;
}

export function Email(props) {
  return <a {...props} href="mailto://ideas@studentinsights.org">{props.children || 'ideas@studentinsights.org'}</a>;
}
Email.propTypes = {
  children: PropTypes.node
};