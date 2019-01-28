import openSocket from 'socket.io-client'
const  socket = openSocket('http://18.223.15.70:3000')
//const  socket = openSocket('http://localhost:3005')

/***************************************
  socket.io for real time communication
 ***************************************/

export function subscribeToTimestampsDriverLocation( cb ) {
    socket.on('timerSendTimestamp', timestamp => cb(null, timestamp))
    socket.emit('start' )
}

export function subscribeToComplete( cb ) {
    socket.on('completed', () => cb() )
}

export function startSimulation() {
    socket.emit('start')
}

export function unsubscribe() {
    socket.emit('stop' )
}


// attacks 
export function sendPacket( packet ) {
    socket.emit('game:tetris', packet)
}


// waits for new opponent
export function waitForOpponent( cb ) {
    socket.on( 'game:tetris:startBattle', ()=> cb() )
}

// subscribes to game room list
export function subscribeToRooms( cb ) {
    socket.on('game:tetris:battleRoomList', (rooms)=> cb(null, rooms) )
}

// unsubscribes to game room list
export function unsubscribeToRooms( cb ) {
    //socket.on('game:tetris:battleRoomList', (rooms)=> cb(null, rooms) )
}


export function subscribeToBattle( cb ) {
    socket.on( 'game:tetris', (msg)=> cb( null, msg ) )
}


export function sendIamJoining( id ) {
    socket.emit( 'game:tetris:joinRoom', id )
}


export function makeBattleRoom( battleName, level, nickName ) {

    let sender = 'Guest'
    if( nickName )
        sender = nickName

    const packet = {
        sender : sender,
        receiver : '',
        type1 : 'game',
        type2 : 'tetris',
        command : 'createBattle'
    }

    let gameLevel = 'low'
    if( level === 2 ) gameLevel = 'medium'
    else if( level === 3 ) gameLevel = 'high'

    packet.battle_name = battleName
    packet.level = gameLevel
    packet.x = 20
    packet.y = 10
console.log('[packet]', packet)
    socket.emit('game:tetris:createBattle', packet)
}