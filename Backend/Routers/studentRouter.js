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
            const querytofindTainingid = 'SELECT * FROM tbl_training WHERE student_id =? '
            const [results2] = await db.query(querytofindTainingid, [results1[0].student_id]);
            console.log("finding trainning id>>>", results2[0].training_id);

            const token = jwt.sign({ id: user.id }, process.env.seckey, { expiresIn: '100d' });
            console.log("login sucess");
            return res.status(200).json({ student_id: results1[0].student_id, token, training_id: results2[0].training_id });
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
    const { training_id } = req.query;
    if (!training_id) {
        return res.status(400).json('training_id is required');
    }
    const parsedStudentId = parseInt(training_id);
    if (isNaN(parsedStudentId)) {
        return res.status(400).json('Invalid training_id');
    }
    const query = 'SELECT * FROM tbl_review WHERE training_id = ?';
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
    const { training_id } = req.query;
    if (!training_id) {
        return res.status(400).json('training_id is required');
    }
    const parsedStudentId = parseInt(training_id);
    if (isNaN(parsedStudentId)) {
        return res.status(400).json('Invalid training_id');
    }
    const query = 'SELECT * FROM tbl_projects WHERE training_id = ?';
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
        return res.status(400).json('training_id is required');
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
    const { training_id } = req.query;
    if (!training_id) {
        return res.status(400).json('training_id is required');
    }
    const parsedStudentId = parseInt(training_id);
    if (isNaN(parsedStudentId)) {
        return res.status(400).json('Invalid training_id');
    }
    const query = 'SELECT * FROM tbl_tasks WHERE training_id = ?';
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
    const { training_id } = req.query;
    if (!training_id) {
        return res.status(400).json('training_id is required');
    }
    const parsedStudentId = parseInt(training_id);
    if (isNaN(parsedStudentId)) {
        return res.status(400).json('Invalid training_id');
    }
    const query = 'SELECT * FROM tbl_training WHERE training_id = ?';
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
    const { training_id, year, month } = req.query;
    if (!training_id) {
        return res.status(400).json('training_id is required');
    }
    const parsedStudentId = parseInt(training_id);
    if (isNaN(parsedStudentId)) {
        return res.status(400).json('Invalid training_id');
    }
    let query = 'SELECT * FROM tbl_attendance WHERE training_id = ?';
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
    const { training_id } = req.query;
    if (!training_id) {
        return res.status(400).json('student_id is required');
    }
    const parsedStudentId = parseInt(training_id);
    if (isNaN(parsedStudentId)) {
        return res.status(400).json('Invalid student_id');
    }
    const query = 'SELECT * FROM tbl_bill WHERE training_id = ?';
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
    const { training_id } = req.query;  // Get student_id from query parameters
    console.log(req.query);

    if (!training_id) {
        return res.status(400).json('training_id is required');
    }

    const query = 'SELECT * FROM tbl_student_messages WHERE training_id = ?';  // Change the filter to student_id
    console.log('Fetching announcements for training_id:', training_id);

    try {
        const [results] = await db.query(query, [training_id]);
        console.log(results);

        if (results.length === 0) {
            return res.status(404).json('No announcements found for this training');
        }
        return res.status(200).json(results);  // Send results back as JSON
    } catch (err) {
        console.error("Query execution error:", err.message);
        return res.status(500).json({ error: err.message });
    }
});


// exam aptitude data collect 
router.get('/getAptitude', verifyToken, async (req, res) => {
    const { batchname } = req.query;
    console.log("from get aptitude", batchname);

    if (!batchname) {
        return res.status(400).json('batchname is required');
    }
    const query = 'SELECT * FROM tbl_aptitude WHERE batch = ?';
    try {
        console.log("hi");

        const [results] = await db.query(query, [batchname]);
        console.log("hi");
        console.log(results);

        if (results.length === 0) {
            console.log("hi");
            return res.status(404).json('No Apitutde found for this batch');
        }
        return res.status(200).json(results);
    } catch (err) {
        console.error("Query execution error:", err.message);
        return res.status(500).json({ error: err.message });
    }
});

