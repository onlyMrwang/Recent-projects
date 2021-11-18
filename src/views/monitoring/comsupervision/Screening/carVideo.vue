<template>
  <div class="car-videos-container" :class="allScreen ? 'all-screen' : ''">
    <div class="header">
      <div>
        <el-select
          class="select-panel"
          v-model="selectedTdh"
          placeholder="请选择"
          @change="handleChange"
        >
          <el-option
            v-for="item in tdhList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            size="mini"
          >
          </el-option>
        </el-select>
      </div>
      <div>
        <el-button type="primary" size="small" @click="closeAllVideo"
          >全部关闭</el-button
        >
        <el-button
          class="all-screen-btn"
          type="primary"
          size="small"
          @click="changeAllScreen"
        >
          <i v-show="!allScreen" class="el-icon-full-screen"></i>
          <svg
            v-show="allScreen"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="14"
            height="14"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              fill="#fff"
              d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z"
            />
          </svg>
        </el-button>
        <span class="close-car-video" @click="closeCarVideo"
          ><i class="el-icon-close"></i
        ></span>
      </div>
    </div>
    <div class="content" :class="showCarList ? 'small-screen' : ''">
      <div
        :class="
          selectedTdh === 0
            ? 'six-videos two-cols'
            : selectedTdh === 1
            ? 'twelve-videos'
            : 'eighteen-videos'
        "
      >
        <div class="video-panel" v-for="item in videoList" :key="item.id">
          <video
            :id="'video' + item.id"
            controls
            autoplay
            muted
            :poster="detailImg1"
            preload="none"
            :style="{ width: `${videoWidths}` }"
            :title="item.name"
          ></video>
          <div class="video-info">
            <span class="video-name">{{ item.name }}</span>
            <span class="close-ico" @click="closeSingleVideo(item.id)"
              ><i class="el-icon-close"></i
            ></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import flvjs from "flv.js";
