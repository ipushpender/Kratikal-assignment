const request = require('request')
const lookup = require('../config/constants');
class activeUrl {
    findServer(serverList) {
        return new Promise((resolve, reject) => {
            try {
                // extract list of url from serverList object
                let urls = serverList.map(a => a.url);
                let urlResponse = [];
                let returnValue;
                // sorting in ascending order basis of priority
                serverList.sort((a, b) => {
                    return a.priority - b.priority;
                });
                // pass each url from list of urls one after another
                urls.map(url => urlResponse.push(this.getLinkStatus(url)));
                Promise.all(urlResponse).then(results => {
                    // validate statusCode
                    var validurls = results.filter((el) => {
                        return el.status >= 200 && el.status < 300;
                    });
                    let returnValue;
                    for (let index = 0; index < serverList.length; index++) {
                        let serverInfo = serverList[index];
                        // return first element where condition match
                        returnValue = validurls.find((elem) => serverInfo.url === elem.url);
                        if (returnValue) {
                            break;
                        }
                    }
                    if (returnValue) {
                        resolve(returnValue)
                    } else {
                        resolve("No Active Url Exists")
                    }
                }).catch(err => {
                    console.log("errr", err);
                })
            } catch (error) {
                console.warn("error", error)
            }
        });
    }

    getLinkStatus(url) {
        return new Promise(function(resolve, reject) {
            let urlStatus;
            request.get({
                url,
                timeout: lookup.TIMEOUT
            }, (err, res, body) => {
                if (err) {
                    // if server is taking more than 5 seconds we are assuming URL not found
                    urlStatus = { status: 404, url: '' }
                    resolve(urlStatus)
                } else {
                    urlStatus = { status: res.statusCode, url: url }
                    resolve(urlStatus);
                }
            })
        })
    }
}


module.exports = activeUrl;