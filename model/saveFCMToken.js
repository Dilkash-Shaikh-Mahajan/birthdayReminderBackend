//import mongoose from "mongoose";
//var mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

let saveToFCMTokenSchema = new Schema(
	{
		fcmToken: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true, versionKey: false },
);

module.exports = model('SaveToken', saveToFCMTokenSchema);
