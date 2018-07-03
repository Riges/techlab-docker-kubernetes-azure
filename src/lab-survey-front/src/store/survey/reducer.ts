import { Map } from 'immutable';
import { DateTime } from 'luxon';
import * as uuidv4 from 'uuid/v4';
import { SurveyAction, SurveyActionKind, SurveyState } from './types';

export const initialState: SurveyState = {
  completedSteps: Map<number, DateTime>(),
  id: uuidv4()
};

const reducer = (state: SurveyState = initialState, action: SurveyAction) => {
  switch (action.type) {
    case SurveyActionKind.StepCompleted:
      return { ...state, completedSteps: state.completedSteps.set(action.step, DateTime.local()) };
    case SurveyActionKind.StepCanceled:
      return { ...state, completedSteps: state.completedSteps.delete(action.step) };
    default:
      return state;
  }
};

export default reducer;
