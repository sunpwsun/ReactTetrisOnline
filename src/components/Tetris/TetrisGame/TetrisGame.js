import React, { Component } from 'react'
import './TetrisGame.css'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as roseRocketAction from '../../../store/modules/roserocket'
import { RoseRocketActions } from '../../../store/actionCreatorsTruck'
import { waitForOpponent, sendPacket, subscribeToBattle } from '../../../services/socketapi'
import Title from '../Title/Title'

import * as V from '../../../services/tetrisVariables'



class TetrisGame extends Component {

    state = {

        startBattle : false,
        gameTimer : null,
        
        gameRooms : [],
        battleName : null,
//        level : 2,          // 1, 2, 3

        imgBrick : [],
        imgPanel : null,
        imgBg : null,
        imgNamePanel : null, 
        cells : [],
        opponentCells : [],
        level : 0,
        score : 0,
        stage : 1,
        intervalDown : 2000,
        gameTimerSpeed : 1000,
        gameCnt : 0,

        currBrick : null,
        gameTimer : null,
        gameOver : true,
        won : null,

        myName : null,
        oppoName : null,
        nextBricksType : [ -1, -1, -1 ],
        ctx : null,

    }

    componentDidMount() {

        this.setState({
            myName : this.props.nickname
        })

        this.gameInit() 
        
        waitForOpponent( ()=>{

            this.setState({
                startBattle : true
            })     
        })

        subscribeToBattle( (error, msg )=> {

            const oppoName = msg.sender;
            this.setState({ oppoName })

                if( msg.command === 'cells' ) {
                    const opponentCells = msg.cells
                    this.setState({ opponentCells })
                    this.drawAll()             
                }
                else if( msg.command === 'lost' ) {

                    //상대방이 졌다. 내가 이겼다.
                   
                    this.setState({
                        gameOver : true,
                        gameRunning : false,
                        timerRunning : false,
                        won : true,
                    })
                    try {
                        clearInterval( this.state.gameTimer );
                    }
                    catch( Exception ) {
                    }

                    this.drawAll()
                }
                else if( msg.command === 'attack' ) {

                    const { cells } = this.state


                    // 상대방이 나를 공격
                    //console.log('attack : ' + lines);
                    const lines = msg.lines - 1;

                    for( let y = 0 ; y < lines ; y++ ) {   		
                        for( let x = 0 ; x < V.numOfX ; x++ ) {
                            
                            if( cells[ x ][ y ] > -1 ) {
                                console.log( "Game OVer 1" );	                            				
                                // game over
                                // I lost
                            }
                        }
                    }
                    
                    
                    for( let y = lines ; y < V.numOfY  ; y++ ) {	            
                        for( let x = 0 ; x < V.numOfX ; x++ ) {
                    
                            cells[ x ][ y - lines ] = cells[ x ][ y ];
                        }
                    }
                    
                    for( let y = V.numOfY - lines ; y < V.numOfY ; y++ ) {
                        for( let x = 0 ; x < V.numOfX ; x++ ) {
                
                            cells[ x ][ y ] = 12;		// Color.BLUE                          			
                        }
                        
                        //nextBricksType[ 1 ] = next[ level ][ Math.floor(  Math.random() * next[ level ].length ) ];
                        let randX =  Math.floor( Math.random() * V.numOfX );
                        cells[ randX ][ y ] = -1;
                    }
                    this.drawAll(); 
                }
        })
    }


    keyPressed( e ) { 

        this.moveBrick( e.keyCode )

    }

