import React, { useState } from "react";
import {
  useSettingsButton,
  ViewPicker,
  useViewIds,
  useCloudStorage,
  useFields,
  FieldPicker,
  FieldType,
} from "@apitable/widget-sdk";
import { Checkbox, TextInput, Typography, Select } from "@apitable/components";
import { PercentOutlined } from "@apitable/icons";
import { SketchPicker } from "react-color";
import style from "./index.css";

export const Setting = () => {
  const [isSettingOpened] = useSettingsButton();
  const viewIds = useViewIds();
  const [viewId, setViewId] = useCloudStorage("selectViewId", viewIds[0]);
  const fields = useFields(viewId || viewIds[0]);
  const [fieldId, setFieldId] = useCloudStorage("videoFieldId", fields[0].id);
  const [showExtraInfo, setShowExtraInfo] = useCloudStorage(
    "showExtraInfo",
    false
  );
  const [extraInfoWidth, setExtraInfoWidth] = useCloudStorage(
    "extraInfoWidth",
    "20"
  );
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [backgroundColor, setBackgroundColor] = useCloudStorage(
    "backgroundColor",
    "#7B67EE"
  );
  const [carouselMode, setCarouselMode] = useCloudStorage("carouselMode", "list");
  const [playListMode, setPlayListMode] = useCloudStorage("playListMode", "all");

  return isSettingOpened ? (
    <div
      style={{
        flexShrink: 0,
        width: "300px",
        borderLeft: "solid 1px var(--lineColor)",
        paddingLeft: "16px",
        paddingTop: "40px",
        paddingRight: "16px",
        background: "var(--defaultBg)",
        overflowY: "auto",
      }}
    >
      <h3 style={{ color: "var(--firstLevelText)" }}>配置</h3>
      <div style={{ marginTop: "16px" }}>
        <Typography variant="body2" color={"var(--thirdLevelText)"}>
          通过视图获取播放清单
        </Typography>
        <div>
          <ViewPicker
            id="viewPicker"
            viewId={viewId}
            onChange={(option) => setViewId(option.value)}
          />
        </div>
      </div>
      <div style={{ marginTop: "16px" }}>
        <Typography variant="body2" color={"var(--thirdLevelText)"}>
          从播放清单中挑选
        </Typography>
        <div>
          <Select
            options={[
              {
                label: "播放全部",
                value: "all",
              },
              {
                label: "第一个视频",
                value: "firstItem",
              },
              {
                label: "最后一个视频",
                value: "lastItem",
              }
            ]}
            value={playListMode}
            onSelected={(option) => {
              setPlayListMode(option.value);
            }}
          />
        </div>
      </div>
      <div style={{ marginTop: "16px" }}>
        <Typography variant="body2" color={"var(--thirdLevelText)"}>
          从哪个附件字段读取视频
        </Typography>
        <div>
          <FieldPicker
            id="FieldPicker"
            viewId={viewId}
            fieldId={fieldId}
            onChange={(option) => setFieldId(option.value)}
            allowedTypes={[FieldType.Attachment, FieldType.URL, FieldType.SingleText, FieldType.Text]}
          />
        </div>
      </div>
      <div style={{ marginTop: "16px" }}>
        <Typography variant="body2" color={"var(--thirdLevelText)"}>
          播放模式
        </Typography>
        <div>
          <Select
            options={[
              {
                label: "列表循环",
                value: "list",
              },
              {
                label: "单个循环",
                value: "single",
              },
              {
                label: "不循环",
                value: "none",
              }
            ]}
            value={carouselMode}
            onSelected={(option) => {
              setCarouselMode(option.value);
            }}
          />
        </div>
      </div>
      <div style={{ marginTop: "16px" }}>
        <Typography variant="body2" color={"var(--thirdLevelText)"}>
          背景颜色
        </Typography>
        <div>
          <div
            className={style.swatch}
            onClick={() => setDisplayColorPicker(!displayColorPicker)}
          >
            <div
              style={{
                backgroundColor: backgroundColor,
                width: "36px",
                height: "14px",
                borderRadius: "2px",
              }}
            />
          </div>
          {displayColorPicker && (
            <div className={style.colorPickerPopover}>
              <div
                className={style.colorPickerCover}
                onClick={() => setDisplayColorPicker(false)}
              />
              <SketchPicker
                color={backgroundColor}
                onChange={(color) => {
                  setBackgroundColor(color.hex);
                }}
                disableAlpha={true}
              />
            </div>
          )}
        </div>
      </div>
      <div style={{ marginTop: "16px" }}>
        <Typography variant="body2" color={"var(--thirdLevelText)"}>
          显示更多信息
        </Typography>
        <div>
          <Checkbox
            checked={showExtraInfo}
            onChange={(value) => setShowExtraInfo(value)}
          >
            视频右侧显示文本信息
          </Checkbox>
          {showExtraInfo && (
            <div>
              <div className={style.row}>
                <Typography variant="body4" color={"var(--thirdLevelText)"}>
                  文本区域宽度
                </Typography>
                <TextInput
                  placeholder="宽度百分比"
                  size="small"
                  value={extraInfoWidth}
                  suffix={<PercentOutlined />}
                  type="number"
                  min={10}
                  max={90}
                  onChange={(e) => setExtraInfoWidth(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;
};
