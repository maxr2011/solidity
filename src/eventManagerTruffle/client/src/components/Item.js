import React, { Component } from 'react'
import PropTypes from 'prop-types';

export class Item extends Component {
    getStyle = () => {
        return {
            background: this.props.item.checked ? '#00ff00' : '#000000'
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
                    <button onClick={this.props.delItem.bind(this,id)} style={btnStyle}>x</button>
                </p>
            </div>
        )
    }
}

Item.propTypes = {
    item: PropTypes.object.isRequired
}

const btnStyle = {
    background: '#ff0000',
    color: 'fff',
    border: 'none',
    padding: '5px 9px',
    borderRadius: '50%',
    cursor: 'pointer',
    float: 'right'
}

export default Item
