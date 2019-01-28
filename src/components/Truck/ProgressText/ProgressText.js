import React, {Component} from 'react'
import { InputNumber } from 'antd'
import 'antd/dist/antd.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as roseRocketAction from '../../../store/modules/roserocket'
import { RoseRocketActions } from '../../../store/actionCreatorsTruck'
import './ProgressText.css'

class ProgressText extends Component {

    /***************************
        Not used.
        Replaced with slider
    ***************************/

    onChange = (v) => {
        RoseRocketActions.changeDriverProgress( v )
    }   

    render() {

        const { legs, driverLocation } = this.props

        let defaultValue
        if( driverLocation )
            defaultValue = driverLocation.legProgress
        else
            defaultValue = 0

        return (
            <div className='inputNumber'>
            Progress &nbsp;
                <InputNumber
                    defaultValue={defaultValue}
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    style={{ width: '40%' }}
                    onChange={this.onChange}
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
)(ProgressText);

