import { createStore, applyMiddleware } from 'redux'
import modules from './modules'
import ReduxThunk from 'redux-thunk'


import { compose } from 'redux'

const configure = () => {

  const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()


  const enhancers = compose(
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
  const store = createStore( modules, applyMiddleware( ReduxThunk))

  return store
}

export default configure