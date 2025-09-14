import React, { useRef, useEffect } from 'react';

interface AudioPlayerProps {
  src: string;
  isPlaying: boolean;
  onEnded: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, isPlaying, onEnded }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, src]); // Re-run if isPlaying or src changes

  return (
    <audio ref={audioRef} src={src} onEnded={onEnded} />
  );
};

export default AudioPlayer;
