import React, { useEffect, useState } from "react";
import { message, Input, Modal, Empty } from "antd";
import { PlusOutlined, PlayCircleOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  GetUserPlaylistsWithSongLists,
  CreateUserPlaylist,
  DeleteUserPlaylist
} from "../../../wailsjs/go/backend/PlaylistBridge";
import { normalizeJson } from "../../utils/helper";
import { useMusicPlayer } from "../../context/MusicContext";

export default function MyPlaylistsPage({ onBack, pushPage }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const { playTrackWithURL } = useMusicPlayer();

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      const res = await GetUserPlaylistsWithSongLists();
      const data = normalizeJson(res);
      if (data.code != 20000) {
          message.error("加载歌单失败");
      }
      console.log("load user playlist:", data.data);
      setPlaylists(data.data || []);
    } catch (err) {
      console.error("Failed to load playlists:", err);
      message.error("加载歌单失败");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      message.warning("请输入歌单名称");
      return;
    }

    try {
      const res = await CreateUserPlaylist(newPlaylistName, newPlaylistDescription, "");
      const data = normalizeJson(res);
      if (data.code === 20000) {
        message.success("歌单创建成功");
        setNewPlaylistName("");
        setNewPlaylistDescription("");
        setShowCreateModal(false);
        await loadPlaylists();
      } else {
        message.error("创建歌单失败");
      }
    } catch (err) {
      console.error("Failed to create playlist:", err);
      message.error("创建歌单失败");
    }
  };

  const handleDeletePlaylist = (playlist) => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除歌单「${playlist.name}」吗？此操作不可恢复。`,
      okText: "删除",
      okType: "danger",
      cancelText: "取消",
      async onOk() {
        try {
          const res = await DeleteUserPlaylist({id: playlist.id});
          const data = normalizeJson(res);
          if (data.code != 20000) {
            message.error("删除失败");
          } 
          message.success("删除成功");
          await loadPlaylists();
        } catch (err) {
          console.error("Failed to delete playlist:", err);
          message.error("删除歌单失败");
        }
      }
    });
};


  const handlePlaylistClick = (playlist) => {
    // const playlistId = getPlaylistId(playlist);
    // if (!playlistId) {
    //   message.error("无法识别歌单ID");
    //   return;
    // }
    // pushPage({
    //   type: "playlistDetail",
    //   playlistId: String(playlistId),
    //   initialData: playlist?.isDaily ? playlist : null,
    //   playlistName: getPlaylistName(playlist)
    // });
    console.log(90, playlist);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-auto">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-warm-divider">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">我的歌单</h1>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-warm-primary text-white rounded-lg hover:opacity-90 transition"
        >
          <PlusOutlined />
          新建歌单
        </button>
      </div>

      {/* 歌单列表 */}
      {loading ? (
        <div className="flex items-center justify-center flex-1">
          <div className="text-warm-subtext">加载中...</div>
        </div>
      ) : playlists?.length === 0 ? (
        <Empty
          description="还没有歌单，创建一个吧"
          style={{ marginTop: "60px" }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.playlist.id}
              playlist={playlist.playlist}
              songs={playlist.songs}
              onPlaylistClick={handlePlaylistClick}
              songCount={playlist.count}
              handleDeletePlaylist={handleDeletePlaylist}
            />
          ))}
        </div>
      )}

      {/* 创建歌单对话框 */}
      <Modal
        title="创建新歌单"
        open={showCreateModal}
        onOk={handleCreatePlaylist}
        onCancel={() => {
          setShowCreateModal(false);
          setNewPlaylistName("");
          setNewPlaylistDescription("");
        }}
        okText="创建"
        cancelText="取消"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">歌单名称</label>
            <Input
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="请输入歌单名称"
              onPressEnter={handleCreatePlaylist}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">描述（可选）</label>
            <Input.TextArea
              value={newPlaylistDescription}
              onChange={(e) => setNewPlaylistDescription(e.target.value)}
              placeholder="请输入歌单描述"
              rows={3}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* 歌单卡片组件 */
function PlaylistCard({
  playlist,
  onPlaylistClick,
  songs,
  songCount,
  handleDeletePlaylist
}) {

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-4 border border-warm-divider/40">
      {/* 封面区域 */}
      <div className="relative mb-4 pb-4 border-b border-warm-divider/40 group">
        <div className="w-full aspect-square bg-gradient-to-br from-warm-primary/20 to-warm-secondary/20 rounded-lg flex items-center justify-center overflow-hidden relative">
          <div className="text-4xl opacity-30">♪</div>

          {/* 悬停时显示操作按钮 */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition">
            <button
              onClick={() => onPlaylistClick(playlist)}
              className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center hover:bg-white"
            >
              <PlayCircleOutlined className="text-xl text-gray-800" />
            </button>
          </div>
        </div>
      </div>

      {/* 信息区域 */}
      <div>
        <h3 className="font-semibold text-gray-800 truncate">{playlist.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {playlist.description}
        </p>
        <p className="text-xs text-gray-400 mt-2">{songCount} 首歌曲</p>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-warm-divider/40">
        <button
          onClick={() => onPlaylistClick(playlist)}
          className="flex-1 py-2 px-3 bg-warm-primary text-white rounded hover:opacity-90 transition text-sm"
        >
          查看歌单
        </button>

        <button onClick={() => handleDeletePlaylist(playlist)} className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded hover:bg-red-100 transition" >
          <DeleteOutlined />
        </button>
      </div>
    </div>
  );
}
