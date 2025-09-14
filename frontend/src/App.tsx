import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, CircularProgress, List, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fetchDeezerData } from './api/deezer';
import TrackListItem from './components/TrackListItem'; // Import the new component
import './App.css';

interface Track {
  id: number;
  title: string;
  artist: {
    name: string;
  };
  preview: string; // Add preview URL
}

function App() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = debouncedSearchTerm ? debouncedSearchTerm : 'top songs';
        const data = await fetchDeezerData('search', { q: query });
        if (data && data.data) {
          setTracks(data.data);
        } else {
          setTracks([]);
          setError(`No tracks found for '${query}'.`);
        }
      } catch (err) {
        setError("Failed to fetch tracks.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [debouncedSearchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handlePlayPause = (trackId: number) => {
    setPlayingTrackId(prevId => (prevId === trackId ? null : trackId));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Music App
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Music App
        </Typography>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Search for songs or artists"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <List>
            {tracks.map((track) => (
              <TrackListItem
                key={track.id}
                track={track}
                isPlaying={playingTrackId === track.id}
                onPlayPause={handlePlayPause}
                onAudioEnded={() => setPlayingTrackId(null)}
              />
            ))}
          </List>
        )}
      </Container>
    </Box>
  );
}

export default App;