    loadImages() {
        // const canvas = this.refs.canvas
        // const ctx = canvas.getContext('2d')

        let imgBrick = []
        imgBrick[ 0 ]    = this.refs.Brick0
        imgBrick[ 1 ]    = this.refs.Brick1
        imgBrick[ 2 ]    = this.refs.Brick2
        imgBrick[ 3 ]    = this.refs.Brick3
        imgBrick[ 4 ]    = this.refs.Brick4
        imgBrick[ 5 ]    = this.refs.Brick5
        imgBrick[ 6 ]    = this.refs.Brick6
        imgBrick[ 7 ]    = this.refs.Brick7
        imgBrick[ 8 ]    = this.refs.Brick8
        imgBrick[ 9 ]    = this.refs.Brick9
        imgBrick[ 10 ]   = this.refs.Brick10
        imgBrick[ 11 ]   = this.refs.Brick11
        imgBrick[ 12 ]   = this.refs.Brick12

        let imgPanel     = this.refs.imgPanel
        let imgBg        = this.refs.imgBg
        let imgNamePanel = this.refs.imgNamePanel

        this.setState({
            imgBrick : imgBrick,
            imgPanel : imgPanel,
            imgBg : imgBg,
            imgNamePanel : imgNamePanel,
        })
    }



    initCells() {

        let cells = []
        let opponentCells = []
    
        for( let x = 0 ; x < V.numOfX ; x++ ) {
                
            cells[ x ] = new Array()
            opponentCells[ x ] = new Array()
    
            for( let y = 0 ; y < V.numOfY ; y++ ) {
            
                cells[ x ][ y ] = -1;
                opponentCells[ x ][ y ] = -1;       
            }
        }

        this.setState({
            cells : cells,
            opponentCells : opponentCells,
        })
    }
    
    generateNextBricksType() {
        
        const { level, nextBricksType } = this.state

        // brick types 0 ~ 6   <-  appearance ratio = 21/26
        // brick types 7 ~ 11  <-  appearance ratio =  5/26
        
        const next = [[ 0, 1, 2, 3, 4, 5, 6 ], 	// Low
                    [ 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 8, 9, 10, 11 ],	// Medium
                    [ 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8, 9, 10, 11 ] ];	// High
    
        //Math.floor( Math.random() * 10 )   <--- 0 ~ 9
        if( nextBricksType[ 0 ] === -1 ) {
            
            //nextBricksType[ 0 ] = next[ level ][ random.nextInt( next[ level ].length ) ];
            //nextBricksType[ 1 ] = next[ level ][ random.nextInt( next[ level ].length ) ];
    
            nextBricksType[ 0 ] = next[ level ][ Math.floor(  Math.random() * next[ level ].length ) ]
            nextBricksType[ 1 ] = next[ level ][ Math.floor(  Math.random() * next[ level ].length ) ]
        }
        else {
            
            nextBricksType[ 0 ] = nextBricksType[ 1 ]
            nextBricksType[ 1 ] = nextBricksType[ 2 ]
        }
            
        nextBricksType[ 2 ] = next[ level ][ Math.floor(  Math.random() * next[ level ].length ) ]

        this.setState({
            nextBricksType
        }) 
      
    }
    
    checkMovable( key ) {
                
        const { currBrick, cells } = this.state

        if( key === "Up" ) {			
            
            for( let i = 0 ; i < 4 ; i++ ) {						
                
                if( currBrick.currPosY[ i ] === 0 )
                    return false;
            }
        }
        else if( key === "Down" ) {			
            
            for( let i = 0 ; i < 4 ; i++ ) {						
                
                if( currBrick.currPosY[ i ] >= V.numOfY - 1 )
                    return false;
    
                //블럭 바로 하단에 다른 블럭이 있는지 확인
                if( cells[ currBrick.currPosX[ i ] ][ currBrick.currPosY[ i ] + 1 ] >= 0 )
                    return false;
            }
        }
        else if( key === "Left" ) {							
        
            for( let i = 0 ; i < 4 ; i++ ) {
            
                // 블럭이 가장 좌측에 있는지 확인
                if( currBrick.currPosX[ i ] <= 0 )
                    return false;
        
                //블럭 바로 좌측에 다른 블럭이 있는지 확인
                if( cells[ currBrick.currPosX[ i ] - 1 ][ currBrick.currPosY[ i ] ] >= 0 )
                    return false;
        
            }	
        }
        else if( key === "Right" ) {							
            
            // 블럭이 가장 우측에 있는지 확인
            for( let i = 0 ; i < 4 ; i++ ) {
                
                if( currBrick.currPosX[ i ] >= V.numOfX - 1 )
                    return false;
        
                //블럭 바로 우측에 다른 블럭이 있는지 확인
                if( cells[ currBrick.currPosX[ i ] + 1 ][ currBrick.currPosY[ i ] ] >= 0 )
                    return false;
    
            }
        }
        
        return true;
    }

