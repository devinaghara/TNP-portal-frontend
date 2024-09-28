import React, { useState, useEffect } from 'react';

const AddResource = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);
  const [resources, setResources] = useState([]);

  // Fetch resources from the backend
  useEffect(() => {
    fetch('/api/resources')
      .then((response) => response.json())
      .then((data) => setResources(data))
      .catch((error) => console.error('Error fetching resources:', error));
  }, []);

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('file', file);

    // Send file and form data to the backend
    fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        alert('File uploaded successfully');
        setResources((prevResources) => [...prevResources, data.resource]); // Add new resource to the list
        setTitle('');
        setDescription('');
        setCategory('');
        setFile(null);
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
      });
  };

  return (
    <div className="max-w-lg p-6">
      <h1 className="text-2xl font-bold mb-4">Add Resource</h1>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            id="title"
            className="w-full border border-gray-300 p-2 rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter document title"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
          <textarea
            id="description"
            className="w-full border border-gray-300 p-2 rounded-md"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a brief description"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
          <select
            id="category"
            className="w-full border border-gray-300 p-2 rounded-md"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="lecture">Lecture Notes</option>
            <option value="assignment">Assignment</option>
            <option value="research">Research Paper</option>
          </select>
        </div>

        <div>
          <label htmlFor="file" className="block text-sm font-medium mb-1">Upload File</label>
          <input
            type="file"
            id="file"
            className="w-full border border-gray-300 p-2 rounded-md"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Resource
        </button>
      </form>

      {/* Show previously uploaded resources */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Previously Uploaded Resources</h2>
        {resources.length === 0 ? (
          <p>No resources uploaded yet.</p>
        ) : (
          <ul className="space-y-4">
            {resources.map((resource, index) => (
              <li key={index} className="border border-gray-300 p-4 rounded-md">
                <h3 className="font-bold">{resource.title}</h3>
                <p>{resource.description}</p>
                <p className="text-sm text-gray-600">Category: {resource.category}</p>
                <a
                  href={resource.fileUrl} // Backend should provide the file URL
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddResource;
