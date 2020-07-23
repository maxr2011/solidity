import React from 'react';

import './EventManager.css';

class EventManager extends React.Component {

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
                
                <br />
            </div>
            </div>
        );
    }

}

export default EventManager