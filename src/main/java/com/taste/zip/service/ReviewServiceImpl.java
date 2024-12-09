package com.taste.zip.service;

import java.util.List;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taste.zip.entity.ReviewEntity;
import com.taste.zip.entity.ReviewLikeEntity;
import com.taste.zip.repository.MemberRepository;
import com.taste.zip.repository.ReviewLikeRepository;
import com.taste.zip.repository.ReviewRepository;
import com.taste.zip.vo.ReviewVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReviewLikeRepository reviewLikeRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Override
    @Transactional
    public ReviewEntity createReview(ReviewEntity review) {
        return reviewRepository.save(review);
    }

    @Override
    @Transactional
    public ReviewEntity updateReview(Long reviewId, ReviewEntity review) {
        ReviewEntity existingReview = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("Review not found"));

        existingReview.setRating(review.getRating());
        existingReview.setContent(review.getContent());
        existingReview.setImageUrl(review.getImageUrl());

        return reviewRepository.save(existingReview);
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId) {
        ReviewEntity review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("Review not found"));
        review.setStatus(0);
        reviewRepository.save(review);
    }

    @Override
    public ReviewVO getReview(Long reviewId) {
        return reviewRepository.findReviewById(reviewId);
    }

    @Override
    public List<ReviewVO> getReviewsByPlace(int placeId) {
        return reviewRepository.findReviewsByPlaceId(placeId);
    }

    @Override
    public List<ReviewVO> getReviewsByMember(int memIdx) {
        return reviewRepository.findReviewsByMemberId(memIdx);
    }

    @Override
    @Transactional
    public void likeReview(Long reviewId, int memIdx) {
        if (!reviewLikeRepository.existsByReviewReviewIdAndMemberMemIdx(reviewId, memIdx)) {
            ReviewLikeEntity like = new ReviewLikeEntity();
            like.setReview(reviewRepository.findById(reviewId)
                    .orElseThrow(() -> new EntityNotFoundException("Review not found")));
            like.setMember(memberRepository.findById(memIdx)
                    .orElseThrow(() -> new EntityNotFoundException("Member not found")));
            reviewLikeRepository.save(like);
        }
    }

    @Override
    @Transactional
    public void unlikeReview(Long reviewId, int memIdx) {
        reviewLikeRepository.deleteByReviewReviewIdAndMemberMemIdx(reviewId, memIdx);
    }

    @Override
    public boolean isLikedByMember(Long reviewId, int memIdx) {
        return reviewLikeRepository.existsByReviewReviewIdAndMemberMemIdx(reviewId, memIdx);
    }

    @Override
    public long getLikeCount(Long reviewId) {
        return reviewLikeRepository.countByReviewReviewId(reviewId);
    }

    @Override
    public List<ReviewVO> getReviewsLikedByMember(int memIdx) {
        return reviewRepository.findReviewsLikedByMemberId(memIdx);
    }
    
    // 전체 리뷰 목록 불러오기
    @Override
    public Page<ReviewVO> getAllReviews(Pageable pageable) {
        return reviewRepository.findAllReviews(pageable);
    }
}
