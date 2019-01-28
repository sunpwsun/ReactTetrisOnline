import React, { Component } from 'react'
import './TetrisLogin.css'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as roseRocketAction from '../../../store/modules/roserocket'
import { RoseRocketActions } from '../../../store/actionCreatorsTruck'
import Title from '../Title/Title'

class TetrisLogin extends Component {

    state = {
        nickname : null
    }

    onChange(e) {

        // validation of nickname


        this.setState({
            nickname : e.target.value
        })
    }

    onGo() {
        const { nickname } = this.state
console.log( '[nickname]', this.state.nickname)
        if( !nickname )
            return

        if( nickname.length < 3 )
            return

        RoseRocketActions.setNickname( this.state.nickname )
        this.props.history.push('/tetrisRoom')
    }


    render() {

        return(
            <div>
                <Title />
                <div className='tetrisLoginForm'>
                    <div className='tetrisLoginFormTitle'>Tetris Battle</div>
                    <hr />
                    <div className='nickNameText'>
                        Nickname 
                        <input className='nickNameInput' type='text' value={this.state.nickname}
                             onChange={(e) => this.onChange(e)} /></div>
                    <div className='goBtn' onClick={()=>this.onGo()}>Go</div>
                </div>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        nickname : state.roserocket.nickname,
    }),
    (dispatch) => ({
        RoseRocketActions: bindActionCreators( roseRocketAction, dispatch)
    })
)( TetrisLogin );