import React, { useRef } from "react";
import cn from "classnames";
import { FiCopy } from "react-icons/fi";
import { ServicesProviderOrManufacturer, VK_SEARCH_REVIEWS_PAGE } from "../../constants/searchPage";
import { Tooltip } from "../../../../shared/components/Tooltip";
import { E_TOOLTIP_PLACEMENT } from "../../../../shared/constants/tooltip";
import styles from "./SearchPageListItem.scss";
import TextHelper from "app/shared/services/text";

export const SearchPageListItem = ({
  dataItem
}: { dataItem: ServicesProviderOrManufacturer }) => {
  const copyText = React.useCallback(
    () => TextHelper.copyTextToClipboard(dataItem.reviewsHashtag),
    [ dataItem.reviewsHashtag ]
  );

  const hashtagRef = useRef(null);

  return (
    <div className={cn(styles.container)}>
      <div className={cn(styles.imgContainer)}>
        <img alt={"фото"} src={dataItem.profilePhotoLink} />
      </div>
      <div className={cn(styles.infoContainer)}>
        <div className={cn(styles.infoName)}>{dataItem.name}</div>
        <div className={cn(styles.infoRow)}>{"Профиль VK: "}
          <a href={`https://vk.com/${dataItem.vkProfile}`} target="_blank" rel="noreferrer">
            Ссылка на профиль VK
          </a>
        </div>
        <div className={cn(styles.infoRow)}>
          {"Номер телефона: "}
          <a href={`tel:${dataItem.phoneNumber}`}>
            {dataItem.phoneNumber}
          </a>
        </div>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
        <div
          className={cn(styles.infoRow)}
          onClick={copyText}
          role="button" tabIndex={0}
        >
          Хештег для размещения отзыва в VK: <span>{dataItem.reviewsHashtag}</span>
          <Tooltip
            text="Копировать хештег"
            tooltipTargetRef={hashtagRef}
            tooltipPlacement={E_TOOLTIP_PLACEMENT.BOTTOM}
          />
          <div className={cn(styles.flipHorizontal)} ref={hashtagRef}><FiCopy /></div>
        </div>
        <div className={cn(styles.infoRow)}>
          {"Отзывы в VK: "}
          <a
            href={VK_SEARCH_REVIEWS_PAGE.replace(
                "__hashtag__",
                dataItem.reviewsHashtag
            )}
          >
            {dataItem.reviewsHashtag}
          </a>
        </div>
      </div>
    </div>
  );
};
