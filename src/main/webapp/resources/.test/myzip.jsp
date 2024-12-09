<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>    

<!DOCTYPE html>
<html lang="ko">
<%@ include file="module/core.jsp" %>
<script type="text/javascript" src="/resources/js/myzip.js"></script>

<body>
    <%@ include file="module/header.jsp" %>
    <main>
        <c:choose>
            <c:when test="${empty member}">
                <section id="myzip" class="com-border com-round">
                    <!-- Title Box -->
                    <div class="myzip-title-wrapper com-border-bottom com-color-primary">
                        <h1>MY ZIP</h1>
                    </div>
                
                    <!-- Profile Box -->
                    <div class="profile-wrapper">
                        <div class="profile-container">
                            <div class="profile-circle">
                                <img src="https://via.placeholder.com/150" alt="Profile Picture">
                            </div>
                        </div>
                    
                        <div class="profile-desc-wrapper">
                            <div class="profile-prefix-wrapper">
                                <p class="profile-prefix">익명의 미식가</p>
                                <div class="profile-badge-container">
                                    <!-- <span>뱃지</span> -->
                                </div>
                            </div>
                            <h2 class="profile-member-name">로그인이 필요합니다</h2>
                            <p class="profile-desc">로그인하고 맛.zip 의 모든 서비스들을 이용해보세요!</p>
                        </div>
                    </div>
                </section>

            </c:when>
            <c:otherwise>
                <section id="myzip" class="com-border com-round" data-memeber="${member.memIdx}">
                    <!-- Title Box -->
                    <div class="myzip-title-wrapper com-border-bottom com-color-primary">
                        <h1>MY ZIP</h1>
                    </div>
                
                    <!-- Profile Box -->
                    <div class="profile-wrapper com-border-bottom">
                        <div class="profile-container">
                            <div class="profile-circle">
                                <img src="https://via.placeholder.com/150" alt="Profile Picture">
                            </div>
                            <div class="profile-btn-wrapper">
                                <c:if test="${isOwner}">
                                    <button id="btn-edit-profile" class="com-btn-primary com-color com-border com-round">편집</button>
                                    <button class="com-btn-secondary com-color com-border com-round" onclick="location.href='member/logout.do'">로그아웃</button>
                                </c:if>
                            </div>
                        </div>
                    
                        <div class="profile-desc-wrapper">
                            <div class="profile-prefix-wrapper">
                                <p class="profile-prefix">초보 미식가</p>
                                <div class="profile-badge-container">
                                    <span>뱃지</span>
                                </div>
                            </div>
                            <h2 class="profile-member-name">${member.memberName}</h2>
                            <p class="profile-desc">안녕하세요! 전국 맛집 탐방이 취미인 미식가입니다.</p>
                        </div>
                    </div>
                
                    <!-- Category and Items Box -->
                    <div class="profile-info-wrapper">
                        <div class="profile-info-btn-wrapper">
                            <button class="category-btn com-color active" data-type="review">리뷰</button>
                            <button class="category-btn com-color" data-type="like">좋아요</button>
                            <button class="category-btn com-color" data-type="bookmark">북마크</button>
                            <button class="category-btn com-color" data-type="collection">컬렉션</button>
                        </div>
                    
                        <div class="item-grid"><div> <!-- ajax 요청으로 목록 불러옴 -->
                    </div>
                </section>
                
                <div id="edit-profile" class="com-border com-round com-bg hidden">
                
                    <button type="button" id="myzip-modal-close-btn" class="modal-close-btn com-color-primary com-round com-btn-secondary com-border">
                        <i class="far fa-times"></i>
                    </button>
                
                    <div class="profile-edit-content">
                        <div class="profile-edit-header">
                            <h2>프로필 편집</h2>
                        </div>

                        <form method="post" action="member/updateProcess.do">
                            <input type="hidden" name="memIdx" value="${member.memIdx}">
                            <input type="hidden" name="memberPw" value="${member.memberPw}">

                            <div class="profile-image-container">
                                <div class="profile-image-circle">
                                    <img src="https://via.placeholder.com/150" alt="Profile Picture">
                                    <div class="image-upload-overlay">
                                        <i class="fas fa-camera"></i>
                                        <input type="file" accept="image/*" class="profile-image-input hidden">
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
                                <label>전화번호</label>
                                <input type="text" name="phone" value="${member.phone}">
                            </div>
                        
                            <div class="form-group">
                                <label>생년월일</label>
                                <input type="text" name="birthday" value="${member.birthday}">
                            </div>
                        
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
            </c:otherwise>
        </c:choose>

    </main>

    <!-- 리뷰 자세히 보기 모달 -->
    <div id="reviewDetailModal" style="display: none;">
        <%@ include file="module/reviewDetail.jsp" %>
    </div>

    <!-- 모바일 전용 네비게이션 -->
    <%@ include file="module/mobileNav.jsp" %>
</body>
</html>