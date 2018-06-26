import { combineReducers, Reducer } from 'redux';
import surveyReducer from './survey/reducer';
import { SurveyState } from './survey/types';

export interface ApplicationState {
  survey: SurveyState;
}

const reducers: Reducer<ApplicationState> = combineReducers<ApplicationState>({
  survey: surveyReducer
});

export default reducers;
