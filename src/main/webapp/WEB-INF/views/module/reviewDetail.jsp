<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div class="modal-overlay"></div>

<div class="review-detail-modal">
<input type="hidden" id="memberIdx" value="${member.memIdx}" />
    <div class="review-detail-header com-relative com-width-100" style="height: 350px;">
        <img src="https://via.placeholder.com/500x350" alt="리뷰 이미지">
        <button class="close-button">
            <i class="fas fa-times"></i>
        </button>
    </div>
    <div class="review-detail-content com-padding-4">
        <div class="restaurant-header com-flex-row com-flex-justify-spacebetween com-flex-align-center com-margin-bottom-20">
            <p class="restaurant-name com-font-size-5 com-font-bold" style="cursor: pointer;">${review.placeTitle}</p>
            <div class="more-options com-relative" style="cursor: pointer; display: none;">
                <button class="more-options-btn com-font-size-4 com-border-clear">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
                <div class="options-dropdown">
                    <div class="option-item edit-review padding-primary" style="cursor: pointer; white-space: nowrap;">수정하기</div>
                    <div class="option-item delete-review padding-primary" style="cursor: pointer; white-space: nowrap;">삭제하기</div>
                </div>
            </div>
        </div>
        <div class="restaurant-info com-margin-bottom-20"></div>
        <div class="review-content-wrapper com-flex-row com-gap-15">
            <div class="review-profile-image com-round-circle com-overflow-hidden" style="width: 50px; height: 50px">
                <img src="${review.profileImage}" alt="프로필">
            </div>
            <div class="review-main-content com-flex-1">
                <div class="reviewer-name com-font-bold com-margin-bottom-small">${review.memberName}</div>
                <div class="review-rating com-margin-bottom-10">
                    <i class="fas fa-star"></i> ${review.rating}
                </div>
                <div class="review-text com-margin-bottom-20">
                    ${review.content}
                </div>
                <div class="review-meta com-flex-row com-flex-justify-center com-flex-align-center">
                    <div class="review-date com-font-size-2">${review.createdDate}</div>
                    <div class="review-like com-pointer">
                        <i class="far fa-heart"></i> ${review.likeCount}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

