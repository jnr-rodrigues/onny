let mongoose = require("mongoose");

var applicationSchema = mongoose.Schema({
    owner: { type: String },
    id: { type: String },
    admins: { type: Array, default: [] },
    name: { type: String },
    icon: { type: String, default: "https://cdn.discordapp.com/attachments/1039517691242877008/1128074666364383394/d7b2ac2be0d74d97415c34df2e43c86f.png" },
    servers: { type: Number, default: 0 },
    users: { type: Number, default: 0 },
    functions: { type: Array, default: [] }
});

module.exports = mongoose.model('Application', applicationSchema, 'application');