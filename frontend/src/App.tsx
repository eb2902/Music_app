import React, { useEffect, useState, useRef } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, CircularProgress, List, TextField, InputAdornment, Paper, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { fetchDeezerData } from './api/deezer';
import TrackListItem from './components/TrackListItem';
import AudioPlayer from './components/AudioPlayer';
import './App.css';

interface Track {
  id: number;
  title: string;
  artist: {
    name: string;
  };
  preview: string;
}

function App() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const audioPlayerRef = useRef<HTMLAudioElement>(null);
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

  const handleTrackSelect = (track: Track) => {
    if (currentTrack && currentTrack.id === track.id) {
      // Toggle play/pause for the current track
      if (isPlaying) {
        audioPlayerRef.current?.pause();
      } else {
        audioPlayerRef.current?.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      // Change track
      setCurrentTrack(track);
      setIsPlaying(true); // Auto-play new track
    }
  };

  const handlePlayPause = () => {
    if (currentTrack) {
      if (isPlaying) {
        audioPlayerRef.current?.pause();
      } else {
        audioPlayerRef.current?.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    // Optional: play next song
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
      <Container component="main" sx={{ mt: 4, mb: 12, flexGrow: 1 }}> {/* Add margin-bottom */}
        <Typography variant="h4" component="h1" gutterBottom>
          Discover Music
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
                isPlaying={currentTrack?.id === track.id && isPlaying}
                onTrackSelect={handleTrackSelect}
              />
            ))}
          </List>
        )}
      </Container>

      {currentTrack && (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 2, display: 'flex', alignItems: 'center' }} elevation={3}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">{currentTrack.title}</Typography>
            <Typography variant="caption" color="text.secondary">{currentTrack.artist.name}</Typography>
          </Box>
          <IconButton onClick={handlePlayPause}>
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
        </Paper>
      )}

      {currentTrack && (
        <AudioPlayer
          ref={audioPlayerRef}
          src={currentTrack.preview}
          isPlaying={isPlaying}
          onEnded={handleAudioEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}
    </Box>
  );
}

export default App;
