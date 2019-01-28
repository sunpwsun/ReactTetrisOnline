import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import TetrisLogin from '../components/Tetris/TetrisLogin/TetrisLogin'
import TetrisRoom from '../components/Tetris/TetrisRoom/TetrisRoom'
import TetrisGame from '../components/Tetris/TetrisGame/TetrisGame'


class TetrisApp extends Component {
  
    render() {

        const {modifyingStops} = this.props
        return (
            <div>
                <Route exact path ='/tetrisLogin' component = {TetrisLogin} />
                <Route       path ='/tetrisRoom' component = {TetrisRoom} />
                <Route       path ='/tetrisGame' component = {TetrisGame} />
            </div>

        )
    }
}

export default TetrisApp
