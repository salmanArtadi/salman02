// ================================================
// File: /pages/joke.tsx
// ================================================
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';

interface Joke {
  setup: string;
  punchline: string;
}

export default function JokePage() {
  const [joke, setJoke] = useState<Joke | null>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const fetchJoke = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/joke');
      if (response.ok) {
        const data = await response.json();
        setJoke(data);
      }
    } catch (error) {
      console.error('Failed to fetch joke:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJoke();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchJoke();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Layout title="Jokes">
      <div className="flex justify-center items-center h-full">
        <div className="relative w-full max-w-lg p-6 rounded-lg shadow-xl bg-card text-card-foreground">
          <div className="absolute -top-4 left-4 bg-primary text-primary-foreground text-sm font-semibold px-3 py-1 rounded-full">
            celotehan receh..
          </div>
          <div className="flex flex-col space-y-4 pt-4">
            {loading ? (
              <div className="text-center text-muted-foreground">Fetching a joke...</div>
            ) : joke ? (
              <>
                <p className="text-lg font-medium">{joke.setup}</p>
                <p className="text-xl font-bold">{joke.punchline}</p>
              </>
            ) : (
              <div className="text-center text-muted-foreground">No joke found.</div>
            )}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => {
                  fetchJoke();
                  setCountdown(10);
                }}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/80 transition disabled:opacity-50"
                disabled={loading}
              >
                Next Joke
              </button>
              <div className="text-sm text-muted-foreground">Next joke in {countdown}s</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
