import React, {Component} from 'react'
import { Slider } from 'antd'
import 'antd/dist/antd.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as roseRocketAction from '../../../store/modules/roserocket'
import { RoseRocketActions } from '../../../store/actionCreatorsTruck'
import './ProgressSlider.css'

class ProgressSlider extends Component {

    onChange = (v) => {

        RoseRocketActions.changeDriverProgress( v )

        // changes the deiver's location
        RoseRocketActions.putDriverLocation( this.props.newDriverLocation ).then( ()=> {

            // should update the driver's location by calling axios
            RoseRocketActions.getDriverLocation()
        })
    }   

    render() {

        const { legs, driverLocation } = this.props

        const marks = {
            0 :  {
                label: <strong>0%</strong>,
            },
            100 : {
              label: <strong>100%</strong>,
            }
        }

        let defaultValue
        if( driverLocation )
            defaultValue = Math.round(driverLocation.legProgress)
        else
            defaultValue = 0

        return (
            <div className='progressSlider'>
                <div className='progressSliderText'>Progress</div>
                {/* <InputNumber
                    defaultValue={defaultValue}
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    style={{ width: '40%' }}
                    onChange={this.onChange}
                /> */}

                <Slider marks={marks} defaultValue={defaultValue} value={defaultValue} tooltipVisible={'true'} onChange={this.onChange}/>
            </div>
        )
    }
}


export default connect(
    (state) => ({
        legs : state.roserocket.legs,
        stops : state.roserocket.stops,
        driverLocation : state.roserocket.driverLocation,
        newDriverLocation : state.roserocket.newDriverLocation
    }),
    (dispatch) => ({
        RoseRocketActions: bindActionCreators( roseRocketAction, dispatch)
    })
)(ProgressSlider);

