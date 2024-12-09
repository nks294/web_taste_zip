<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>    
<!DOCTYPE html>
<html lang="ko">

    <!-- <head> 태그 -->
    <%@ include file="module/core.jsp" %>

    <!-- 메인화면 JS -->
    <script type="text/javascript" src="/resources/js/home.js"></script>
    <script type="text/javascript" src="/resources/js/mainBanner.js"></script>
    <script type="text/javascript" src="/resources/js/mapSmall.js"></script>
    
    <body class="com-no-select">
        <!-- 헤더 -->
        <%@ include file="module/header.jsp" %>
        
        <!-- 메인 배너 -->
        <section id="main-banner" class="com-margin-0 com-width-100">
            <div class="main-banner-wrapper com-relative com-overflow-hidden">
                <div class="banner-slides">
                    <a href="/notice/4"><img src="/resources/img/example/example_image_01.jpg" alt="이번주 리뷰왕은 누구?" data-link="/notice/4" data-title="이번주 리뷰왕은 누구?"></a>
                    <a href="/notice/5"><img src="/resources/img/example/example_image_02.jpg" alt="나만의 마커 커스터마이징 오픈!" data-link="/notice/5" data-title="나만의 마커 커스터마이징 오픈!"></a>
                    <a href="/notice/6"><img src="/resources/img/example/example_image_03.jpg" alt="이번달의 맛.zip 테마: #흑백요리사" data-link="/notice/6" data-title="이번달의 맛.zip 테마: #흑백요리사"></a>
                    <a href="/notice/7"><img src="/resources/img/example/example_image_04.jpg" alt='"클린 리뷰" 캠페인' data-link="/notice/7" data-title='"클린 리뷰" 캠페인'></a>
                    <a href="/notice/8"><img src="/resources/img/example/example_image_05.jpg" alt="신상 아이콘 4종 등장!" data-link="/notice/8" data-title="신상 아이콘 4종 등장!"></a>
                </div>
                <div class="banner-pagination-dots-wrapper com-width-100 com-padding-4 com-flex-row com-flex-align-center com-flex-justify-center">
                    <div class="banner-pagination-dots-contents com-max-width-1280 com-flex-row com-flex-align-center com-flex-justify-center">
                        <div class="banner-pagination-counter-wrapper com-flex-row com-gap-10">
                            <button class="main-banner-page-nav-btn main-banner-prev-btn com-color-white"><i class="far fa-chevron-left"></i></button>
                            <div class="page-counter com-relative com-flex-row com-gap-10 com-flex-justify-center com-flex-align-center com-font-bold com-color-white">
                                <span class="current-page com-font-size-6">1</span>
                                <div class="page-divider com-font-size-7 com-font-normal">/</div>
                                <span class="total-page com-font-size-6 com-color-primary">5</span>
                            </div>
                            <button class="main-banner-page-nav-btn main-banner-next-btn com-color-white"><i class="far fa-chevron-right"></i></button>    
                        </div>
                        <div class="banner-pagination-dots com-flex-row com-scroll-x com-no-scroll"></div>
                    </div>
                </div>
            </div>
        </section>

        <main>

            <section id="recommand">
                <h3 class="section-title com-color-primary com-margin-bottom-10"><i class="fas fa-utensils-alt"></i>지역별 맛.zip</h2>
                <div class="section-content-wrapper com-flex-col com-round-20">
                    <div class="map-small-container com-flex-row com-flex-1 com-flex-align-center com-flex-justify-center com-relative">
                        <div id="map-small" class="map-small com-round-10 com-width-100" style="height: 540px;"></div>
                        <div class="region-list-container com-flex-col com-height-100 com-flex-no-shrink com-relative">
                            <div class="region-list-wrapper com-height-100 horizontal-scroll com-flex-row com-overflow-hidden com-relative">
                                <ul class="region-list"></ul>
                            </div>
                            <button id="prev-arrow" class="arrow-btn left-arrow com-color-primary com-hide">
                                <i class="fas fa-chevron-left com-font-size-6"></i>
                            </button>
                            <button id="next-arrow" class="arrow-btn right-arrow com-color-primary">
                                <i class="fas fa-chevron-right com-font-size-6"></i>
                            </button>
                        </div>
                        <div class="map-small-restaruant-list-wrapper com-height-100 com-padding-4 com-no-scroll com-scroll-y" style="background: transparent;">
                            <ul class="map-small-restaruant-list com-flex-col com-gap-20"></ul>
                        </div>
                    </div>
                </div>
            </section>
            
            <section id="foo-banner1" class="com-relative com-border-thin com-round-20 com-flex-row com-flex-align-center com-flex-justify-center com-overflow-hidden" style="color: var(--zip-lightmode-text); height:250px; max-width:1630px;">
                <img src="/resources/img/example/example_image_06.jpg" alt="다용도 배너1" class="com-img-fit">
                <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: var(--zip-white); padding: 15px; border-radius:10px; background: #00000033">배너1</span>
            </section>

            <section id="category">
                <div class="section-content-wrapper com-flex-col com-round-20">
                    <h3 id="recommand-title" class="section-title com-color-primary com-margin-bottom-20">오늘 #아침은 #치킨으로 결정!</h2>
                    <div class="category-tab-header horizontal-scroll com-flex-row com-margin-bottom-20"></div>
                    <div class="category-tab-content-wrapper com-relative">
                        <div class="category-tab-contents com-overflow-hidden com-padding-1"></div>
                        <button class="scroll-left scroll-btn" disabled>
                            <span class="line line1"></span>
                            <span class="line line2"></span>
                        </button>
                        <button class="scroll-right scroll-btn">
                            <span class="line line1"></span>
                            <span class="line line2"></span>
                        </button>
                    </div>
                </div>
            </section>
            
            <section id="reviews">
                <h3 class="section-title com-color-primary com-margin-bottom-10"><i class="fas fa-soup"></i>맛집 리뷰들을 한곳에, 리뷰.zip</h2>
                <div class="section-content-wrapper com-flex-col com-round-20">
                    <div class="card-list-wrapper com-relative">
                        <button class="scroll-left scroll-btn" disabled>
                            <span class="line line1"></span>
                            <span class="line line2"></span>
                        </button>
                        <button class="scroll-right scroll-btn">
                            <span class="line line1"></span>
                            <span class="line line2"></span>
                        </button>
                        <ul class="card-list com-no-scroll com-flex-row com-scroll-x com-flex-no-wrap com-gap-30 com-padding-1 horizontal-scroll"></ul>
                    </div>
                </div>
            </section>

            <section id="foo-banner2" class="com-relative com-border-thin com-round-20 com-flex-row com-flex-align-center com-flex-justify-center com-overflow-hidden" style="color: var(--zip-lightmode-text); height:250px; max-width:1630px;">
                <img src="/resources/img/example/example_image_07.jpg" alt="다용도 배너2" class="com-img-fit">
                <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: var(--zip-white); padding: 15px; border-radius:10px; background: #00000033">배너2</span>
            </section>
            
            <section id="today-theme">
                <h3 class="section-title com-color-primary com-margin-bottom-10"><i class="fas fa-sandwich"></i><span class="hashtag">#이번달_테마</span> 추천 식당</h2>
                <div class="section-content-wrapper com-flex-col com-round-20">
                    <div class="card-list-wrapper com-relative">
                        <button class="scroll-left scroll-btn" disabled>
                            <span class="line line1"></span>
                            <span class="line line2"></span>
                        </button>
                        <button class="scroll-right scroll-btn">
                            <span class="line line1"></span>
                            <span class="line line2"></span>
                        </button>
                        <ul class="card-list com-no-scroll com-flex-row com-scroll-x com-flex-no-wrap com-gap-30 com-padding-1 horizontal-scroll"></ul>
                    </div>
                </div>
            </section>

            <section id="smart-zip">
                <h3 class="section-title com-color-primary com-margin-bottom-10"><i class="fas fa-server"></i>나를 위한 추천 식당</h2>
                <div class="section-content-wrapper com-flex-col com-round-20">
                    <div class="card-list-wrapper com-relative">
                        <button class="scroll-left scroll-btn" disabled>
                            <span class="line line1"></span>
                            <span class="line line2"></span>
                        </button>
                        <button class="scroll-right scroll-btn">
                            <span class="line line1"></span>
                            <span class="line line2"></span>
                        </button>
                        <ul class="card-list com-no-scroll com-flex-row com-scroll-x com-flex-no-wrap com-gap-30 com-padding-1 horizontal-scroll"></ul>
                    </div>
                </div>
            </section>
            
            <section id="foo-banner3" class="com-relative com-border-thin com-round-20 com-flex-row com-flex-align-center com-flex-justify-center com-overflow-hidden" style="color: var(--zip-lightmode-text); height:250px; max-width:1630px;">
                <img src="/resources/img/example/example_image_08.jpg" alt="다용도 배너3" class="com-img-fit">
                <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: var(--zip-white); padding: 15px; border-radius:10px; background: #00000033">배너3</span>
            </section>
            

        </main>
        
        <!-- 모바일 네비게이션 -->
        <%@ include file="module/mobileNav.jsp" %>

        <!-- 위로 스크롤 -->
        <%@ include file="module/scrollToTop.jsp" %>

        <!-- 푸터 -->
        <%@ include file="module/footer.jsp" %>

    </body>
</html>