<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>    
<!DOCTYPE html>
<html lang="ko">

    <!-- <head> 태그 내용 불러오는 jsp 파일 -->
    <%@ include file="module/core.jsp" %>

    <script type="text/javascript" src="/resources/js/main.js"></script>
    
    <body>
        <!-- 헤더 모듈로 불러오기 -->
        <%@ include file="module/header.jsp" %>

        <main>
            <section id="recommand">
                <div class="section-content-wrapper com-border com-shadow com-round">
                    <h3 class="section-title com-color-primary com-border-bottom"><i class="fas fa-utensils-alt"></i>지역별 맛.zip</h2>
                    <div class="section-content-horizontal-wrapper">
                        <div id="mob-popular-container" class="popular-restaurant-wrapper" style="display: none;">
                            <h5 class="popular-restaurant-title">#요즘_핫한_맛집</h5>
                            <div class="popular-restaurant-list com-border">
                                <a href="#" id="mob-restaurant-rotation"></a>
                            </div>
                            <div class="popular-restaurant-popup com-border com-shadow com-bg">
                                <ul id="restaurant-full-list"></ul>
                            </div>
                        </div>
                        <div class="region-list-container com-border-right">
                            <div class="region-list-wrapper horizontal-scroll">
                                <ul class="region-list"></ul>
                            </div>
                            <div class="pagenation-dots">
                                <span class="dot active" data-page="1"></span>
                                <span class="dot" data-page="2"></span>
                            </div>
                        </div>
                        <div class="map-small-container">
                            <div id="map-small" class="map-small" style="width: 1006px; height: 540px;"></div>
                        </div>
                    </div>
                </div>
            </section>
            <hr class="mobile-hr">
            <section id="reviews">
                <div class="section-content-wrapper com-border com-shadow com-round">
                    <h3 class="section-title com-color-primary com-border-bottom"><i class="fas fa-soup"></i>맛집 리뷰들을 한곳에, 리뷰.zip</h2>
                    <div class="card-list-wrapper">
                        <button class="scroll-left scroll-btn com-btn-circle com-color com-btn-secondary com-border com-list-hover-animate" disabled>
                            <i class="fa fa-chevron-left"></i>
                        </button>
                        <ul class="card-list"></ul>
                        <button class="scroll-right scroll-btn com-btn-circle com-color com-btn-secondary com-border com-list-hover-animate">
                            <i class="fa fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </section>
            <hr class="mobile-hr">
            <section id="category">
                <div class="section-content-wrapper  com-border com-shadow com-round">
                    <h3 id="recommand-title" class="section-title com-color-primary com-border-bottom">오늘 #아침은 #치킨으로 결정!</h2>
                    <div class="category-tab-header horizontal-scroll"></div>
                    <div class="category-tab-content-wrapper">
                        <div class="category-tab-contents com-border-bottom"></div>
                        <button id="prev-btn" class="scroll-btn com-btn-circle com-btn-secondary scroll-left com-color com-border com-list-hover-animate" disabled>
                            <i class="fa fa-chevron-left"></i>
                        </button>
                        <button id="next-btn" class="scroll-btn com-btn-circle com-btn-secondary scroll-right com-color com-border com-list-hover-animate">
                            <i class="fa fa-chevron-right"></i>
                        </button>
                    </div>
                    <div class="category-tab-banner">
                        광고 배너
                    </div>
                </div>
            </section>
            <hr class="mobile-hr">
            <section id="today-theme">
                <div class="section-content-horizontal-wrapper" style="gap: 20px;">
                    <div class="today-theme-list com-border com-shadow com-round">
                        <h3 class="section-title com-color-primary com-border-bottom"><i class="fas fa-sandwich"></i>특별한 한끼를 위한 #오늘의_테마 추천 식당</h2>
                        <div class="card-list-wrapper">
                            <ul class="card-list"></ul>
                            <button class="scroll-left scroll-btn com-color com-btn-circle com-btn-secondary com-border com-list-hover-animate" disabled>
                                <i class="fa fa-chevron-left"></i>
                            </button>
                            <button class="scroll-right scroll-btn com-color com-btn-circle com-btn-secondary com-border com-list-hover-animate">
                                <i class="fa fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                    <div class="today-theme-wrapper com-border com-shadow com-round">
                        <h3 class="section-title com-color-primary com-border-bottom"><i class="fas fa-seedling"></i>#오늘의_테마.zip</h2>
                        <div class="today-theme" style="height:100%; display: flex; justify-content: center; align-items: center;">
                            컨텐츠 영역
                        </div>
                    </div>
                </div>
            </section>
        </main>
        
        <!-- 반응형 모바일 네비게이션 모듈로 불러오기 -->
        <%@ include file="module/mobileNav.jsp" %>

        <!-- 푸터 모듈로 불러오기 -->
        <%@ include file="module/footer.jsp" %>

    </body>
</html>