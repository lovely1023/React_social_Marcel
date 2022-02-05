
const express = require('express');
const app = express();
const {
  socketPort
} = require('./../../config/vars');
const server = app.listen(socketPort);
const socketIo = require('socket.io');
const io = socketIo.listen(server);
const Patient = require('./../models/patient.model');
const User = require('./../models/user.model');
//const Room = require('./../models/room.model')
const {
  createConsultEvent
} = require('./provider.controller');
const logger = require('../../config/logger')

logger.info("Start socket server: " + socketPort)

const updateUserPatientState = async (idc, userPatient) => {
  try {
    //console.log("updateUserPatientState:",userPatient)
    let id = null;
    if (userPatient) {
      id = userPatient._id ? userPatient._id : userPatient.id;
    } else {
      id = idc;
    }
    return await Patient.findOneAndUpdate({
      _id: id
    }, userPatient);
  } catch (e) {
    logger.error("updateUserPatientState e :" + e)
  }
};

const updateUserProviderState = async (idc, userProvider) => {
  try {
    //console.log("updateUserProviderState:", userProvider)
    let id = null;
    if (userProvider) {
      id = userProvider._id ? userProvider._id : userProvider.id;
    } else {
      id = idc;
    }
    if (!userProvider._id) {
      userProvider["_id"] = id
      delete userProvider["id"]
    }
    return await User.findOneAndUpdate({
      _id: id
    }, userProvider);
  } catch (e) {
    logger.error("updateUserProviderState e :" + e);
  }
};


const publicUserProviderState = async (providerId) => {
  try {
    let userProvider = await User.findOne({
      _id: providerId
    });
    userProvider.providerPublic = userProvider.providerPublic ? !userProvider.providerPublic : true;
    return await User.findOneAndUpdate({
      _id: providerId
    }, userProvider);
  } catch (e) {
    logger.error("updateUserProviderState e :" + e)
  }
};


//------------------------------------------

const confirmConnectProvider = async (idProvider, socketId, user) => {
  try {
    //console.log("confirmConnectProvider", user)
    const userProvider = await User.findOne({
      _id: idProvider
    });
    userProvider.connection = false;
    userProvider.calling = false;
    userProvider.state = true;
    if (socketId) {
      userProvider.socketId = socketId;
    }
    if (user.peerId) {
      userProvider.peerId = user.peerId;
    }
    return await updateUserProviderState(idProvider, userProvider);
  } catch (e) {
    logger.error("confirmConnectProvider e :" + e)
  }
};

const connectProvider = async (idProvider, socketId, user/*, notify*/) => {
  try {
    //console.log("connectProvider", user)
    const userProvider = await User.findOne({
      _id: idProvider
    });
    userProvider.connection = true;
    userProvider.calling = false;
    userProvider.state = true;
    if (socketId) {
      userProvider.socketId = socketId;
    }
    if (user.peerId) {
      userProvider.peerId = user.peerId;
    }
    await updateUserProviderState(idProvider, userProvider);
    //notify(userProvider)
  } catch (e) {
    logger.error("confirmConnectProvider e :" + e)
  }
};


const disconnectProvider = async (idProvider/*, notify*/) => {
  try {
    const userProvider = await User.findOne({
      _id: idProvider
    });
    userProvider.connection = false;
    userProvider.calling = false;
    userProvider.socketId = null;
    userProvider.peerId = null;
    await updateUserProviderState(idProvider, userProvider);
    //notify(userProvider);
  } catch (e) {
    logger.error("disconnectProvider e :" + e)
  }
};

//-----------------------

const startAttetionPatientForPay = async (idProvider, idPatient, callback) => {
  try {
    /*console.log("startAttetionPatientForPay")
    console.log(idProvider)*/
    const userProvider = await User.findOne({
      _id: idProvider
    });
    /*console.log(userProvider)
    console.log(idPatient)*/
    userProvider.calling = false;
    const patient = await Patient.findOne({
      _id: idPatient
    });

    patient.calling = false;
    /*console.log("userProvider")
    console.log(userProvider.socketId)
    console.log("patient")
    console.log(patient.socketId)*/
    //await updateUserPatientState(idPatient, patient);
    //await updateUserProviderState(idProvider, userProvider);
    callback(patient.socketId, userProvider.socketId);
  } catch (e) {
    logger.error("startCallProvider e :" + e)
  }
};


