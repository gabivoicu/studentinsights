import _ from 'lodash';

/*
Functions for transforming the feed data structure that holds
all notes and services for a student.
*/

// Merges data from event_notes and deprecated tables (notes, interventions).
export function mergedNotes(feed) {
  const deprecatedInterventions = feed.deprecated.interventions.map(intervention => {
    return {
      ...intervention,
      type: 'deprecated_interventions',
      sort_timestamp: intervention.start_date_timestamp
    };
  });
  const eventNotes = feed.event_notes.map(eventNote => {
    return {
      ...eventNote,
      type: 'event_notes',
      sort_timestamp: eventNote.recorded_at
    };
  });

  const transitionNotes = [];

  const mergedNotes = [
    ...eventNotes,
    ...deprecatedInterventions,
    ...transitionNotes
  ];
  return _.sortBy(mergedNotes, 'sort_timestamp').reverse();
}

export function matchesMergedNoteType(mergedNote, mergedNoteType, mergedNoteTypeId) {
  if (mergedNote.type !== mergedNoteType) return false;
  switch (mergedNote.type) {
  case 'event_notes': return (mergedNote.event_note_type_id === mergedNoteTypeId);
  case 'deprecated_interventions': return (mergedNote.intervention_type_id === mergedNoteTypeId);
  }

  return false;
}
