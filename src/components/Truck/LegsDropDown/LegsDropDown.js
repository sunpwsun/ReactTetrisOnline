import React, {Component} from 'react'
import { Cascader } from 'antd'
import 'antd/dist/antd.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as roseRocketAction from '../../../store/modules/roserocket'
import { RoseRocketActions } from '../../../store/actionCreatorsTruck'
import './LegsDropDown.css'

class LegsDropDown extends Component {

    onChangeLeg = (e) => {
           
        RoseRocketActions.changeDriverLeg( e[0] )

        // changes the deiver's location
        RoseRocketActions.putDriverLocation( this.props.driverLocation ).then( ()=> {

            // should update the driver's location by calling axios
            RoseRocketActions.getDriverLocation()
        })
    }   

    render() {

        const { legs, driverLocation } = this.props

        let defaultVal = []
        if( driverLocation ) {
            defaultVal.push( driverLocation.activeLegID )
        }

        const legsOpt = []
        if( legs ) {
            legs.forEach( leg => {
                
                legsOpt.push(
                    {
                        value : leg.legID,
                        label : leg.legID
                    }
                )
            })
        }

        console.log( 'legsOpt - ', legsOpt)
        console.log( 'defaultVal - ', defaultVal)

        const placeholder = defaultVal.length > 0 ? defaultVal[0] : null

        return (
            <div className='legDropDown'>
                <strong>LegID</strong> &nbsp;
                <Cascader 
                
                    options={legsOpt} 
                    allowClear={false}
                    defaultValue={defaultVal}
                    value={defaultVal}
                    onChange={this.onChangeLeg} 
                    // placeholder={placeholder }
                    style={{ width: '40%', textAlign : 'left' }}
                    popupPlacement={'bottomRight'}
                />
            </div>
        )
    }
}


export default connect(
    (state) => ({
        legs : state.roserocket.legs,
        stops : state.roserocket.stops,
        driverLocation : state.roserocket.driverLocation
    }),
    (dispatch) => ({
        RoseRocketActions: bindActionCreators( roseRocketAction, dispatch)
    })
)(LegsDropDown);

