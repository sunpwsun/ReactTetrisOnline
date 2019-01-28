import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as roseRocketAction from '../../../store/modules/roserocket'
import { RoseRocketActions } from '../../../store/actionCreatorsTruck'
import './ModifyBtnForm.css'


class ModifyBtnForm extends Component {

    handleModigyStopsBtn( ) {
 console.log('Modify Sopts')       
        RoseRocketActions.startModifyStops()
    }

    render() {

        return(
            <div className='modifyBtnForm'>
                <div className='modifyBtn' onClick={this.handleModigyStopsBtn}>
                    Modify Stops Information
                </div>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        running : state.roserocket.running,
        modifyingStops : state.roserocket.modifyingStops,
    }),
    (dispatch) => ({
        RoseRocketActions: bindActionCreators( roseRocketAction, dispatch)
    })
)( ModifyBtnForm );