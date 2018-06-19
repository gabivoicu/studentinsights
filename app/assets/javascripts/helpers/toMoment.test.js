import {toMomentFromTime} from '../helpers/toMoment';
import {toMoment} from './toMoment';


it('#toMoment and then back to text', () => {
  expect(toMoment('12/19/2018').format('YYYY-MM-DD')).toEqual('2018-12-19');
  expect(toMoment('3/5/2018').format('YYYY-MM-DD')).toEqual('2018-03-05');
  expect(toMoment('1/15/18').format('YYYY-MM-DD')).toEqual('2018-01-15');
  expect(toMoment('01/5/18').format('YYYY-MM-DD')).toEqual('2018-01-05');
  expect(toMoment('01-5-18').format('YYYY-MM-DD')).toEqual('2018-01-05');
});


describe('#toMomentFromTime works as expected across timezones', () => {
  /* eslint-disable no-undef */
  describe('in NYC', () => {
    const string = '2018-05-09T12:03:26.664Z';
    const tz = process.env.TZ; 
    process.env.TZ = 'America/New_York';
    expect(toMomentFromTime(string).local().format('dddd M/D, h:mma')).toEqual('Wednesday 5/9, 7:03am');
    expect(toMomentFromTime(string).toDate().toLocaleTimeString()).toEqual('08:03:26');
    process.env.TZ = tz;
  });

  describe('in Chicago', () => {
    const string = '2018-05-09T12:03:26.664Z';
    const tz = process.env.TZ;
    process.env.TZ = 'America/Chicago';
    expect(toMomentFromTime(string).local().format('dddd M/D, h:mma')).toEqual('Wednesday 5/9, 7:03am');
    expect(toMomentFromTime(string).toDate().toLocaleTimeString()).toEqual('08:03:26');
    process.env.TZ = tz;
  });
  /* eslint-enable no-undef */
});
