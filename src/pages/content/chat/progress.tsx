import { cn } from '@root/src/shared/utils';

interface ProgressProps {
  progress: number;
  className?: string;
  onClick?: (progress: number) => void;
  color?: string;
}

const numberOfBars = 28;
const Progress = ({ progress, className, onClick, color }: ProgressProps) => {
  const numberOfFilledBars = Math.floor(numberOfBars * progress);
  return (
    <div className={cn('flex flex-row items-center bg-twitch-background gap-[3px]', className)}>
      {Array.from({ length: numberOfBars }, (_, i) => (
        <div
          key={i}
          style={{
            backgroundColor: i < numberOfFilledBars ? color : undefined,
          }}
          className={cn('h-6 w-2 rounded', {
            'bg-twitch-grey': i >= numberOfFilledBars,
          })}
          onClick={() => onClick?.(i / numberOfBars)}
        />
      ))}
    </div>
  );
};

export default Progress;
