import React, { useState } from 'react';
import axios from 'axios';
import './TaskReply.css';
import { TokenRequest } from '../AxiosCreate';
import { useSelector } from 'react-redux';

function TaskReply({ task }) {
  const logininfom = useSelector((state) => state.userlogin?.LoginInfo[0]);

  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ text: '', isError: false });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check if file is a zip file
      if (!selectedFile.name.toLowerCase().endsWith('.zip')) {
        setSubmitMessage({ text: 'Only .zip files are allowed', isError: true });
        e.target.value = ''; // Clear the file input
        return;
      }
      setFile(selectedFile);
      setSubmitMessage({ text: '', isError: false });
    }
  };

  // submiting the file and datay
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task || !task.task_id) {
      setSubmitMessage({ text: 'Task data not available', isError: true });
      return;
    }

    if (!description) {
      setSubmitMessage({ text: 'Description is required', isError: true });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage({ text: '', isError: false });

    try {
      const formData = new FormData();
      formData.append('task_id', task.task_id);
      formData.append('description', description);
      formData.append('student_id', logininfom.student_id)
      if (file) {
        formData.append('file', file); // Note: using 'file' to match your backend's single file upload
      }

      const response = await TokenRequest.post('/student/submit-task', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you use token auth
        },
      });

      setSubmitMessage({ text: 'Task submitted successfully!', isError: false });
      setTimeout(() => {
        setIsOpen(false);
        setDescription('');
        setFile(null);
      }, 1500);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitMessage({
        text: error.response?.data?.message || 'Failed to submit task',
        isError: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="upload-button"
      >
        Upload
      </button>

      {isOpen && (
        <div className="modal-overlay">
          <div className="task-reply-modal">
            <div className="modal-header">
              <h3>Submit Task: {task?.task_description || 'Unknown Task'}</h3>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setDescription('');
                  setFile(null);
                  setSubmitMessage({ text: '', isError: false });
                }}
                className="close-button"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="task-reply-form">
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Describe your submission..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="file">Upload ZIP File:</label>
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  accept=".zip"
                />
                <small>Only .zip files allowed. Max file size: 10MB.</small>
              </div>

              {file && (
                <div className="file-preview">
                  <h4>Selected File:</h4>
                  <ul>
                    <li>{file.name} ({Math.round(file.size / 1024)} KB)</li>
                  </ul>
                </div>
              )}

              {submitMessage.text && (
                <div className={`submit-message ${submitMessage.isError ? 'error' : 'success'}`}>
                  {submitMessage.text}
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setDescription('');
                    setFile(null);
                    setSubmitMessage({ text: '', isError: false });
                  }}
                  disabled={isSubmitting}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !description}
                  className="submit-button"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskReply;