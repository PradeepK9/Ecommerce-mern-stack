
module.exports = (callBackFun)=> (req, res, next)=>{
    Promise.resolve(callBackFun(req, res, next)) // acts as try block
    .catch(next);
}