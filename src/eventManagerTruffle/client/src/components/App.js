import React from 'react';

import EventManager from './EventManager.js';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  state = { loading: true, drizzleState: null };

  componentDidMount() {
    const { drizzle } = this.props;

    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {

      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();

      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    if (this.state.loading) { 
      return (
        <div className="alert alert-info" role="alert">
        <div className="App">
          <h4 className="alert-heading">Drizzle Status</h4>
          <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
      
            Status: Loading...

          </header>
        </div>
        </div>
    );
    } else {
      return (
        <div className="alert alert-info" role="alert">
        <div className="App">
          <h4 className="alert-heading">Drizzle Status</h4>
          <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        
            Status: Drizzle is ready
  
          </header>
        </div>
        <div id="eventManager">

        <EventManager drizzle={this.props.drizzle} drizzleState={this.state.drizzleState}
        />

        </div>
      </div>
      );
      
    }
  }
}



export default App;
