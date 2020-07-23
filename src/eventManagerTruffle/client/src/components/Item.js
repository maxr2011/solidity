import React, { Component } from 'react'
import PropTypes from 'prop-types';

export class Item extends Component {
    getStyle = () => {
        return {
            background: '#ffffff'//this.props.item.checked ? '#00ff00' : '#eeeeee'
        }
    }
    render() {
        const {title, creator, expiration, id} = this.props.item;
        return (
            <div style={this.getStyle()}>
                <p>
                    <input type="checkbox" onChange={this.props.toggleItem.bind(this, id)} defaultChecked={this.props.item.checked}/>{' '}
                    {title + '. '}
                    {'Creator: ' + creator + '. '}
                    {'Expires: ' + expiration + '.  '}
                    <button onClick={this.props.delItem} style={btnStyle}>x</button>
                </p>
            </div>
        )
    }
}

Item.propTypes = {
    item: PropTypes.object.isRequired
}

const btnStyle = {
    background: '#aaaaaa',
    display: 'inline-block',
    color: '#111111',
    border: 'none',
    borderRadius: '50%',
    padding: '5px 9px',
    cursor: 'pointer',
    //float: 'right'
}

export default Item
