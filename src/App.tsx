import React from 'react';
import { Provider } from 'react-redux';
import Router from './components/Router';
import { store } from './app/store';

const App: React.FC = () => {
  return <>
    <Provider store={store}>
      <Router />
    </Provider>
  </>;
};

export default App;
