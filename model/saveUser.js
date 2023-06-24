//import mongoose from "mongoose";
//var mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

let saveToDatabaseSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		dateOfBirth: {
			type: String,
			required: true,
		},
		whatsAppNumber: {
			type: Number,
			required: true,
		},
		relation: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true, versionKey: false },
);

module.exports = model('SaveUser', saveToDatabaseSchema);
