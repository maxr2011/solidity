import React, { Component } from 'react'

export class AddEvent extends Component {
    state = {name: '', location: '', start: '', end: ''};
    onSubmit = (event) => {
        event.preventDefault();
        const {name, location, start, end} = this.state;
        this.props.addEvent(name,location,start,end);
        this.setState({name: '', location: '', start: '', end: ''})
    }
    onChange = (event) => this.setState({ [event.target.name]: event.target.value});
    render() {
        return (
            <form onSubmit={this.onSubmit} style={{ display: 'flex'}}>
                <input type='text' name='name' onChange={this.onChange} style={{flex: '10', padding: '5px'}} placeholder='Name' required="required"/>
                <input type='text' name='location' onChange={this.onChange}  style={{flex: '10', padding: '5px'}} placeholder='Location' required="required"/>
                <input type='text' name='start' onChange={this.onChange}  style={{flex: '10', padding: '5px'}} placeholder='Start-Time' required="required"/>
                <input type='text' name='end' onChange={this.onChange}  style={{flex: '10', padding: '5px'}} placeholder='End-Time' required="required"/>
                
                <input type='submit' value="CreateEvent" className='btn' style={{flex: '1'}}/>
            </form>
        )
    }
}

export default AddEvent
