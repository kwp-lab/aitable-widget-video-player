import React, { useState, useEffect, useMemo } from "react";
import {
  initializeWidget,
  useCloudStorage,
  useRecords,
  useFields,
  useField,
  FieldType,
  useViewIds,
} from "@apitable/widget-sdk";
import { Typography, Button } from "@apitable/components";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@apitable/icons";
import { QRCodeSVG } from "qrcode.react";
import { Setting } from "./setting";
import style from "./index.css";

export const VideoPlaylistPlayer = () => {
  const [currentIndex, setCurrentIndex] = useState(0); // 当前播放的视频索引

  const viewIds = useViewIds();
  const [viewId] = useCloudStorage("selectViewId", viewIds[0]);
  const [videoFieldId] = useCloudStorage("videoFieldId", "");
  const [showExtraInfo] = useCloudStorage("showExtraInfo", false);
  const [extraInfoWidth] = useCloudStorage("extraInfoWidth", "20");
  const [carouselMode] = useCloudStorage("carouselMode", "list");
  const [playListMode] = useCloudStorage("playListMode", "all");

  const [backgroundColor] = useCloudStorage(
    "backgroundColor",
    "var(--defaultBg)"
  );

  const [playList, setPlayList] = useState([]);

  const fields = useFields(viewId);
  const records = useRecords(viewId, { filter: {} });
  const videoField = useField(videoFieldId);

  console.log({ records, viewId, currentIndex });

  useEffect(() => {
    if (records.length > 0 && currentIndex >= records.length) {
      setCurrentIndex(0); // 如果索引超出数组长度，重置到第一个视频
    }
    // console.log("useEffect changed", { currentIndex, records });
  }, [viewId, records, currentIndex]);

  useEffect(() => {
    if (carouselMode == "single") {
      setCurrentIndex(0);
    }
  }, [carouselMode]);

  useMemo(() => {
    let videos = [];
    if (videoFieldId !== "") {
      records.forEach((record) => {
        let url = "";
        if (videoField.type === FieldType.URL) {
          url = record.getCellValueString(videoFieldId);
        } else if (videoField.type === FieldType.Attachment) {
          const attachments = record.getCellValue(videoFieldId);
          url = attachments[0].url;
        } else if (videoField.type === FieldType.SingleText || videoField.type === FieldType.Text) {
          const content = record.getCellValueString(videoFieldId);
          url = content.startsWith("http") ? content : "";
        }

        url && videos.push(url);
      });
    }

    if (playListMode === "firstItem") {
      videos = videos.slice(0, 1);
    } else if (playListMode === "lastItem") {
      videos = videos.slice(-1);
    }

    // Only update playList if videos array has changed
    if (JSON.stringify(videos) !== JSON.stringify(playList)) {
      setPlayList(videos);
      console.log("playList", playList);
    }
  }, [records]);

  const handleVideoEnd = (event) => {
    if (carouselMode == "none") {
      return;
    }

    if (carouselMode == "list") {
      if (currentIndex < playList.length - 1) {
        setCurrentIndex((prevIndex) => prevIndex + 1); // 播放下一个视频
      } else {
        setCurrentIndex(0); // 所有视频播放结束后，重新开始
      }
    }
    
    event.target.play();
  };

  const handleNextVideo = () => {
    if (currentIndex < playList.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1); // 播放下一个视频
    } else {
      setCurrentIndex(0); // 所有视频播放结束后，重新开始
    }
  };

  const handlePrevVideo = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1); // 播放上一个视频
    } else {
      setCurrentIndex(playList.length - 1); // 播放第一个视频
    }
  };

  const renderText = (fieldName, fieldText) => {
    return fieldText ? (
      <div className={style.mt6}>
        <Typography variant="h3" className={style.extraInfoFieldName}>
          {fieldName}
        </Typography>
        <Typography variant="body1" className={style.extraInfoFieldText}>
          {fieldText || "（空）"}
        </Typography>
      </div>
    ) : null;
  };

  const renderUrlToQRCode = (fieldName, url) => {
    return url ? (
      <div className={style.mt6}>
        <Typography variant="h3" className={style.extraInfoFieldName}>
          {fieldName}
        </Typography>
        <div className={style.extraInfoLabelWrapper}>
          <QRCodeSVG value={url} marginSize={2} size={200} />
        </div>
      </div>
    ) : null;
  };

  const renderSelectorToLable = (fieldName, options) => {
    return options && options.length > 0 ? (
      <div className={style.mt6}>
        <Typography variant="h3" className={style.extraInfoFieldName}>
          {fieldName}
        </Typography>
        <div className={style.extraInfoLabelWrapper}>
          {options.map((option) => {
            return (
              <span key={option.name} className={style.extraInfoLabel}>
                {option.name}
              </span>
            );
          })}
        </div>
      </div>
    ) : null;
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        background: backgroundColor,
        borderTop: "1px solid var(--lineColor)",
      }}
    >
      <div
        className="flexCentercontainer"
        style={{ flexGrow: 1, overflow: "auto", padding: "0 24px", flexDirection: "column" }}
      >
        {playList.length > 0 ? (
          <video
            key={playList[currentIndex]} // 使用 key 来确保每次更换视频时重新加载
            src={playList[currentIndex]}
            controls
            autoPlay
            onEnded={handleVideoEnd}
            style={{
              height: "calc(100% - 74px)",
              borderRadius: "12px",
              width: "100%",
            }}
          />
        ) : (
          <p>No videos available to play.</p>
        )}
        <div
          className={style.btnControl}
        >
          <Button
            style={{ color: "#fff" }}
            variant="jelly"
            color="rgb(31, 41, 55)"
            size="small"
            prefixIcon={<ArrowLeftOutlined currentColor />}
            onClick={handlePrevVideo}
          >
            上一个
          </Button>
          <Button
            style={{ color: "#fff" }}
            variant="jelly"
            color="rgb(31, 41, 55)"
            size="small"
            suffixIcon={<ArrowRightOutlined currentColor />}
            onClick={handleNextVideo}
          >
            下一个
          </Button>
        </div>
      </div>
      {showExtraInfo && (
        <div
          style={{
            width: `${extraInfoWidth}%`,
            overflow: "auto",
            padding: "20px 24px",
            backgroundColor: "rgb(17, 24, 39)",
          }}
        >
          {records.length > 0 &&
            fields.length > 0 &&
            fields.map((field) => {
              if (field.id !== videoFieldId) {
                if (
                  [FieldType.SingleSelect, FieldType.MultiSelect].includes(
                    field.type
                  )
                ) {
                  return renderSelectorToLable(
                    field.name,
                    records[currentIndex].getCellValue(field.id)
                  );
                } else if (field.type === FieldType.URL) {
                  return renderUrlToQRCode(
                    field.name,
                    records[currentIndex].getCellValueString(field.id)
                  );
                } else {
                  return renderText(
                    field.name,
                    records[currentIndex].getCellValueString(field.id)
                  );
                }
              }
            })}
        </div>
      )}
      <Setting />
    </div>
  );
};

initializeWidget(VideoPlaylistPlayer, process.env.WIDGET_PACKAGE_ID);
