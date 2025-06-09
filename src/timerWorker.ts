let timeoutId: number | null = null;
self.onmessage = (e: MessageEvent) => {
  const { type, delay } = e.data as { type: string; delay?: number };
  if (type === 'start' && typeof delay === 'number') {
    clearTimeout(timeoutId as number);
    timeoutId = setTimeout(() => {
      self.postMessage({ type: 'expired' });
    }, delay);
  } else if (type === 'stop') {
    clearTimeout(timeoutId as number);
    timeoutId = null;
  }
};
