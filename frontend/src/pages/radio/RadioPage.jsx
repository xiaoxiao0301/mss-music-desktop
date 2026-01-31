import { useState, useEffect } from "react";
import SlidePage from "../../components/SlidePage";
import RadioDetailPage from "./RadioDetailPage";
import { GetRadioCategories } from "../../../wailsjs/go/backend/RadioBridge";
import { message } from "antd";

export default function RadioPage() {
  const [categories, setCategories] = useState([]);          // 所有分类组
  const [currentGroup, setCurrentGroup] = useState(null);    // 当前选中的分类组
  const [currentDetail, setCurrentDetail] = useState(null);  // 当前电台详情

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await GetRadioCategories();
      const data = typeof res === "string" ? JSON.parse(res) : res;

      if (data.code !== 20000) {
        message.error("获取电台分类失败");
        return;
      }
      console.log("电台分类数据：", data.data);
      setCategories(data.data);

      // 默认选中第一个分类
      if (data.data.length > 0) {
        setCurrentGroup(data.data[0]);
      }

    } catch (e) {
      console.error(e);
      message.error("网络连接超时");
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">

      {/* 列表页（淡出） */}
      <div
        className={`transition-opacity duration-300 ${
          currentDetail ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* 分类 Tabs */}
        <div className="card p-4 mb-4">
          <p className="text-sm font-bold mb-2">电台分类</p>
          <div className="flex gap-2 flex-wrap">
            {categories.map((group) => (
              <button
                key={group.id}
                onClick={() => setCurrentGroup(group)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  currentGroup?.id === group.id
                    ? "bg-warm-primary text-white"
                    : "bg-warm-secondary hover:bg-warm-secondary/70"
                }`}
              >
                {group.title}
              </button>
            ))}
          </div>
        </div>

        {/* 电台网格 */}
        <div className="grid grid-cols-4 gap-4 px-4">
          {currentGroup?.list?.map((item) => (
            <div
              key={item.id}
              onClick={() => setCurrentDetail(item)}
              className="card p-3 rounded-xl cursor-pointer hover:bg-warm-secondary/40 transition"
            >
              <img
                src={item.pic_url}
                className="w-full h-40 object-cover rounded-lg shadow"
              />
              <p className="mt-3 font-bold">{item.title}</p>
              <p className="text-sm text-warm-subtext">{item.listenDesc}</p>
              <p className="text-xs text-warm-subtext mt-1">
                收听人数：{item.listenNum}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 详情页（右侧滑入） */}
      <SlidePage show={!!currentDetail}>
        <RadioDetailPage
          radio={currentDetail}
          onBack={() => setCurrentDetail(null)}
        />
      </SlidePage>
    </div>
  );
}
