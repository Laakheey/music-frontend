import { useEffect, useState } from "react";
import SpotifyWebPlayer from "react-spotify-web-playback";

const Player = ({
  accessToken,
  trackUri,
}: {
  accessToken: string;
  trackUri: string;
}) => {

    const [play, setPlay] = useState(false);

    useEffect(() => setPlay(true), [trackUri])

  return (
    <>
      <SpotifyWebPlayer
        token={accessToken}
        showSaveIcon
        callback={state => {
            if(state.isPlaying) setPlay(false)
        }}
        play={play}
        uris={trackUri ? [trackUri] : []}
      />
    </>
  );
};

export default Player;
