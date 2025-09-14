import React from 'react';
import { ListItem, ListItemText, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import AudioPlayer from './AudioPlayer';

interface Track {
  id: number;
  title: string;
  artist: {
    name: string;
  };
  preview: string;
}

interface TrackListItemProps {
  track: Track;
  isPlaying: boolean;
  onPlayPause: (trackId: number) => void;
  onAudioEnded: () => void;
}

const TrackListItem: React.FC<TrackListItemProps> = ({ track, isPlaying, onPlayPause, onAudioEnded }) => {
  return (
    <ListItem key={track.id} secondaryAction={
      <IconButton edge="end" aria-label="play/pause" onClick={() => onPlayPause(track.id)}>
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
    }>
      <ListItemText primary={track.title} secondary={track.artist.name} />
      <AudioPlayer
        src={track.preview}
        isPlaying={isPlaying}
        onEnded={onAudioEnded}
      />
    </ListItem>
  );
};

export default TrackListItem;
