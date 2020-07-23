import React from "react";

class GetUserEvents extends React.Component {
    state = { userEvents: null, drizzleState: null, drizzle: null };

    componentDidMount() {

        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.EventManager;

        var state = drizzle.store.getState();

        if (state.drizzleStatus.initialized) {
        
            this.setState({ loading: false, drizzleState , drizzle });

            contract.methods.getUserEvents().call().then(userEvents => {
              this.setState({ userEvents });
              console.log("user events");
              console.log(userEvents);
            });

        }

    }

    render() {

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

    }

}

export default GetUserEvents