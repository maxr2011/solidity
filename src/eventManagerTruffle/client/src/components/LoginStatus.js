import React from "react";

class LoginStatus extends React.Component {
    state = { loginStatus: null };

    componentDidMount() {

        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.EventManager;

        var state = drizzle.store.getState();

        if (state.drizzleStatus.initialized) {
        
            // Für das dynamische Laden des Dropdownmenues 
            contract.methods.login().call().then(loginStatus => {
              this.setState({ loginStatus });
              console.log("logged in: " + loginStatus);
            });

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

        var login_status = this.state.loginStatus;
        console.log(login_status);

        if(login_status !== undefined && login_status != null) {

            var login_status_text;
            if(login_status) {
                login_status_text = "Eingeloggt";
            } else {
                login_status_text = "Nicht Eingeloggt";
            }

            return (
                <div id="login_status">
                    <p> Status: {login_status_text}</p>
                </div> 
            );

        } else {

            return (
                <div id="login_status">
                    <p> login status: loading</p>
                </div> 
            );

        }

    }

}

export default LoginStatus