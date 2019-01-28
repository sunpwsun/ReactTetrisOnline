import React, { Component } from 'react'
import './Timer.css'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'


class Timer extends Component {

    /******************************************************************************************* 
        Shows how long it will take the driver to complete the entire path (all of the legs). 
        Also, calculate how much time is left for the driver based on their current position 
    *******************************************************************************************/

    toHHMMSS( num ) {
        let hours   = Math.floor(num / 3600);
        let minutes = Math.floor((num - (hours * 3600)) / 60);
        let seconds = num - (hours * 3600) - (minutes * 60);
    
        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return hours+':'+minutes+':'+seconds;
    }

    timeDiff( timestamps, idxCurrentLeg) {
        const diff = new Date( timestamps[ idxCurrentLeg + 1 ] ) - new Date()
        const num = new Date( Math.floor((diff) / (1000)) )

        return this.toHHMMSS( num )
    }

    timeDiffFinal( timestamps, idxCurrentLeg) {
        const diff = new Date( timestamps[ timestamps.length - 1 ] ) - new Date()
        const num = Math.floor((diff) / (1000))

        return this.toHHMMSS( num )
    }

    render() {

        const {stops, legs, driverLocation, timestamps, completed } = this.props
        const idxCurrentLeg = legs.findIndex( leg => leg.legID === driverLocation.activeLegID )     
        const endStop = stops[ idxCurrentLeg + 1 ].name 
        const finalStop = stops[ stops.length - 1 ].name 

        return(
            <div className='timer'>
                {/* { stops && legs && driverLocation ? */}
               
                    <div>
                        <div className='timerTitle'>
                        Arriving at Stop {endStop} in
                        </div>
                        <div className='time'>
                            { !completed ?
                                <div>
                                    { timestamps ?
                                        <div>{this.timeDiff(timestamps, idxCurrentLeg)}</div>
                                            : 
                                        <div>Not Running</div>
                                    }
                                </div>
                                :
                                <div>COMPLETED!!</div>
                            }
                        </div>
                        <div className='timerTitle' style={{marginTop:'10px'}}>
                        Arriving at Final Stop {finalStop} in
                        </div>
                        <div className='time'>
                            { !completed ?
                                <div>
                                    { timestamps ?
                                        <div>{this.timeDiffFinal(timestamps, idxCurrentLeg)}</div>
                                            : 
                                        <div>Not Running</div>
                                    }
                                    </div>
                                :
                                <div>COMPLETED!!</div>
                            }
                        </div>
                    </div>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        legs : state.roserocket.legs,
        stops : state.roserocket.stops,
        driverLocation : state.roserocket.driverLocation,
        timestamps : state.roserocket.timestamps,
        completed : state.roserocket.completed
    })
)( Timer )