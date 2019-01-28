import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as roseRocketAction from '../../../store/modules/roserocket'
import { RoseRocketActions } from '../../../store/actionCreatorsTruck'
import './BonusDriverForm.css'
import XYPosText from '../XYPosText/XYPosText'

class BonusDriverForm extends Component {

    onChange(location) {

        // axios call - PUT bonus driver location
        RoseRocketActions.putBonusDriverLocation( location ).then( ()=> {

            // should update the bonus driver's location by calling axios
            RoseRocketActions.getBonusDriverLocation()
        })
    }

    render() {

        return(
            <div className='bonusDriverForm'>
                <div className='formTitle'>Bonus Driver Location</div>
                { this.props.bonusDriverLocation ?
                    <XYPosText />
                    :
                    <div>Loading...</div>
                }
                <div className='changeBtn' onClick={ ()=>this.onChange(this.props.bonusDriverLocation)} >Change</div>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        running : state.roserocket.running,
        bonusDriverLocation : state.roserocket.bonusDriverLocation
    }),
    (dispatch) => ({
        RoseRocketActions: bindActionCreators( roseRocketAction, dispatch)
    })
)( BonusDriverForm );