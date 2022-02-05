const httpStatus = require('http-status');
const path = require('path');
const nodemailer = require("nodemailer");
const { emailConfig, smsConfig, culqiConfing } = require("../../config/vars");
const client = require('twilio')(smsConfig.Sid, smsConfig.authToken);
const bcrypt = require('bcryptjs');
const { env, baseUrl } = require('../../config/vars');
const Culqi = require('culqi-node');
const APIError = require('../utils/APIError');
var ffmpeg = require('fluent-ffmpeg');
const editly = require('editly');

ffmpeg.setFfmpegPath('C:/ffmpeg/bin/ffmpeg.exe');


var fs = require('fs');
const ytdl = require('ytdl-core');


/**
 * Load user and append to req.
 * @public
 */
exports.youtube = async (req, res, next) => {
    try {
        const videoPath = path.join(__dirname + './../../public/videos/');
				const videoUrl="http://www.youtube.com/watch?v=aqz-KE-bpKQ";
				// Create WriteableStream
				const writeableStream = fs.createWriteStream(`yt-video.mp4`);

				// Listening for the 'finish' event
				writeableStream .on('finish', () => {
				  console.log(`yt-video downloaded successfully`);
				});
				
				ytdl(videoUrl, {
					format: "mp4",
				}).pipe(writeableStream);
    } catch (error) {
        return next(error);
    }
};

exports.makeVideo = async (req, res, next) => {
    try {
        const videoPath = path.join(__dirname + './../../public/videos/');
        const editSpec={
            outPath: videoPath+'Editly.mp4',
            width:600,
            height:1000,
            // audioFilePath:videoPath+'output.mp3',
            fps:10,
            allowRemoteRequests:true,
            clips: [
              { layers: [
                { type: 'video', path: videoPath+'movie.mp4'},
                { type: 'video', path: videoPath+'movie.mp4',height:0.3},
              ] },
            ],
          }
        await editly(editSpec)
        .catch(console.error);
        res.send('ok')
    } catch (error) {
        return next(error);
    }
};


exports.muteVideo = async (req, res, next) => {
    try {
        const videoPath = path.join(__dirname + './../../public/videos/');
        var url = videoPath + 'output.mp4';
        console.log(url)
        fs.exists(url, function (exists) {
            if (exists) {
                fs.unlink(url, function (err, data) {
                    if (!err)
                        console.log("Existing File Deleted . . . ");
                });
            }
        });

        ffmpeg('http://localhost:3000/videos/movie.mp4') //Input Video File
            .output(videoPath + 'mute-movie.mp4') // Output File
            .noAudio().videoCodec('copy')
            .on('end', function (err) {
                if (err)
                    console.log(err)
                else if (!err) {

                    console.log("Conversion Done");
                    res.send('Remove Audio is Done');

                }

            })
            .on('error', function (err) {
                console.log('error: ', +err);

            }).run();
    } catch (error) {
        return next(error);
    }
};


exports.removeVideo = async (req, res, next) => {
    try {
        const videoPath = path.join(__dirname + './../../public/videos/');
        var url = videoPath + 'output.mp3';
        fs.exists(url, function (exists) {
            if (exists) {
                fs.unlink(url, function (err, data) {
                    if (!err) {
                        console.log("Existing File Deleted . . . ");
                    }
                });
            }
        });
        ffmpeg(videoPath + 'input.mp4') // Input Video File
            .output(videoPath + 'output.mp3') // Output  File
            .on('end', function (err) {
                if (!err) {
                    console.log("Remove video is done");
                    res.send('Remove Video is Done');

                }

            })
            .on('error', function (err) {
                console.log('error: ' + err);
            }).run();
    } catch (error) {
        return next(error);
    }
};

exports.thumbnail = async (req, res, next) => {
    const videoFilePath = req.body.videoFilePath
    const template = req.body.template
    const faceVideo = req.body.faceVideo
    const mainVideo = req.body.mainVideo
    try {
        const videoPath = path.join(__dirname + './../../public/videos/');

        function videoCropCenterFFmpeg(
            video,
            w,
            h,
            x,
            y,
            tempFile
        ) {
            return new Promise((res, rej) => {
                ffmpeg()
                    .input(video)
                    .videoFilters([
                        {
                            filter: "crop",
                            options: {
                                w,
                                h,
                                x,
                                y
                            },
                        },
                    ])
                    .output(tempFile)
                    .on("start", function (commandLine) {
                        console.log("Spawned FFmpeg with command: " + commandLine);
                        console.log("Start videoCropCenterFFmpeg:", video);
                    })
                    // .on("progress", function(progress) {
                    //   console.log(progress);
                    // })
                    .on("error", function (err) {
                        console.log("Problem performing ffmpeg function");
                        rej(err);
                    })
                    .on("end", function () {
                        console.log("End videoCropCenterFFmpeg:", tempFile);
                        res(tempFile);
                    })
                    .run();
            });
        }
        if(faceVideo){
            var faceVideoPath= await videoCropCenterFFmpeg(
                videoFilePath,
                faceVideo.width,
                faceVideo.height,
                faceVideo.x,
                faceVideo.y,
                videoPath + 'faceOutput.mp4'
            );
        }

    
        var mainVideoPath= await videoCropCenterFFmpeg(
            videoFilePath,
            mainVideo.width,
            mainVideo.height,
            mainVideo.x,
            mainVideo.y,
            videoPath + 'mainOutput.mp4'
        );
        var layers=[];

        if(faceVideo){
            layers=[
                    { type: 'video', path: mainVideoPath},
                    { 
                        type: 'video', 
                        path: faceVideoPath,
                        width:template.gamerVideo.width,
                        height:template.gamerVideo.height,
                        position:{
                            x:template.gamerVideo.x,
                            y:template.gamerVideo.y,
                        }                   
                    },
                  ]
        }else{
            layers=[
                { type: 'video', path: mainVideoPath},
              ] 
        }
        const editedVideoPath = path.join(__dirname + './../../public/editedVideos/');
        const editedVideoName=Date.now()+'Edited.mp4';

        const editSpec={
            outPath:editedVideoPath+editedVideoName,
            width:template.mainVideo.width,
            height:template.mainVideo.height,
            // audioFilePath:videoPath+'output.mp3',
            fps:2,
            allowRemoteRequests:true,
            keepSourceAudio:true,
            clips: [
              { layers },
            ],
          }

        await editly(editSpec)
        .catch(console.error);

        res.status(httpStatus.OK).json(editedVideoName);

    } catch (error) {
        return next(error);
    }
};

exports.videoInfo = async (req, res, next) => {
    try {
        const videoPath = path.join(__dirname + './../../public/videos/');

        ffmpeg.ffprobe(videoPath+'movie.mp4', function (err, metadata) {
            if (err) {
                console.log("MetaData not Found. " + err);
            } else {
                res.send(metadata);
            }
        });
    } catch (error) {
        return next(error);
    }
};