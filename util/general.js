module.exports={
    isLength24:(id)=>{
        if(id.length != 24)
        {
            const err=new Error('id should be 24 character long')
            err.status=400
            throw err
        }
    }
}