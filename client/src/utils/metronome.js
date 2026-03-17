export function startMetronome(bpm, callback) {
  // Convert beats per minute to milliseconds per beat
  const interval = (60 / bpm) * 1000;

  // Initial call
  callback();

  // Set interval for subsequent beats
  const id = setInterval(() => {
    callback();
  }, interval);

  return id;
}
