import { cn } from '@root/src/shared/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaPause, FaPlay } from 'react-icons/fa';
import WaveSurfer from 'wavesurfer.js';
import { VoiceNote as IVoiceNote } from '../../background/type';

interface WaveformProps {
  audio: string;
  voiceNote: IVoiceNote;
}

const Waveform = ({ audio, voiceNote }: WaveformProps) => {
  const containerRef = useRef();
  const waveSurferRef = useRef<WaveSurfer>();
  const [isPlaying, toggleIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const formatDuration = useCallback((duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    const waveSurfer = WaveSurfer.create({
      container: containerRef.current,
      cursorWidth: 0,
      barWidth: 3,
      height: 50,
      waveColor: '#5f5f6a',
      progressColor: voiceNote.author_color,
    });

    waveSurfer.load(audio);

    waveSurfer.on('ready', () => {
      waveSurferRef.current = waveSurfer;
    });

    waveSurfer.on('timeupdate', () => {
      setCurrentTime(waveSurfer.getCurrentTime());
    });

    waveSurfer.on('audioprocess', () => {
      setDuration(waveSurfer.getDuration());
    });

    waveSurfer.on('play', () => {
      toggleIsPlaying(true);
    });

    waveSurfer.on('pause', () => {
      toggleIsPlaying(false);
    });

    return () => {
      waveSurfer.destroy();
    };
  }, [audio, voiceNote.author_color]);

  return (
    <div className="bg-twitch-background rounded-md px-3 py-4 flex flex-row gap-2 items-center h-16">
      <div
        className={cn('border-r-2 border-white/20 px-2')}
        style={{
          color: voiceNote.author_color,
        }}
        onClick={() => waveSurferRef.current?.playPause()}>
        {isPlaying ? <FaPause className="w-6 h-6" /> : <FaPlay className="w-6 h-6" />}
      </div>

      <div className="w-full" ref={containerRef} />
      <span className="text-muted">{isPlaying ? formatDuration(currentTime) : formatDuration(duration)}</span>
    </div>
  );
};

export default Waveform;
