const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/upload.controller');
const { authorize, SUPER_ADMIN, ADMIN, PROVIDER } = require('../../middlewares/auth');
const router = express.Router();

router
  .route('/')
  .post(controller.fileUpload);

module.exports = router;