    pinCurrBrickToCells() {
        const { cells, currBrick } = this.state
        
        for( let i = 0 ; i < 4 ; i++ ) {          
            cells[ currBrick.currPosX[ i ] ][ currBrick.currPosY[ i ] ] = currBrick.type;
        }
    }

    checkLineFull() {
    
        const { cells } = this.state

        let lineIsFull = true
        let fullLines = 0
        
        for( let y = 0 ; y < V.numOfY ; y++ ) {
                
            for( let x = 0 ; x < V.numOfX ; x++ ) {
                    
                if( cells[ x ][ y ] === -1 ) {
                    
                    lineIsFull = false
                    continue;
                }
            }
    
            if( lineIsFull ) {
                
                // 한 줄이 꽉찼다. 이 줄을 지우고, 이 줄보다 위에 있는 블럭들을 전부 한줄씩 내린다. 점수 올린다.
                for( let j = y ; j > 0 ; j-- ) {
                    for( let i = 0 ; i < V.numOfX ; i++ ) {
                        cells[ i ][ j ] = cells[ i ][ j - 1 ]
                    }
                }
                
                this.setState({
                    score : this.state.score + 100
                })
                
                fullLines++
            }
                    
            lineIsFull = true;
        }
        
        // if more than 2 lines are removed, opponent's stacked lines will be increased by removed lines - 1.
        // Ex) I removed 3 lines, opponent gets 2 lines.
        // Ex) I removed 2 lines, opponent gets 1 lines.
        if( fullLines > 1 )
            this.attack( fullLines )
        
    }

    attack( lines ) {
        //
        let packet = {
            sender : this.state.myName,
            receiver : '',
            type1 : 'game',
            type2 : 'tetris',
            command : 'attack'
        }
        packet.lines = lines
    
       // socket.emit('game:tetris', packet)
        sendPacket( packet )
    }

    generateNextBricks() {
    
        const { nextBricksType } = this.state
 console.log('nextBricksType[ 0 ]', nextBricksType[ 0 ])       
        const currBrick = new V.TetrisBrick( nextBricksType[ 0 ] )
        this.setState({
            currBrick
        })
        this.generateNextBricksType()
    }

    moveBrick( keyCode ) {

        const { gameOver, currBrick, cells } = this.state

        if( gameOver )
            return;


        // SPACE BAR
        if( keyCode === 32 ) {
            
            let smallgestPosY = 100

            for( let i = 0 ; i < 4 ; i++ )
                if( currBrick.currPosY[ i ] < smallgestPosY )
                    smallgestPosY = currBrick.currPosY[ i ]

            for( let y = smallgestPosY ; y < V.numOfY ; y++ ) {

                if( this.checkMovable( "Down" ) ) {
                    currBrick.moveDown()
                }
                else {      // 내려올 수 있을만큼 내려왔다. 다음 블럭 만들어서 내려보내기

                    this.pinCurrBrickToCells()
                    this.checkLineFull()
                    this.generateNextBricks()

                    break
                }
            }
        }
        // LEFT
        else if( keyCode === 37 ) {
                
            if( this.checkMovable( "Left" ) ) {
                currBrick.moveToLeft()
            }
        }
        // RIGHT
        else if( keyCode === 39 ) {
    
            if( this.checkMovable( "Right" ) ) {				
                currBrick.moveToRight();
            }
        }
        // UP
        else if( keyCode === 38 ) {   
            
            currBrick.rotateBrick( cells )  
        }
        // DOWN
        else if( keyCode === 40 ) {  
                
            if( this.checkMovable( "Down" ) ) {

                currBrick.moveDown()
            }
            else {      // 내려올 수 있을만큼 내려왔다. 다음 블럭 만들어서 내려보내기

                this.pinCurrBrickToCells()
                this.checkLineFull()
                this.generateNextBricksType()
            }  
        }
                
        // debuging         
        // Page Up : 33      
        // Page Down : 34
        else if( keyCode === 33 ) {     

        }
        else if( keyCode === 34 ) {     

        }
        
        this.checkGameOver()
        
        this.drawAll()
    }

