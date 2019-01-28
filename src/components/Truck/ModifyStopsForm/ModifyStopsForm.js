import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as roseRocketAction from '../../../store/modules/roserocket'
import { RoseRocketActions } from '../../../store/actionCreatorsTruck'
import './ModifyStopsForm.css'
import { InputNumber } from 'antd'


class ModifyStopsForm extends Component {

    state = {
        x : 50,
        y : 50,
        speed : 100
    }

    onSave() {
        RoseRocketActions.changeXYSave()
    }

    onCancel() {
        RoseRocketActions.changeXYCancel()
    }

    onChangeX = (i, v) => {
        
        let newValue = v.target.value
        if( newValue < 0 )
            newValue = 0
        if( newValue > 199 )
            newValue = 199
console.log(i, newValue)

        RoseRocketActions.changeTmpX( i, newValue )
    }

    onChangeY = (i, v) => {
        let newValue = v.target.value
        if( newValue < 0 )
            newValue = 0
        if( newValue > 199 )
            newValue = 199
console.log(i, newValue)

        RoseRocketActions.changeTmpY( i, newValue )
    }

    onChangeSpeed = (i, v) => {
        let newValue = v.target.value
        if( newValue < 1 )
            newValue = 1
        if( newValue > 1999 )
            newValue = 1999
console.log(i, newValue)
        RoseRocketActions.changeTmpSpeed(i, newValue)
    }

    onAddX = (i, v) => {
        let newValue = v.target.value

        if( newValue < 0 )
            newValue = 0

        if( newValue > 199 )
            newValue = 199

        this.setState({
            ...this.state,
            x : newValue
        })

        RoseRocketActions.setDuplicatedXY(false)
    }
        
    onAddY = (i, v) => {
        let newValue = v.target.value

        if( newValue < 0 )
            newValue = 0

        if( newValue > 199 )
            newValue = 199

        this.setState({
            ...this.state,
            y : newValue
        })

        RoseRocketActions.setDuplicatedXY(false)
    }

    onAddSpeed = (i, v) => {
        let newValue = v.target.value
        if( newValue < 0 )
            newValue = 0
        if( newValue > 1999 )
            newValue = 1999
        this.setState({
            ...this.state,
            speed : newValue
        })
    }

    onRemove = (index) => {
        console.log(index)


        const n = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        let newTmpStops = this.props.tmpStops
     
        newTmpStops.splice( index, 1 )   // remove
 console.log( '[stops]', this.props.stops[2], this.props.stops[3], this.props.stops[4])   
 console.log( 'stops length', this.props.stops.length)
        newTmpStops[ 0 ].name = 'A'
        for( let i = 1 ; i < newTmpStops.length ; i++ ) {
            newTmpStops[ i ].name = '' + n.charAt( i ) 
            console.log('newTmpStops[ i ].name', newTmpStops[ i ].name)
        }
 console.log( '[stops]', this.props.stops[2], this.props.stops[3], this.props.stops[4]) 
 console.log( 'stops length', this.props.stops.length)
        let newTmpLegs = []
         
        for( let i = 0 ; i < index - 1 ; i++ ) {
       
            newTmpLegs.push( this.props.tmpLegs[ i ] )
        }
     
        for( let i = index ; i < newTmpStops.length ; i++) {
    
            const tmpLeg = {}
            tmpLeg.startStop = newTmpStops[ i - 1 ].name
            tmpLeg.endStop = newTmpStops[ i ].name
            tmpLeg.speedLimit = this.props.tmpLegs[ i ].speedLimit
            tmpLeg.legID = tmpLeg.startStop + tmpLeg.startStop
            newTmpLegs.push( tmpLeg )
        }
    


        RoseRocketActions.removeTmpStopsAndLegs(index, newTmpStops, newTmpLegs)
    }

