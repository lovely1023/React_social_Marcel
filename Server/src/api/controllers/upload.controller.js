const httpStatus = require('http-status');
const path = require('path');

const nodemailer = require("nodemailer");
const { emailConfig, smsConfig, culqiConfing } = require("../../config/vars");
const client = require('twilio')(smsConfig.Sid, smsConfig.authToken);
const bcrypt = require('bcryptjs');
const { env, baseUrl } = require('../../config/vars');
const Culqi = require('culqi-node');
const APIError = require('../utils/APIError');
const Template = require('../models/template.model');





/**
 * Load user and append to req.
 * @public
 */


exports.fileUpload = async (req, res) => {

    const file = req.files.myfile;
    console.log('file')
    console.log(file)
    var rand_no = Math.floor(123123123123 * Math.random());
    const fileName = rand_no + file.name;
    const filePath = path.join(__dirname + './../../public/uploadedVideos/');
    file.mv(filePath + fileName, function (error) {
        if (error) {
            console.log("file upload error", error)
        } else {
            res.status(httpStatus.CREATED).json(fileName);
        }
    });


};





