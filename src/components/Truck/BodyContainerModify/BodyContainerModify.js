import React, { Component } from 'react'
import CanvasContainer from '../CanvasContainer/CanvasContainer'
import ModifyStopsForm from '../ModifyStopsForm/ModifyStopsForm'
import './BodyContainerModify.css'

class BodyContainerModify extends Component {

    render() {
        return(
            <div className='aaa'>
                <ModifyStopsForm />
                
                <CanvasContainer />
                
            </div>
        )
    }
}



export default BodyContainerModify