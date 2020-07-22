import React from 'react';
import ReactDOM from 'react-dom';
import { Drizzle, generateStore } from "drizzle";
import App from './components/App';
import drizzleOptions from './drizzleOptions'

const drizzleStore = generateStore(drizzleOptions);
const drizzle = new Drizzle(drizzleOptions, drizzleStore);
ReactDOM.render(<App drizzle={drizzle}/>, document.getElementById('root'));