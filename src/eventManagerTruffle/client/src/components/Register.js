import React from "react";

class Register extends React.Component {
    state = { loading: true, drizzleState: null, drizzle: null };

    componentDidMount() {
        const { drizzle, drizzleState } = this.props;

        var state = drizzle.store.getState();

        // If Drizzle is initialized (and therefore web3, accounts and contracts), continue.
        if (state.drizzleStatus.initialized) {
            this.setState({ loading: false, drizzleState , drizzle });
        }
    }

    registerUser = () => {
        console.log("CONSOLE: Registering User");

        const contract = this.state.drizzle.contracts.EventManager;
        contract.methods.register().send();
    }

    render() {
        return (
        <button type="button" id="create_event_button" onClick={this.registerUser}>Register</button>
        );
    }
}

export default Register;