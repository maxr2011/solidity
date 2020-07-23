import React, { Component } from 'react';
import Item from './Item';
import PropTypes from 'prop-types';

class ItemList extends Component {
    render() {
        return (
            <div>
                <h1>ItemList</h1>
                {this.props.items.map((item) => (
                    <Item key={item.id} item={item} toggleItem={this.props.toggleItem}/>
                ))}
            </div>
        );
    }
}

ItemList.propTypes = {
    items: PropTypes.array.isRequired
}

export default ItemList;
