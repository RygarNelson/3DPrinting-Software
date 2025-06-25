module.exports = {
    execute(res, err, message){
        if (err) {
            console.log(err)
            res.send({
                success: false,
                error: err.code
            })
        } else {
            res.send({
                success: true,
                data: message
            })
        }
    }
}