package com.taste.zip.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.taste.zip.entity.PlaceEntity;

@Repository
public interface PlaceRepository extends JpaRepository<PlaceEntity, Integer> {

        Optional<PlaceEntity> findByContentid(String contentid);

        List<PlaceEntity> findByTitleContaining(String searchTerm);

        @Query("SELECT p FROM PlaceEntity p ORDER BY p.placeId")
        Page<PlaceEntity> findAllPaged(Pageable pageable);

        @Modifying
        @Query("UPDATE PlaceEntity p SET p.areaname = :areaName, p.sigunguname = :sigunguName WHERE p.contentid = :contentid")
        int updateAreaName(@Param("areaName") String areaName, @Param("sigunguName") String sigunguName,
                        @Param("contentid") String contentid);

        @Modifying
        @Query("UPDATE PlaceEntity p SET p.cat3 = :categoryName WHERE p.cat3 = :categoryCode")
        int updateCategory(@Param("categoryName") String categoryName, @Param("categoryCode") String categoryCode);

        @Query("SELECT p FROM PlaceEntity p WHERE p.cat3 = :category")
        List<PlaceEntity> findByCategory(@Param("category") String category);

        @Query("SELECT p FROM PlaceEntity p WHERE " +
                        "(LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword1, '%')) " +
                        " OR LOWER(p.addr1) LIKE LOWER(CONCAT('%', :keyword1, '%')) " +
                        " OR LOWER(p.treatmenu) LIKE LOWER(CONCAT('%', :keyword1, '%')))" +
                        " AND (:keyword2 IS NULL OR " +
                        "(LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword2, '%')) " +
                        " OR LOWER(p.addr1) LIKE LOWER(CONCAT('%', :keyword2, '%')) " +
                        " OR LOWER(p.treatmenu) LIKE LOWER(CONCAT('%', :keyword2, '%'))))")
        List<PlaceEntity> searchPlaces(@Param("keyword1") String keyword1, @Param("keyword2") String keyword2);

        @Query("SELECT DISTINCT p.theme FROM PlaceEntity p WHERE p.theme IS NOT NULL AND p.theme != ''")
        List<String> getAllThemes();

        @Modifying
        @Query("UPDATE PlaceEntity p SET p.avgRating = :avgRating, p.reviewCount = :reviewCount WHERE p.placeId = :placeId")
        int updatePlaceStats(@Param("placeId") int placeId, @Param("avgRating") Double avgRating,
                        @Param("reviewCount") Integer reviewCount);

        // 랭킹 조회 쿼리
        // @Query("SELECT p FROM PlaceEntity p WHERE p.avgRating IS NOT NULL ORDER BY
        // p.avgRating DESC, p.reviewCount DESC")
        // List<PlaceEntity> findTopRankedPlaces();

        // 전체 식당 탑텐
        @Query("SELECT p FROM PlaceEntity p " +
                        "WHERE p.reviewCount >= 1 " +
                        "ORDER BY p.avgRating DESC, p.reviewCount DESC")
        Page<PlaceEntity> findTop10RankedPlaces(Pageable page);

        // 지역별 식당 탑텐
        @Query("SELECT p FROM PlaceEntity p " +
                        "WHERE p.areaname LIKE %:region% AND p.reviewCount >= 1 " +
                        "ORDER BY p.avgRating DESC, p.reviewCount DESC")
        Page<PlaceEntity> findTop10PlacesByRegion(@Param("region") String region, Pageable page);

        // 플레이스 불러오기 통합 메서드
        @Query("SELECT p FROM PlaceEntity p " +
                        "WHERE (:category = 'all' OR p.cat3 = :category) " +
                        "AND (:theme = 'none' OR p.theme = :theme) " +
                        "AND (:searchWord IS NULL OR :searchWord = '' " +
                        "   OR (:searchField = 'title' AND p.title LIKE CONCAT('%', :searchWord, '%')) " +
                        "   OR (:searchField = 'addr1' AND p.addr1 LIKE CONCAT('%', :searchWord, '%')) " +
                        "   OR (:searchField = 'treatmenu' AND p.treatmenu LIKE CONCAT('%', :searchWord, '%'))) " +
                        "AND p.firstimage IS NOT NULL AND p.firstimage <> '' " +
                        "ORDER BY FUNCTION('RAND')")
        Page<PlaceEntity> findPlaces(
                        @Param("category") String category,
                        @Param("theme") String theme,
                        @Param("searchField") String searchField,
                        @Param("searchWord") String searchWord,
                        Pageable pageable);

}
