import React from 'react';

import './EventManager.css';
import ItemList from './ItemList';

class EventManager extends React.Component {

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

    render() {
        return (
            <div id="eventManager">
            <div id="eventManagerSection">
                <h2>EventManager</h2>
                <table>
                    <tbody>
                    <tr>
                        <td valign="top"><button id="login_button" onClick={this.login}>Login</button></td>
                        <td valign="top"><button id="register_button" onClick={this.register}>Register</button></td>
                    </tr>
                    </tbody>
                </table>
                    <ItemList items={this.state.items}/>
                <br />
            </div>
            </div>
        );
    }

}

export default EventManager