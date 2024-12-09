<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>    

<!DOCTYPE html>
<html lang="ko">
<%@ include file="module/core.jsp" %>
<script type="text/javascript" src="/resources/js/myzip.js"></script>

<body>
    <%@ include file="module/header.jsp" %>
    <main>
        <section id="myzip" class="com-border-primary com-round-10 com-width-100" data-member="${memberIdx}">
            <!-- Title Box -->
            <div class="myzip-title-wrapper com-color-primary com-text-center">
                <h3 class="com-padding-3">MY ZIP</h3>
            </div>
        
            <!-- Profile Box -->
            <div class="profile-wrapper com-flex-row com-padding-6 com-gap-50">
                <div class="profile-container">
                    <div class="profile-circle com-round-circle com-border-thin com-overflow-hidden com-margin-bottom-20">
                        <img src="${targetMem.profileImage != null ? targetMem.profileImage : '/resources/img/default-profile.png'}" alt="Profile Picture" class="com-img-fit com-padding-4">
                    </div>
                    <div class="profile-btn-wrapper com-flex-col com-gap-10">
                        <c:if test="${isOwner}">
                            <button id="btn-edit-profile" class="com-btn-primary com-color com-border-primary com-round-5">편집</button>
                            <button class="com-btn-secondary com-color com-border-primary com-round-5" onclick="location.href='member/logout.do'">로그아웃</button>
                        </c:if>
                    </div>
                </div>
            
                <div class="profile-desc-wrapper com-gap-10 com-flex-1 com-flex-col">
                    <div class="profile-prefix-wrapper com-flex-row com-flex-justify-spacebetween com-flex-align-center">
                        <p class="profile-prefix">초보 미식가</p>
                        <div class="profile-badge-container">
                            <span>뱃지</span>
                        </div>
                    </div>
                    <h2 class="profile-member-name com-font-normal">${targetMem.memberName}</h2>
                    <c:choose>
                        <c:when test="${empty targetMem.introduction}">
                            <p class="profile-desc com-text-center com-round-10 com-border-thin com-font-size-2 com-color com-round-10 com-padding-2 com-flex-1">설명이 없습니다.</p>
                        </c:when>
                        <c:otherwise>
                            <p class="profile-desc com-round-10 com-border-thin com-font-size-2 com-color com-round-10 com-padding-2 com-flex-1">${targetMem.introduction}</p>
                        </c:otherwise>
                    </c:choose>
                </div>
            </div>
        
            <!-- Category and Items Box -->
            <div class="profile-info-wrapper com-flex-col com-gap-25">
                <div class="profile-info-btn-wrapper com-flex-row com-gap-15 horizontal-scroll com-scroll-x">
                    <button class="tab-btn category-btn com-color com-relative com-flex-no-shrink com-flex-row com-flex-align-center com-flex-justify-center com-gap-10 active" data-section="#review"><i class="fas fa-comment rv-rate"></i>내 리뷰</button>
                    <button class="tab-btn category-btn com-color com-relative com-flex-no-shrink com-flex-row com-flex-align-center com-flex-justify-center com-gap-10" data-section="#like"><i class="fas fa-heart rv-like"></i>좋아요</button>
                    <button class="tab-btn category-btn com-color com-relative com-flex-no-shrink com-flex-row com-flex-align-center com-flex-justify-center com-gap-10" data-section="#bookmark"><i class="fas fa-bookmark rv-bookmark"></i>북마크</button>
                    <button class="tab-btn category-btn com-color com-relative com-flex-no-shrink com-flex-row com-flex-align-center com-flex-justify-center com-gap-10" data-section="#collection"><i class="fas fa-box-full com-color-primary"></i>컬렉션</button>
                </div>
            
                <div class="tab-content">
                    <!-- 리뷰 섹션 -->
                    <div id="review" class="tab-section">
                        <ul class="item-grid">
                            <!-- 리뷰 내용이 여기에 렌더링됩니다 -->
                        </ul>
                    </div>
                
                    <!-- 좋아요 섹션 -->
                    <div id="like" class="tab-section" style="display: none;">
                        <ul class="item-grid">
                            <!-- 좋아요한 리뷰 목록 -->
                        </ul>
                    </div>
                
                    <!-- 북마크 섹션 -->
                    <div id="bookmark" class="tab-section" style="display: none;">
                        <ul class="item-grid">
                            <!-- 북마크된 장소 목록 -->
                        </ul>
                    </div>
                
                    <!-- 컬렉션 섹션 -->
                    <div id="collection" class="tab-section" style="display: none;">
                        <!-- 패밀리어 -->
                        <div id="familiar-container">
                            <div class="com-border-bottom-thin com-width-100 com-padding-2 collection-header com-flex-row com-flex-justify-spacebetween">
                                <h5>패밀리어</h5>
                                <c:if test="${isOwner}">
                                    <button id="openGachaBtn" class="com-btn-primary com-round-5 com-padding-list">캐릭터 뽑기</button>
                                </c:if>
                            </div>
                            <ul class="collection-grid">
                            </ul>
                        </div>
                
                        <!-- 칭호 -->
                        <div id="title-container" style="margin-top: 20px;">
                            <h5 class="com-border-bottom-thin com-width-100 com-padding-2">칭호</h5>
                            <p>현재 준비 중입니다.</p>
                        </div>
                
                        <!-- 뱃지 -->
                        <div id="badge-container" style="margin-top: 20px;">
                            <h5 class="com-border-bottom-thin com-width-100 com-padding-2">뱃지</h5>
                            <p>현재 준비 중입니다.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        <div id="edit-profile" class="com-bg com-relative com-overflow-hidden com-border-primary com-round-20 com-z-index-1000 hidden">
        
            <button type="button" id="myzip-modal-close-btn" class="myzip-modal-close-btn com-color-primary">
                <i class="far fa-times"></i>
            </button>
        
            <div class="profile-edit-content com-round-10 com-padding-4">
                <div class="profile-edit-header com-flex-row com-flex-align-center com-flex-justify-center com-margin-bottom-20">
                    <h2>프로필 편집</h2>
                </div>

                <form method="post" action="member/updateProcess.do">
                    <input type="hidden" name="memIdx" value="${member.memIdx}">
                    <input type="hidden" name="memberPw" value="${member.memberPw}">
                    <input type="hidden" name="profileImage" id="profileImageInput" value="${member.profileImage}">

                    <div class="profile-image-container">
                        <div class="profile-image-circle">
                            <img src="${member.profileImage != null ? member.profileImage : '/resources/img/default-profile.png'}" alt="Profile Picture">
                            <div class="image-upload-overlay">
                                <i class="fas fa-edit"></i>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>아이디</label>
                        <input type="text" name="memberId" value="${member.memberId}" readonly>
                    </div>

                    <div class="form-group">
                        <label>이름</label>
                        <input type="text" name="memberName" value="${member.memberName}">
                    </div>

                    <div class="form-group">
                        <label>자기소개</label>
                        <textarea name="introduction" class="introduction-input" maxlength="500">${member.introduction}</textarea>
                    </div>

                    <!-- <div class="form-group">
                        <label>전화번호</label>
                        <input type="text" name="phone" value="${member.phone}">
                    </div>

                    <div class="form-group">
                        <label>생년월일</label>
                        <input type="text" name="birthday" value="${member.birthday}">
                    </div> -->

                    <div class="myzip-secondary-btn-wrapper">
                        <a href="javascript:void(0)" id="changePasswordBtn" class="com-color">비밀번호 변경</a>
                        <a href="javascript:void(0)" class="com-color">회원 탈퇴</a>
                    </div>

                    <button type="submit" class="save-profile-btn com-btn-primary com-round com-border">저장하기</button>
                </form>

            </div>
        </div>

        <!-- 비밀번호 변경 -->
        <div class="password-change-modal hidden" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1200; display: flex; justify-content: center; align-items: center;">
            <div class="profile-edit-content">
                <div class="profile-edit-header">
                    <button class="back-btn-pw">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <h2>비밀번호 변경</h2>
                </div>

                <form id="passwordChangeForm" method="post" action="member/updatePassword.do">
                    <input type="hidden" name="memIdx" value="${member.memIdx}">
                    <input type="hidden" name="memberId" value="${member.memberId}">

                    <div class="form-group">
                        <input type="password" name="currentPassword" placeholder="현재 비밀번호" required>
                    </div>
                    <div class="form-group">
                        <input type="password" name="memberPw" id="memberPw" placeholder="새 비밀번호" required>
                    </div>
                    <div class="form-group">
                        <input type="password" name="confirmPassword" placeholder="새 비밀번호 확인" required>
                    </div>
                    <button type="submit" class="save-profile-btn">변경하기</button>
                </form>
            </div>
        </div>
    </main>

    <%-- 리뷰 수정 모달 --%>
    <%@ include file="module/reviewForm.jsp" %>  

    <!-- 리뷰 자세히 보기 모달 -->
    <div id="reviewDetailModal" style="display: none;">
        <%@ include file="module/reviewDetail.jsp" %>
    </div>

    <div id="gachaModal" class="hidden" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1200; display: flex; justify-content: center; align-items: center;">
        <div class="gacha-content" style="width: 400px; height: 600px;">
            <iframe src="/randomCharacter" style="width: 100%; height: 100%; border: none;"></iframe>
        </div>
    </div>


    <!-- 모바일 전용 네비게이션 -->
    <%@ include file="module/mobileNav.jsp" %>
</body>
</html>