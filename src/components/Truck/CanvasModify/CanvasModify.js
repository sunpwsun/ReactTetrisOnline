import React, { Component } from 'react'
import { connect } from 'react-redux'
import './CanvasModify.css'

const OFFSET_X = 50
const OFFSET_Y = 50
const NUM_X = 200
const NUM_Y = 200

const tmp = 10

class CanvasModify extends Component {

    state = {
        D : 3
    }

    componentDidMount() {
        //this.calcScaleFactor()
        this.drawMap()
    }


    componentDidUpdate() {
        //this.calcScaleFactor()
        this.drawMap() 
    }

    drawMap() {
    
        const canvas = this.refs.canvasModify
        const ctx = canvas.getContext('2d')

        this.drawBackground( ctx )
        this.drawLegs( ctx )
        this.drawStops( ctx )
        // this.drawDriver( ctx )
        
        // if( this.props.showBonusDriver )
        //     this.drawBonusDriver( ctx )

        if( this.props.showStopNames )
            this.drawStopNames( ctx )
    
    }

    drawStopNames( ctx ) {

        const stops = this.props.tmpStops
        const { D } = this.state

        ctx.font = '25px Verdana'
        ctx.textAlign = 'right'
        for( let i = 0 ; i < stops.length ; i++) {

            // if the tow stops' positions are same
            if( i !== 0 && stops[ i ].x == stops[ 0 ].x && stops[ i ].y == stops[ 0 ].y ) 
                continue
            ctx.fillText( stops[ i ].name, OFFSET_X + stops[ i ].x * D - 10 , OFFSET_Y + stops[ i ].y * D + 5 )
        }
    }



    drawStops( ctx ) {
        
        const stops = this.props.tmpStops
        const { D } = this.state

        for( let i = 0 ; i < stops.length ; i++ ) {

            ctx.beginPath()
            ctx.strokeStyle = 'black'
            ctx.lineWidth = 2
            ctx.setLineDash( [] )
            
            ctx.rect( OFFSET_X + stops[ i ].x * D - 4, OFFSET_Y + stops[ i ].y * D - 4, 8, 8)
            
            if( i == 0 ) {
                ctx.rect( OFFSET_X + stops[ i ].x * D - 2, OFFSET_Y + stops[ i ].y * D - 2, 4, 4)
            }
            ctx.stroke()  
        }
    }

    drawLegs( ctx ) {

        const legs = this.props.tmpLegs
        const stops = this.props.tmpStops
        const { D } = this.state

        for( let i = 1 ; i < stops.length ; i++ ) {
            ctx.beginPath();
            ctx.strokeStyle = 'blue'
            ctx.lineWidth = 3
            ctx.setLineDash( [] )           // solid line

            ctx.moveTo( OFFSET_X + stops[ i - 1 ].x * D, OFFSET_Y + stops[ i - 1 ].y * D)
            ctx.lineTo( OFFSET_X + stops[ i ].x * D, OFFSET_Y + stops[ i ].y * D)
            ctx.stroke();
        }



        // legs.forEach( leg => {

        //     const sIdx = stops.findIndex( stop => stop.name == leg.startStop)
        //     const eIdx = stops.findIndex( stop => stop.name == leg.endStop)
            
        //     ctx.beginPath();
        //     ctx.strokeStyle = 'blue'
        //     ctx.lineWidth = 3
        //     ctx.setLineDash( [] )           // solid line

        //     ctx.moveTo( OFFSET_X + stops[sIdx].x * D, OFFSET_Y + stops[sIdx].y * D)
        //     ctx.lineTo( OFFSET_X + stops[eIdx].x * D, OFFSET_Y + stops[eIdx].y * D)
        //     ctx.stroke();

        // })

    }

    drawBackground(ctx) { 
        
        const { D } = this.state

        // clears map
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0 ,0, 700, 750)
        ctx.fillStyle = "#000000"

        // draws horizontal lines
        for( let x = OFFSET_X ; x <= OFFSET_X + D * NUM_X ; x += 25 * D) {

            ctx.beginPath()
            ctx.strokeStyle = 'gray'
            ctx.lineWidth = 1
            if( x % 10 !== 0 )
                ctx.setLineDash( [1, 4])        // dashed line
            else 
                ctx.setLineDash( [] )           // solid line
            ctx.moveTo( x, OFFSET_Y )
            ctx.lineTo( x, OFFSET_Y + D * NUM_X )
            ctx.stroke();


            ctx.font = '20px Verdana'
            ctx.textAlign = 'center'
            ctx.fillText( (x - OFFSET_X ) /D, x, OFFSET_Y - 10)
        }
        

        // draws vertical lines
        for( let y = OFFSET_Y ; y <= OFFSET_Y + D * NUM_Y ; y += 25 * D) {
            
            ctx.beginPath()
            ctx.lineWidth = 1
            if( y % 10 !== 0 )
                ctx.setLineDash( [1, 4])        // dashed line
            else 
                ctx.setLineDash( [] )           // solid line
            ctx.moveTo( OFFSET_X, y )
            ctx.lineTo( OFFSET_X + D * NUM_Y, y )
            ctx.stroke();


            ctx.font = '20px Verdana';
            ctx.textAlign = 'right'
            ctx.fillText( (y - OFFSET_Y ) /D, OFFSET_X - 10, y + 10);
        }

        // draws legend
        // bottom of canvas
        ctx.font = '15px Verdana';
        ctx.textAlign = 'left'
        ctx.fillText( 'Start/End Stops', 100, 700);
        ctx.fillText( 'Other Stops', 100, 730);
        ctx.fillText( 'Truck', 520, 700);
     //   ctx.fillText( 'Bonus Driver', 220, 730);
        ctx.fillText( 'Completed Leg', 330, 700);
        ctx.fillText( 'Remaining Leg', 330, 730);
     //   ctx.fillText( 'Bonus Driver path', 540, 730);


        // stops
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 3
        ctx.setLineDash( [] )
        ctx.rect( 80, 692, 8, 8)
        ctx.rect( 82, 694, 4, 4)
        ctx.rect( 80, 722, 8, 8)
        ctx.stroke()  


        // diver
        ctx.beginPath()
        ctx.strokeStyle = 'red'
        ctx.lineWidth = 3
        ctx.setLineDash( [] )
        ctx.arc( 505, 695, 3, 0, 2 * Math.PI)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineWidth = 2
        ctx.arc( 505, 695, 7, 0, 2 * Math.PI)
        ctx.stroke()

        ctx.beginPath()
        ctx.strokeStyle = 'blue'
        ctx.lineWidth = 3
        ctx.setLineDash( [] )       
        ctx.moveTo( 290, 695 )
        ctx.lineTo( 320, 695)
        ctx.stroke()

        ctx.setLineDash( [3,3] )          
        ctx.moveTo( 290, 725 )
        ctx.lineTo( 320, 725)
        ctx.stroke()

    }

    render() {

        return(
            <div >
                <canvas className='mapCanvas' ref='canvasModify' width={700} height={750} />
            </div>
        )
    }
}

export default connect(
    (state) => ({
        tmpStops : state.roserocket.tmpStops,
        tmpLegs : state.roserocket.tmpLegs,
        
        
        showStopNames : state.roserocket.showStopNames,
        
    })
)(CanvasModify);