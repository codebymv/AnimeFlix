import { useState, useEffect } from "react";
import Artplayer from "../services/ArtPlayer";
// import VideoPlayer from "../services/VideoPlayer";
import {
  useFetchData,
  useFetchStreamData,
  useAnimeEpisodeData,
  useAnimeEpisodeServerData,
} from "../services/AnimeWatch";
import { PlayIcon } from "@vidstack/react/icons";
// Base styles for media player and provider (~400B).
import "@vidstack/react/player/styles/base.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "../components/Loading";
import TopUpcoming from "../components/TopUpcoming";
import VideoPlayer from "../services/VideoPlayer";
import { watchData } from "../services/userService";

export default function AnimeInfo() {
  const [isLoading, setIsLoading] = useState(true);

  const [loadingVideo, setLoadingVideo] = useState(true);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState(null);
  const { id } = useParams();
  const { data, loading, error } = useFetchData(id);
  const {
    episodeData,
    loading: loading2,
    error: error2,
  } = useAnimeEpisodeData(id);
  const {
    episodeServerData,
    loading: loadingServer,
    error: errorServer,
  } = useAnimeEpisodeServerData(selectedEpisodeId);
  const {
    streamData,
    loading: loadingStreamData,
    error: errorStreamData,
  } = useFetchStreamData(selectedEpisodeId);
  const navigate = useNavigate();

  useEffect(() => {
    if (episodeData && episodeData.episodes.length > 0) {
      setSelectedEpisodeId(episodeData.episodes[0].episodeId);
      setIsLoading(false);
    }
  }, [episodeData]);

  useEffect(() => {
  const sendData = async () => {
    const episodeId = selectedEpisodeId;
    const animeId = id;
    console.log(episodeId, animeId);
    await watchData(animeId, episodeId);
  };

  sendData();
}, [selectedEpisodeId, id]);

  const handleClick = () => {
    navigate(`/anime/info?id=${encodeURIComponent(id)}`);
  };
  const classOfDiv = document.querySelector(".overlay");

  const add = () => {
    setIsLoading(true);
    const currentIndex = episodeData.episodes.findIndex(
      (epi) => epi.episodeId === selectedEpisodeId
    );
    if (currentIndex < episodeData.episodes.length - 1) {
      setSelectedEpisodeId(episodeData.episodes[currentIndex + 1].episodeId);
    }
    setIsLoading(false);
  };

  const sub = () => {
    const currentIndex = episodeData.episodes.findIndex(
      (epi) => epi.episodeId === selectedEpisodeId
    );
    if (currentIndex > 0) {
      setSelectedEpisodeId(episodeData.episodes[currentIndex - 1].episodeId);
    }
  };

  if (loading || loading2 || loadingServer || loadingStreamData) {
    return <Loader />;
  }

  if (error || error2 || errorServer || errorStreamData) {
    return <div>Error: {error.message}</div>;
  }

  if (
    !data ||
    !data.anime ||
    !data.anime.info ||
    !episodeData ||
    !episodeData.episodes
  ) {
    return <Loader />;
  }

  const info = data.anime.info;
  const relatedAnime = data.relatedAnimes;
  const recommendedAnime = data.recommendedAnimes;

  const episodes = episodeData.episodes;

  return (
    <div className="text-start lg:px-6 px-4 w-full h-auto max-w-[1420px] my-4  mx-auto xl:px-0 sm:px-4">
      <div className="w-full mx-auto space-x-6 lg:py-10 my-auto lg:flex-row flex-col flex rounded-3xl space-y-4 lg:space-y-0">
        <div className="flex lg:w-3/4 lg:flex-row flex-col-reverse">
          <div className="lg:w-1/4 border-pink-500 max-h-[550px] overflow-auto mostly-customized-scrollbar text-slate-100">
            <p className="border border-gray-900 pl-6 py-2 text-sm">
              List of Episodes
            </p>
            {/* {isLoading && <div className="w-full h-full rounded-t-md bg-gray-900 flex items-center justify-center ">
               
               <span className="  animate-spin ease-linear rounded-full w-10 h-10 border-t-2 border-b-2 border-orange-500 ml-3"></span>
             </div>}
              */}
            {episodes &&
              episodes.map((epi, index) => (
                <div
                  style={{ display: isLoading ? "none" : "flex" }}
                  onClick={() => setSelectedEpisodeId(epi.episodeId)}
                  className={`w-full flex border ${
                    epi.episodeId === selectedEpisodeId
                      ? "text-orange-500 font-semibold"
                      : "" || epi.number % 2 !== 0
                      ? "bg-gray-800"
                      : "bg-gray-900"
                  } border-gray-900 py-3 text-xs`}
                  key={index}
                >
                  <div className="w-1/6 text-center">{epi.number}</div>
                  <div className="w-4/6 line-clamp-1 cursor-pointer">
                    {epi.title}
                  </div>
                  <div
                    className={`w-1/6 ${
                      epi.episodeId === selectedEpisodeId
                        ? "selected-episode"
                        : ""
                    }`}
                  >
                    {epi.episodeId === selectedEpisodeId && (
                      <span
                        className="selected-indicator"
                        aria-label="Selected Episode"
                      >
                        <i className="fas fa-play"></i>
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
          <div className="lg:w-4/5">
            <div>
              {" "}
              {isLoading && (
                <div className="w-full z-10 h-full rounded-t-md bg-gray-900 flex items-center justify-center ">
                  <span className="  animate-spin ease-linear rounded-full w-10 h-10 border-t-2 border-b-2 border-orange-500 ml-3"></span>
                </div>
              )}
              {streamData && (
                <div className="">
                  <VideoPlayer
                    src={streamData.sources[0]?.url}
                    data={streamData}
                  ></VideoPlayer>
                  {/* <Artplayer
                    source={streamData.sources[0]?.url}
                    data={streamData}
                    style={{ width: "full", height: "100%", margin: "0" }}
                    getInstance={(art) => {
                      art.on("ready", () => setLoadingVideo(false));
                      art.on("loadedmetadata", () => setLoadingVideo(false));
                    }}
                  /> */}
                  {/* <VideoPlayer
                    style={{ width: "full", height: "100%", margin: "0" }}
                    src={streamData.sources[0]?.url}
                  /> */}
                </div>
              )}
            </div>
            <div className="w-full font-semibold py-1 bg-gray-900 text-xs text-end">
              <button
                onClick={() => sub()}
                className="bg-orange-200 p-1 m-1 rounded-sm"
              >
                Previous
              </button>
              <button
                onClick={() => add()}
                className="bg-orange-200 p-1 m-1 rounded-sm"
              >
                Next
              </button>
            </div>
            <div className="flex">
              <div className="w-1/4 text-xs bg-orange-300 text-center font-semibold text-gray-800 p-1 rounded-l-md">
                <p className="lg:line-clamp-none line-clamp-3">
                  You are streaming Episode {episodeServerData?.episodeNo}. If
                  the current server doesn&apos;t work, please try other servers
                  beside.
                </p>
              </div>
              <div className="w-3/4 text-xs font-bold bg-gray-600 text-gray-950 p-1 rounded-r-md">
                <div className="h-1/2 border-b-2 flex justify-start items-center border-gray-900 space-x-4">
                  <span>
                    <i className="fas fa-closed-captioning"></i> SUB:
                  </span>
                  <span className="uppercase space-x-2">
                    {episodeServerData?.sub[0]?.serverName && (
                      <span className="bg-orange-200 rounded-sm px-1">
                        {episodeServerData.sub[0].serverName}
                      </span>
                    )}
                    {episodeServerData?.sub[1]?.serverName && (
                      <span className="bg-orange-200 rounded-sm px-1">
                        {episodeServerData.sub[1].serverName}
                      </span>
                    )}
                  </span>
                </div>
                <div className="h-1/2 flex justify-start items-center space-x-5">
                  <span>
                    <i className="fas fa-microphone"></i> DUB:
                  </span>
                  <span className="uppercase space-x-2">
                    {episodeServerData?.dub[0]?.serverName && (
                      <span className="bg-orange-200 rounded-sm px-1">
                        {episodeServerData.dub[0]?.serverName}
                      </span>
                    )}
                    {episodeServerData?.dub[1]?.serverName && (
                      <span className="bg-orange-200 rounded-sm px-1">
                        {episodeServerData.dub[1].serverName}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-1/5 p-0">
          <div className="left pb-2">
            <img
              className="shadow-2xl shadow-blue-500/20 rounded-sm w-32"
              src={info.poster}
              alt="Anime Poster"
            />
          </div>
          <p className="text-3xl line-clamp-2 my-2 text-start text-slate-300">
            {info.name}
          </p>
          <div>
            <div className="text-slate-900 block">
              <div className="info lg:flex text-xs font-semibold py-2">
                <div className="flex text-start">
                  <p className="border-slate-900 border bg-orange-300 rounded-s-sm px-1">
                    {info.stats.rating}
                  </p>
                  <p className="border-slate-900 border bg-orange-100 px-1">
                    <i className="far fa-clock"></i> {info.stats.duration}
                  </p>
                  <p className="border-slate-900 border bg-orange-300 px-1">
                    <i className="fas fa-tv"></i> {info.stats.type}
                  </p>
                  <p className="border-slate-900 border bg-orange-100 rounded-e-sm px-1">
                    {info.stats.quality}
                  </p>
                </div>
                <div className="flex text-start text-slate-900 px-2">
                  <div className="text-nowrap border-slate-900 border bg-orange-300 rounded-s-sm px-1 whitespace-normal">
                    <i className="far fa-closed-captioning"></i>{" "}
                    {info.stats.episodes.sub}
                  </div>
                  {info.stats.episodes.dub && (
                    <div className="border-slate-900 border bg-orange-100 rounded-e-sm px-1">
                      <i className="fas fa-microphone"></i>{" "}
                      {info.stats.episodes.dub}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="right text-start flex flex-col py-2 text-xs text-slate-300 gap-4">
            <div>
              <p className="italic">Overview:</p>
              <p className="line-clamp-3">{info.description}</p>
            </div>
            <div>
              AnimeFlix is a demonstration website that I have developed to
              showcase my skills and abilities. This project is intended purely
              for educational and portfolio purposes. I do not intend to
              monetize, earn money, or derive any financial benefit from this
              website.
            </div>
          </div>
          <div className="border my-2 border-orange-300 bg-orange-100 w-fit text-xs p-1 rounded-sm">
            <button onClick={() => handleClick()}>View Detail</button>
          </div>
        </div>
      </div>
      {relatedAnime && (
        <div
          onClick={() => handleClick(relatedAnime[0].id)}
          className="lg:w-3/12 pt-8  "
        >
          <p className="text-3xl text-start text-slate-50">Related Anime</p>
          <div className="border flex space-x-3 border-slate-600 rounded-lg shadow h-24 p-2 mt-4">
            <div className=" w-fit h-full">
              <img
                className=" rounded h-full "
                src={relatedAnime[0].poster}
                alt="relatedAnime poster"
              />
            </div>
            <div className="text-slate-50">
              <p className="text-start   line-clamp-2">
                {relatedAnime[0].name}
              </p>
              <div className="flex gap-4">
                <p>{relatedAnime[0].type} </p>
                <div className="flex text-slate-900">
                  <p className="text-nowrap border-slate-100 border bg-orange-300  rounded-s-lg px-1 whitespace-normal">
                    <i className="far fa-closed-captioning "> </i>{" "}
                    {relatedAnime[0].episodes.dub}{" "}
                  </p>
                  <p className="order-slate-100 border bg-orange-100  rounded-e-lg  px-1">
                    <i className="fas fa-microphone"></i>{" "}
                    {relatedAnime[0].episodes.sub}{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="  w-full ">
        <div className="text-3xl text-start pt-8 text-lavender-web-500">
          Recommended Anime
        </div>
        <TopUpcoming topUpcoming={recommendedAnime} />
      </div>
    </div>
  );
}
