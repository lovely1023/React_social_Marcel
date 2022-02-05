const express = require('express');
// const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');

const editorRoutes = require('./editor.route');
const templateRoutes = require('./template.route');
const uploadRoutes = require('./upload.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * @request method api/v1/users, auth, public, provider,
 */

// router.use('/users', userRoutes);
router.use('/auth', authRoutes);

router.use('/editor', editorRoutes);
router.use('/template', templateRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
