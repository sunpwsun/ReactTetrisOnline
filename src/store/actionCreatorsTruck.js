import { bindActionCreators } from 'redux'
import * as roserocketActions from './modules/roserocket'


import store from './index'

const { dispatch } = store

export const RoseRocketActions = bindActionCreators(roserocketActions, dispatch)