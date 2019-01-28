import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './Dashboard.css'
import Timer from '../Timer/Timer'
import TimelineDash from '../TimelineDash/TimelineDash'


class Dashboard extends Component {

    render() {

        const {stops, legs, driverLocation} = this.props
        
        return(
            <div className='dashBorad'>
                {
                    ( stops.length !== 0 && legs.length !== 0 && driverLocation ) ?
                    <div>
                        {/* <Timer /> */}
                        <TimelineDash />
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
        driverLocation : state.roserocket.driverLocation
    })
)( Dashboard )