import React from 'react'
import { Provider } from 'react-redux'
import store from './store'
import TetrisApp from './components/TetrisApp'
import { BrowserRouter, Switch } from 'react-router-dom'

const Root = () => {
    return (
    
        <Provider store={store}>
            <BrowserRouter>
                <Switch>
                    <TetrisApp />
                </Switch>
            </BrowserRouter>
        </Provider>
    )
}

export default Root