// Add aptitude mark for a student
router.post('/addaptitudemark', verifyToken, async (req, res) => {
    const { student_id, aptitude, month } = req.body;
    console.log("Received body:", req.body);

    //  Updated validation (allows 0 as valid value)
    if (
        student_id === undefined ||
        aptitude === undefined ||
        month === undefined
    ) {
        return res.status(400).json('student_id, aptitude, and month are required');
    }

    const parsedStudentId = parseInt(student_id);
    const parsedMark = parseFloat(aptitude);

    if (isNaN(parsedStudentId) || isNaN(parsedMark)) {
        return res.status(400).json('Invalid student_id or aptitude');
    }

    const query = `
        INSERT INTO tbl_review (student_id, aptitude, month)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            aptitude = VALUES(aptitude),
            month = VALUES(month)
    `;

    try {
        const [result] = await db.query(query, [parsedStudentId, parsedMark, month]);
        return res.status(200).json({ message: 'Aptitude mark saved successfully' });
    } catch (err) {
        console.error("Database insert error:", err.message);
        return res.status(500).json({ error: err.message });
    }
});
const ftp = require("basic-ftp");
const multer = require('multer');

// Multer memory storage
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 30 * 1024 * 1024 }, // 30 MB
    // No file filter - accept all file types
});

// FTP Upload Function (unchanged)
async function uploadToFTP(fileBuffer, filename) {
    const client = new ftp.Client();
    try {
        await client.access({
            host: "ftp.techwingsys.com",
            user: "test2@techwingsys.com",
            password: "9995400671@Test2",
            secure: false
        });

        try {
            await client.ensureDir("billtws/uploads/task");
        } catch (dirError) {
            console.log("Directory already exists or couldn't be created");
        }

        const stream = require('stream');
        const bufferStream = new stream.PassThrough();
        bufferStream.end(fileBuffer);

        await client.uploadFrom(bufferStream, filename);
        console.log("File uploaded to FTP!");
        return true;
    } catch (err) {
        console.error("FTP upload failed:", err);
        throw err;
    } finally {
        client.close();
    }
}

// Task Submission Route (unchanged except for file size limit)
router.post('/submit-task', verifyToken, upload.single('file'), async (req, res) => {
    const { task_id, description, student_id, training_id } = req.body;

    if (!task_id || !description) {
        return res.status(400).json({ message: 'Task ID and description are required' });
    }

    try {
        // Check if already submitted
        const [existingSubmission] = await db.query(
            'SELECT * FROM tbl_taskupload WHERE task_id = ? AND student_id = ?',
            [task_id, student_id]
        );
        if (existingSubmission.length > 0) {
            return res.status(409).json({ message: 'You have already submitted this task.' });
        }

        // Upload file to FTP
        let file = null;
        if (req.file) {
            file = req.file.originalname;
            await uploadToFTP(req.file.buffer, file);
        }

        // Save submission record to DB
        const submissionQuery = `
            INSERT INTO tbl_taskupload
            (task_id, student_id, description, file,training_id, created_at) 
            VALUES (?, ?, ?, ?,?, NOW())
        `;
        const [submissionResult] = await db.query(submissionQuery, [task_id, student_id, description, file, training_id]);

        res.status(201).json({
            message: 'Task submitted successfully',
            submissionId: submissionResult.insertId
        });

    } catch (err) {
        console.error('Task submission error:', err);
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ message: 'File size must be less than 30MB' });
        }
        res.status(500).json({ message: 'Failed to submit task', error: err.message });
    }
});

// get ad
router.get('/getad', async (req, res) => {
  const query = 'SELECT * FROM tbl_popup';

  try {
    const [results] = await db.query(query); 

    if (results.length === 0) {
      return res.status(404).json('Data not found');
    }

    return res.status(200).json(results);
  } catch (err) {
    console.error("Query execution error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});


// get banner
router.get('/getbanner', async (req, res) => {
  const query = 'SELECT * FROM tbl_banner';

  try {
    const [results] = await db.query(query); 

    if (results.length === 0) {
      return res.status(404).json('Data not found');
    }

    return res.status(200).json(results);
  } catch (err) {
    console.error("Query execution error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});



module.exports = router;
