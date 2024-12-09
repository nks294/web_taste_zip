package com.taste.zip.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.taste.zip.entity.ReviewEntity;
import com.taste.zip.vo.ReviewVO;

public interface ReviewService {

    ReviewEntity createReview(ReviewEntity review);

    ReviewEntity updateReview(Long reviewId, ReviewEntity review);

    void deleteReview(Long reviewId);

    ReviewVO getReview(Long reviewId);

    List<ReviewVO> getReviewsByPlace(int placeId);

    List<ReviewVO> getReviewsByMember(int memIdx);

    Page<ReviewVO> getAllReviews(Pageable pageable);

    void likeReview(Long reviewId, int memIdx);

    void unlikeReview(Long reviewId, int memIdx);

    boolean isLikedByMember(Long reviewId, int memIdx);

    long getLikeCount(Long reviewId);

    List<ReviewVO> getReviewsLikedByMember(int memIdx);

}
