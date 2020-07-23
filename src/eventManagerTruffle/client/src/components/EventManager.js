import React from 'react';

import LoginStatus from './LoginStatus';
import Login from './Login';
import Register from './Register';

import EventInfo from './EventInfo';
import CreateEvent from './CreateEvent';
import GetUserEvents from './GetUserEvents';
import GetParticipantEvents from './GetParticipantEvents';

import ItemInfo from './ItemInfo';
import CreateItem from './CreateItem';
//import ItemList from './ItemList';

import './EventManager.css';


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
        console.log('User wants to toggle item with id=' + id);
    }

    delItem = (id) => {
        console.log('User wants to delete item with id=' + id);
    }
    addEvent = (name, location, start, end) => {
        console.log('User wants create event: ' + name + location + start + end);
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
                <h2>Login Status</h2>

                <div id="login_status">
                    <LoginStatus drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} />
                </div>
                
                <center>
                <table>
                    <tbody>
                    <tr>
                        <td valign="top"><Login drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} /></td>
                        <td valign="top"><Register drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} /></td>
                    </tr>
                    </tbody>
                </table>
                </center>

                <br />

                <h2>Erstellung eines neuen Events</h2>

                <CreateEvent drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} />

                <br />

                <h2>Event Info</h2>

                <EventInfo drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} />

                <br />

                <h2>Meine Events</h2>

                <GetUserEvents drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} />

                <br />

                <h2>Teilnehmende Events</h2>

                <GetParticipantEvents drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} />

                <br />

                <h2>Item hinzufügen</h2>

                <CreateItem drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} />

                <br />

                <h2>Item Info</h2>

                <ItemInfo drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} />

                <br /> <br /> <br />

            </div>

            <div id="footer">

                &copy; 2020 EventManager

            </div>
            </div>
        );

        } 

    }

}

export default EventManager