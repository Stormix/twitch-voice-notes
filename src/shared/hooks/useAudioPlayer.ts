import getBlobDuration from 'get-blob-duration';
import { useCallback, useEffect, useRef, useState } from 'react';

type AudioStatus = 'idle' | 'loaded' | 'playing' | 'paused';

type useAudioType = {
  url: string;
};

const useAudioPlayer = ({ url }: useAudioType) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const [status, setStatus] = useState<AudioStatus>('idle');
  const [volume, setVolume] = useState(0.5);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!audio) {
      const elt = new Audio(url);
      elt.volume = volume;
      setAudio(elt);
    }
  }, [audio, url, volume]);

  useEffect(() => {
    const fetchDuration = async () => {
      const durationFetched = await getBlobDuration(url);
      if (durationFetched - 1 > 0) {
        setDuration(durationFetched - 1); // offset difference with audio file
      } else {
        setDuration(durationFetched);
      }
    };
    if (audio) {
      fetchDuration();
    }
  }, [audio, url]);

  useEffect(() => {
    const loadedDataHandler = () => {
      setAudioReady(true);
      if (audio?.duration === Infinity) {
        audio.currentTime = 1e101;
        audio.ontimeupdate = () => {
          if (audio) {
            audio.ontimeupdate = () => {};
            audio.currentTime = 0;
          }
        };
      }
    };

    if (audio) {
      audio.load();
      setStatus('loaded');
      audio.addEventListener('loadeddata', loadedDataHandler);
    }
    return () => {
      audio?.removeEventListener('loadeddata', loadedDataHandler);
    };
  }, [audio, audioReady]);

  useEffect(() => {
    if (audio) {
      const intervalHandler = () => {
        setCurrentTime(audio.currentTime || 0);
      };
      if (status === 'playing') {
        intervalIdRef.current = setInterval(intervalHandler, 300);
      } else {
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
        }
      }
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [status, audio, currentTime, duration]);

  useEffect(() => {
    if (currentTime >= duration) {
      setStatus('loaded');
      setCurrentTime(duration);
    }
    if (intervalIdRef.current && (audio?.ended || audio?.paused)) {
      clearInterval(intervalIdRef.current);
    }
  }, [audio?.ended, audio?.paused, currentTime, duration]);

  useEffect(() => {
    if (audio) {
      audio.volume = volume;
    }
  }, [audio, volume]);

  const play = useCallback(() => {
    if (audio) {
      audio.play();
      setStatus('playing');
    }
  }, [audio]);

  const pause = useCallback(() => {
    if (audio) {
      audio.pause();
      setStatus('paused');
    }
  }, [audio]);

  const handleAudioSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const seekTime = +e.target.value;
      if (typeof audio?.currentTime === 'number') {
        audio.currentTime = seekTime;
        setCurrentTime(seekTime);
        audio.pause();
      }
    },
    [audio],
  );

  const handleSeek = useCallback(
    ({ seekTime }: { seekTime: number }) => {
      if (typeof audio?.currentTime === 'number' && seekTime < duration) {
        audio.currentTime = seekTime;
        setCurrentTime(seekTime);
      } else {
        console.log('seekTime is greater than duration');
      }
    },
    [audio, duration],
  );

  return {
    status,
    play,
    pause,
    handleSeek,
    handleAudioSeek,
    duration,
    currentTime,
    volume,
    setVolume,
  };
};

export default useAudioPlayer;
