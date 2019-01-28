import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import StartBtnForm from '../StartBtnForm/StartBtnForm'
import DriverForm from '../DriverForm/DriverForm'
import BonusDriverForm from '../BonusDriverForm/BonusDriverForm'
import ModifyBtnForm from '../ModifyBtnForm/ModifyBtnForm'
import Timer from '../Timer/Timer' 
import './FormsContainer.css'

class FormsContainer extends Component {

    render() {

        const {stops, legs, driverLocation, bonusDriverLocation} = this.props

        return(
            <div className='formContainer' >
                {   
                    (stops.length !==0 && legs.length !==0 && driverLocation && bonusDriverLocation )?
                    <div>
                        <StartBtnForm />
                        <DriverForm />
                        {/* <BonusDriverForm /> */}
                        <ModifyBtnForm />
                        <Timer />
                    </div>
                    :
                    <div>Loading...</div>
                } 
            </div>
        )
    }
}

export default connect(
    (state) => ({
        legs : state.roserocket.legs,
        stops : state.roserocket.stops,
        driverLocation : state.roserocket.driverLocation,
        bonusDriverLocation : state.roserocket.bonusDriverLocation
    
    })
)( FormsContainer )