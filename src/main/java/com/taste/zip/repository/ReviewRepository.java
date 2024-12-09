package com.taste.zip.repository;

import com.taste.zip.entity.ReviewEntity;
import com.taste.zip.vo.ReviewVO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
        @Query("SELECT new com.taste.zip.vo.ReviewVO(r.reviewId, m.memberName, p.title, r.rating, r.content, r.createdDate, r.imageUrl, p.placeId, p.addr1, p.cat3, m.profileImage, m.memIdx, p.avgRating, p.reviewCount) "
                        +
                        "FROM ReviewEntity r " +
                        "JOIN r.member m " +
                        "JOIN r.place p " +
                        "WHERE p.placeId = :placeId AND r.status = 1")
        List<ReviewVO> findReviewsByPlaceId(@Param("placeId") int placeId);

        @Query("SELECT new com.taste.zip.vo.ReviewVO(r.reviewId, m.memberName, p.title, r.rating, r.content, r.createdDate, r.imageUrl, p.placeId, p.addr1, p.cat3, m.profileImage, m.memIdx, p.avgRating, p.reviewCount) "
                        +
                        "FROM ReviewEntity r " +
                        "JOIN r.member m " +
                        "JOIN r.place p " +
                        "WHERE m.memIdx = :memIdx AND r.status = 1")
        List<ReviewVO> findReviewsByMemberId(@Param("memIdx") int memIdx);
        @Query("SELECT new com.taste.zip.vo.ReviewVO(r.reviewId, m.memberName, p.title, r.rating, r.content, r.createdDate, r.imageUrl, p.placeId, p.addr1, p.cat3, m.profileImage, m.memIdx, p.avgRating, p.reviewCount) "
                        +
                        "FROM ReviewEntity r " +
                        "JOIN r.member m " +
                        "JOIN r.place p " +
                        "WHERE r.reviewId = :reviewId")
        ReviewVO findReviewById(@Param("reviewId") Long reviewId);

        @Query("SELECT new com.taste.zip.vo.ReviewVO(r.reviewId, m.memberName, p.title, r.rating, r.content, r.createdDate, r.imageUrl, p.placeId, p.addr1, p.cat3, m.profileImage, m.memIdx, p.avgRating, p.reviewCount) "
                        +
                        "FROM ReviewEntity r " +
                        "JOIN r.member m " +
                        "JOIN r.place p " +
                        "JOIN ReviewLikeEntity rl ON r.reviewId = rl.review.reviewId " +
                        "WHERE rl.member.memIdx = :memIdx")
        List<ReviewVO> findReviewsLikedByMemberId(@Param("memIdx") int memIdx);

        // 전체 리뷰 목록 불러오기 (페이지네이션)
        @Query("SELECT new com.taste.zip.vo.ReviewVO(r.reviewId, m.memberName, p.title, r.rating, r.content, r.createdDate, r.imageUrl, p.placeId, p.addr1, p.cat3, m.profileImage, m.memIdx, p.avgRating, p.reviewCount) "
                + "FROM ReviewEntity r "
                + "JOIN r.member m "
                + "JOIN r.place p")
        Page<ReviewVO> findAllReviews(Pageable pageable);

}
