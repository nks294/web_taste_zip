<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="ko">
<%@ include file="module/core.jsp" %>
<script type="text/javascript" src="/resources/js/map.js"></script>
<style>


</style>

<body class="com-no-select">
    <%@ include file="module/header.jsp" %>
    <input type="hidden" id="currentUserProfileImage" value="${member.profileImage}">

    <main id="map-page">
        <div id="map"  style="width: 100%; height:calc(100vh - 80px)"></div> <!-- 지도가 표시될 영역 -->
    
        <div class="map-controls">
            <button class="map-control-btn bookmark-control">
                <i class="far fa-bookmark"></i>
            </button>
            <button class="map-control-btn location-control">
                <i class="fas fa-location-arrow"></i>
            </button>
        </div>
    
        <div class="restaurant-container">
            <div class="restaurant-list-container com-width-100 com-relative com-bg com-overflow-hidden com-shadow-right">
                <div class="mobile-toggle-wrapper">
                    <div class="mobile-toggle-handle"></div>
                </div>

                <div class="restaurant-screen com-flex-col com-height-100">
                    <!-- 음식점 목록 헤더 영역 -->
                    <div class="restaurant-list-container-header-wrapper com-flex-col">
                        <div class="search-bar-wrapper com-padding-input com-border-primary com-color-white com-round-10 com-margin-10">
                            <div class="search-bar com-flex-row com-flex-justify-spacebetween">
                                <input type="text" placeholder="이번에는 어떤 맛집을 찾아볼까?" class="com-border-clear">
                                <button type="submit" class="search-btn com-font-size-5 com-color-primary" style="margin-left: 15px"><i class="fas fa-search"></i></button>
                            </div>
                        </div>
        
                        <div class="filter-buttons com-relative com-flex-row com-gap-10 com-padding-2">
                            <div class="filter-selector-container com-relative com-flex-1 com-width-100">
                                <button class="filter-button com-btn-secondary">카테고리</button>
                            </div>
                            <div class="filter-selector-container com-relative com-flex-1 com-width-100">
                                <button class="filter-button com-btn-secondary">테마</button>
                            </div>
                            <button class="filter-button com-btn-secondary com-flex-1 com-width-100">거리순</button>
                            
                            <!-- 옵션 모달들 -->
                            <div class="filter-options com-border-thin com-round-10 com-padding-2 com-bg category-options hidden">
                                <div class="options-grid">
                                    <button class="option-btn com-padding-1 com-round-5 com-btn-secondary">한식</button>
                                    <button class="option-btn com-padding-1 com-round-5 com-btn-secondary">중식</button>
                                    <button class="option-btn com-padding-1 com-round-5 com-btn-secondary">일식</button>
                                    <button class="option-btn com-padding-1 com-round-5 com-btn-secondary">서양식</button>
                                    <button class="option-btn com-padding-1 com-round-5 com-btn-secondary">카페/찻집</button>
                                    <button class="option-btn com-padding-1 com-round-5 com-btn-secondary">이색음식점</button>
                                </div>
                            </div>
                            <div class="filter-options com-border-thin com-round-10 com-padding-2 com-bg theme-options hidden">
                                <div class="options-grid">
                                    <button class="option-btn com-padding-1 com-round-5 com-btn-secondary">미슐랭 가이드</button>
                                    <button class="option-btn com-padding-1 com-round-5 com-btn-secondary">흑백요리사</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 음식점 목록 영역 -->
                    <div class="restaurant-list-wrapper com-scroll-y com-height-100 com-padding-3">
                        <div class="restaurant-list com-height-100"></div> 
                    </div>

                    <!-- 페이지네이션 영역 -->
                    <div class="pagination-container com-padding-2 com-relative com-flex-row com-flex-justify-center com-gap-20">
                        <button class="pagination-btn first-page"><i class="fas fa-angle-double-left"></i></button>
                        <button class="pagination-btn prev-page"><i class="fas fa-angle-left"></i></button>
                        <div class="page-numbers com-flex-row com-gap-10"></div>
                        <button class="pagination-btn next-page"><i class="fas fa-angle-right"></i></button>
                        <button class="pagination-btn last-page"><i class="fas fa-angle-double-right"></i></button>
                    </div>
                </div>
            </div>
    
            <div class="restaurant-detail-container com-relative com-bg com-shadow-right com-scroll-y">
                <button class="close-button">
                    <i class="far fa-times"></i>
                </button>

                <div class="restaurant-screen com-flex-col com-height-100">
                    <div class="restaurant-detail-header com-width-100" style="height: 350px">
                        <img src="https://via.placeholder.com/500x350" class="com-img-fit" alt="식당 대표 이미지">
                    </div>

                    <div class="restaurant-detail-content com-padding-4">

                        <h2 class="restaurant-detail-name com-font-size-5 com-font-bold com-margin-bottom-small"></h2>

                        <div class="restaurant-detail-buttons">
                            <button class="detail-bookmark-btn detail-button com-flex-col com-gap-5 com-flex-justify-center com-flex-align-center com-flex-1 com-pointer com-btn-secondary com-border com-padding-primary com-round-5"><i class="far fa-bookmark com-font-size-4"></i><p>북마크</p></button>
                            <button class="detail-button com-flex-col com-gap-5 com-flex-justify-center com-flex-align-center com-flex-1 com-pointer com-btn-secondary com-border com-padding-primary com-round-5"><i class="far fa-edit com-font-size-4"></i><p>리뷰</p></button>
                            <button class="detail-button com-flex-col com-gap-5 com-flex-justify-center com-flex-align-center com-flex-1 com-pointer com-btn-secondary com-border com-padding-primary com-round-5"><i class="far fa-share-alt com-font-size-4"></i><p>공유</p></button>
                            <button class="navi-button com-flex-col com-gap-5 com-flex-justify-center com-flex-align-center com-flex-1 com-pointer com-btn-secondary com-border com-padding-primary com-round-5"><i class="fas fa-route com-font-size-4"></i><p>길찾기</p></button>
                        </div>

                        <div class="restaurant-info">
                            <p></p>
                            <p></p>
                            <p></p>
                        </div>

                        <div class="restaurant-reviews com-margin-top-30 com-width-100"></div>
                    </div>
                </div>

            </div>

            <!-- 접고 펼치기 버튼 -->
            <button class="toggle-button">
                <i class="fas fa-chevron-left"></i>
            </button>
        </div>
    
        <div class="review-modal hidden">
            <div class="review-modal-content com-bg com-round-10 com-padding-4">
                <div class="review-modal-header com-flex-fow com-flex-align-center com-margin-bottom-20" style="display: flex;">
                    <button class="back-btn com-pointer com-font-size-5 com-padding-2 com-border-clear">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <h2 class="restaurant-name">리뷰 작성</h2>
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
                    <span class="rating-text com-font-size-2">평가해주세요</span>
                </div>
    
                <textarea class="review-text-input com-margin-bottom-20 com-round-10 com-border-thin com-padding-3 com-width-100" placeholder="맛있게 드셨나요? 식당의 분위기와 서비스도 궁금해요!" style="height:150px; resize: none;"></textarea>
    
                <div class="photo-upload-container com-margin-bottom-20">
                    <div class="photo-upload-box">
                        <i class="fas fa-camera com-font-size-5 com-margin-bottom-small"></i>
                        <span>사진 추가</span>
                    </div>
                    <input type="file" id="reviewImage" name="images" class="photo-input" accept="image/*" multiple style="display: none;">
                    <div class="photo-preview-container" style="display: flex;"></div>
                </div>
    
                <button class="submit-review-btn com-btn-primary com-padding-3 com-round-10 com-pointer com-font-bold com-width-100">리뷰 등록하기</button>
            </div>
        </div>
    </main>

    <%@ include file="module/mobileNav.jsp" %>

</body>
</html>