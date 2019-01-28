import axios from 'axios'

const url = 'http://localhost:3005'           // local
//const url = 'http://18.223.15.70:3005' 

// fetch all Legs
export const getAllLegs = async () => {
    
    return await axios.get( url +'/legs' )
}

// fetch all Stops
export const getAllStops = async () => {
   
    return await axios.get( url +'/stops' )
}

// fetch driver's location
export const getDriverLocation = async () => {
    
    return await axios.get( url +'/driver' )
}

// fetch bonus driver's location
export const getBonusDriverLocation = async () => {
   
    return await axios.get( url +'/bonusdriver' )
}

// updates the driver location
export const putDriverLocation = async ( newLocation ) => {

    return await axios.put( url + '/driver', newLocation )
        .then( response => { console.log( '[axios] update success : ', response) } )
        .catch( response => { console.log(response) } )
}

// updates the bonus driver location
export const putBonusDriverLocation = async ( newLocation ) => {
    
    return await axios.put( url + '/bonusdriver', newLocation )
        .then( response => { console.log( '[axios] update success : ', response) } )
        .catch( response => { console.log(response) } )
}