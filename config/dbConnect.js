const mongoose = require('mongoose')

const dbConnect = (url) => {
    try {
        mongoose.set("strictQuery", false)
        const conn = mongoose.connect(url)
        
        if (conn) console.log('Database connected successfull!')
    } catch (error){
        console.log('Database error: ', error)
    }
}

module.exports = dbConnect