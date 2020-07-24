import React from "react";

class EventInfo extends React.Component {
    state = { eventInfo: null, eventParticipants: null, drizzleState: null, drizzle: null };

    componentDidMount() {

        const { drizzle, drizzleState } = this.props;

        var state = drizzle.store.getState();

        if (state.drizzleStatus.initialized) {
        
            this.setState({ loading: false, drizzleState , drizzle });

        }

    }

    timestampConvert(unix_timestamp) {

        var a = new Date(unix_timestamp * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();

        if(min < 10) {
            min = '0'+min;
        }
        if(sec < 10) {
            sec = '0'+sec;
        }

        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
        return time;

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

                document.getElementById('event_info').innerHTML= "Initiator: " + eventInfo['event_initiator'] + "<br /> Name: " + eventInfo['event_name'] + "<br /> Ort: " + eventInfo['event_location'] + "<br /> Startzeit: " + this.timestampConvert(eventInfo['event_start_time']) + "<br /> Endzeit: " + this.timestampConvert(eventInfo['event_end_time']) + "<br />";
                
            });

        }

    }

    eventParticipants = () => {

        console.log('showing event participants ...'); // getEventParticipants

        var drizzle = this.state.drizzle;

        var event_info_address = document.getElementById('event_info_address').value;

        const contract = drizzle.contracts.EventManager;

        var state = drizzle.store.getState();

        if(state.drizzleStatus.initialized) {

            contract.methods.getEventParticipants(event_info_address).call().then(eventParticipants => {

                this.setState({ eventParticipants });
                console.log("event participants");
                console.log(eventParticipants);

                var event_participants_string = "";

                for(var i = 0; i < eventParticipants.length; i++) {
                    event_participants_string += eventParticipants[i] + " <br />";
                }

                if(eventParticipants.length < 1) {
                    document.getElementById('participants_info').innerHTML = "<br />Keine Teilnehmer <br />";
                } else {
                    document.getElementById('participants_info').innerHTML = "<br />Teilnehmer: " + event_participants_string + "<br />";
                }                
                
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

    eventRemove = () => {

        console.log('deleting event ...');

        var drizzle = this.state.drizzle;

        var event_remove_address = document.getElementById('event_info_address').value;

        var state = drizzle.store.getState();

        if(state.drizzleStatus.initialized) {

            const contract = this.state.drizzle.contracts.EventManager;
            contract.methods.removeEvent(event_remove_address).send();

        }

    }

    render() {

        return(
            <div id="event_info_div">
                
                <div id="event_info"></div>
                <div id="participants_info"></div>
                <form>
                    <label for="event_info_address" id="input_label">Adresse:</label> <input type="text" name="event_info_address" id="event_info_address"></input> <br />
                </form>
                <table id="event_info_buttons">
                    <tbody>
                    <tr>
                        <td valign="top"><button id="event_info_button" onClick={this.eventInfo}>Info anzeigen</button></td>
                        <td valign="top"><button id="event_info_participants_button" onClick={this.eventParticipants}>Teilnehmer anzeigen</button></td>
                        <td valign="top"><button id="event_participate_button" onClick={this.eventParticipate}>Teilnehmen</button></td>
                        <td valign="top"><button id="event_remove_button" onClick={this.eventRemove}>Event Löschen</button></td>
                    </tr>
                    </tbody>
                </table>

            </div>
        );

    }

}

export default EventInfo