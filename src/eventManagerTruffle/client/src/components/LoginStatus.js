import React from "react";

class LoginStatus extends React.Component {
    state = { loginStatus: null, drizzleState: null, drizzle: null };

    componentDidMount() {

        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.EventManager;

        var state = drizzle.store.getState();

        if (state.drizzleStatus.initialized) {
        
            this.setState({ loading: false, drizzleState , drizzle });

            contract.methods.login().call().then(loginStatus => {
              this.setState({ loginStatus });
              console.log("logged in: " + loginStatus);
            });

        }

    }

    render() {

        var login_status = this.state.loginStatus;

        if(login_status !== undefined && login_status != null) {

            var login_status_text = "Wird geladen...";
            if(login_status) {
                login_status_text = "Eingeloggt";
            } else {
                login_status_text = "Nicht Eingeloggt";
            }

            return (<p> Status: {login_status_text}</p>);

        } else {

            return (<p> Status: Wird geladen...</p>);

        }

    }

}

export default LoginStatus