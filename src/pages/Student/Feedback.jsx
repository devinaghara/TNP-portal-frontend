import React, { useState } from 'react';

const Feedback = () => {
    const [feedbackCategory, setFeedbackCategory] = useState('');
    const [feedbackText, setFeedbackText] = useState('');

    const handleCategoryChange = (event) => {
        setFeedbackCategory(event.target.value);
    };

    const handleTextChange = (event) => {
        setFeedbackText(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Implement the logic to submit feedback (e.g., sending it to the backend)
        console.log('Category:', feedbackCategory);
        console.log('Feedback:', feedbackText);
        // Reset the form after submission
        setFeedbackCategory('');
        setFeedbackText('');
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Student Feedback</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="category" className="block text-lg font-medium mb-2">
                        Feedback Category
                    </label>
                    <select
                        id="category"
                        value={feedbackCategory}
                        onChange={handleCategoryChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    >
                        <option value="" disabled>Select a category</option>
                        <option value="placement">Placement Related</option>
                        <option value="facility">Facility Related</option>
                        <option value="tnpCell">TNP Cell Related</option>
                        <option value="general">General Complaint</option>
                        <option value="company">Company Related</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="feedback" className="block text-lg font-medium mb-2">
                        Your Feedback
                    </label>
                    <textarea
                        id="feedback"
                        value={feedbackText}
                        onChange={handleTextChange}
                        rows="6"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Describe your feedback or complaint here..."
                        required
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                >
                    Submit Feedback
                </button>
            </form>
        </div>
    );
};

export default Feedback;
