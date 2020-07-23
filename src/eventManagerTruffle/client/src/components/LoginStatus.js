import React from "react";

class LoginStatus extends React.Component {
    state = { dataKey: null };

    componentDidMount() {

        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.EventManager;

        var state = drizzle.store.getState();

        if (state.drizzleStatus.initialized) {

            const dataKey = drizzle.contracts.EventManager.methods.login.cacheCall();

            console.log(state.contracts.EventManager.login[dataKey].value);

        }

    }

    getLoginState() {

        var state = this.drizzle.store.getState();

        if (state.drizzleStatus.initialized) {

            const dataKey = this.drizzle.contracts.EventManager.methods.login.cacheCall();

            return state.contracts.EventManager.login[dataKey].value;

        }

    }

    render() {

        const ContractState = this.props.drizzleState.contracts;

        return (
            <div id="login_status">
                <p> login status:  </p>
            </div> 
        );

    }

}

export default LoginStatus