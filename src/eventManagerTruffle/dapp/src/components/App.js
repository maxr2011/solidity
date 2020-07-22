import React from 'react'

class App extends React.Component {

    state = {
        loading: true,
        drizzleState: null 
    };

    componentDidMount = () => {
        const {drizzle} = this.probs;

        this.unsubscribe = drizzle.store.subscribe(()  => {
            const drizzleState = drizzle.store.getState();

            if(drizzleState.drizzleStatus.initialized) {

                this.setState({
                    loading: false,
                    drizzleState
                });

            }
        })
    }

    componentWillUnmount = () => {
        this.unsubscribe();
    }

    render = () => {
        if(this.state.loading) {
            return (
                <div className="alert alert-info" role="alert">
                    <h4 className="alert-heading">Drizzle Status</h4>
                    <p>Loading...</p>
                </div>
            );
        } else {
            return (
                <YourComponent drizzle={this.props.drizzle} drizzleState={this.state.drizzleState}
                />
            );
        }
    }

}