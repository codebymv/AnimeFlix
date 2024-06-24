// import Navbar from '../components/Navbar'
// import Footer from '../components/Footer'
import { useState, useEffect } from "react";
import Schedual from "../components/Schedual";
import Swiper from "../components/Swiper";
import TrendingCards from "../components/TrendingCards";
import Loading from "../components/Loading";
import LatestEpisodes from "../components/LatestEpisodes";
import GenresCard from "../components/GenresCard";
import HomePageApi from "../services/HomePageApi";
import Search from "../services/Search";
import CardsType3 from "../components/CardsType3";
import TopUpcoming from "../components/TopUpcoming";
import EstimatedSchedual from "../components/EstimatedSchedual";
export default function HomePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleClick = (id) => {
    navigate(`/anime/info?id=${encodeURIComponent(id)}`);
  };
  useEffect(() => {
    const getData = async () => {
      const response = await HomePageApi();
      const response2 = await Search();
      setData(response);

      setLoading(false);
    };
    getData();
  }, []);
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <div className="lg:px-6 px-2  text-slate-50 w-full h-auto max-w-[1420px] my-4 mx-auto xl:px-0 sm:px-4  ">
        {/* <Schedual /> */}
        {/* <Navbar /> */}
        <Swiper  banners={data.spotlightAnimes} />
        <div className="text-3xl text-start py-8 text-lavender-web-500">
          Trending
        </div>
        <TrendingCards trendingAnimes={data.trendingAnimes} />
        <div className="w-full lg:flex">
          <div className="  w-full ">
            <div className="text-3xl text-start pt-8 text-lavender-web-500">
              Latest Episodes
            </div>
            <LatestEpisodes latestEpisodes={data.latestEpisodeAnimes} />
          </div>
          {/* <div className="lg:w-1/5 w-full">
            <div className="text-3xl text-start py-8 text-lavender-web-500">
              Genres
            </div>
            <GenresCard genre={data.genres} />
          </div> */}
        </div>
        <div className="grid lg:flex sm:grid-cols-2">
          <div className="lg:w-1/4 sm:1/2">
            <div className="text-3xl text-start py-8 text-lavender-web-500">
              Top Airing
            </div>
            <CardsType3 a={0} b={5} data={data.topAiringAnimes} />
            <div className="text-start text-lg">
              <button className="py-4">
                View More <i className="fa-solid fa-angle-right"></i>
              </button>
            </div>
          </div>
          <div className="lg:w-1/4 sm:1/2">
            <div className="text-3xl text-start py-8 text-lavender-web-500">
              Most Popular
            </div>
            <CardsType3 a={4} b={9} data={data.top10Animes.month} />
            <div className="text-start text-lg">
              <button className="py-4">
                View More <i className="fa-solid fa-angle-right"></i>
              </button>
            </div>
          </div>
          <div className="lg:w-1/4 sm:1/2">
            <div className="text-3xl text-start py-8 text-lavender-web-500">
              Most Favourite
            </div>
            <CardsType3 a={0} b={5} data={data.trendingAnimes} />
            <div className="text-start text-lg">
              <button className="py-4">
                View More <i className="fa-solid fa-angle-right"></i>
              </button>
            </div>
          </div>
          <div className="lg:w-1/4 sm:1/2">
            <div className="text-3xl text-start py-8 text-lavender-web-500">
              Latest Completed
            </div>
            <CardsType3 a={0} b={5} data={data.latestEpisodeAnimes} />
            <div className="text-start text-lg">
              <button className="py-4">
                View More <i className="fa-solid fa-angle-right"> </i>
              </button>
            </div>
          </div>
        </div>
        <div className="  w-full ">
          <div className="text-3xl text-start pt-8 text-lavender-web-500">
            Top Upcoming
          </div>
          <TopUpcoming topUpcoming={data.topUpcomingAnimes} />
        </div>
       
        {/* <Footer /> */}
      </div>
    </>
  );
}
