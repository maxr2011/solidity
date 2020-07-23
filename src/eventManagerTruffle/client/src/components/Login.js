import React from "react";

class Login extends React.Component {
    state = { loginStatus: null, drizzleState: null, drizzle: null };

    componentDidMount() {

        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.EventManager;

        var state = drizzle.store.getState();

        if (state.drizzleStatus.initialized) {
        
            this.setState({ loading: false, drizzleState , drizzle });

            // Für das dynamische Laden des Dropdownmenues 
            contract.methods.login().call().then(loginStatus => {
              this.setState({ loginStatus });
              console.log("logged in: " + loginStatus);
            });

        }

    }

    refreshLoginState = () => {

        var drizzle = this.state.drizzle;
        var drizzleState = this.state.drizzleState;

        const contract = drizzle.contracts.EventManager;

        var state = drizzle.store.getState();

        if (state.drizzleStatus.initialized) {
        
            this.setState({ loading: false, drizzleState , drizzle });

            // Für das dynamische Laden des Dropdownmenues 
            contract.methods.login().call().then(loginStatus => {
              this.setState({ loginStatus });
              console.log("logged in: " + loginStatus);
            });

        }

    }

    getLoginState = () => {

        console.log("Logging in...");
        document.getElementById('login_status').innerHTML = '<p> Status: Wird geladen...</p>';

        var drizzle = this.state.drizzle;
        var drizzleState = this.state.drizzleState;

        const contract = drizzle.contracts.EventManager;

        var state = drizzle.store.getState();

        if (state.drizzleStatus.initialized) {
        
            this.setState({ loading: false, drizzleState , drizzle });

            // Für das dynamische Laden des Dropdownmenues 
            contract.methods.login().call().then(loginStatus => {

              this.setState({ loginStatus });
              console.log("logged in: " + loginStatus);

              if(loginStatus !== undefined && loginStatus != null) {

                var login_status_text = "Wird geladen...";
                if(loginStatus) {
                    login_status_text = "Eingeloggt";
                } else {
                    login_status_text = "Nicht Eingeloggt";
                }
    
                document.getElementById('login_status').innerHTML = '<p> Status: ' + login_status_text + '</p>';
    
              } else {
    
                document.getElementById('login_status').innerHTML = '<p> Status: Wird geladen...</p>';
    
              }

            });

        }

    }

    render() {

        return (
            <button onClick={this.getLoginState}>Login</button>
        );       

    }

}

export default Login