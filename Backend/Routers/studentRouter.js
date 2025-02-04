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
        const [results] = await db.query('SELECT * FROM tbl_login1 WHERE username = ?', [username]);
        console.log(results);

        if (results.length === 0) {
            console.log(3);
            return res.status(401).json({ message: 'Invalid username or password' });
        } else {
            console.log(4);
            const user = results[0];
            console.log(user);
            console.log(5);
            if (password !== user.password) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
            const token = jwt.sign({ id: user.id }, process.env.seckey, { expiresIn: '1d' });
            console.log("login sucess");
            return res.status(200).json({ student_id: user.student_id, token, userId: user.id });
        }
    } catch (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});

router.get('/check', verifyToken, async (req, res) => {
    res.status(200).json('helooo')
});

router.get('/getdatareview', async (req, res) => {
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
router.get('/getdatatraining', async (req, res) => {
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



router.get('/getdataattendance', async (req, res) => {
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




router.get('/getdatabill', async (req, res) => {
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

router.get('/getdatavideos', async (req, res) => {
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

router.get('/getdataAnnouncements', async (req, res) => {
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

router.get('/getdatamaterial', async (req, res) => {
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


router.post('/change-password', async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;

    // Validate request
    if (!userId || !currentPassword || !newPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Fetch user by userId
        const [results] = await db.query('SELECT * FROM tbl_login1 WHERE id = ?', [userId]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = results[0];

        // Check if the current password matches
        if (currentPassword !== user.password) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        await db.query('UPDATE tbl_login1 SET password = ? WHERE id = ?', [hashedPassword, userId]);

        return res.status(200).json({ message: 'Password updated successfully' });

    } catch (err) {
        console.error('Error updating password:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});


module.exports = router;
