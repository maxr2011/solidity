import React from "react";

class EventInfo extends React.Component {
    state = { eventInfo: null, drizzleState: null, drizzle: null };

    componentDidMount() {

        const { drizzle, drizzleState } = this.props;

        var state = drizzle.store.getState();

        if (state.drizzleStatus.initialized) {
        
            this.setState({ loading: false, drizzleState , drizzle });

        }

    }

    eventInfo = () => {

        console.log("getting event info...");

        var drizzle = this.state.drizzle;

        var event_info_address = document.getElementById('event_info_address').value;

        const contract = drizzle.contracts.EventManager;

        var state = drizzle.store.getState();

        if(state.drizzleStatus.initialized) {

            contract.methods.getEventInfo(event_info_address).call().then(eventInfo => {
                this.setState({ eventInfo });
                console.log("user events");
                console.log(eventInfo);

                document.getElementById('event_info').innerHTML= "Initiator: " + eventInfo['event_initiator'] + "<br /> Name: " + eventInfo['event_name'] + "<br /> Ort: " + eventInfo['event_location'] + "<br /> Startzeit: " + eventInfo['event_start_time'] + "<br /> Endzeit: " + eventInfo['event_end_time'] + "<br />";
                
            });

        }

    }

    render() {

        return(
            <div id="event_info_div">
                <div id="event_info"></div>
                <form>
                    <input type="text" name="event_info_address" id="event_info_address"></input> <br />
                </form>
                <button onClick={this.eventInfo}>Info anzeigen</button>
            </div>
        );

        /*
        var user_events = this.state.userEvents;

        if(user_events !== undefined && user_events != null) {

            if(user_events.length > 0) {

                var user_events_div;

                user_events_div = "";

                for(var i = 0; i < user_events.length; i++) {

                    user_events_div += (i+1) + '. Event, Adresse: ';
                    user_events_div += user_events[i];
                    user_events_div += "\n";

                }

                return (<div id="user_events"> 
                
                {user_events_div}
                
                </div>
                );

            } else {

                return (
                    <p><i>Keine Events.</i></p>
                );

            }

        } else {

            return (
                <p><i>Events werden geladen ...</i></p>
            );

        }
        */

    }

}

export default EventInfo