import { getCarVideo } from "@/api/monitoring/comsupervision.js";
export default {
  props: ["showCarList"],
  data() {
    return {
      tdhList: [
        { value: 0, label: "6路" },
        { value: 1, label: "12路" },
        { value: 2, label: "18路" },
      ],
      selectedTdh: 0,
      videoList: [],
      allScreen: false,
      detailImg1: require("@/assets/monitoring/type/video-off.png"),
      widths: window.screen.availWidth - 300,
    };
  },
  mounted() {},
  computed: {
    videoWidths() {
      const width =
        this.selectedTdh === 0 ? 95 : this.selectedTdh === 1 ? 110 : 150;
      const num = this.selectedTdh === 0 ? 3 : this.selectedTdh === 1 ? 4 : 6;
      return this.allScreen ? (this.widths - width) / num + "px" : "";
    },
  },
  destroyed() {
    this.closeAllVideo();
  },
  methods: {
    // 全部关闭按钮
    closeAllVideo() {
      this.videoList.map((item) => {
        this.destoryVideo(item.player);
        clearInterval(item.time);
      });
      this.videoList.splice(0, this.videoList.length);
    },
    // 关闭视频窗口
    closeCarVideo() {
      this.videoList.map((item) => {
        this.destoryVideo(item.player);
        clearInterval(item.time);
      });
      this.allScreen = false;
      this.selectedTdh = 0;
      this.videoList.splice(0, this.videoList.length);
      this.$emit("closeCarVideo");
    },
    // 切换视频窗口全屏
    changeAllScreen() {
      this.allScreen = !this.allScreen;
      if (this.allScreen) {
        this.$emit("changeVideoWidth", 4);
      } else {
        this.handleChange(this.selectedTdh);
      }
    },
    // 切换视频路数
    handleChange(val) {
      if (!this.allScreen) {
        this.$emit("changeVideoWidth", val);
      }
    },
    // 关闭单个视频
    closeSingleVideo(id) {
      const index = this.videoList.findIndex((item) => item.id === id);
      this.destoryVideo(this.videoList[index].player);
      clearInterval(this.videoList[index].time);
      this.videoList.splice(index, 1);
    },
    async getCarVideos(carId) {
      const self = this;
      const res = await getCarVideo({ carId });
      if (res.code === 200) {
        self.videoList = self.videoList.filter((video) => {
          const index = res.data.findIndex((item) => item.id === video.id);
          if (index > -1) {
            self.destoryVideo(video.player);
            clearInterval(video.time);
          }
          return index === -1;
        });
        self.videoList.unshift(...res.data);
        this.$nextTick(() => {
          self.startPlay(res.data);
        });
      }
    },
    //视频浏览
    startPlay(videoArr) {
      const self = this;
      // const newArr = []
      if (videoArr.length + self.videoList.length > 60) {
        for (
          const i = self.videoList.length - 1;
          videoArr.length + i > 59;
          i--
        ) {
          self.destoryVideo(self.videoList[i].player);
          clearInterval(self.videoList[i].time);
          self.videoList.pop();
        }
      }
      videoArr.forEach((item, index) => {
        let videoElement = document.getElementById("video" + item.id);
        let player = this.createPlayer(videoElement, item.url);
        //定时方法是为了用户离开页面视频是实时播放的,暂停按钮无用
        this.videoList[index].time = setInterval(function() {
          // console.log(videoElement.buffered, "idididid");
          let buffered = videoElement.buffered;
          if (buffered.length > 0) {
            let end = buffered.end(0);
            var diff = end - videoElement.currentTime;
            if (diff > 0.15) {
              videoElement.currentTime = end - 0.1;
            }
          }
        }, 1000);
        player.on(flvjs.Events.ERROR, (errorType, errorDetail, errorInfo) => {
          console.log("errorType:", errorType);
          console.log("errorDetail:", errorDetail);
          console.log("errorInfo:", errorInfo);
          //视频出错后销毁重新创建
          if (player) {
            player.pause();
            player.unload();
            player.detachMediaElement();
            player.destroy();
            player = null;
            player = this.createPlayer(videoElement, item.url);
          }
        });

        // player.on("statistics_info", function(res) {
        //   if (this.lastDecodedFrame == 0) {
        //     this.lastDecodedFrame = res.decodedFrames;
        //     return;
        //   }
        //   if (this.lastDecodedFrame != res.decodedFrames) {
        //     this.lastDecodedFrame = res.decodedFrames;
        //   } else {
        //     this.lastDecodedFrame = 0;
        //     if (this.player) {
        //       this.player.pause();
        //       this.player.unload();
        //       this.player.detachMediaElement();
        //       this.player.destroy();
        //       this.player = null;
        //       this.createPlayer(videoElement, this.url);
        //     }
        //   }
        // });

        this.videoList[index].player = player;
      });
    },
    createPlayer(videoElement, url) {
      if (flvjs.isSupported()) {
        let player = null;
        player = flvjs.createPlayer(
          {
            type: "flv", //=> 媒体类型 flv 或 mp4
            isLive: true, //=> 是否为直播流
            hasAudio: false, //=> 是否开启声音
            url: url, //=> 视频流地址
          },
          {
            enableWorker: false, //不启用分离线程
            enableStashBuffer: false, //关闭IO隐藏缓冲区
            reuseRedirectedURL: true, //重用301/302重定向url，用于随后的请求，如查找、重新连接等。
            autoCleanupSourceBuffer: true, //自动清除缓存
          }
        );
        player.attachMediaElement(videoElement); //=> 绑DOM
        if (url !== "" && url !== null) {
          // setTimeout(() => {
          //   player.load();
          //   player.play();
          // }, 2000);
          player.load();
          player.play();
        }

        return player;
      }
    },
    destoryVideo(flvPlayer) {
      if (flvPlayer) {
        flvPlayer.pause();
        flvPlayer.unload();
        flvPlayer.detachMediaElement();
        flvPlayer.destroy();
      }

      flvPlayer = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.car-videos-container {
  background-color: #fff;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;

  .header {
    display: flex;
    justify-content: space-between;
    padding: 12px 12px 0;

    .select-panel {
      width: 80px;
      font-size: 13px;
    }

    button {
      padding: 6px;
      font-size: 13px;
      height: 32px;

      svg {
        width: 14px;
        height: 14px;
        position: unset;
      }
    }
    .all-screen-btn {
      width: 32px;
    }

    .close-car-video {
      cursor: pointer;
      margin-left: 10px;
    }

    ::v-deep .el-select .el-input {
      &.is-focus .el-input__inner {
        border-color: #41b8c3;
      }
      .el-select__caret {
        line-height: 32px;
      }
    }
  }

  .content {
    padding: 0 20px 20px;
    height: calc(100% - 80px);
    overflow: auto;
    &::-webkit-scrollbar {
      cursor: pointer;
      width: 7px;
      height: 7px;
      background-color: transparent;
    }
    /*定义滑块 内阴影+圆角*/
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      cursor: pointer;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
      background-color: #f5f5f5;
    }
    video {
      width: 144px;
      height: 81px;
    }
    .six-videos .video-panel {
      width: 144px;
      margin: auto;
    }
    .twelve-videos,
    .eighteen-videos {
      display: flex;
      flex-wrap: wrap;
    }
    .video-panel:not(:first-child) {
      margin-top: 8px;
    }
    .twelve-videos {
      .video-panel {
        flex: 0 0 45%;
        &:not(:nth-child(2)) {
          margin-top: 8px;
        }

        &:nth-child(even) {
          margin-left: 16px;
        }
      }
    }

    .eighteen-videos .video-panel {
      flex: 0 0 31%;
      &:not(:nth-child(2)),
      &:not(:nth-child(3)) {
        margin-top: 8px;
      }

      &:nth-child(3n),
      &:nth-child(3n-1) {
        margin-left: 16px;
      }
    }

    .video-info {
      display: flex;
      justify-content: space-between;
      padding: 0 8px;
      color: #222;
      font-size: 12px;
      .close-ico {
        cursor: pointer;
      }
      .video-name {
        -webkit-line-clamp: 1; // 用来限制在一个块元素显示的文本的行数
        display: -webkit-box; // 将对象作为弹性伸缩盒模型显示
        -webkit-box-orient: vertical; //设置或检查伸缩盒对象的子元素的排列方式
        text-overflow: ellipsis; // 在多行文本的情况下，用...隐藏超出范围的文本
        word-break: break-all;
        overflow: hidden;
      }
    }
  }

  video {
    object-fit: fill;

    // 隐藏所有控件
    &::-webkit-media-controls-enclosure {
      display: none;
    }

    &::-webkit-media-controls {
      /* Works only on Chrome-based browsers */
      display: none;
    }

    .vjs-loading-spinner {
      width: 36px;
      height: 36px;
      left: 60%;
      top: 80%;
    }
  }

  .two-cols.six-videos {
    display: flex;
    flex-wrap: wrap;
    .video-panel {
      flex: 0 0 45%;
      width: 280px;
      margin: unset;
      &:not(:first-child),
      &:not(:nth-child(2)) {
        margin-top: 8px;
      }

      &:nth-child(even) {
        margin-left: 16px;
      }
    }
    video {
      width: 285px;
      height: 24vh;
    }
  }

  .small-screen {
    .six-videos {
      video {
        width: 176px;
        height: 99px;
      }
      display: flex;
      flex-wrap: wrap;
      .video-panel {
        width: unset;
        flex: 0 0 45%;
        margin: unset;
        &:not(:first-child),
        &:not(:nth-child(2)) {
          margin-top: 8px;
        }

        &:nth-child(even) {
          margin-left: 16px;
        }
      }
    }
    .twelve-videos {
      video {
        width: 176px;
        height: 99px;
      }
      .video-panel {
        flex: 0 0 31% !important;
        &:not(:nth-child(2)),
        &:not(:nth-child(3)) {
          margin-top: 8px;
        }
        &:nth-child(even) {
          margin-left: unset !important;
        }
        &:nth-child(3n),
        &:nth-child(3n-1) {
          margin-left: 16px !important;
        }
      }
    }
  }
}

.all-screen .content {
  .six-videos {
    display: flex;
    flex-wrap: wrap;
    video {
      width: 368px;
      height: 29vh;
    }

    .video-panel {
      width: unset;
      flex: 0 0 32% !important;
      margin: unset;
      &:nth-child(even) {
        margin-left: unset;
      }

      &:not(:first-child),
      &:not(:nth-child(2)),
      &:not(:nth-child(3)) {
        margin-top: 7vh;
      }

      &:nth-child(3n),
      &:nth-child(3n-1) {
        margin-left: 12px;
      }
    }
  }
  .eighteen-videos {
    video {
      width: 160px;
      height: 12vh;
    }

    .video-panel {
      flex: 0 0 15% !important;
      &:not(:first-child),
      &:not(:nth-child(2)),
      &:not(:nth-child(3)),
      &:not(:nth-child(4)),
      &:not(:nth-child(5)),
      &:not(:nth-child(6)) {
        margin-top: 10vh !important;
      }

      &:nth-child(6n),
      &:nth-child(6n-1),
      &:nth-child(6n-2),
      &:nth-child(6n-3),
      &:nth-child(6n-4) {
        margin-left: 12px;
      }
    }
  }
  .twelve-videos {
    video {
      width: 256px;
      height: 19vh;
    }

    .video-panel {
      flex: 0 0 24% !important;
      &:not(:first-child),
      &:not(:nth-child(2)),
      &:not(:nth-child(3)),
      &:not(:nth-child(4)) {
        margin-top: 5vh !important;
      }

      &:nth-child(4n),
      &:nth-child(4n-1),
      &:nth-child(4n-2) {
        margin-left: 12px;
      }
    }
  }
}
</style>
