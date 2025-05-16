const { hash, compare } = require("bcryptjs")
const crypto = require('crypto');


exports.doHash =(value,setvalue)=>{
    const results = hash(value,setvalue);
    return results

};
exports.doHashValidation  = (value,hashValue)=>{
    const results = compare(value,hashValue);
    return results
}

exports.hmacProcess = (value, key) => {
    const results = crypto.createHmac('sha256', key).update(value).digest('hex');
    return results;
  };