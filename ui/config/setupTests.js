// This is a configuration file for Jest
import './sprockets-shims.js';
import '../legacy.js';

// Enzyme support
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-15.4';
Enzyme.configure({ adapter: new Adapter() });

// These are for MountTimer and measurePageLoad.
// See https://gist.github.com/ShirtlessKirk/eb41720a797411defae6
import './performance-timing-api.js';
import {performance} from 'perf_hooks';
global.performance = performance;

// https://github.com/jefflau/jest-fetch-mock
global.fetch = require('jest-fetch-mock'); // eslint-disable-line no-undef

// Make console.warn and error fail tests
console.error = jest.fn(error => { throw new Error(error); }); //eslint-disable-line no-console
console.warn = jest.fn(warn => { throw new Error(warn); }); //eslint-disable-line no-console