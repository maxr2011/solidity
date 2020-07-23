import React from "react";

class CreateEvent extends React.Component {
    state = { loading: true, drizzleState: null, drizzle: null };

    componentDidMount(){
        const { drizzle, drizzleState } = this.props;
        //const drizzle = this.props.drizzle;
        //const contract = drizzle.contracts.EventManager;

        var state = drizzle.store.getState()

        // If Drizzle is initialized (and therefore web3, accounts and contracts), continue.
        if (state.drizzleStatus.initialized) {
            this.setState({ loading: false, drizzleState , drizzle});

            console.log("DrizzleState initialized! Objects:");
            console.log(drizzle.contracts.EventManager);
            console.log(drizzle.contracts.EventManager.methods.createUserEvent);

            const eventAdress = drizzle.contracts.EventManager.methods.createUserEvent("Grillen", "Randersacker", 1598191200, 1598198400).send();
            //const callback = drizzle.contracts.EventManager.methods.register().send();
        }

        // let drizzle know we want to call the `set` method with `value`

    }


    creatEvent() {
        if (this.state.loading) { 
            console.log("CONSOLE: Create an event");

            /*
            // Declare this transaction to be observed. We'll receive the eventAdress for reference.
            const eventAdress = drizzle.contracts.EventManager.methods.createUserEvent.send("test", "test", 15600000, 15700000);

            //const eventadress = contract.methods["createUserEvent"].cacheSend("test", "test", 15600000, 15700000);
            //contract.methods["createUserEvent"].cacheSend("test", "test", 15600000, 15700000);
            //contract.createUserEvent.methods.cacheSend("test", "test", 15600000, 15700000);
            //const eventadress = contract.methods.createUserEvent.send("test", "test", 15600000, 15700000);

            // Use the eventAdress to display the transaction status.
            if (state.transactionStack[eventAdress]) {
                const txHash = state.transactionStack[eventAdress]

                return state.transactions[txHash].status
            }
            */
        }
    }


    render() {
        return (
        <div>
            <button id="create_event" onClick={this.createEvent}>Create Event</button>
        </div>
        );
    }
}

export default CreateEvent;