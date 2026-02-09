import { useEffect, useState } from "react";
import { GetArtistTypes, GetArtistListByFilters } from "../../../wailsjs/go/backend/ArtistBridge";
import { message } from "antd";
import SlidePage from "../../components/SlidePage";
import ArtistDetailPage from "./ArtistDetailPage";
import { formatConcern, getSingerCover } from "../../utils/helper";
import { SkeletonGrid } from "../../components/SkeletonCard";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function ArtistPage() {
  const [categories, setCategories] = useState(null);

  const [area, setArea] = useState(-100);
  const [genre, setGenre] = useState(-100);
  const [sex, setSex] = useState(-100);
  const [index, setIndex] = useState(-100);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [hotList, setHotList] = useState([]);
  const [singerList, setSingerList] = useState([]);

  const [currentArtist, setCurrentArtist] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadArtistList();
  }, [area, genre, sex, index, page]);

  const loadCategories = async () => {
    try {
      const res = await GetArtistTypes();
      const data = typeof res === "string" ? JSON.parse(res) : res;

      console.log("歌手分类列表：", data);

      setCategories(data.data);
    } catch (e) {
      console.error(e);
      message.error("获取歌手分类失败");
    }
  };

  const loadArtistList = async () => {
    try {

      if (page > 1) {
        setLoading(true);
      }

      const res = await GetArtistListByFilters(page, area, genre, sex, index);
      const data = typeof res === "string" ? JSON.parse(res) : res;

      console.log("歌手列表数据：", data);

      const listData = data.data;
      setHotList(listData.hotlist || []);
      setSingerList(listData.singerlist || []);
      setTotal(listData.total || 0);
    } catch (e) {
      console.error(e);
      message.error("获取歌手列表失败");
    } finally {
      setLoading(false);
    }
  };

  const resetPageAndLoad = (setter, value) => {
    setter(value);
    setPage(1);
  };

  


  return (
    <div className="relative flex flex-col h-full overflow-hidden p-4">
      {/* 首屏加载骨架屏 */}
      {loading && singerList.length === 0 && (
        <div className="w-full h-full overflow-y-auto">
          <div className="mb-4 p-4 bg-gray-100 rounded-xl h-32 animate-pulse"></div>
          <SkeletonGrid columns={5} count={15} />
        </div>
      )}

      {/* 分页加载 Loading Spinner */}
      {loading && singerList.length > 0 && <LoadingSpinner />}


      {/* 分类筛选 */}
      {categories && (
        <div className="card p-4 mb-4">
          <p className="text-sm font-bold mb-2">歌手筛选</p>

          {/* 地区 */}
          <FilterRow
            title="地区"
            list={categories.area}
            selected={area}
            onSelect={(v) => resetPageAndLoad(setArea, v)}
          />

          {/* 流派 */}
          <FilterRow
            title="流派"
            list={categories.genre}
            selected={genre}
            onSelect={(v) => resetPageAndLoad(setGenre, v)}
          />

          {/* 性别 */}
          <FilterRow
            title="性别"
            list={categories.sex}
            selected={sex}
            onSelect={(v) => resetPageAndLoad(setSex, v)}
          />

          {/* 首字母 */}
          {/* <FilterRow
            title="首字母"
            list={categories.index}
            selected={index}
            onSelect={(v) => resetPageAndLoad(setIndex, v)}
          /> */}
        </div>
      )}

      {/* 热门歌手 */}
      <div className="card p-4 mb-4">
        <p className="text-sm font-bold mb-3">热门歌手</p>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {hotList.map((artist) => (
            <div className="min-w-[120px]" key={artist.singer_id}>
              <ArtistCard
                artist={artist}
                onClick={() => setCurrentArtist(artist.singer_mid)}
                getSingerCover={getSingerCover}
              />
            </div>
          ))}
        </div>
      </div>


      {/* 歌手列表 */}
      <div className="flex-1 overflow-auto card p-4">
        <p className="text-sm font-bold mb-3">全部歌手</p>

        <div className="grid grid-cols-5 gap-4">
          {singerList.map((artist) => (
            <ArtistCard
              key={artist.singer_id}
              artist={artist}
              onClick={() => setCurrentArtist(artist.singer_mid)}
              getSingerCover={getSingerCover}
            />
          ))}
        </div>

        {/* 加载更多 */}
        {singerList.length < total && (
          <div className="text-center py-6">
            <button
              className="px-4 py-2 bg-warm-primary text-white rounded-lg"
              onClick={() => setPage((p) => p + 1)}
            >
              加载更多
            </button>
          </div>
        )}
      </div>

      {/* 详情页 */}
      <SlidePage show={!!currentArtist}>
        <ArtistDetailPage
          artistMid={currentArtist}
          onBack={() => setCurrentArtist(null)}
        />
      </SlidePage>
    </div>
  );
}

/* ------------------ 子组件：筛选行 ------------------ */
function FilterRow({ title, list, selected, onSelect }) {
  return (
    <div className="flex items-center mb-3">
      <span className="w-16 text-sm text-warm-subtext">{title}</span>
      <div className="flex gap-2 flex-wrap">
        {list.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`px-3 py-1 rounded-lg text-sm ${
              selected === item.id
                ? "bg-warm-primary text-white"
                : "bg-warm-secondary hover:bg-warm-secondary/70"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------ 子组件：歌手卡片 ------------------ */


function ArtistCard({ artist, onClick, getSingerCover }) {
  const pic = getSingerCover(artist.singer_mid);

  return (
    <div
      className="cursor-pointer hover:bg-warm-secondary/40 p-3 rounded-lg transition flex flex-col items-center"
      onClick={onClick}
    >
      <img
        src={pic}
        className="w-24 h-24 rounded-full object-cover shadow mb-2"
      />

      <p className="text-sm font-bold truncate text-center">{artist.singer_name}</p>

      {artist.concernNum && (
        <p className="text-xs text-warm-subtext mt-1">
          {formatConcern(artist.concernNum)}
        </p>
      )}
    </div>
  );
}

