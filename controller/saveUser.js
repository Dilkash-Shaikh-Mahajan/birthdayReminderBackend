const SaveUser = require('./../model/saveUser');

const saveToDatabase = async (req, res) => {
	console.log(req.body);
	try {
		const SavedUser = await SaveUser.create(req.body);
		res.status(200).json({
			message: 'User Added SuccessFully',
			data: SaveUser,
			status: true,
		});
	} catch (error) {
		res.status(403).json({
			status: false,
			error: error.message,
		});
	}
};
const saveUser = {
	saveToDatabase,
};

module.exports = saveUser;
