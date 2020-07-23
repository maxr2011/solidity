import React, { Component } from 'react'
import PropTypes from 'prop-types';

export class Item extends Component {
    getStyle = () => {
        return {
            background: this.props.item.checked ? '#00ff00' : '#ff0000'
        }
    }
    render() {
        return (
            <div style={this.getStyle()}>
                <h5>{this.props.item.title}</h5>
                <p>{this.props.item.creator}</p>
                <p>{this.props.item.expiration}</p>
                <p>{this.props.item.checked}</p>
            </div>
        )
    }
}

Item.propTypes = {
    item: PropTypes.object.isRequired
}

export default Item
