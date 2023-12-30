import { BACKEND_URL, CHANNEL_NAME_REGEX } from '@root/src/shared/config';
import useAudioPlayer from '@root/src/shared/hooks/useAudioPlayer';
import { useLocation } from '@root/src/shared/hooks/useLocation';
import { cn } from '@root/src/shared/utils';
import { format } from 'date-fns';
import { useCallback, useMemo } from 'react';
import { FaPause, FaPlay } from 'react-icons/fa';
import { VoiceNote as IVoiceNote } from '../../background/type';
import Progress from './progress';

interface MessageProps {
  voiceNote: IVoiceNote;
}

const Message = ({ voiceNote }: MessageProps) => {
  const { href } = useLocation();

  const channel = useMemo(() => {
    return new RegExp(CHANNEL_NAME_REGEX, 'gi').exec(href)?.[1];
  }, [href]);

  const formattedTime = useMemo(() => format(new Date(voiceNote.createdAt), 'hh:mm a'), [voiceNote.createdAt]);

  const formatDuration = useCallback((duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const { status, play, pause, handleSeek, duration, currentTime } = useAudioPlayer({
    url: `${BACKEND_URL}/audio?id=${voiceNote.id}`,
  });

  if (voiceNote.channel !== channel) return null;

  return (
    <div className="flex flex-col gap-1 bg-twitch-black py-2 px-8 w-full flex-wrap">
      <div className="flex justify-between items-center w-full">
        <span
          className="px-2 py-1 rounded-md bg-twitch-background"
          style={{
            color: voiceNote.author_color,
          }}>
          {voiceNote.author}
        </span>
        <span className="text-muted">{formattedTime}</span>
      </div>
      <div className="bg-twitch-background rounded-md px-3 py-4 flex flex-row gap-2 items-center">
        <div
          className={cn('border-r-2 border-white/20 px-2')}
          style={{
            color: voiceNote.author_color,
          }}>
          {status === 'playing' ? (
            <FaPause className="w-6 h-6" onClick={pause} />
          ) : (
            <FaPlay className="w-6 h-6" onClick={play} />
          )}
        </div>
        <Progress
          progress={currentTime / duration}
          className="flex-grow"
          color={voiceNote.author_color}
          onClick={progress => {
            handleSeek({ seekTime: progress * duration });
          }}
        />
        <span className="text-muted">
          {status === 'playing' ? formatDuration(currentTime) : formatDuration(duration)}
        </span>
      </div>
    </div>
  );
};

export default Message;
