import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as roseRocketAction from '../../../store/modules/roserocket'
import { RoseRocketActions } from '../../../store/actionCreatorsTruck'
import './StartBtnForm.css'
import { subscribeToTimestampsDriverLocation, subscribeToComplete, unsubscribe } from '../../../services/socketapi'


class StartBtnForm extends Component {

    handleStartBtn( running ) {

        // starts simulation
        if( !running ) {
            subscribeToTimestampsDriverLocation( (err, timestampsDriverlocation ) => {
            console.log('[TIMESTAMP] ', timestampsDriverlocation)
                RoseRocketActions.updateTimestampsDriverLocation( timestampsDriverlocation )
            })

            // Server sends the COMPLETED if the driver arrives at the final
            subscribeToComplete( ()=> {
                console.log('[COMPOLETED!!!]')    
                RoseRocketActions.simulationCompleted()
            })

        }
        // stops simulation
        else {
            console.log('[!!!!STOP!!!!]')           
            unsubscribe()
            RoseRocketActions.updateAppStopped()
        }

    }

    render() {

        const {running} = this.props
        return(
            <div className='startBtnForm'>
                <div onClick={()=>this.handleStartBtn(running)}>
                    {
                        running  ?

                        <div className='stopBtn'>STOP</div> 
                        : 
                        <div className='startBtn' >START</div> 
                    
                    }
                </div>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        running : state.roserocket.running,
    }),
    (dispatch) => ({
        RoseRocketActions: bindActionCreators( roseRocketAction, dispatch)
    })
)( StartBtnForm );