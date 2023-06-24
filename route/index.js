const express = require('express');
const { saveToDatabase } = require('../controller/saveUser');
const saveAdminToken = require('../controller/saveFCMToken');

const router = express.Router();

router.post('/saveToDatabase', saveToDatabase);
router.post('/saveToFCMToken', saveAdminToken.saveToFCMTokenFunction);
router.get('/getAllFCMToken', saveAdminToken.getAllFCMToken);

module.exports = router;