const startCallProvider = async (idProvider, idPatient, callback) => {
  try {
    const userProvider = await User.findOne({
      _id: idProvider
    });
    userProvider.calling = true;

    const patient = await Patient.findOne({
      _id: idPatient
    });
    patient.calling = true;
    await updateUserPatientState(idPatient, patient);
    await updateUserProviderState(idProvider, userProvider);
    callback(patient.socketId, userProvider.socketId);
  } catch (e) {
    logger.error("startCallProvider e :" + e)
  }
};



const endCallProvider = async (idProvider, idPatient) => {
  try {
    const userProvider = await User.findOne({
      _id: idProvider
    });
    userProvider.calling = false;
    const patient = await Patient.findOne({
      _id: idPatient
    });
    patient.calling = true;
    await updateUserPatientState(idPatient, patient);
    return await updateUserProviderState(idProvider, userProvider);
  } catch (e) {
    logger.error("endCallProvider e :" + e)
  }
};

//------------------------------------------

const connectConfirmPatient = async (idPatient, socketId, p) => {
  try {
    //console.log("connectConfirmPatient", p)
    const patient = await Patient.findOne({
      _id: idPatient
    });
    patient.connection = true;
    patient.calling = false;
    if (socketId) {
      patient.socketId = socketId;
    }
    if (p.peerId) {
      patient.peerId = p.peerId;
    }
    return await updateUserPatientState(idPatient, patient);
  } catch (e) {
    logger.error("connectConfirmPatient e :" + e)
  }
};

const disconnectPatient = async (socketId) => {
  try {
    const patient = await Patient.findOne({
      socketId: socketId
    });
    patient.connection = true;
    patient.calling = false;
    patient.socketId = null;
    patient.socketId = null;
    return await updateUserPatientState(patient._id, userProvider);
  } catch (e) {
    logger.error("disconnectPatient e :" + e)
  }
};


//-------------
/*
const countPatientRoom = async (room, callback) => {
  try {
    if (room) {
      const patientsData = await Patient.find({
        room: room,
        connection: true
      }).sort({
        lastSeen: -1
      });
      const providerData = await User.findOne({
        room: room
      });
      logger.info("countPatientRoom send :" + providerData.id + "-" + providerData.socketId)
      callback(providerData.socketId, patientsData);
    }
  } catch (e) {
    logger.error("countPatientRoom e :" + e)
  }
};*/

//-------------

const getPatientById = async (patientId) => {
  try {
    return await Patient.findById(patientId);
  } catch (e) {
    logger.error("getPatientById e :" + e)
  }
};

const emitDataByRoom = async (room) => {
  try {
    if (room) {
      const patientsData = await Patient.find({
        room: room,
        connection: true
      }).sort({
        lastSeen: -1
      });
      const providerData = await User.findOne({
        room: room
      });

      if (patientsData) {
        //socket.to(providerData.socketId).emit("updatePatientRoom", patientsData.length);
      }

      /*io.emit('stateUpdated', {
        patientsData: patientsData,
        providerData: providerData
      })*/
    }
  } catch (e) {
    logger.error("emitDataByRoom e :" + e)
  }
};

//------------------


const notifyPatients = async (provider, callback) => {
  try {
    const patientsData = await Patient.find({
      room: provider.room,
      connection: true
    }).sort({
      lastSeen: -1
    });
    callback(patientsData);
  } catch (e) {
    logger.error("emitDataByRoom e :" + e)
  }
};

const notifyProvider = async (patient, callback) => {
  try {
    const provider = await User.findOne({
      _id: patient.providerId
    });
    callback(provider);
  } catch (e) {
    logger.error("emitDataByRoom e :" + e)
  }
};

///------------------------

