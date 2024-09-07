const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { minimize: false });

const adminModel = mongoose.models.admin || mongoose.model("admin", adminSchema);

module.exports = { adminModel, adminSchema };
