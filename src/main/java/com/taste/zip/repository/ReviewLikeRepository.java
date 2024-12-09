package com.taste.zip.repository;

import com.taste.zip.entity.ReviewLikeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewLikeRepository extends JpaRepository<ReviewLikeEntity, Long> {
    boolean existsByReviewReviewIdAndMemberMemIdx(Long reviewId, int memIdx);
    void deleteByReviewReviewIdAndMemberMemIdx(Long reviewId, int memIdx);
    long countByReviewReviewId(Long reviewId);
}
