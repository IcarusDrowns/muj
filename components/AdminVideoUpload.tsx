// components/AdminVideoUpload.js

import React, { useState } from 'react';
import axios from 'axios';

const AdminVideoUpload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [duration, setDuration] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setthumbnailUrl] = useState('');

  const handleVideoSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/movies/upload', {
        title,
        description,
        genre,
        duration,
        thumbnailUrl,
        videoUrl,
      });
      console.log(response.data);
      // Handle success
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  return (
    <form onSubmit={handleVideoSubmit}>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Title" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Description" />
      <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} required placeholder="Genre" />
      <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} required placeholder="Duration" />
      <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} required placeholder="Video URL" />
      <input type="url" value={thumbnailUrl} onChange={(e) => setthumbnailUrl(e.target.value)} required placeholder="thumbnail URL" />
      <button type="submit">Submit Video</button>
    </form>
  );
};

export default AdminVideoUpload;