    sendCells() {
        
        const { cells, myName } = this.state
        
        let packet = {
            sender : myName,
            receiver : '',
            type1 : 'game',
            type2 : 'tetris',
            command : 'cells'
        }
        packet.cells = cells
        
        sendPacket( packet )
    }
    
    checkGameOver() {
            
        //    if( !gameRunning )
        //        return;
     
        const { cells, gameTimer, myName } = this.state

        for( let i = 0 ; i < 4 ; i++ ) {
            for( let j = 0 ; j < V.numOfX ; j++) {
                if( cells[ j ][ i ] >= 0 ) {
    
                    // game over
                    this.setState({
                        gameOver : true,
                        gameRunning : false,
                        timerRunning : false,
                        won	: false,
                    })
 
    
                    try {
    
                        // I lost
                        // send lost packet
    
                        clearInterval( gameTimer );
                    }
                    catch( Exception ) {
    
                        //
    
                    }
    
                    let packet = {
                        sender : myName,
                        receiver : '',
                        type1 : 'game',
                        type2 : 'tetris',
                        command : 'lost'
                    };
                
                    sendPacket( packet )
    
                    break
                }
            }
        }
    
    
        
    }
    

    clearScreen() {
console.log('clearScreenr')
        const { ctx, imgBg } = this.state

        // clear canvas
        ctx.drawImage( imgBg, 0, 0, imgBg.width, imgBg.height)
    }  

    drawStackedBricks() {
                
        const { ctx, cells, imgBrick } = this.state

        for( let i = 0 ; i < V.numOfX ; i++ ) {
            for( let j = 4 ; j < V.numOfY ; j++ ) {
                if( cells[ i ][ j ] >= 0 ) {
                    ctx.drawImage( imgBrick[ cells[ i ][ j ] ], 
                                    V.myPanelX  + V.mySquareLen * i,
                                    V.myPanelY  + V.mySquareLen * (j-4),
                                    V.mySquareLen,
                                    V.mySquareLen );                                 
                }
            }
        }	
    }
    drawOppoBricks() {
        
        const { ctx, opponentCells, imgBrick } = this.state
        // draws a opponent's bricks
        for( let i = 0 ; i < V.numOfX ; i++ ) {
    
            for( let j = 4 ; j < V.numOfY ; j++ ) {

                if( opponentCells[ i ][ j ] >= 0 ) {               
                    ctx.drawImage( imgBrick[ opponentCells[ i ][ j ] ], 
                        V.opponentPanelX  + V.oppoSquareLen * i,
                        V.opponentPanelY  + V.oppoSquareLen * (j-4),
                        V.oppoSquareLen,
                        V.oppoSquareLen )          
                }
            }
        }
    }
    
