import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // 1. State to manage form input
  const [form, setForm] = useState({
    fullName: '',
    jobTitle: '',
    bio: '',
    themeColor: '#4f46e5', // Default color: Indigo
  });

  // 2. Other states: deployment progress, result link, and status message
  const [deploying, setDeploying] = useState(false);
  const [vercelUrl, setVercelUrl] = useState('');
  const [status, setStatus] = useState('');

  // 3. Load saved form from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('formData');
    if (saved) setForm(JSON.parse(saved));
  }, []);

  // 4. Save form to localStorage on change
  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(form));
  }, [form]);

  // 5. Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 6. Generate HTML content based on the form
  const generateHTML = () => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${form.fullName}'s Portfolio</title>
      <style>
        body {
          background-color: ${form.themeColor};
          color: white;
          font-family: 'Segoe UI', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          text-align: center;
        }
        h1 { font-size: 2.5rem; }
        h2 { font-size: 1.5rem; margin-top: 0.5rem; }
        p { max-width: 600px; margin-top: 1rem; font-size: 1rem; }
      </style>
    </head>
    <body>
      <h1>${form.fullName}</h1>
      <h2>${form.jobTitle}</h2>
      <p>${form.bio}</p>
    </body>
    </html>
  `;

  // 7. Deploy the generated HTML to Vercel
  const deployToVercel = async () => {
    setDeploying(true);
    setStatus('Deploying...');

    const html = generateHTML();

    const payload = {
      name: 'portfolio-site',
      files: [{ file: 'index.html', data: html }],
      target: 'production',
    };

    try {
      const res = await axios.post('https://api.vercel.com/v13/deployments', payload, {
        headers: {
          Authorization: `Bearer YOUR_VERCEL_TOKEN_HERE`, // Replace with your token
          'Content-Type': 'application/json',
        },
      });
      setVercelUrl(res.data.url);
      setStatus('✅ Deployment Successful!');
    } catch (err) {
      console.error(err);
      setStatus('❌ Deployment Failed');
    } finally {
      setDeploying(false);
    }
  };

  // 8. Render UI
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Side - Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-5">
          <h2 className="text-2xl font-bold text-gray-800">🌟 Portfolio Generator</h2>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            name="jobTitle"
            placeholder="Job Title"
            value={form.jobTitle}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            name="bio"
            placeholder="Short Bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex items-center gap-3">
            <label className="text-gray-700">Theme Color:</label>
            <input
              type="color"
              name="themeColor"
              value={form.themeColor}
              onChange={handleChange}
              className="w-10 h-10 border rounded-full"
            />
          </div>
          <button
            onClick={deployToVercel}
            disabled={deploying}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            {deploying ? 'Deploying...' : '🚀 Deploy to Vercel'}
          </button>
          {status && <p className="text-gray-600">{status}</p>}
          {vercelUrl && (
            <p className="mt-2 text-blue-600 underline">
              🔗 <a href={`https://${vercelUrl}`} target="_blank" rel="noreferrer">{vercelUrl}</a>
            </p>
          )}
        </div>

        {/* Right Side - Live Preview */}
        <div
          className="rounded-lg shadow-md p-6 flex flex-col justify-center items-center text-white"
          style={{ backgroundColor: form.themeColor }}
        >
          <h1 className="text-3xl font-bold">{form.fullName || 'Your Name'}</h1>
          <h2 className="text-xl mt-2">{form.jobTitle || 'Your Title'}</h2>
          <p className="mt-4 text-center max-w-md">{form.bio || 'Your bio will appear here...'}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
