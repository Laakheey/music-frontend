import { SearchResultType } from "./Dashboard";

type TrackSearchResultProps = {
  track: SearchResultType;
  key: string;
  chooseTrack: (track: SearchResultType) => void;
};

const TrackSearchResult = ({ track, chooseTrack }: TrackSearchResultProps) => {
  const handlePlay = () => chooseTrack(track);

  return (
    <div className="flex m-2 items-center cursor-pointer" onClick={handlePlay}>
      <img src={track.albumUrl} alt="album" className="w-64 h-64" />
      <div className="ml-3">
        <div className="">{track.title}</div>
        <div className="text-gray-400">{track.artist}</div>
      </div>
    </div>
  );
};

export default TrackSearchResult;