    onAdd = (i) => {
        console.log( this.state.x, this.state.y, this.state.speed)

        for( let i = 1 ; i < this.props.tmpStops.length ; i++ ) {
            if( this.props.tmpStops[ i ].x === this.state.x && this.props.tmpStops[ i ].y === this.state.y ) {

                RoseRocketActions.setDuplicatedXY(true)
                return
            }
        }



        RoseRocketActions.addTmpStopsAndLegs( this.state.x, this.state.y, this.state.speed )

        this.setState({
            x : 50,
            y : 50,
            speed : 100
        })
    }

    render() {

        const { tmpStops, tmpLegs } = this.props

        let newStops = []
        for( let i = 0 ; i < tmpStops.length ; i++ ) {
            newStops.push(
                <div className='stopInputLayout bottomLine'>
                    <div>{tmpStops[i].name}</div>
                    <input className='changeXYInput' type="number" min={0} max={199} value={tmpStops[i].x} onChange={ (value) => { this.onChangeX( i, value ) } } />
                    {/* <InputNumber className='changeXYInput' min={0} max={199} defaultValue={tmpStops[i].y} onChange={ (value) => { this.onChangeY( i, value ) } } /> */}
                    <input className='changeXYInput' type="number"  min={0} max={199} value={tmpStops[i].y} onChange={ (value) => { this.onChangeY( i, value ) } } />
                    <div>{
                        i > 0 ?
                            <input className='changeSpeedInput' type="number" min={1} max={1999} value={tmpLegs[ i - 1 ].speedLimit} onChange={ (value) => { this.onChangeSpeed( i-1, value ) } } />
                        :
                        <div></div>
                    }</div>
                    <div>{ i > 1 ?
                            <div className='removeStopBtn' onClick={()=>this.onRemove(i)}>
                            Remove
                            </div>
                            :
                            <div></div>
                    }</div>
                </div>
            )
        }

         const nextStop = String.fromCharCode( ( tmpStops[ tmpStops.length - 1 ].name.charCodeAt(0) ) + 1 )

        return(
            <div className='modifyStopForm'>
                <div className='modifyStopTitle'>Modify Stops Infomation</div>
                <div className='innerModifyStopForm' >
                    
                    <div className='stopInputLayout' >
                        <div></div>
                        <div>X</div>
                        <div>Y</div>
                        <div>Speed</div>
                        <div></div>
                    </div>
                    <hr /> 
                    {
                        tmpStops.length <= 25 ?
                        <div className='stopInputLayout' style={{marginBottom:'10px'}}>
                            <div>{nextStop}</div>
                            <input className='addXYInput' type="number" min={0} max={199} value={this.state.x} onChange={ (value) => this.onAddX( nextStop, value)}/>
                            <input className='addXYInput' type="number" min={'0'} max={'199'} value={this.state.y} onChange={ (value) => this.onAddY( nextStop, value)}/>
                            <input className='addSpeedInput' type="number" min={1} max={1999} value={this.state.speed} onChange={ (value) => this.onAddSpeed( nextStop, value)}/>
                            <div className='removeStopBtn' onClick={()=>this.onAdd(nextStop)}>Add</div>
                            
                        </div>
                        :
                        <div className='maxStops'>
                            Maximum Stops
                        </div>
                    }
                    {
                        this.props.duplicatedXY && (<div className='duplicatedXY'>X and Y are Duplicated !!</div> )

                    }
                    <hr />
                   
                        {newStops}
                    
                </div>
                <div className='saveCancelBtns'>
                    <div></div>
                    <div className='saveBtn' onClick={this.onSave}>Save</div>
                    <div></div>
                    <div className='cancelBtn' onClick={this.onCancel}>Cancel</div>
                    <div></div>
                </div>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        stops : state.roserocket.stops,
        tmpStops : state.roserocket.tmpStops,
        tmpLegs : state.roserocket.tmpLegs,
        duplicatedXY : state.roserocket.duplicatedXY,
    }),
    (dispatch) => ({
        RoseRocketActions: bindActionCreators( roseRocketAction, dispatch)
    })
)( ModifyStopsForm );