const saveFCMToken = require('./../model/saveFCMToken');

const saveToFCMTokenFunction = async (req, res) => {
	try {
		const { fcmToken } = req.body;
		const alreadyExist = await saveFCMToken.find({ fcmToken });

		const SavedAdminToken = await saveFCMToken.create(req.body);
		res.status(200).json({
			message: 'FCM Token Added SuccessFully',
			data: SavedAdminToken,
			status: true,
		});
	} catch (error) {
		res.status(403).json({
			status: false,
			error: error.message,
		});
	}
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
