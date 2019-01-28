import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as roseRocketAction from '../../../store/modules/roserocket'
import { RoseRocketActions } from '../../../store/actionCreatorsTruck'
import './DriverForm.css'
import LegsDropDown from '../LegsDropDown/LegsDropDown'
import ProgressText from '../ProgressText/ProgressText'
import ProgressSlider from '../ProgressSlider/ProgressSlider'


class DriverForm extends Component {


    onChangeClick(newLocation) {

        // changes the deiver's location
        RoseRocketActions.putDriverLocation( newLocation ).then( ()=> {

            // should update the driver's location by calling axios
            RoseRocketActions.getDriverLocation()
        })
    }

    render() {

        const { legs, stops, driverLocation, newDriverLocation } = this.props

        return(
            <div className='driverForm'>
                <div className='formTitle'>Truck Location</div>
                    {
                        (legs&&stops&&driverLocation) ? 
                        <div>
                            <LegsDropDown />
                            {/* <ProgressText /> */}
                            <ProgressSlider />
                        </div>
                        :
                        <div>Loading...</div>
                    }
                <div className='changeBtn' onClick={() => this.onChangeClick(newDriverLocation)} >Move Truck</div>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        running : state.roserocket.running,
        legs : state.roserocket.legs,
        stops : state.roserocket.stops,
        driverLocation : state.roserocket.driverLocation,
        newDriverLocation : state.roserocket.newDriverLocation,
    }),
    (dispatch) => ({
        RoseRocketActions: bindActionCreators( roseRocketAction, dispatch)
    })
)( DriverForm );