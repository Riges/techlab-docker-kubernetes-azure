import { applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware } from 'redux-observable';
import DevTools from '../containers/DevTools';
import surveyEpic from '../epics/surveyEpic';
import rootReducer, { ApplicationState } from './reducers';

const epicMiddleware = createEpicMiddleware(surveyEpic);
const enhancer = compose(applyMiddleware(epicMiddleware, createLogger()), DevTools.instrument());

const configureStore = (initialState: ApplicationState) => {
  return createStore(rootReducer, initialState, enhancer);
};

export default configureStore;
