const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    // Username & Password are already included with Passport
    isAdmin: { type: Boolean, default: false, required: true },
    full_name: { type: String, required: false },
    email: { type: String, required: false }
    // More fields go here
});

/* Note:
Passport also makes sure the usernames are unique & offers several methods onto our Schema */
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);