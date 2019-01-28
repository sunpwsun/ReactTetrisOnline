import React, { Component } from 'react'
import './TimelineDash.css'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Timeline, Icon } from 'antd'


class TimelineDash extends Component {

    render() {

        const { legs, stops, driverLocation, timestamps, running, completed } = this.props

        return(
            <div>
                <div className='timelineTitle'>Tracking Path</div>
                <div className='timeline'>
                
                {  
                    (stops&& driverLocation && timestamps ) ?
                    <Timeline>
                        { timestamps.map((timestamp, i) =>  {

                            const date = new Date(timestamp).toLocaleString()
                            const idxCurrentLeg = legs.findIndex( leg => leg.legID === driverLocation.activeLegID )
                            let ret
                            if( i <= idxCurrentLeg || completed )
                                ret = <Timeline.Item className='passedText' dot={<Icon type='check-circle' theme='twoTone' twoToneColor='#52c41a' /> }><strong>[Stop {stops[i].name}] Passed at {date}</strong></Timeline.Item> 
                            else if( i > idxCurrentLeg + 1 )
                                ret = <Timeline.Item>[Stop {stops[i].name}] Estimated at {date}</Timeline.Item> 
                            else {
                                if( running )
                                    ret = <Timeline.Item style={{color:'blue'}} dot={<Icon type='sync' spin style={{ fontSize: '16px' }} />} color='red'><strong>[Stop {stops[i].name}] Arriving at {date}</strong></Timeline.Item> 
                                else
                                    ret = <Timeline.Item style={{color:'blue'}} dot={<Icon type='sync' style={{ fontSize: '16px' }} />} color='red'><strong>[Stop {stops[i].name}] Arriving at {date}</strong></Timeline.Item> 
                                
                            }

                            return ret
                        })}

                    </Timeline>
                    :
                    <div className='notRunningText'>Not Running</div>
                }
                </div>
            </div>  
        )
    }
}

export default connect(
    (state) => ({
        newDriverLocation : state.roserocket.newDriverLocation,
        legs : state.roserocket.legs,
        stops : state.roserocket.stops,
        driverLocation : state.roserocket.driverLocation,
        timestamps : state.roserocket.timestamps,
        running : state.roserocket.running,
        completed : state.roserocket.completed,
    })
)( TimelineDash )