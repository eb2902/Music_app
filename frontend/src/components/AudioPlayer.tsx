import React, { useEffect, forwardRef } from 'react';

interface AudioPlayerProps {
  src: string;
  isPlaying: boolean;
  onEnded: () => void;
  onPlay: () => void;
  onPause: () => void;
}

const AudioPlayer = forwardRef<HTMLAudioElement, AudioPlayerProps>(
  ({ src, isPlaying, onEnded, onPlay, onPause }, ref) => {
    useEffect(() => {
      const audioElement = (ref as React.RefObject<HTMLAudioElement>)?.current;
      if (audioElement) {
        if (isPlaying) {
          audioElement.play().catch(e => console.error("Error playing audio:", e));
        } else {
          audioElement.pause();
        }
      }
    }, [isPlaying, src, ref]);

    return (
      <audio
        ref={ref}
        src={src}
        onEnded={onEnded}
        onPlay={onPlay}
        onPause={onPause}
      />
    );
  }
);

export default AudioPlayer;
