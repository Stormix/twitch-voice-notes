import { FloatingArrow, arrow, offset, useFloating, useHover, useInteractions } from '@floating-ui/react';
import { BACKEND_URL, CHANNEL_NAME_REGEX } from '@root/src/shared/config';
import { useLocation } from '@root/src/shared/hooks/useLocation';
import useLongPress from '@root/src/shared/hooks/useLongPress';
import useStorage from '@root/src/shared/hooks/useStorage';
import { Logger } from '@root/src/shared/logger';
import userStorage from '@root/src/shared/storages/userStorage';
import { cn } from '@root/src/shared/utils';
import { useMemo, useRef, useState } from 'react';
import { AiOutlineAudioMuted } from 'react-icons/ai';
import { BsRecord2 } from 'react-icons/bs';
import { FaMicrophone, FaTrash } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import { useReactMediaRecorder } from 'react-media-recorder';
import { recordPayloadSchema } from './validation';

const logger = new Logger('VoiceInput');

const VoiceInput = () => {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);
  const { refs, floatingStyles, context } = useFloating({
    placement: 'top',
    middleware: [
      offset(12),
      arrow({
        element: arrowRef,
      }),
    ],
    open: isOpen,
    onOpenChange: setIsOpen,
  });
  const hover = useHover(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const { user, access_token } = useStorage(userStorage);

  const { startRecording, stopRecording, status } = useReactMediaRecorder({
    audio: true,
    onStop: (_, blob) => setRecordedAudio(blob),
  });

  const { href } = useLocation();
  const channel = useMemo(() => {
    return new RegExp(CHANNEL_NAME_REGEX, 'gi').exec(href)?.[1];
  }, [href]);

  const onSend = async () => {
    try {
      const formData = new FormData();

      const payload = {
        channel,
        author: user.login!,
        color: user.color!,
      };

      recordPayloadSchema.parse(payload);

      formData.append('author', user.login!);
      formData.append('channel', channel!);
      formData.append('audio', recordedAudio!);
      formData.append('color', user.color!);

      if (recordedAudio.size > 1024 * 1024 * 5) {
        logger.warn('Audio file too large');
        return;
      }

      try {
        await fetch(`${BACKEND_URL}/record`, {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${btoa(user.login + ':' + access_token)}`,
          },
        });
      } catch (e) {
        // Fail silently
      }
    } catch (e) {
      logger.warn('Failed to send audio');
      console.error(e);
    } finally {
      setRecordedAudio(null);
    }
  };

  const { handlers } = useLongPress(
    {
      onLongPress: () => {
        if (user) startRecording();
      },
      onStop: () => {
        if (status === 'recording' && user) stopRecording();
      },
    },
    500,
  );

  return (
    <div className="flex flex-row gap-2">
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className={cn(
          'flex items-center justify-center rounded-full ease-in duration-200 cursor-pointer transition-colors gap-4',
          {
            'bg-twitch-background p-3 cursor-not-allowed': !user,
            'bg-twitch hover:bg-twitch-dark p-3': user && status !== 'recording',
            'bg-red-500 p-2': status === 'recording',
          },
        )}
        {...handlers}>
        {!user && <AiOutlineAudioMuted className="fill-white w-6 h-6" />}
        {status !== 'recording' && user && !recordedAudio && <FaMicrophone className="fill-twitch-light w-6 h-6" />}
        {status === 'recording' && <BsRecord2 className="fill-white animate-pulse w-8 h-8" />}
        {status === 'stopped' && recordedAudio && <IoSend onClick={onSend} className="fill-white w-6 h-6" />}
      </div>

      {status === 'stopped' && recordedAudio && (
        <div
          className={cn(
            'w-12 flex items-center justify-center rounded-full ease-in duration-200 cursor-pointer transition-colors gap-4 bg-red-500 p-2',
          )}
          onClick={() => setRecordedAudio(null)}>
          <FaTrash className="fill-white w-6 h-6" />
        </div>
      )}

      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className={cn('py-2 px-4 font-sans rounded-md text-center transition-colors', {
            'bg-twitch-background': !user,
            'bg-twitch-light text-twitch fill-twitch-light ': user && status !== 'recording',
            'bg-red-500 text-white fill-red-500 ': status === 'recording',
          })}
          {...getFloatingProps()}>
          <FloatingArrow ref={arrowRef} context={context} />
          {!user && <span>Sign in to send voice notes</span>}
          {status !== 'recording' && user && !recordedAudio && <span>Hold & release to send audio </span>}
          {status === 'recording' && user && <span>Currently recording... Don&apos;t break TOS!</span>}
          {status === 'stopped' && recordedAudio && <span>Click to send audio</span>}
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
