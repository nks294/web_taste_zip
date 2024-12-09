<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div class="review-modal hidden">
    <div class="review-modal-content com-bg com-round-10 com-padding-4">
        <div class="review-modal-header com-flex-fow com-flex-align-center com-margin-bottom-20" style="display: flex;">
            <button class="back-btn com-pointer com-font-size-5 com-padding-2 com-border-clear">
                <i class="fas fa-chevron-left"></i>
            </button>
            <h2 class="restaurant-name"></h2>
        </div>
        <input type="hidden" id="currentUserMemIdx" value="${sessionScope.member.memIdx}">
        <div class="rating-container com-margin-bottom-20 com-text-center">
            <div class="stars com-font-size-5 rv-rate com-margin-bottom-10">
                <i class="far fa-star com-pointer" data-rating="1"></i>
                <i class="far fa-star com-pointer" data-rating="2"></i>
                <i class="far fa-star com-pointer" data-rating="3"></i>
                <i class="far fa-star com-pointer" data-rating="4"></i>
                <i class="far fa-star com-pointer" data-rating="5"></i>
            </div>
            <span class="rating-text com-font-size-2"></span>
        </div>

        <textarea class="review-text-input com-margin-bottom-20 com-round-10 com-border-thin com-padding-3 com-width-100" placeholder="맛있게 드셨나요? 식당의 분위기와 서비스도 궁금해요!" style="height:150px; resize: none;"></textarea>

        <div class="photo-upload-container com-margin-bottom-20">
            <div class="photo-upload-box">
                <i class="fas fa-camera com-font-size-5 com-margin-bottom-small"></i>
                <span>사진 추가</span>
            </div>
            <input type="file" id="reviewImage" name="images" class="photo-input" accept="image/*" multiple style="display: none;">
            <div class="photo-preview-container" style="display: flex;" ></div>
        </div>

        <button class="submit-review-btn com-btn-primary com-padding-3 com-round-10 com-pointer com-font-bold com-width-100">리뷰 등록하기</button>
    </div>
</div>