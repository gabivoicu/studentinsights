import React from 'react';
import PropTypes from 'prop-types';
import {isEnglishLearner, roundedWidaLevel} from '../helpers/language';
import {toMomentFromTimestamp} from '../helpers/toMoment';
import LanguageStatusLink from '../student_profile/LanguageStatusLink';
import {TwoLineChip} from './layout';
import {Concern} from './containers';
import HoverSummary, {secondLineMonthsAgo} from './HoverSummary';
import Tooltip from './Tooltip';
import Freshness from './Freshness';


export default class ChipForLanguage extends React.Component {
  render() {
    const {nowFn, districtKey} = this.context;
    const {student, access, accessKey} = this.props;
    const nowMoment = nowFn();
    const limitedEnglishProficiency = student.limited_english_proficiency;
    const languageStatusEl = (
      <LanguageStatusLink
        style={{fontSize: 12, color: 'black'}}
        studentFirstName={student.first_name}
        ellTransitionDate={student.ell_transition_date}
        limitedEnglishProficiency={limitedEnglishProficiency}
        access={access} 
      />
    );


    // TODO(kr) improve
    const dataPoint = (access || {})[accessKey];
    const mostRecentMoment = languageAssessmentMoment(dataPoint);
    
    // render as score, use fractions for composites
    const score = (!dataPoint)
      ? null 
      : roundedWidaLevel(dataPoint.performance_level, {shouldRenderFractions: true});

    // TODO(kr) improve to split oral / written
    const concernKey = isEnglishLearner(districtKey, limitedEnglishProficiency)
      ? languageConcern(score)
      : 'low';

    const daysAgo = mostRecentMoment ? nowMoment.clone().diff(mostRecentMoment, 'days') : null;
    return (
      <Freshness daysAgo={daysAgo}>
        <Concern concernKey={concernKey}>
          <Tooltip tooltipStyle={{minWidth: 400}} title={
            <HoverSummary
              atMoment={mostRecentMoment}
              concernKey={concernKey}
              score={score}
              name={`ACCESS WIDA Levels: ${accessKey}`}
            />
          }>
            <TwoLineChip
              firstLine={languageStatusEl}
              secondLine={({width}) => secondLineMonthsAgo(daysAgo, width)}
            />
          </Tooltip>
        </Concern>
      </Freshness>
    );
  }
}
ChipForLanguage.contextTypes = {
  districtKey: PropTypes.string.isRequired,
  nowFn: PropTypes.func.isRequired
};
ChipForLanguage.propTypes = {
  student: PropTypes.object.isRequired,
  access: PropTypes.object,
  accessKey: PropTypes.string.isRequired
};


function languageConcern(score) {
  if (score === null || score === undefined) return 'unknown';
  if (score >= 5) return 'low';
  if (score >= 3) return 'medium';
  return 'high';
}

function languageAssessmentMoment(dataPoint) {
  if (!dataPoint) return null;
  if (!dataPoint.date_taken) return null;
  return toMomentFromTimestamp(dataPoint.date_taken);
}