package com.taste.zip.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.taste.zip.entity.PlaceEntity;
import com.taste.zip.vo.PlaceVO;

public interface PlaceService {
    int insertPlace(PlaceVO data);

    List<PlaceEntity> getPlaceList();

    int updateAreaName(String areaName, String sigunguName, String contentid);

    List<PlaceEntity> getPlacePage(int page, int size);

    PlaceEntity getPlace(int placeId);

    int updatePlaceDetails(PlaceEntity place);

    int updatePlaceIntro(PlaceEntity place);

    PlaceEntity submitPlace(PlaceEntity place);

    List<PlaceEntity> searchPlaces(String keyword1, String keyword2);

    int updateCategories();

    List<PlaceEntity> getPlacesByCategory(String category);

    Page<PlaceEntity> findPlaces(String category, String theme, String searchField, String searchWord, Pageable pageable);

    List<PlaceEntity> getBookmarkedPlaces(int memIdx);

    boolean toggleBookmark(int memIdx, int placeId);

    boolean isBookmarked(int memIdx, int placeId);

    List<String> getAllThemes();

    void updatePlace(PlaceEntity place);

    List<PlaceEntity> getTopRankedPlaces(); // 랭킹 조회 메서드

    List<PlaceEntity> getTopPlacesByRegion(String region);

}
