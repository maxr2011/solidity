import Set from './contracts/Set.json'
import EventSet from './contracts/EventSet.json'
import Event from './contracts/Event.json'
import EventManager from './contracts/EventManager.json'

const drizzleOptions = {

    web3: {
        block: false,
        fallback: {
            type: 'ws',
            url: 'ws://127.0.0.1:7545'
        }
    },
    contracts: [
        Set,
        EventSet,
        Event,
        EventManager
    ],
    polls: {
        accounts: 1500
    }

}

export default drizzleOptions 