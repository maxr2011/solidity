import React from 'react';

function doSomething() {
    console.log("do something log");
}

class EventManager extends React.Component {

    doSomething() {
        console.log("do something");
    }

    render() {
        return (
            <div id="buttonWrapper">
                <h2>EventManager Test</h2>
                <button onClick={this.doSomething}>Do Something</button>
                <br />
            </div>
        );
    }
    
}

export default EventManager