    runningBrick() {
    
        const { ctx, currBrick, imgBrick } = this.state
        ctx.fillStyle = currBrick.color
        
        for( let i = 0 ; i < 4 ; i++ ) {
    
            if( currBrick.currPosY[i] > 3) {
    
                ctx.drawImage( imgBrick[ currBrick.type ], 
                    V.myPanelX + V.mySquareLen * currBrick.currPosX[ i ], 
                    V.myPanelY + V.mySquareLen * (currBrick.currPosY[ i ]-4), 
                    V.mySquareLen,
                    V.mySquareLen );
            }
        }
    }
    drawNextBricks() {
    
        const { ctx, imgBrick, nextBricksType } = this.state

        for( let j = 0 ; j < 3 ; j++ ) {
    
            ctx.fillStyle = V.brickColors[ nextBricksType[ j ] ];
            
    
            for( let i = 0 ; i < 4 ; i++ ) {
    
                ctx.drawImage( imgBrick[ nextBricksType[ j ] ],
                    V.nextBrickPanelX + 75 - V.centerPosX[ nextBricksType[ j ] ] * V.nextBrickLength +  ( V.nextBrickLength ) * ( V.squarePosX[ nextBricksType[ j ] ][ 0 ][ i ] - 3 ) + 2, 
                    150 * ( 2 - j ) + V.nextBrickPanelY  + 75 - V.centerPosY[ nextBricksType[ j ] ] * V.nextBrickLength + ( V.nextBrickLength + 1 ) * ( V.squarePosY[ nextBricksType[ j ] ][ 0 ][ i ] ), 
                    V.nextBrickLength, 
                    V.nextBrickLength );
        
            }	
        }
    }   
    



    drawAll() {

        const { gameOver, won } = this.state


        // clears screen
        this.clearScreen()
        
        this.drawPanel()					// draws my Panel and opponent's panel
        this.drawStackedBricks()			// draws stacked bricks
        this.drawOppoBricks()				// draws a opponent's bricks
        this.runningBrick()					// draws a running brick
        this.drawNextBricks()				// draws next bricks
    
    
        if( gameOver ) {
            if( won ) {
                this.drawMessage("WON")
            }
            else {
                this.drawMessage("LOST")
            }
        }
    }
    

 


    drawPanel() {

        const { imgPanel, imgNamePanel, myName, oppoName, ctx } = this.state

        // draws my Panel
        ctx.drawImage( imgPanel, V.myPanelX, V.myPanelY, imgPanel.width, imgPanel.height);
    
        // draws opponent's Panel
        ctx.drawImage( imgPanel, V.opponentPanelX, V.opponentPanelY, imgPanel.width, imgPanel.height);
    
        // draws my name and opponent's name
        ctx.drawImage( imgNamePanel,52, 11,imgNamePanel.width, imgNamePanel.height );
        ctx.drawImage( imgNamePanel,593, 11,imgNamePanel.width, imgNamePanel.height );
        ctx.textAlign="center";
        ctx.font="30px Arial bold";
        ctx.fillStyle = "#ffff00"
    
        if( myName )
            ctx.fillText( myName, 212, 48);
        if( oppoName )
            ctx.fillText( oppoName, 754, 48);
    }

    drawMessage( msgType ){

        const { ctx } = this.state

        let msg;
        if( msgType === "WAITING")
            msg = "Waiting for Opponent";
        else if( msgType === "LOST")
            msg = "You Lost!";
        else if( msgType === "WON")
            msg = "You Won!";
        console.log("---" + msg);
        // draws a black filled box
       
        ctx.fillStyle = "#000000";
        ctx.fillRect( V.frameSizeX/10*3 - 50, V.frameSizeY/8*3, V.frameSizeX/10*4, V.frameSizeY/8*2 );
        
        // draw a white rectagle
        ctx.strokeStyle = "#8f0000";
        ctx.lineWidth = 3;
        ctx.strokeRect( V.frameSizeX/10*3 - 50, V.frameSizeY/8*3, V.frameSizeX/10*4, V.frameSizeY/8*2 );
       
        // draws a message
        ctx.textAlign="center";
        ctx.font="30px Arial bold";
        ctx.fillStyle = "#ffff00"
        ctx.fillText(msg, V.frameSizeX/2 - 50, V.frameSizeY/2); 
    }

