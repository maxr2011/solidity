import React from "react";

class CreateEvent extends React.Component {
    state = { loading: true, drizzleState: null, drizzle: null };

    componentDidMount(){
        const { drizzle, drizzleState } = this.props;

        var state = drizzle.store.getState();

        // If Drizzle is initialized (and therefore web3, accounts and contracts), continue.
        if (state.drizzleStatus.initialized) {
            this.setState({ loading: false, drizzleState , drizzle});
        }
    }

    createEvent = () => {

            console.log("CONSOLE: Create an event");

            var drizzle = this.state.drizzle;
            var drizzleState = this.state.drizzle.drizzleState;

            var state = drizzle.store.getState();

            // If Drizzle is initialized (and therefore web3, accounts and contracts), continue.
            if (state.drizzleStatus.initialized) {
                this.setState({ loading: false, drizzleState , drizzle});
    
                console.log("DrizzleState initialized! Objects:");
                console.log(drizzle.contracts.EventManager);
                console.log(drizzle.contracts.EventManager.methods.createUserEvent); 

                var eventName = document.getElementById('event_create_name').value;
                var eventLocation = document.getElementById('event_create_location').value;
                var eventStartDate = document.getElementById('event_create_start_date').value;
                var eventEndDate = document.getElementById('event_create_end_date').value;
    
                console.log('Creating new Event {name: "' + eventName + '", location: "' + eventLocation + '", start_date: "' + eventStartDate + '", end_date: "' + eventEndDate + '"}');

                const eventAdress = drizzle.contracts.EventManager.methods.createUserEvent(eventName, eventLocation, eventStartDate, eventEndDate).send();

                console.log("new event adress: " + eventAdress);

            }
            
    }

    render() {
        return (
        <div id="eventCreationForm">

            <form id="event_create_form" name="event_create_form">

                <label for="event_create_name" id="input_label">Name:</label> <input type="text" name="event_create_name" id="event_create_name" /> <br />
                <label for="event_create_location" id="input_label">Ort:</label> <input type="text" name="event_create_location" id="event_create_location" /> <br />
                <label for="event_create_start_date" id="input_label">Startdatum:</label> <input type="text" name="event_create_start_date" id="event_create_start_date" /> <br />
                <label for="event_create_end_date" id="input_label">Enddatum:</label> <input type="text" name="event_create_end_date" id="event_create_end_date" /> <br />

                <button type="button" id="create_event" onClick={this.createEvent}>Event erstellen</button>
            
            </form>
            
        </div>
        );
    }
}

export default CreateEvent;