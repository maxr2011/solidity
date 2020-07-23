import React from 'react';

import LoginStatus from './LoginStatus';

import './EventManager.css';

class EventManager extends React.Component {
    state = { loading: true, drizzleState: null };

    doSomething() {
        console.log("do something");
    }

    login() {
        console.log("logging in..");
    }
    
    register() {
        console.log("register new user...");
    }

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

    render() {
        if(this.state.loading == false) {

        return (
            <div id="eventManager">
            <div id="eventManagerSection">
                <h2>EventManager</h2>

                <LoginStatus drizzle={this.props.drizzle} drizzleState={this.state.drizzleState}
                />

                
                <table>
                    <tbody>
                    <tr>
                        <td valign="top"><button id="login_button" onClick={this.login}>Login</button></td>
                        <td valign="top"><button id="register_button" onClick={this.register}>Register</button></td>
                    </tr>
                    </tbody>
                </table>
                
                <br />
            </div>
            </div>
        );

        } else {

        return (
            <p>EventManager did not load.</p>
        );

        }
    }

}

export default EventManager