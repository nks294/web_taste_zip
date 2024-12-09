package com.taste.zip.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
// import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taste.zip.entity.ReviewEntity;
import com.taste.zip.handler.FileManager;
import com.taste.zip.service.ReviewService;
import com.taste.zip.vo.ReviewVO;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@AllArgsConstructor
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private FileManager fileManager;

    @PostMapping("/create")
    public ResponseEntity<ReviewEntity> createReview(
            @RequestParam(value = "images[]", required = false) List<MultipartFile> images,
            @RequestParam("review") String reviewJson,
            HttpServletRequest request) {

        try {
            ObjectMapper mapper = new ObjectMapper();
            ReviewEntity review = mapper.readValue(reviewJson, ReviewEntity.class);

            if (images != null && !images.isEmpty()) {
                List<String> imageUrls = fileManager.handleReviewImages(images, request);
                review.setImageUrl(mapper.writeValueAsString(imageUrls));
            }

            ReviewEntity savedReview = reviewService.createReview(review);
            return ResponseEntity.ok(savedReview);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{reviewId}/isOwner")
    public ResponseEntity<Boolean> isReviewOwner(@PathVariable Long reviewId, @RequestParam int memIdx) {
        ReviewVO review = reviewService.getReview(reviewId);
        return ResponseEntity.ok(review.getMemIdx() == memIdx);
    }

    @GetMapping(value = "/{reviewId}", produces = "application/json")
    public ResponseEntity<ReviewVO> getReview(@PathVariable Long reviewId) {
        return ResponseEntity.ok(reviewService.getReview(reviewId));
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewEntity> updateReview(@PathVariable Long reviewId, @RequestBody ReviewEntity review) {
        return ResponseEntity.ok(reviewService.updateReview(reviewId, review));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(value = "/place/{placeId}", produces = "application/json")
    public ResponseEntity<List<ReviewVO>> getPlaceReviews(@PathVariable int placeId) {
        return ResponseEntity.ok(reviewService.getReviewsByPlace(placeId));
    }

    @GetMapping(value = "/member/{memIdx}", produces = "application/json")
    public ResponseEntity<List<ReviewVO>> getMemberReviews(@PathVariable int memIdx) {
        return ResponseEntity.ok(reviewService.getReviewsByMember(memIdx));
    }

    @PostMapping("/{reviewId}/like")
    public ResponseEntity<Void> likeReview(@PathVariable Long reviewId, @RequestParam int memIdx) {
        reviewService.likeReview(reviewId, memIdx);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{reviewId}/like")
    public ResponseEntity<Void> unlikeReview(@PathVariable Long reviewId, @RequestParam int memIdx) {
        reviewService.unlikeReview(reviewId, memIdx);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{reviewId}/like/count")
    public ResponseEntity<Long> getLikeCount(@PathVariable Long reviewId) {
        return ResponseEntity.ok(reviewService.getLikeCount(reviewId));
    }

    @GetMapping("/{reviewId}/like/check")
    public ResponseEntity<Boolean> isLikedByMember(@PathVariable Long reviewId, @RequestParam int memIdx) {
        return ResponseEntity.ok(reviewService.isLikedByMember(reviewId, memIdx));
    }

    @GetMapping(value = "/member/{memIdx}/liked", produces = "application/json")
    public ResponseEntity<List<ReviewVO>> getMemberLikedReviews(@PathVariable int memIdx) {
        return ResponseEntity.ok(reviewService.getReviewsLikedByMember(memIdx));
    }

    // 전체 리뷰 목록 불러오기
    @GetMapping(value = "/all", produces = "application/json")
    public ResponseEntity<Page<ReviewVO>> getAllReviews(            
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
            
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(reviewService.getAllReviews(pageable));
    }
}
