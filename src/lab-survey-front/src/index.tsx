import 'bootstrap/dist/css/bootstrap.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './containers/App';
import DevTools from './containers/DevTools';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './store/configureStore';
import { ApplicationState } from './store/reducers';
import { initialState } from './store/survey/reducer';

const initialApplicationState: ApplicationState = { survey: initialState };

const store = configureStore(initialApplicationState);

ReactDOM.render(
  <Provider store={store}>
    <div>
      <App />
      <DevTools />
    </div>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
