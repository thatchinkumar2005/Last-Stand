export default function playAudio({
  path,
  loop = false,
  onended = null,
  currentTime = 0,
  volume = 1,
}) {
  const audio = new Audio(path);
  audio.autoplay = false;
  audio.loop = loop;
  audio.volume = volume;
  audio.onended = onended;
  audio.pause();
  audio.currentTime = currentTime;
  audio.play();
}
