const express = require('express');
const app = express();
const cron = require('node-cron');
require('dotenv').config();
const SaveUser = require('./model/saveUser');
const saveFCMToken = require('./model/saveFCMToken');
const cors = require('cors');
const port = process.env.PORT || 7786;
let api = require('./route');
require('./database');
app.use(cors());
const allowedOrigins = [
	'https://birthday-reminder-frontend1.vercel.app',
	'http://localhost:3000',
	// Add more frontend links here
];
app.use((req, res, next) => {
	const origin = req.headers.origin;
	if (allowedOrigins.includes(origin)) {
		res.setHeader('Access-Control-Allow-Origin', origin);
	}
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);
const admin = require('firebase-admin');
admin.initializeApp({
	credential: admin.credential.cert({
		projectId: process.env.FIREBASE_PROJECT_ID, // I get no error here
		clientEmail: process.env.FIREBASE_CLIENT_EMAIL, // I get no error here
		privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // I get error HERE
	}),
});
// app.use("/api", blogRoutes);
app.use('/', (req, res) => {
	res.json({ message: 'Hello World!' });
});
//  # ┌────────────── second (optional)
//  # │ ┌──────────── minute
//  # │ │ ┌────────── hour
//  # │ │ │ ┌──────── day of month
//  # │ │ │ │ ┌────── month
//  # │ │ │ │ │ ┌──── day of week
//  # │ │ │ │ │ │
//  # │ │ │ │ │ │
//  # * * * * * *
// cron.schedule(' * * * * *', async () => {
cron.schedule(' 0 0 * * *', async () => {
	// This code will run at midnight (12:00 AM) every day

	// Fetch the data from the database
	const data = await SaveUser.find();
	const currentDate = new Date();
	const currentMonth = currentDate.getMonth() + 1;

	data.map(async (userData) => {
		const [year, month, day] = userData.dateOfBirth.split('-');
		if (
			Number(month) === currentMonth &&
			Number(day) === currentDate.getDate()
		) {
			// console.log(userData);
			// console.log(year, month, day);
			// console.log(data);
			const allToken = await saveFCMToken.find();
			// console.log(allToken);
			var payload = {
				notification: {
					body: `Today is ${userData.name}, BirthDay, I have wish him on ${userData.whatsAppNumber} Whatsapp Number 👍 `,
					title: `Today is ${userData.name} BirthDay`,
					icon: 'https://dilkash-payment-gateway.netlify.app/favicon.ico',
					// requireInteraction: true,
					click_action: `https://birthday-reminder-frontend.vercel.app/`,
					// requireInteraction: true,
				},
			};
			function generateWhatsAppLink(phoneNumber, message) {
				const baseUrl = 'https://wa.me/';
				const encodedPhoneNumber =
					encodeURIComponent(phoneNumber);
				const encodedMessage = encodeURIComponent(message);
				const link = `${baseUrl}${encodedPhoneNumber}?text=${encodedMessage}`;
				return link;
			}

			// Usage example
			const recipientNumber = 'RECIPIENT_PHONE_NUMBER';
			const greetingMessage =
				'Hello! This is your greeting message.';

			const whatsappLink = generateWhatsAppLink(
				recipientNumber,
				greetingMessage,
			);
			console.log('WhatsApp Link:', whatsappLink);
			// console.log(payload);
			var options = {
				priority: 'high',
				timeToLive: 60 * 60 * 24,
			};
			var allFCMToken = allToken.map(function (obj) {
				return obj.fcmToken;
			});
			// console.log('allFCMToken', allFCMToken);
			admin.messaging()
				.sendToDevice(allFCMToken, payload, options)
				.then(function (response) {
					console.log(
						'Successfully sent message:',
						response,
					);
				})
				.catch(function (error) {
					// console.log('Error sending message:', error);
				});
		}
	});
});
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
