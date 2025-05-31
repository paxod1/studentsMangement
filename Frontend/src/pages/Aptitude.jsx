import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TokenRequest } from '../AxiosCreate';
import './Aptitude.css';

function Aptitude() {
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [months, setMonths] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [answers, setAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState([]);

    const loginInfo = useSelector((state) => state.userlogin?.LoginInfo[0]);

    const monthNames = {
        '01': 'January', '02': 'February', '03': 'March', '04': 'April',
        '05': 'May', '06': 'June', '07': 'July', '08': 'August',
        '09': 'September', '10': 'October', '11': 'November', '12': 'December'
    };

    useEffect(() => {
        async function fetchQuestions() {
            setLoading(true);
            try {
                const batchData = await TokenRequest.get(`/student/getdatatraining?student_id=${loginInfo.student_id}`);
                const batchName = batchData.data[0]?.batch;

                const res = await TokenRequest.get(`/student/getAptitude?batchname=${batchName}`);
                const data = res.data;

                setQuestions(data);

                const uniqueMonths = [...new Set(data.map(q => q.month))];
                setMonths(uniqueMonths);
            } catch (err) {
                console.error("Failed to fetch aptitude data", err);
            } finally {
                setLoading(false);
            }
        }

        if (loginInfo?.student_id) {
            fetchQuestions();
        }
    }, [loginInfo]);

    const handleMonthSelect = (month) => {
        setSelectedMonth(month);
        setAnswers({});
        setShowResult(false);
        setWrongAnswers([]);
    };

    const handleOptionChange = (questionId, selectedOption) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: selectedOption
        }));
    };


    const handleSubmit = () => {
        const filtered = questions.filter(q => q.month === selectedMonth);
        let total = 0;
        const wrong = [];

        filtered.forEach(q => {
            if (answers[q.question_id] === q.answer) {
                total += q.mark;
            } else if (answers[q.question_id]) {
                wrong.push({
                    questionId: q.question_id,
                    question: q.question,
                    correctAnswer: q.answer,
                    correctAnswerText: q[`option_${q.answer.toLowerCase()}`],
                    yourAnswer: answers[q.question_id],
                    yourAnswerText: q[`option_${answers[q.question_id].toLowerCase()}`],
                    explanation: q.explanation || '',
                });
            }
        });

        setScore(total);
        setWrongAnswers(wrong);
        setShowResult(true);
    };


    const filteredQuestions = questions.filter(q => q.month === selectedMonth);
    const totalPossibleScore = filteredQuestions.reduce((sum, q) => sum + q.mark, 0);
    const formattedMonth = selectedMonth ? `${monthNames[selectedMonth.split('-')[1]]} ${selectedMonth.split('-')[0]}` : '';

    return (
        <div className="aptitude-container">
            <h2 className="aptitude-title">Aptitude Test</h2>

            {loading && <div className="loading-spinner">Loading...</div>}

            {!loading && !selectedMonth && (
                <div className="month-selection-section">
                    <h3>Select Test Month</h3>
                    <div className="month-grid">
                        {months.map((month, idx) => {
                            const [year, monthNum] = month.split('-');
                            const monthName = monthNames[monthNum] || monthNum;
                            return (
                                <div
                                    key={idx}
                                    className="month-box"
                                    onClick={() => handleMonthSelect(month)}
                                >
                                    <div className="month-icon">
                                        <span className="month-abbr">{monthName.substring(0, 3)}</span>
                                    </div>
                                    <div className="month-details">
                                        <span className="month-name">{monthName}</span>
                                        <span className="month-year">{year}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {selectedMonth && (
                <div className="test-section">
                    <div className="test-header">
                        <h3>Aptitude Test - {formattedMonth}</h3>
                        {!showResult && (
                            <button
                                className="back-btn"
                                onClick={() => {
                                    setSelectedMonth('');
                                    setShowResult(false);
                                }}
                            >
                                ← Back to Months
                            </button>
                        )}
                    </div>

                    {!showResult && filteredQuestions.length > 0 && (
                        <div className="questions-section">
                            {filteredQuestions.map((q, index) => (
                                <div key={q.question_id} className="question-box">
                                    <p className="question-text">
                                        <span className="question-number">{index + 1}.</span>
                                        {q.question}
                                        {q.mark > 1 && <span className="question-mark"> ({q.mark} marks)</span>}
                                    </p>
                                    <div className="options">
                                        {['A', 'B', 'C', 'D'].map(opt => {
                                            const optionText = q[`option_${opt.toLowerCase()}`];
                                            if (!optionText) return null;

                                            return (
                                                <label key={opt} className="option-label">
                                                    <input
                                                        type="radio"
                                                        name={`q${q.question_id}`}
                                                        value={opt}
                                                        checked={answers[q.question_id] === opt}
                                                        onChange={() => handleOptionChange(q.question_id, opt)}
                                                    />
                                                    <span className="option-letter">{opt}.</span>
                                                    <span className="option-text">{optionText}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}

                            <button
                                className="submit-btn"
                                onClick={handleSubmit}
                                disabled={Object.keys(answers).length < filteredQuestions.length}
                            >
                                Submit Answers
                            </button>
                        </div>
                    )}

                    {showResult && (
                        <div className="result-section">
                            <div className={`result-box ${score >= totalPossibleScore * 0.7 ? 'pass' : 'fail'}`}>
                                <h3>Test Result</h3>
                                <div className="score-display">
                                    <div className="score-circle">
                                        <span className="score-value">{score}</span>
                                        <span className="score-total">/{totalPossibleScore}</span>
                                    </div>
                                    <div className="score-percentage">
                                        {Math.round((score / totalPossibleScore) * 100)}%
                                    </div>
                                </div>
                                <div className="result-message">
                                    {score >= totalPossibleScore * 0.7 ? (
                                        <span className="pass-message">Congratulations! You passed the test.</span>
                                    ) : (
                                        <span className="fail-message">Keep practicing! You'll do better next time.</span>
                                    )}
                                </div>
                            </div>
                            {wrongAnswers.length > 0 && (
                                <div className="wrong-answers">
                                    <h4>Questions to Review:</h4>
                                    {wrongAnswers.map((item, idx) => (
                                        <div key={idx} className="wrong-answer-item">
                                            <p className="wrong-question">
                                                <span className="wrong-q-number">{idx + 1}.</span>
                                                {item.question}
                                            </p>

                                            <div className="answer-comparison">
                                                <div className="answer-section correct-section">
                                                    <div className="answer-header">
                                                        <span>Correct Answer:</span>
                                                        <strong className="correct">{item.correctAnswer}. {item.correctAnswerText}</strong>
                                                    </div>
                                               
                                                </div>

                                                <div className="answer-section your-section">
                                                    <div className="answer-header">
                                                        <span>Your Answer:</span>
                                                        <strong className="wrong">{item.yourAnswer}. {item.yourAnswerText}</strong>
                                                    </div>

                                                </div>
                                            </div>

                                            {item.explanation && (
                                                <div className="explanation">
                                                    <span>Explanation:</span>
                                                    <p>{item.explanation}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                className="back-btn center-btn"
                                onClick={() => {
                                    setSelectedMonth('');
                                    setShowResult(false);
                                }}
                            >
                                ← Back to All Tests
                            </button>
                        </div>
                    )}

                    {selectedMonth && !showResult && filteredQuestions.length === 0 && (
                        <div className="no-questions">
                            <p>No questions available for this month.</p>
                            <button
                                className="back-btn"
                                onClick={() => setSelectedMonth('')}
                            >
                                ← Back to Months
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Aptitude;