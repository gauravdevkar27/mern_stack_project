const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    userName: {type:String, required:true, unique:true},
    passWord: {type:String, required:true}
});

userSchema.pre("save", async function (next) {
    const user = this;
    if(!user.isModified('passWord')) return next(); // if user not modified password then goto next function

    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(user.passWord, salt);
    user.passWord = hash;
    next();
})

userSchema.methods.comparePassword = async function (passWord) {     //wheather user enter password is matching our database or not
    return await bcrypt.compare(passWord, this.passWord);
}


const User = mongoose.model("User", userSchema);

module.exports = User;