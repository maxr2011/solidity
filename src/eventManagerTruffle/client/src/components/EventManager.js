import React from 'react';

import Login from './Login';
import CreateEvent from './CreateEvent';
import ItemList from './ItemList';

import './EventManager.css';
import Register from './Register';
import LoginStatus from './LoginStatus';


class EventManager extends React.Component {
    state = { loading: true, drizzleState: null };

    state = {
        items: [
            {
                id: 1,
                creator: 0x367E7e251F63eeccD9Af88121A2C7D9F3cD5168c,
                title: 'Kuchen',
                expiration: 2595424765,
                checked: false
            },
            {
                id: 2,
                creator: 0x367E7e251F63eeccD9Af88121A2C7D9F3cD5168c,
                title: 'Bier',
                expiration: 2595424765,
                checked: true
            },
            {
                id: 3,
                creator: 0x367E7e251F63eeccD9Af88121A2C7D9F3cD5168c,
                title: 'Haggis',
                expiration: 2595424765,
                checked: false
            },
        ]
    }

    doSomething() {
        console.log("do something");
    }

    login() {
        console.log("logging in..");
    }
    
    register() {
        console.log("register new user...");
    }

    toggleItem = (id) => {
        console.log(id);
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
        if(this.state.loading) {

            return (
                <p>EventManager did not load.</p>
            );

        } else {

        return (
            <div id="eventManager">
            <div id="eventManagerSection">
                <h2>EventManager</h2>

                <div id="login_status">
                    <LoginStatus drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} />
                </div>
                
                <table>
                    <tbody>
                    <tr>
                        <td valign="top"><Login drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} /></td>
                        <td valign="top"><Register drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} /></td>
                    </tr>
                    </tbody>
                </table>

                <br />
                <h2>Erstellung eines neuen Events</h2>

                <CreateEvent drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} />

                <ItemList items={this.state.items} toggleItem={this.toggleItem} />

                <br />
            </div>
            </div>
        );

        } 

    }

}

export default EventManager