import React from 'react';

import LoginStatus from './LoginStatus';

import './EventManager.css';
import ItemList from './ItemList';

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
                    <ItemList items={this.state.items} toggleItem={this.toggleItem}/>
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