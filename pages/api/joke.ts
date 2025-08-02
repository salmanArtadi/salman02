// ================================================
// File: /pages/api/joke.ts
// ================================================
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch('https://official-joke-api.appspot.com/random_joke');
    if (!response.ok) {
      throw new Error('Failed to fetch joke from external API');
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Joke API error:', error);
    res.status(500).json({ message: 'Error fetching joke' });
  }
}
