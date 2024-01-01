import { BACKEND_URL, CHANNEL_NAME_REGEX } from '@root/src/shared/config';
import { useLocation } from '@root/src/shared/hooks/useLocation';
import { format } from 'date-fns';
import { useMemo } from 'react';
import { VoiceNote as IVoiceNote } from '../../background/type';
import Waveform from './waveform';

interface MessageProps {
  voiceNote: IVoiceNote;
}

const Message = ({ voiceNote }: MessageProps) => {
  const { href } = useLocation();

  const channel = useMemo(() => {
    return new RegExp(CHANNEL_NAME_REGEX, 'gi').exec(href)?.[1];
  }, [href]);

  const formattedTime = useMemo(() => format(new Date(voiceNote.createdAt), 'hh:mm a'), [voiceNote.createdAt]);

  if (voiceNote.channel !== channel) return null;

  return (
    <div className="flex flex-col gap-1 bg-twitch-black py-2 px-8 w-full flex-wrap">
      <div className="flex justify-between items-center w-full">
        <span
          className="px-2 py-1 rounded-md bg-twitch-background font-medium"
          style={{
            color: voiceNote.author_color,
          }}>
          {voiceNote.author}
        </span>
        <span className="text-muted">{formattedTime}</span>
      </div>
      <Waveform audio={`${BACKEND_URL}/audio?id=${voiceNote.id}`} voiceNote={voiceNote} />
    </div>
  );
};

export default Message;
