import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import { Plus, Trash2, Link } from 'lucide-react';

const AddResource = () => {
  const [subject, setSubject] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [resources, setResources] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for the POST request

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate the Google Drive link
    if (!driveLink.match(/^https:\/\/(drive\.google\.com|docs\.google\.com)/)) {
      setError('Invalid Google Drive link');
      return;
    }

    const newResource = {
      subject,
      driveLink,
    };

    try {
      setLoading(true);
      console.log(newResource)
      // Send POST request to your backend API
      const response = await axios.post('http://localhost:3003/resource/add', {
        subject:subject,
        driveLink:driveLink
      }, {
        withCredentials: true,
        
      });

      if (response.data.success) {
        // Update the resources list locally
        setResources((prev) => [
          ...prev,
          { id: response.data.resourceId, ...newResource },
        ]);
        setSubject('');
        setDriveLink('');
      } else {
        setError(response.data.message || 'Failed to add resource');
      }
    } catch (error) {
      console.error('Error adding resource:', error);
      setError('An error occurred while adding the resource');
    } finally {
      setLoading(false);
    }
  };

  const deleteResource = (id) => {
    setResources((prev) => prev.filter((resource) => resource.id !== id));
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-8">
      <div className="flex items-center justify-center mb-6">
        <Plus className="mr-2 text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-800">Study Resources Hub</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200"
            placeholder="Enter subject name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Resource Link</label>
          <input
            type="url"
            value={driveLink}
            onChange={(e) => setDriveLink(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200"
            placeholder="Paste Google Drive link"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
        >
          {loading ? 'Adding...' : <><Plus className="mr-2" /> Add Resource</>}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
          <Link className="mr-2 text-blue-500" />
          Uploaded Resources
        </h3>

        {resources.length === 0 ? (
          <div className="text-center text-gray-500 p-4 bg-gray-50 rounded-md">
            No resources uploaded yet
          </div>
        ) : (
          <div className="space-y-3">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="bg-gray-50 p-4 rounded-lg flex justify-between items-center hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-800">{resource.subject}</p>
                  <a
                    href={resource.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-sm hover:underline flex items-center"
                  >
                    <Link className="mr-1 w-4 h-4" /> Open Resource
                  </a>
                </div>
                <button
                  onClick={() => deleteResource(resource.id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-full"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddResource;
