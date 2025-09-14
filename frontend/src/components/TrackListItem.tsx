import React from 'react';
import { ListItem, ListItemText, IconButton, ListItemButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

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
  onTrackSelect: (track: Track) => void;
}

const TrackListItem: React.FC<TrackListItemProps> = ({ track, isPlaying, onTrackSelect }) => {
  return (
    <ListItem
      key={track.id}
      disablePadding
      secondaryAction={
        <IconButton edge="end" aria-label="play/pause" onClick={() => onTrackSelect(track)}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
      }
    >
      <ListItemButton onClick={() => onTrackSelect(track)}>
        <ListItemText primary={track.title} secondary={track.artist.name} />
      </ListItemButton>
    </ListItem>
  );
};

export default TrackListItem;
