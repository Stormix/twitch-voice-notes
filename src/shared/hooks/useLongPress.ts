import { useCallback, useEffect, useState } from 'react';

interface IUseLongPress {
  onLongPress: () => void;
  onStop: () => void;
}

const useLongPress = ({ onLongPress: onLongPress, onStop }: IUseLongPress, ms = 300) => {
  const [startLongPress, setStartLongPress] = useState(false);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (startLongPress) {
      timerId = setTimeout(onLongPress, ms);
    } else {
      clearTimeout(timerId);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [onLongPress, ms, startLongPress]);

  const start = useCallback(() => {
    setStartLongPress(true);
  }, []);

  const stop = useCallback(() => {
    setStartLongPress(false);
    onStop();
  }, [onStop]);

  return {
    handlers: {
      onMouseDown: start,
      onMouseUp: stop,
      onMouseLeave: stop,
      onTouchStart: start,
      onTouchEnd: stop,
    },
  };
};

export default useLongPress;
