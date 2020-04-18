// My Trial with GET and POST from NODEJS
const axios = require('axios');

axios.get('http://localhost:8080').then(resp => {

    console.log(resp.data);
});