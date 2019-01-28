import React, { Component } from 'react'
import FormsContainer from '../FormsContainer/FormsContainer'
import CanvasContainer from '../CanvasContainer/CanvasContainer'
import TimelineDash from '../TimelineDash/TimelineDash'
import './BodyContainer.css'


class BodyContainer extends Component {

    render() {


        return(
            <div className='bodyGrid'>
                <FormsContainer />
                <CanvasContainer />
                <TimelineDash />
            </div>
        )
        }
}



export default BodyContainer