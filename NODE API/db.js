const mongoose = require('mongoose')

mongoose.connect(process.env.DBPATH)
    .then(() => {
        console.log('DataBase is connected')
    }).catch((err) => {
        console.log('DataBase is not connected', err)
    })

module.exports = mongoose