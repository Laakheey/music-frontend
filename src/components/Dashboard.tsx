import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import SpotifyWebAPi from "spotify-web-api-node";
import TrackSearchResult from "./TrackSearchResult";
import Player from "./Player";

const spotifyWebAPi = new SpotifyWebAPi({
  clientId: import.meta.env.VITE_CLIENT_ID,
});

export type SearchResultType = {
  artist: string;
  title: string;
  uri: string;
  albumUrl: string;
};

const Dashboard = ({ code }: { code: string }) => {
  const accessToken = localStorage.getItem('spotify_token') || useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<
    SearchResultType[] | undefined
  >([]);
  const [selectedMusic, setSelectedMusic] = useState<SearchResultType>();
  const [lyrics, setLyrics] = useState("");
  const [lyricsLoading, setLyricsLoading] = useState(false);

  const chooseTrack = (track: SearchResultType) => {
    console.log("chooseTrackCalled");
    setSelectedMusic(track);
    setSearch("");
    setSearchResult([]);
  };

  useEffect(() => {
    if (!accessToken) return;

    spotifyWebAPi.setAccessToken(accessToken);
  }, [accessToken]);

  const handleSearch = () => {
    if (!search) return setSearchResult([]);

    if (!accessToken) return;

    setLyrics('');

    let cancel = false;

    spotifyWebAPi.searchTracks(search).then((res) => {
      if (cancel) return;
      console.log("spotify web api called");
      setSearchResult(
        res.body.tracks?.items.map((track) => {
          const smallestImage = track.album.images.reduce((smallest, image) => {
            if (smallest.height && image.height) {
              if (image.height < smallest.height) return image;
              return smallest;
            }
            return image;
          });
          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestImage.url,
          };
        })
      );
    });
  };

  useEffect(() => {
    if (!selectedMusic) return;

    setLyricsLoading(true);
    const track = encodeURIComponent(selectedMusic.title);
    const artist = encodeURIComponent(selectedMusic.artist);  
    fetch(`http://localhost:5124/lyrics?track=${track}&artist=${artist}`, {
      method: "GET",
    }).then(async (res) => {
      const data = await res.json();
      console.log("🚀 ~ useEffect ~ data:", data)
      setLyrics(data.lyrics)
    }).finally(() => setLyricsLoading(false));

  }, [selectedMusic]);

  return (
    <div className="container flex flex-col h-screen">
      <nav className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-white text-xl">Music</span>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search"
            className="px-2 py-1 rounded focus:outline-none focus:ring focus:border-blue-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </nav>
      <div className="flex-grow overflow-y-auto px-4">
        {searchResult?.map((track) => (
          <TrackSearchResult
            track={track}
            key={track.uri}
            chooseTrack={() => chooseTrack(track)}
          />
        ))}
        {searchResult?.length === 0 && (
          <div className="text-center whitespace-pre">
            {
              lyricsLoading ? "Lyrics is being loading.." : lyrics
            }
          </div>
        )}
      </div>
      <div className="bg-gray-200 p-4">
        <Player accessToken={accessToken} trackUri={selectedMusic?.uri!} />
      </div>
    </div>
  );
};

export default Dashboard;
