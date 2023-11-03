// pages/api/movies/upload.js

import { getSession } from 'next-auth/react';
import prismadb from '@/libs/prismadb'; // Ensure this path is correct

export default async function uploadHandler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  // Check if the user is authenticated and has the 'admin' role
  const session = await getSession({ req });
  if (!session || session.user.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Extract video details from the request body
    const { title, description, genre, duration, videoUrl, thumbnailUrl } = req.body;

    // Validate the input
    if (!title || !description || !genre || !duration || !videoUrl || !thumbnailUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Save the video details in the database
    const newVideo = await prismadb.movie.create({
      data: {
        title,
        description,
        genre,
        duration,
        videoUrl,
        thumbnailUrl,
        // Add other fields as necessary
      },
    });

    // Respond with the created video details
    return res.status(201).json(newVideo);
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