    gameInit() {
        
        const canvas = this.refs.tetrisCanvas
 console.log('canvas', canvas)      
        const ctx = canvas.getContext('2d')
        this.setState({ ctx })
        this.loadImages()
    
        // initializes cells (10 x 20)
        this.initCells()
        // let nextBricksType = [ -1, -1, -1 ]
    
        // this.setState({
        //     nextBricksType
        // })

        // generates next bricks
        //		nextBricksType[ 0 ] = -1;
        this.generateNextBricksType()
        

        let { nextBricksType, startBattle } = this.state

        // generates a running brick
        const currBrickType = nextBricksType[ 0 ]
      
        let currBrick = new V.TetrisBrick( currBrickType )
  
        this.generateNextBricksType()
        
        this.setState({
            level : 0,
            score : 0,
            stage : 1,
            intervalDown : 2000,
            gameTimerSpeed : 1000,
            gameCnt : 0,
            currBrick :currBrick,
        })
    
        const watchingStart = setInterval( ()=>{
           
console.log( 'startBattle', this.state.startBattle )    
            if( this.state.startBattle ) {
                const gameTimer = setInterval( ()=>{

                   
 
                        let { gameCnt, currBrick } = this.state
                        gameCnt++
                        this.setState({
                            gameCnt : gameCnt,
                        })
                        
                        if( gameCnt % 1000000 === 0 )
                            this.setState({
                                gameCnt : 0,
                            })
                    
                        // if a brick can move down, Move a brick down
                        if( this.checkMovable( "Down" ) ) {
                                
                            currBrick.moveDown()
                        }
                        else {									// 내려올 수 있을만큼 내려왔다. 다음 블럭 만들어서 내려보내기
                            
                            this.pinCurrBrickToCells()
                            this.checkLineFull()
                            this.generateNextBricks()
                            this.checkGameOver()
                        }
                    
                        this.sendCells()
                        this.drawAll()
                    
                }, this.state.gameTimerSpeed )

                this.setState({
                    gameTimer : gameTimer
                })
                clearInterval( watchingStart )      
            }
            else {
                this.clearScreen()
                this.drawPanel()
                this.drawNextBricks()
                this.drawMessage( "WAITING" )
            }
        }, 1000 )
    
        this.setState({
            gameOver : false,
        })
        
    }	








    render() {



        return(
            <div>
                <div style={{display:'none'}} >
                    <img id="Brick0"  ref='Brick0' src="images/brick00.png" alt=""/>
                    <img id="Brick1"  ref='Brick1' src="images/brick01.png" alt=""/>
                    <img id="Brick2"  ref='Brick2' src="images/brick02.png" alt=""/>
                    <img id="Brick3"  ref='Brick3' src="images/brick03.png" alt=""/>
                    <img id="Brick4"  ref='Brick4' src="images/brick04.png" alt=""/>
                    <img id="Brick5"  ref='Brick5' src="images/brick05.png" alt=""/>
                    <img id="Brick6"  ref='Brick6' src="images/brick06.png" alt=""/>
                    <img id="Brick7"  ref='Brick7' src="images/brick07.png" alt=""/>
                    <img id="Brick8"  ref='Brick8' src="images/brick08.png" alt=""/>
                    <img id="Brick9"  ref='Brick9' src="images/brick09.png" alt=""/>
                    <img id="Brick10" ref='Brick10' src="images/brick10.png" alt=""/>
                    <img id="Brick11" ref='Brick11' src="images/brick11.png" alt=""/>
                    <img id="Brick12" ref='Brick12' src="images/brick12.png" alt=""/>
                    <img id="imgBg"   ref='imgBg' src="images/TetrisBg.png" alt=""/>
                    <img id="imgPanel" ref='imgPanel' src="images/TetrisPanel.png" alt=""/>
                    <img id="imgNamePanel" ref='imgNamePanel' src="images/nameBg.png" alt=""/>

                </div>

                <Title />
                
                <div className='gameCanvasForm'>
                    <canvas className='tetrisCanvas' ref='tetrisCanvas' width={950} height={730} tabIndex="0" onKeyDown={ (e) => this.keyPressed( e ) } />  
                </div>
            </div>
        )
    }
}









export default connect(
    (state) => ({
        nickname : state.roserocket.nickname,
        onBattle : state.roserocket.onBattle,
        guest : state.roserocket.guest
    }),
    (dispatch) => ({
        RoseRocketActions: bindActionCreators( roseRocketAction, dispatch)
    })
)( TetrisGame );