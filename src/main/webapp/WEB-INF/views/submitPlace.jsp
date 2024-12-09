<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
    <%@ include file="module/core.jsp" %>
    <script type="text/javascript" src="/resources/js/submitPlace.js"></script>

<body>
    <div class="submit-form">
        <h2>맛집 등록하기</h2>
        <form id="placeSubmitForm" action="/places/submit" method="POST">
            <div class="form-group">
                <label for="title">가게명</label>
                <input type="text" id="title" name="title" required>
                <button type="button" id="checkTitleBtn" class="btn btn-secondary">중복확인</button>
                <div id="searchResults" style="display:none;" class="search-results">
                    <div class="results-container"></div>
                </div>
            </div>

            <div class="form-group">
                <label>카테고리</label>
                <div class="category-buttons">
                    <button type="button" class="category-btn" data-value="한식">한식</button>
                    <button type="button" class="category-btn" data-value="중식">중식</button>
                    <button type="button" class="category-btn" data-value="일식">일식</button>
                    <button type="button" class="category-btn" data-value="서양식">서양식</button>
                    <button type="button" class="category-btn" data-value="이색음식점">이색음식점</button>
                    <button type="button" class="category-btn" data-value="카페/찻집">카페/찻집</button>
                    <input type="hidden" id="cat3" name="cat3" required>
                </div>
            </div>

            <!-- <div class="form-group">
                <label for="theme">테마</label>
                <input type="text" id="theme" name="theme" >
            </div> -->

            <div class="form-group">
                <label>테마</label>
                <div class="theme-buttons">
                    <c:forEach items="${themes}" var="theme">
                        <button type="button" class="theme-btn" data-value="${theme}">${theme}</button>
                    </c:forEach>
                    <input type="text" id="custom-theme" placeholder="직접 입력">
                    <input type="hidden" id="theme" name="theme">
                </div>
            </div>
            
            <div class="form-group">
                <label for="areaname">지역명</label>
                <input type="text" id="areaname" name="areaname" >
            </div>

            <div class="form-group">
                <label for="addr1">주소</label>
                <div>
                    <input type="text" id="addr1" name="addr1">
                    <button type="button" id="searchAddress" class="btn btn-secondary">검색</button>
                    <div id="map" style="width:100%;height:400px;margin-top:20px;"></div>
                    <button type="button" id="getCoordinates" class="btn btn-primary" style="display:none;">좌표 입력</button>
                </div>
            </div>

            <div class="form-group">
                <label for="mapx">위도(map x)</label>
                <input type="text" id="mapx" name="mapx" >
            </div>

            <div class="form-group">
                <label for="mapy">경도(map y)</label>
                <input type="text" id="mapy" name="mapy" >
            </div>


            <div class="form-group">
                <label for="firstimage">대표 이미지 URL</label>
                <input type="text" id="firstimage" name="firstimage" >
            </div>

            <div class="form-group">
                <label for="firstmenu">대표 메뉴</label>
                <input type="text" id="firstmenu" name="firstmenu" >
            </div>

            <div class="form-group">
                <label for="homepage">홈페이지</label>
                <input type="text" id="homepage" name="homepage">
            </div>

            <div class="form-group">
                <label for="tel">전화번호(tel)</label>
                <input type="text" id="tel" name="tel" >
            </div>

            <div class="form-group">
                <label for="opentimefood">영업시간</label>
                <textarea id="opentimefood" name="opentimefood" ></textarea>
            </div>

            <div class="form-group">
                <label for="restdatefood">휴무일</label>
                <input type="text" id="restdatefood" name="restdatefood" >
            </div>

            <div class="form-group">
                <label for="treatmenu">취급 메뉴</label>
                <textarea id="treatmenu" name="treatmenu" ></textarea>
            </div>

            <button type="submit" class="submit-btn">등록하기</button>
        </form>
    </div>

</body>
</html>
