const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const verifyToken = require('../TokenVerification');

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);

    if (!username || !password) {
        console.log(1);
        return res.status(400).json({ message: 'Please provide username and password' });
    }
    try {
        console.log(2);
        const [results] = await db.query('SELECT * FROM tbl_login WHERE username = ?', [username]);
        console.log(results);

        if (results.length === 0) {
            console.log(3);
            return res.status(401).json({ message: 'Invalid username or password' });
        } else {
            console.log(4);
            const user = results[0];
            if (password !== user.password) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
            console.log("user>", user);

            const query = 'SELECT * FROM tbl_student WHERE email = ?';

            const [results1] = await db.query(query, [username]);
            console.log("from student table", results1[0].student_id);

            const token = jwt.sign({ id: user.id }, process.env.seckey, { expiresIn: '100d' });
            console.log("login sucess");
            return res.status(200).json({ student_id: results1[0].student_id, token, });
        }
    } catch (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

// checking token
router.get('/check', verifyToken, async (req, res) => {
    res.status(200).json('helooo')
});


// data geting students review
router.get('/getdatareview', verifyToken, async (req, res) => {
    const { student_id } = req.query;
    if (!student_id) {
        return res.status(400).json('student_id is required');
    }
    const parsedStudentId = parseInt(student_id);
    if (isNaN(parsedStudentId)) {
        return res.status(400).json('Invalid student_id');
    }
    const query = 'SELECT * FROM tbl_review WHERE student_id = ?';
    try {
        const [results] = await db.query(query, [parsedStudentId]);
        if (results.length === 0) {
            return res.status(404).json('Student not found');
        }
        return res.status(200).json(results);
    } catch (err) {
        console.error("Query execution error:", err.message);
        return res.status(500).json({ error: err.message });
    }
});

// get student project data
router.get('/getProjects', verifyToken, async (req, res) => {
    const { student_id } = req.query;
    if (!student_id) {
        return res.status(400).json('student_id is required');
    }
    const parsedStudentId = parseInt(student_id);
    if (isNaN(parsedStudentId)) {
        return res.status(400).json('Invalid student_id');
    }
    const query = 'SELECT * FROM tbl_projects WHERE student_id = ?';
    try {
        const [results] = await db.query(query, [parsedStudentId]);
        if (results.length === 0) {
            return res.status(404).json('Student not found');
        }
        console.log(results);
        return res.status(200).json(results);
    } catch (err) {
        console.error("Query execution error:", err.message);
        return res.status(500).json({ error: err.message });
    }
});

// get student personl details
router.get('/getstudent', verifyToken, async (req, res) => {
    const { student_id } = req.query;
    if (!student_id) {
        return res.status(400).json('student_id is required');
    }
    const parsedStudentId = parseInt(student_id);
    if (isNaN(parsedStudentId)) {
        return res.status(400).json('Invalid student_id');
    }
    const query = 'SELECT * FROM tbl_student WHERE student_id = ?';
    try {
        const [results] = await db.query(query, [parsedStudentId]);
        if (results.length === 0) {
            return res.status(404).json('Student not found');
        }
        return res.status(200).json(results);
    } catch (err) {
        console.error("Query execution error:", err.message);
        return res.status(500).json({ error: err.message });
    }
});

// get student tasks details
router.get('/getTasks', verifyToken, async (req, res) => {
    const { student_id } = req.query;
    if (!student_id) {
        return res.status(400).json('student_id is required');
    }
    const parsedStudentId = parseInt(student_id);
    if (isNaN(parsedStudentId)) {
        return res.status(400).json('Invalid student_id');
    }
    const query = 'SELECT * FROM tbl_tasks WHERE student_id = ?';
    try {
        const [results] = await db.query(query, [parsedStudentId]);
        if (results.length === 0) {
            return res.status(404).json('Student not found');
        }
        return res.status(200).json(results);
    } catch (err) {
        console.error("Query execution error:", err.message);
        return res.status(500).json({ error: err.message });
    }
});

router.get('/getdatatraining', verifyToken, async (req, res) => {
    const { student_id } = req.query;
    if (!student_id) {
        return res.status(400).json('student_id is required');
    }
    const parsedStudentId = parseInt(student_id);
    if (isNaN(parsedStudentId)) {
        return res.status(400).json('Invalid student_id');
    }
    const query = 'SELECT * FROM tbl_training WHERE student_id = ?';
    try {
        const [results] = await db.query(query, [parsedStudentId]);
        if (results.length === 0) {
            return res.status(404).json('Student not found');
        }
        return res.status(200).json(results);
    } catch (err) {
        console.error("Query execution error:", err.message);
        return res.status(500).json({ error: err.message });
    }
});



router.get('/getdataattendance', verifyToken, async (req, res) => {
    const { student_id, year, month } = req.query;
    if (!student_id) {
        return res.status(400).json('student_id is required');
    }
    const parsedStudentId = parseInt(student_id);
    if (isNaN(parsedStudentId)) {
        return res.status(400).json('Invalid student_id');
    }
    let query = 'SELECT * FROM tbl_attendance WHERE student_id = ?';
    let queryParams = [parsedStudentId];
    if (year && month) {
        query += ' AND YEAR(date_taken) = ? AND MONTH(date_taken) = ?';
        queryParams.push(year, month);
    } else {
        console.log('Filtering without specific year/month');
    }
    try {
        const [results] = await db.query(query, queryParams);
        if (results.length === 0) {
            return res.status(404).json('No attendance data found');
        }
        return res.status(200).json(results);
    } catch (err) {
        console.error("Query execution error:", err.message);
        return res.status(500).json({ error: err.message });
    }
});




router.get('/getdatabill', verifyToken, async (req, res) => {
    const { student_id } = req.query;
    if (!student_id) {
        return res.status(400).json('student_id is required');
    }
    const parsedStudentId = parseInt(student_id);
    if (isNaN(parsedStudentId)) {
        return res.status(400).json('Invalid student_id');
    }
    const query = 'SELECT * FROM tbl_bill WHERE student_id = ?';
    try {
        const [results] = await db.query(query, [parsedStudentId]);
        if (results.length === 0) {
            return res.status(404).json('Student not found');
        }
        return res.status(200).json(results);
    } catch (err) {
        console.error("Query execution error:", err.message);
        return res.status(500).json({ error: err.message });
    }
});

router.get('/getdatavideos', verifyToken, async (req, res) => {
    const { batchname } = req.query;
    console.log(batchname);

    if (!batchname) {
        return res.status(400).json('batchname is required');
    }

    const query = 'SELECT * FROM tbl_videos WHERE batch = ?';

    try {
        const [results] = await db.query(query, [batchname]);
        if (results.length === 0) {
            return res.status(404).json('No videos found for this batch');
        }
        return res.status(200).json(results);
    } catch (err) {
        console.error("Query execution error:", err.message);
        return res.status(500).json({ error: err.message });
    }
});

router.get('/getdataAnnouncements', verifyToken, async (req, res) => {
    const { batchname } = req.query;
    console.log(req.query);

    console.log(1);

    console.log(batchname);
    console.log(2);
    if (!batchname) {
        return res.status(400).json('batchname is required');
        console.log(0);
    }

    const query = 'SELECT * FROM tbl_announcements WHERE batch = ?';
    console.log(3);
    try {

        const [results] = await db.query(query, [batchname]);
        console.log(results);

        console.log(4);
        if (results.length === 0) {
            console.log(5);
            return res.status(404).json('No announcements found for this batch');
        }
        return res.status(200).json(results);
    } catch (err) {
        console.error("Query execution error:", err.message);
        return res.status(500).json({ error: err.message });
    }
});

router.get('/getdatamaterial', verifyToken, async (req, res) => {
    const { batchname } = req.query;
    console.log(batchname);

    if (!batchname) {
        return res.status(400).json('batchname is required');
    }

    const query = 'SELECT * FROM tbl_material WHERE batch = ?';

    try {
        const [results] = await db.query(query, [batchname]);
        if (results.length === 0) {
            return res.status(404).json('No announcements found for this batch');
        }
        return res.status(200).json(results);
    } catch (err) {
        console.error("Query execution error:", err.message);
        return res.status(500).json({ error: err.message });
    }
});


// change password
router.post('/change-password', verifyToken, async (req, res) => {
    const { student_id, currentPassword, newPassword } = req.body;
    if (!student_id || !currentPassword || !newPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const [results] = await db.query('SELECT * FROM tbl_login1 WHERE student_id = ?', [student_id]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = results[0];
        console.log(user);

        if (currentPassword !== user.password) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }
        await db.query('UPDATE tbl_login1 SET password = ? WHERE student_id = ?', [newPassword, user.student_id]);
        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {

        console.error('Error updating password:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});



router.get('/getdataAnnouncementsid', verifyToken, async (req, res) => {
    const { student_id } = req.query;  // Get student_id from query parameters
    console.log(req.query);

    if (!student_id) {
        return res.status(400).json('student_id is required');
    }

    const query = 'SELECT * FROM tbl_student_messages WHERE student_id = ?';  // Change the filter to student_id
    console.log('Fetching announcements for student_id:', student_id);

    try {
        const [results] = await db.query(query, [student_id]);
        console.log(results);

        if (results.length === 0) {
            return res.status(404).json('No announcements found for this student');
        }
        return res.status(200).json(results);  // Send results back as JSON
    } catch (err) {
        console.error("Query execution error:", err.message);
        return res.status(500).json({ error: err.message });
    }
});



module.exports = router;
