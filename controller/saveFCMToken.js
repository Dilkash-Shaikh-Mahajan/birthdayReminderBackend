const saveFCMToken = require('./../model/saveFCMToken');

const saveToFCMTokenFunction = async (req, res) => {
	const { fcmToken } = req.body;
	const alreadyExist = await saveFCMToken.findOne({ fcmToken });
	console.log(alreadyExist);

	if (alreadyExist === null) {
		const savedAdminToken = await saveFCMToken.create(req.body);
		return res.status(200).json({
			message: 'FCM Token Added Successfully',
			data: savedAdminToken,
			status: true,
		});
	} else {
		// Update the existing document with the new token
		alreadyExist.fcmToken = fcmToken;
		await alreadyExist.save();

		return res.status(200).json({
			message: 'FCM Token Updated Successfully',
			data: alreadyExist,
			status: true,
		});
	}

	// This line will never be reached because the response is already sent
};

const getAllFCMToken = async (req, res) => {
	try {
		const allFCMToken = await saveFCMToken.find();
		res.status(200).json(allFCMToken);
	} catch (error) {
		res.status(403).json(error.message);
	}
};
const saveAdminToken = {
	saveToFCMTokenFunction,
	getAllFCMToken,
};

module.exports = saveAdminToken;
