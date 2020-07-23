import React from "react";

class GetParticipantEvents extends React.Component {
    state = { loginStatus: null, participantEvents: null, drizzleState: null, drizzle: null };

    componentDidMount() {

        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.EventManager;

        var state = drizzle.store.getState();

        if (state.drizzleStatus.initialized) {
        
            this.setState({ loading: false, drizzleState , drizzle });

            contract.methods.login().call().then(loginStatus => {
                
                if(loginStatus) {
                    contract.methods.getUserParticipantEvents().call().then(participantEvents => {
                        this.setState({ participantEvents });
                        console.log("participant events");
                        console.log(participantEvents);
                    });
                }
                this.setState({ loginStatus });
                
            });

        }

    }

    render() {

        var participant_events = this.state.participantEvents;
        var login_status = this.state.loginStatus;

        if(participant_events !== undefined && participant_events != null) {

            if(participant_events.length > 0) {

                var user_events_div;

                user_events_div = "";

                for(var i = 0; i < participant_events.length; i++) {

                    user_events_div += (i+1) + '. Event, Adresse: ';

                    var event_address = participant_events[i];
                    
                    user_events_div += event_address;

                    user_events_div += "\n";

                }

                return (<div id="participant_events"> 
                
                {user_events_div}
                
                </div>
                );

            } else {

                return (
                    <p><i>Keine Events.</i></p>
                );

            }

        } else {

            if(login_status) {
                return (
                    <p><i>Events werden geladen ...</i></p>
                );
            } else {
                return (
                    <p><i>Logge dich ein, um teilnehmende Events zu sehen.</i></p>
                );
            }

        }

    }

}

export default GetParticipantEvents