import React, { Component } from 'react'
import './TetrisRoom.css'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as roseRocketAction from '../../../store/modules/roserocket'
import { RoseRocketActions } from '../../../store/actionCreatorsTruck'
import { subscribeToRooms, makeBattleRoom, sendIamJoining } from '../../../services/socketapi'
import Title from '../Title/Title'
import { Radio } from 'antd'

const RadioGroup = Radio.Group

class TetrisRoom extends Component {

    state = {
        gameRooms : [],
        battleName : null,
        level : 2,          // 1, 2, 3
    }

    componentDidMount() {
        subscribeToRooms( ( error, rooms ) => {
            console.log( 'rooms', rooms)
            this.setState({
                gameRooms : rooms
            })
        })
    }


    onChangeName(e) {

        // validation of nickname


        this.setState({
            battleName : e.target.value
        })
    }

    onMakeAndWait() {

        if( !this.state.battleName )
            return

        if( this.state.battleName.length < 3 )
            return


console.log( '[battlename_level]', this.state.battleName, this.state.level)
        // request for making a new battle room to server
        makeBattleRoom(this.state.battleName, this.state.level, this.props.nickname )

        RoseRocketActions.makeRoomAndWait( this.state.battleName, this.state.level )

        // I am a host
        RoseRocketActions.setIamGuest(false)

        // go /tetrisGame
        this.props.history.push('/tetrisGame')
    }



    onSelectRoom(i) {
console.log('[Gameroom selected]', i.roomID)
        sendIamJoining( i.roomID )

        // I am a guest
        RoseRocketActions.setIamGuest(true)
        // go /tetrisGame
        this.props.history.push('/tetrisGame')
    }



    onLevelChange(e) {
console.log('radio checked', e.target.value)
        this.setState({
          level: e.target.value,
        }) 
    }



    render() {

        let rooms = []

        for( let i = 0 ; i < this.state.gameRooms.length ; i++ ) {
            rooms.push(
                <div className='gameRoomName' onClick={()=>this.onSelectRoom(this.state.gameRooms[i])}>
                    {this.state.gameRooms[i].name}
                </div>
            )
        }


        return(
            <div>
                <Title />
                <div className='welcome'>
                    Welcome, {this.props.nickname}
                </div>
                <div className='gameRoomChooseForm'>
                    <div>
                        <div className='selectText'>Select Battle</div>
                        <div className='roomListbox'>
                            {rooms}
                        </div>
                        <div className='totalText'>Total {this.state.gameRooms.length} battles</div>
                    </div>
                    <div className='or'>OR</div>
                    <div>
                        <div className='selectText'>Make Battle</div>
                        <div className='battleName'>
                            <div className='battleNameText'>Battle Name</div>
                            <input className='battleNameInput' type='text' value={this.state.nickname} onChange={(e) => this.onChangeName(e)} />
                        </div>
                        <div className='battleLevel'>
                            <div className='battleNameText'>Level</div>
                            <RadioGroup onChange={(e)=>this.onLevelChange(e)} value={this.state.level} >
                                <Radio className='radioStyle' value={1}> Low</Radio>
                                <Radio className='radioStyle' value={2}> Medium</Radio>
                                <Radio className='radioStyle' value={3}> High</Radio>
                            </RadioGroup>
                        </div>
                        <div className='makeBtn' onClick={()=>this.onMakeAndWait()}>Make and Wait</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        nickname : state.roserocket.nickname,
        onBattle : state.roserocket.onBattle,
    }),
    (dispatch) => ({
        RoseRocketActions: bindActionCreators( roseRocketAction, dispatch)
    })
)( TetrisRoom );