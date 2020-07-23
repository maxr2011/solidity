import React from "react";

class CreateItem extends React.Component {
    state = { loading: true, drizzleState: null, drizzle: null };

    componentDidMount(){
        const { drizzle, drizzleState } = this.props;

        var state = drizzle.store.getState();

        // If Drizzle is initialized (and therefore web3, accounts and contracts), continue.
        if (state.drizzleStatus.initialized) {
            this.setState({ loading: false, drizzleState , drizzle});
        }
    }

    createItem = () => {

            console.log("CONSOLE: Create an item");

            var drizzle = this.state.drizzle;
            var drizzleState = this.state.drizzle.drizzleState;

            var state = drizzle.store.getState();

            // If Drizzle is initialized (and therefore web3, accounts and contracts), continue.
            if (state.drizzleStatus.initialized) {
                this.setState({ loading: false, drizzleState , drizzle});
    
                console.log("DrizzleState initialized! Objects:");
                console.log(drizzle.contracts.EventManager);
                console.log(drizzle.contracts.EventManager.methods.createUserEvent); 

                var eventAddress = document.getElementById('item_create_event_address').value;
                var itemName = document.getElementById('item_create_name').value;

                console.log('Creating new Item {eventAdress: "' + eventAddress + '", itemName: "' + itemName + '"}');

                const itemAddress = drizzle.contracts.EventManager.methods.createUserEventItem(eventAddress, itemName).send();

                console.log(itemAddress);

            }

    }

    render() {
        return (
        <div id="itemCreationForm">

            <form id="item_create_form" name="item_create_form">

                <label for="item_create_event_address" id="input_label">Event Adresse:</label> <input type="text" name="item_create_event_address" id="item_create_event_address" /> <br />
                <label for="item_create_name" id="input_label">Item Name:</label> <input type="text" name="item_create_name" id="item_create_name" /> <br />
                
                <button type="button" id="create_item" onClick={this.createItem}>Item hinzufügen</button>
            
            </form>
            
        </div>
        );
    }
}

export default CreateItem;