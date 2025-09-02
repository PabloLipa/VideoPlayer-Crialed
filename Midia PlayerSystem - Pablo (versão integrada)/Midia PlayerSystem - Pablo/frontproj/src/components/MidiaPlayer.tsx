import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Layout, Menu } from 'antd';
import 'tailwindcss/tailwind.css';
import { Header } from 'antd/es/layout/layout';

const API_BASE_URL = "http://localhost:5000/api";

interface Media {
  id: number;
  name: string;
  description: string;
  url: string;
  type: string;
}

const MediaPlayer: React.FC = () => {
  const [playlistId, setPlaylistId] = useState<string>('');
  const [playlist, setPlaylist] = useState<Media[]>([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaylist = useCallback(async () => {
    if (!playlistId) return;
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/playlists/${playlistId}/media`);
      if (!response.ok) {
        throw new Error('Playlist não encontrada ou erro na API.');
      }
      const data: Media[] = await response.json();
      setPlaylist(data);
      if (data.length > 0 && currentMediaIndex >= data.length) {
        setCurrentMediaIndex(0);
      }
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setPlaylist([]);
    } finally {
      setLoading(false);
    }
  }, [playlistId, currentMediaIndex]);

  useEffect(() => {
    fetchPlaylist();
    const interval = setInterval(fetchPlaylist, 5000);
    return () => clearInterval(interval);
  }, [fetchPlaylist]);

  useEffect(() => {
    if (playlist.length === 0) return;

    const timer = setTimeout(() => {
      setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % playlist.length);
    }, 10000);

    return () => clearTimeout(timer);
  }, [currentMediaIndex, playlist]);

  const currentMedia = playlist[currentMediaIndex];

  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center justify-between bg-white px-8 shadow-sm">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold m-0 text-gray-800">Media Player</h1>
        </div>
      </Header>
      <div className="flex flex-col items-center justify-center p-4 font-sans flex-grow">
        <div className="w-full max-w-4xl p-6 bg-white rounded-xl shadow-lg flex flex-col items-center">
          <div className="w-full mb-4 flex space-x-2">
            <Input
              className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ID da Playlist (ex: 1)"
              value={playlistId}
              onChange={(e) => setPlaylistId(e.target.value)}
            />
            <Button
              onClick={fetchPlaylist}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Carregar Playlist
            </Button>
          </div>
          {loading && <p className="text-blue-500">Carregando...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && playlist.length === 0 && playlistId && (
            <p className="text-gray-500">Nenhuma mídia encontrada nesta playlist.</p>
          )}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-200 shadow-md transition-opacity duration-1000">
            {currentMedia && (
              <div className="w-full h-full flex items-center justify-center animate-fadeIn">
                {currentMedia.type === 'video' ? (
                  <video
                    key={currentMedia.url}
                    src={currentMedia.url}
                    className="w-full h-full object-contain"
                    autoPlay
                    muted
                    loop
                  />
                ) : (
                  <img
                    key={currentMedia.url}
                    src={currentMedia.url}
                    alt={currentMedia.name}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            )}
          </div>
          {currentMedia && (
            <div className="mt-4 text-center">
              <h2 className="text-2xl font-semibold">{currentMedia.name}</h2>
              <p className="text-gray-600">{currentMedia.description}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MediaPlayer;
