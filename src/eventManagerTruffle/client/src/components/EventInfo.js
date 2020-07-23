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
                console.log("event info");
                console.log(eventInfo);

                document.getElementById('event_info').innerHTML= "Initiator: " + eventInfo['event_initiator'] + "<br /> Name: " + eventInfo['event_name'] + "<br /> Ort: " + eventInfo['event_location'] + "<br /> Startzeit: " + eventInfo['event_start_time'] + "<br /> Endzeit: " + eventInfo['event_end_time'] + "<br />";
                
            });

        }

    }

    eventParticipate = () => {

        console.log('participating at event ...');

        var drizzle = this.state.drizzle;

        var event_participate_address = document.getElementById('event_info_address').value;

        var state = drizzle.store.getState();

        if(state.drizzleStatus.initialized) {

            const contract = this.state.drizzle.contracts.EventManager;
            contract.methods.participateEventById(event_participate_address).send();

        }

    }

    render() {

        return(
            <div id="event_info_div">
                
                <div id="event_info"></div>
                <form>
                    <label for="event_info_address" id="input_label">Adresse:</label> <input type="text" name="event_info_address" id="event_info_address"></input> <br />
                </form>
                <table id="event_info_buttons">
                    <tbody>
                    <tr>
                        <td valign="top"><button id="event_info_button" onClick={this.eventInfo}>Info anzeigen</button></td>
                        <td valign="top"><button id="event_participate_button" onClick={this.eventParticipate}>Teilnehmen</button></td>
                    </tr>
                    </tbody>
                </table>

            </div>
        );

    }

}

export default EventInfo