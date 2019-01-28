import React, { Component } from 'react'
import Canvas from '../Canvas/Canvas'
import CanvasModify from '../CanvasModify/CanvasModify'
import './CanvasContainer.css'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as roseRocketAction from '../../../store/modules/roserocket'
import { RoseRocketActions } from '../../../store/actionCreatorsTruck'
import { Switch } from 'antd'


class CanvasContainer extends Component {


    onChangeName(checked) {
        console.log(`name switch to ${checked}`)
        RoseRocketActions.toggleShowName()
    }

    onChangeZoom(checked) {
        console.log(`zoom switch to ${checked}`)
        RoseRocketActions.toggleZoomIn()
    }

    onChangeBonus(checked) {
        console.log(`bonus switch to ${checked}`)
        RoseRocketActions.toggleShowBonusDriver()
    }

    render() {


        const { legs, stops, driverLocation, newDriverLocation, showStopNames, modifyingStops } = this.props

        return(
                <div className='canvasContainer'>
                <div className='toggleBtn'>
                    <Switch checked={showStopNames} onChange={this.onChangeName} /> Show Stop Names 
                    {/* <Switch checked={zoomIn} onChange={this.onChangeZoom} style={{marginLeft:'30px'}} /> Zoom In */}
                    {/* <Switch checked={showBonusDriver} onChange={this.onChangeBonus} style={{marginLeft:'30px'}} /> Show Bonus Driver */}
                </div>
                    {
                        modifyingStops ?
                        <CanvasModify className='mapCanvas' />
                        :

                        ( legs.length !== 0 && stops.length!==0 && driverLocation && newDriverLocation) ?     
                            <Canvas className='mapCanvas' />
                        :
                        <div>Loading...</div>
                    }
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
        zoomIn : state.roserocket.zoomIn,
        showStopNames : state.roserocket.showStopNames,
        showBonusDriver : state.roserocket.showBonusDriver,
        modifyingStops : state.roserocket.modifyingStops,
    }),
    (dispatch) => ({
        RoseRocketActions: bindActionCreators( roseRocketAction, dispatch)
    })
)( CanvasContainer );