import { useState, useEffect } from 'react';

interface UseTypingEffectOptions {
  speed?: number; // typing speed in milliseconds per character
  delay?: number; // delay before starting to type in milliseconds
  onComplete?: () => void; // callback when typing is complete
}

export function useTypingEffect(
  text: string,
  options: UseTypingEffectOptions = {}
): { text: string; isComplete: boolean } {
  const { speed = 100, delay = 0, onComplete } = options;
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);

    if (!text) {
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;

    const startTyping = () => {
      const typeNextChar = () => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
          timeoutId = setTimeout(typeNextChar, speed);
        } else {
          setIsComplete(true);
          if (onComplete) {
            onComplete();
          }
        }
      };

      typeNextChar();
    };

    if (delay > 0) {
      timeoutId = setTimeout(startTyping, delay);
    } else {
      startTyping();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [text, speed, delay, onComplete]);

  return { text: displayedText, isComplete };
}

