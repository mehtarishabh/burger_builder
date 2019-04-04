import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burgerbuilder-e2ccc.firebaseio.com/'
})

export default instance;