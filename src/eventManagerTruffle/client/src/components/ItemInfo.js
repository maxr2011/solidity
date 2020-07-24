import React from "react";

class ItemInfo extends React.Component {
    state = { eventInfo: null, drizzleState: null, drizzle: null };

    componentDidMount() {

        const { drizzle, drizzleState } = this.props;

        var state = drizzle.store.getState();

        if (state.drizzleStatus.initialized) {
        
            this.setState({ loading: false, drizzleState , drizzle });

        }

    }

    timestampConvert(unix_timestamp) {

        var a = new Date(unix_timestamp * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();

        if(min < 10) {
            min = '0'+min;
        }
        if(sec < 10) {
            sec = '0'+sec;
        }

        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
        return time;

    }

    itemInfo = () => {

        console.log("getting item info...");

        var drizzle = this.state.drizzle;

        var item_info_address = document.getElementById('item_info_address').value;
        var item_info_id = document.getElementById('item_info_id').value;

        const contract = drizzle.contracts.EventManager;

        var state = drizzle.store.getState();

        if(state.drizzleStatus.initialized) {

            contract.methods.getEventItemInfo(item_info_address, item_info_id).call().then(itemInfo => {

                this.setState({ itemInfo });
                console.log("item info");
                console.log(itemInfo);

                var checked = 'Nein';
                if(itemInfo['item_checked']) {
                    checked = 'Ja';
                }

                document.getElementById('item_info').innerHTML= "Name: " + itemInfo['item_name'] + "<br /> Besitzer: " + itemInfo['item_holder'] + "<br /> Bestätigt: " + checked + "<br /> Läuft ab: " + this.timestampConvert(itemInfo['item_time_expiration']) + "<br />";
                
            });

        }

    }

    itemUpdate = () => {

        console.log('checking item ...');

        var drizzle = this.state.drizzle;

        var item_info_address = document.getElementById('item_info_address').value;
        var item_info_id = document.getElementById('item_info_id').value;

        var state = drizzle.store.getState();

        if(state.drizzleStatus.initialized) {

            const contract = this.state.drizzle.contracts.EventManager;
            contract.methods.updateEventItemState(item_info_address, item_info_id).send();

            this.itemInfo();

        }

    }

    itemRemove = () => {

        console.log('checking item ...');

        var drizzle = this.state.drizzle;

        var item_info_address = document.getElementById('item_info_address').value;
        var item_info_id = document.getElementById('item_info_id').value;

        var state = drizzle.store.getState();

        if(state.drizzleStatus.initialized) {

            const contract = this.state.drizzle.contracts.EventManager;
            contract.methods.removeEventItem(item_info_address, item_info_id).send();

        }

    }

    render() {

        return(
            <div id="item_info_div">
                
                <div id="item_info"></div>
                <form>
                    <label for="item_info_address" id="input_label">Event Adresse:</label> <input type="text" name="item_info_address" id="item_info_address"></input> <br />
                    <label for="item_info_id" id="input_label">Item Id:</label> <input type="text" name="item_info_id" id="item_info_id"></input> <br />
                </form>
                <table id="item_info_buttons">
                    <tbody>
                    <tr>
                        <td valign="top"><button id="item_info_button" onClick={this.itemInfo}>Info anzeigen</button></td>
                        <td valign="top"><button id="item_update_state" onClick={this.itemUpdate}>Bestätigen</button></td>
                        <td valign="top"><button id="item_delete_button" onClick={this.itemRemove}>Item Löschen</button></td>
                    </tr>
                    </tbody>
                </table>

            </div>
        );

    }

}

export default ItemInfo