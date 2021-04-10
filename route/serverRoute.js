const express = require('express');
const router = express.Router();
const serverArray = require('../config/server');
var ActiveUrl = require('../module/activeUrl');
var activeUrl = new ActiveUrl();


router.get('/', (req, res) => {
    try {
        activeUrl.findServer(serverArray)
            .then((data) => {
                res.end(JSON.stringify(data));
            }).catch((err) => {
                console.log("error", err)
            })
    } catch (error) {
        console.log("error", error)
    }
});
module.exports = router;