const disconnectConnection = async (socketId/*, notifyProviderCallback, notifyPatientsCallback*/) => {
  try {
    let userProviderOrPatient = await User.findOne({
      socketId: socketId
    });
    let isProviderDisconnect = true;
    if (userProviderOrPatient == undefined || userProviderOrPatient == null) {
      userProviderOrPatient = await Patient.findOne({
        socketId: socketId
      });
      isProviderDisconnect = false;
    }
    if (userProviderOrPatient) {
      userProviderOrPatient.connection = false;
      userProviderOrPatient.state = false;
      userProviderOrPatient.calling = false;
      userProviderOrPatient.socketId = null;
      userProviderOrPatient.peerId = null;
      if (isProviderDisconnect) {
        await User.findOneAndUpdate({
          _id: userProviderOrPatient._id
        }, userProviderOrPatient);
      } else {
        await Patient.findOneAndUpdate({
          _id: userProviderOrPatient._id
        }, userProviderOrPatient);
      }
    }else{
      logger.error("disconnectConnection socketId not found:" + socketId);
    }
  } catch (e) {
    logger.error("disconnectConnection e :" + e)
  }
};

io.on('connection', (socket) => {
  //console.log('sssss')
  logger.info('connection active :' + socket.id);

  socket.on('disconnect', async () => {
    logger.info('----------------------------disconnect :' + socket.id);
    disconnectConnection(socket.id);
  });

  //------------
  //provider entered in pay-provider
  socket.on('providerEnteredInPayProvider', async (userProvider, dni) => {
    if (userProvider) {
      logger.info('providerEnteredInPayProvider :', userProvider);
      logger.info('patient-dni:' + dni);

      await confirmConnectProvider(userProvider.id, socket.id, userProvider);

      const patient = await Patient.findOne({ dni: dni });
      logger.info('patient.socketId:' + patient.socketId);
      if (patient.socketId) {
        socket.to(patient.socketId).emit("providerEnteredInPayProvider", 'providerEntered');
      }
      else {
        logger.info('There is no patient with this dni');
      }
    }
  });

  //patient entered in pay-patient
  socket.on('patientEnteredInPayPatient', async (providerId, dni) => {
    if (providerId) {
      logger.info('patientEnteredInPayPatient :providerId' + providerId);
      logger.info('patient-dni:' + dni);

      const patient = await Patient.findOneAndUpdate({ dni: dni }, { $set: { socketId: socket.id } }, { new: true });

      const provider = await User.findById(providerId);
      logger.info('provider.socketId:' + provider.socketId);
      logger.info('patient.socketId:' + patient.socketId);
      if (provider.socketId) {
        socket.to(provider.socketId).emit("patientEnteredInPayPatient", patient.socketId);
      }
      else {
        logger.info('There is no provider with this _id');
      }
    }
  });

  //send payAmount from provider to patient
  socket.on('sendPay', async (payAmount, patientSocketId) => {
    logger.info('payAmount: ' + payAmount);
    socket.to(patientSocketId).emit('sendPay', payAmount);
  })

  //send pay confirm info from patient to provider
  socket.on('confirmPay', async (providerId, payMethodSelect) => {
    if (providerId) {
      const provider = await User.findById(providerId);
      if (provider.socketId) {
        socket.to(provider.socketId).emit('confirmPay', {
          "type:": 'confirm',
          "payMethodSelect": payMethodSelect
        });
      } else {
        logger.info('there is no such provider.socketId');
      }
    }
  });

  socket.on('confirmConnect', async (userProvider) => {
    if (userProvider) {
      logger.info('confirmConnect :' + socket.id + ' - ' + userProvider.id);
      await confirmConnectProvider(userProvider.id, socket.id, userProvider);
    }
  });


  socket.on('sendUploadFile', async (uploadFileName, key, othersId) => {
    var sender = {};
    if (key === 'provider')
      sender = await Patient.findById(othersId);
    else
      sender = await User.findById(othersId);

    if (sender.socketId) {
      socket.to(sender.socketId).emit('sendUploadFile', uploadFileName);
    }
    else
      logger.info('there is no such patient.socketId');
  })


  socket.on('activate', async (userProvider) => {
    if (userProvider) {
      logger.info('activate :' + socket.id + ' - ' + userProvider.id);
      await connectProvider(userProvider.id, socket.id, userProvider/*,
        (provider) => {
          notifyPatients(provider, (patients) => {
            if (patients && patients.length > 0) {
              patients.forEach(patient => {
                logger.info("providerConnect to patient :" + patient._id + " " + patient.socketId);
                socket.to(patient.socketId).emit("providerConnect", provider.id);
              });
            }
          });
        }*/);
    }
  });

  socket.on('desactivate', async (userProvider) => {
    if (userProvider) {
      logger.info('desactivate :' + socket.id + ' - ' + userProvider.id);
      await disconnectProvider(userProvider.id/*,
        (provider) => {
          notifyPatients(provider, (patients) => {
            if (patients && patients.length > 0) {
              patients.forEach(patient => {
                logger.info("providerDisconnect to patient :" + patient._id + " " + patient.socketId);
                socket.to(patient.socketId).emit("providerDisconnect", provider.id);
              });
            }
          });
        }*/
      );
    }
  });


  //send confirm provider info from patient to provider
  socket.on('confirmConnectPatient', async (patient) => {
    if (patient) {
      logger.info('confirmConnectPatient :' + socket.id + ' - ' + patient._id);
      await connectConfirmPatient(patient._id, socket.id, patient);
      /*await countPatientRoom(patient.room, (socketId, patients) => {
        logger.info('countPatientRoom :' + patients.length);
        socket.to(socketId).emit("countPatientRoom", patients.length);
        socket.to(socketId).emit("updatePatientState", patient);
      });
*/
    }
  });


  //send confirm provider info from provider to patient
  socket.on('confirmProvider', async (dni) => {
    if (dni) {
      const patient = await Patient.findOne({ dni });
      if (patient.socketId)
        socket.to(patient.socketId).emit('confirmProvider', 'confirmProvider');
      else
        logger.info('there is no such patient.socketId');
    }
  })
  //------------

  socket.on('startAttetionPatientForPay', async (provider, patient, amountPayAttetion) => {
    logger.info('startAttetionPatientForPay :' + socket.id + " to ");
    await startAttetionPatientForPay(provider.id, patient._id, (patientSocketId, providerSocketId) => {
      socket.to(patientSocketId).emit("startAttetionPatientForPayListener", {
        providerId: provider.id,
        amount: amountPayAttetion
      });
    });
  });


  socket.on('confirmPayAttetion', async (provider, patient) => {
    logger.info('confirmPayAttetion :' + socket.id);
    await startAttetionPatientForPay(provider._id, patient._id, (patientSocketId, providerSocketId) => {
      socket.to(providerSocketId).emit("confirmPayAttetionListener", {
        patientId: patient._id,
        providerId: provider._id
      });
    });
  });


  socket.on('preparateVideoCallFormProvider', async (userProvider, patientId) => {
    if (userProvider) {
      const id = userProvider._id ? userProvider._id : userProvider.id;
      userProvider.socketId = socket.id;
      await updateUserProviderState(id, userProvider);
      socket.join(id + "-" + userProvider.room);
      const patient = await getPatientById(patientId);
      socket.to(patient.socketId).emit("preparateVideoCallFormProvider", userProvider);
      logger.info('-------------------preparateVideoCall :' + socket.id +
        " - join room :" + id + "-" + userProvider.room + " - wait patient: " + patient.socketId)

    }
  });

  socket.on('preparateVideoCallFormPatient', async (data) => {
    if (data.provider) {
      data.patient.socketId = socket.id;
      await updateUserPatientState(data.patient)
      const id = data.provider._id ? data.provider._id : data.provider.id;
      logger.info('preparateVideoCall :' + socket.id + " - join room :" + id + "-" + data.provider.room)
      socket.join(id + "-" + data.provider.room);
      socket.to(id + "-" + data.provider.room).broadcast.emit('patient_connected', data.patient);
    }
  });

  socket.on("publicMe", providerId => {
    publicUserProviderState(providerId);
  });

  socket.on("chat_provider", data => {
    socket.emit("chat_provider", {
      text: data.text,
      from: data.from,
      to: data.to
    });

    socket.to(data.to).emit("chat_provider", {
      text: data.text,
      from: data.from,
      to: data.to
    });
  });

  socket.on("endCall", data => {
    console.log("endCall", data);
    socket.to(data.to).emit("endCall", {
      text: data.text,
      from: data.from,
      to: data.to
    });
  });

});