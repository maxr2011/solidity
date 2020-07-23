import React, { Component } from 'react'
import PropTypes from 'prop-types';

export class Item extends Component {
    getStyle = () => {
        return {
            background: this.props.item.checked ? '#00ff00' : '#ff0000'
        }
    }
    render() {
        const {title, creator, expiration, id} = this.props.item;
        return (
            <div style={this.getStyle()}>
                <p>
                    <input type="checkbox" onChange={this.props.toggleItem.bind(this, id)}/>{' '}
                    {title + '. '}
                    {'Creator: ' + creator + '. '}
                    {'Expires: ' + expiration + '.'}
                </p>
            </div>
        )
    }
}

Item.propTypes = {
    item: PropTypes.object.isRequired
}

export default Item
