import { Store } from 'react-redux';
import { ActionsObservable } from 'redux-observable';
import { Observable } from 'rxjs';
import { ajax } from 'rxjs/observable/dom/ajax';
import { ApplicationState } from '../store/reducers';
import { StepCompleted, SurveyActionKind } from '../store/survey/types';

const surveyEpic = (action$: ActionsObservable<StepCompleted>, store: Store<ApplicationState>): Observable<StepCompleted> =>
  action$.ofType(SurveyActionKind.StepCompleted).mergeMap(action =>
    ajax
      .post(
        './api',
        { ...store.getState().survey, completedSteps: store.getState().survey.completedSteps.toObject() },
        { 'Content-Type': 'application/json' }
      )
      .map(res => Observable.empty())
      .catch((error: ErrorEvent) => {
        return Observable.throw(error.message);
      })
  );

export default surveyEpic;
