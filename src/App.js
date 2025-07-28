import React, { useState } from 'react';
import './index.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '',
  });

  const [preview, setPreview] = useState('');
  const [deploymentLink, setDeploymentLink] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreview = () => {
    const html = `
      <html>
        <head>
          <title>${formData.name}</title>
          <style>
            body { font-family: Arial; padding: 2rem; background: ${formData.color || '#ffffff'}; }
            h1 { color: #333; }
            p { font-size: 18px; }
          </style>
        </head>
        <body>
          <h1>${formData.name}</h1>
          <p>${formData.description}</p>
        </body>
      </html>
    `;
    setPreview(html);
  };

  const handleDeploy = async () => {
    // Simulated deployment logic (could integrate Vercel API)
    const blob = new Blob([preview], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setDeploymentLink(url);
    alert('Site preview ready!');
  };

  return (
    <div className="container">
      <h1>Auto Website Generator</h1>

      <form onSubmit={(e) => e.preventDefault()}>
        <label>Website Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="My Cool Site"
        />

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="What your website is about..."
        />

        <label>Background Color (e.g. #f0f0f0 or red)</label>
        <input
          type="text"
          name="color"
          value={formData.color}
          onChange={handleChange}
          placeholder="#ffffff"
        />

        <div className="button-group">
          <button type="button" onClick={handlePreview}>Preview</button>
          <button type="button" onClick={handleDeploy}>Deploy</button>
        </div>
      </form>

      {preview && (
        <div className="preview">
          <h2>Live Preview</h2>
          <iframe
            title="Website Preview"
            srcDoc={preview}
            style={{ width: '100%', height: '300px', border: '1px solid #ccc' }}
          ></iframe>
        </div>
      )}

      {deploymentLink && (
        <div className="preview">
          <p>Deployment Preview URL: <a href={deploymentLink} target="_blank" rel="noopener noreferrer">{deploymentLink}</a></p>
        </div>
      )}
    </div>
  );
}

export default App;
