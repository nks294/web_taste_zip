<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>    

<script type="text/javascript" src="/resources/js/header.js"></script>

<style>
        
</style>

<header class="com-width-100 com-bg-header com-sticky-top com-z-index-top">
    <div class="title-wrapper com-white-to-primary com-color com-flex-row com-flex-align-center com-flex-justify-spacebetween com-relative com-max-width-1280 com-margin-center">

        <div class="header-left">
            <div id="popular-container" class="popular-restaurant-wrapper com-relative">
                <div class="popular-restaurant-mob-title"><i class="fas fa-fire-alt" aria-hidden="true"></i></div>
                <div class="popular-restaurant-title com-font-size-1 com-font-bold com-margin-bottom-small com-transition-bundle-05s">#요즘_핫한_맛집</div>
                <div class="popular-restaurant-list com-font-size-1 com-round-10 com-text-overflow com-transition-bundle-05s">
                    <a href="#" id="restaurant-rotation" class="com-block com-text-hover-underline"></a>
                </div>
                <div class="popular-restaurant-popup com-round-10 com-font-size-1 com-overflow-hidden">
                    <ul id="restaurant-full-list" class="com-flex-col com-bg-primary com-bg com-border com-round-10"></ul>
                </div>
            </div>
        </div>

        <div class="header-center">
            <a href="/" class="logo">
                <!-- <img src="/resources/img/logo-temp.png" alt="로고"> -->
                <h1 class="com-font-jua com-font-normal com-font-style-normal"><span></span></h1>
            </a>
        </div>

        <div class="header-right">
            <div class="header-btn-wrapper com-relative com-flex-row com-gap-20 com-font-size-6">
                <a href="javascript:void(0)" id="change-mode"><i class="mode-icon"></i></a>
                <a href="/map" id="goto-map"><i class="fas fa-map"></i></a>
                
                <c:choose>
                    <c:when test="${empty member}">
                        <a href="javascript:void(0)" id="do-login"><i class="fas fa-user"></i></a>
                    </c:when>
                    <c:when test="${member.memGrade == 2}">
                        <a href="/admin"><i class="fas fa-user-shield"></i></a>
                    </c:when>
                    <c:otherwise>
                        <a href="/myzip?id=${member.memIdx}"><i class="fas fa-user"></i></a>
                    </c:otherwise>
                </c:choose>
            </div>
        </div>
    </div>

    <!-- 모달 등장시 주변 어두워지게 하는 오버레이 -->
    <div id="modal-overlay" class="modal-overlay"></div>

    <!-- 로그인/회원가입 모달 -->
    <div id="login-register" class="hidden">

        <button type="button" id="modal-close-btn" class="modal-close-btn">
            <i class="far fa-times"></i>
        </button>
    
        <!-- 비밀번호 실시간 유효성 검사 툴팁 -->
        <div class="password-tooltip hidden" id="password-tooltip">
            <ul>
                <li id="length-check" class="font-size-1 com-margin-bottom-small invalid">8자 이상 입력</li>
                <li id="uppercase-check" class="font-size-1 com-margin-bottom-small invalid">대문자 포함</li>
                <li id="lowercase-check" class="font-size-1 com-margin-bottom-small invalid">소문자 포함</li>
                <li id="number-check" class="font-size-1 com-margin-bottom-small invalid">숫자 포함</li>
                <li id="special-check" class="font-size-1 com-margin-bottom-small invalid">특수문자 포함</li>
            </ul>
        </div>

        <!-- 트랜지션을 위한 overflow hidden 속성 div -->
        <div class="login-register-wrapper com-bg com-relative com-overflow-hidden com-border-primary com-round-20 com-z-index-1000">
            <div class="login-register-screen screen-expand com-relative com-overflow-hidden">

                <!-- 로그인 컨테이너 -->
                <div class="login-container com-relative com-overflow-hidden com-flex-col">
                    <div class="login-register-header com-flex-row com-flex-align-center com-flex-justify-center com-margin-bottom-20">
                        <p class="com-font-jua com-font-normal com-font-style-normal com-font-size-9 com-margin-top-15 com-color-primary">로그인</p>
                    </div>
                    <div class="login-register-contents com-flex-col com-flex-justify-center com-flex-align-center com-gap-5 com-flex-1 com-scroll-y">
                        <form action="/loginProcess.do" method="post" class="com-width-100 com-flex-col com-gap-10 com-flex-1">
                            
                            <div class="login-input com-flex-col com-gap-15 com-margin-bottom-20">
                                <div class="login-input-wrapper com-flex-col com-gap-15 com-margin-bottom-20">
                                    <input type="email" name="memberId" placeholder="이메일" class="input-text com-width-100 com-padding-primary com-margin-bottom-10">
                                    <input type="password" name="memberPw" placeholder="비밀번호" class="input-text com-width-100 com-padding-primary com-margin-bottom-10">
                                    <p id="error-message" class="error-message"></p>
                                </div>
                                <div class="login-input-footer com-flex-row com-flex-justify-spacebetween com-font-size-2 com-flex-align-center com-width-100">
                                    <div class="remember-login-wrapper com-flex-row com-flex-align-center com-gap-10">
                                        <input type="checkbox" name="remember_login" id="remember_login">
                                        <label for="remember_login">아이디 기억하기</label>
                                    </div>
                                    <a href="javascript:void(0)" class="forgot-password font-size-2 com-text-hover-underline">내 계정 찾기</a>
                                </div>
                            </div>
                            <div class="login-register-button-wrapper com-margin-top-10">
                                <input type="submit" id="btn-login" class="com-btn-primary com-width-100 com-round-5 com-padding-primary" value="로그인">
                                <div class="login-register-footer com-width-100 com-text-center com-margin-top-10">
                                    <span class="register-title font-size-2">아직 회원이 아니신가요?</span>
                                    <a href="javascript:void(0)" class="button-register font-size-2 com-text-hover-underline">회원가입</a>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="sns-login-wrapper com-width-100 com-flex-col com-flex-align-center com-gap-15 com-margin-bottom-20">
                        <span class="sns-login-title com-relative com-flex-row com-width-100 com-flex-align-center font-size-2">간편 로그인 / 회원가입</span>
                        <div class="sns-login-btn-bundle com-flex-row com-flex-justify-center com-gap-30">
                            <a href="/social/kakao/login" class="kakao com-round-circle com-flex-row com-flex-align-center com-border-thin com-flex-justify-center"><img src="/resources/img/ico/ico-kakao.svg" alt="카카오 로고"></a>
                            <a href="/social/naver/login" class="naver com-round-circle com-flex-row com-flex-align-center com-border-thin com-flex-justify-center"><img src="/resources/img/ico/ico-naver.svg" alt="네이버 로고"></a>
                            <a href="/social/google/login" class="google com-round-circle com-flex-row com-flex-align-center com-border-thin com-flex-justify-center"><img src="/resources/img/ico/ico-google.svg" alt="구글 로고"></a>
                        </div>
                    </div>
                </div>
                <!-- 로그인 컨테이너 끝 -->
        
                <!-- 회원가입 컨테이너 -->
                <div class="register-container com-relative com-overflow-hidden com-flex-col hidden">
                    <div class="login-register-header com-flex-row com-flex-align-center com-flex-justify-center com-margin-bottom-20">
                        <div class="step-indicator com-flex-row com-flex-justify-spacebetween com-width-100">
                            <div class=" step-1 com-width-100 com-text-center com-padding-3 active">약관 동의</div>
                            <div class=" step-2 com-width-100 com-text-center com-padding-3">계정 생성</div>
                            <div class=" step-3 com-width-100 com-text-center com-padding-3">정보 입력</div>
                        </div>
                    </div>
                    <div class="login-register-contents com-flex-col com-flex-justify-center com-flex-align-center com-gap-5 com-flex-1 com-scroll-y">
                        <form action="/member/joinProcess.do" method="post" class="com-width-100 com-flex-col com-gap-10 com-flex-1 com-flex-justify-center">
                            <div id="register-page-1" class="register-step login-input com-flex-col com-flex-justify-center com-flex-1 com-gap-15 com-margin-bottom-20">
                                <div class="welcome-wrapper com-flex-col com-text-center com-gap-20">
                                    <h1>안녕하세요!</p>
                                    <h3>맛.zip 사이트 가입을 환영합니다.</h3>
                                    <p class="welcome-desc">원활한 사이트 이용을 위해<br>아래 약관에 동의해주세요.</p>
                                    <div class="register-agreement-wrapper com-width-100 com-flex-row com-flex-justify-center com-flex-align-center com-gap-10 com-margin-top-20 com-font-size-4 com-font-bold">
                                        <input type="checkbox" name="register_agreement" id="register_agreement">
                                        <label for="register_agreement" id="register_agreement_label">이용 약관 동의</label>
                                    </div>
                                    <div class="login-register-button-wrapper">
                                    <button type="button" id="btn-next-step-1" class="btn-next-step com-round-10 com-width-100 com-padding-primary com-btn-primary" disabled>다음</button>
                                        <div class="login-register-footer com-width-100 com-text-center com-margin-top-10">
                                            <span class="register-title font-size-2">이미 회원이라면</span>
                                            <a href="javascript:void(0)" class="button-login font-size-2 com-text-hoverunderline">로그인</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- 약관 동의 팝업 -->
                            <div id="terms-modal">
                                <div id="terms-content" class="terms-content com-bg com-flex-col com-gap-15 com-scroll-y com-padding-3 com-margin-center com-width-100">
                                    <div class="terms-item">
                                        <div class="terms-checkbox-wrapper com-flex-row com-flex-align-center com-margin-bottom-small com-relative">
                                            <input type="checkbox" id="all-agree" class="terms-checkbox">
                                            <label for="all-agree" class="terms-checkbox-label">
                                                <strong>전체 동의하기</strong>
                                            </label>
                                        </div>
                                        <div class="terms-item-content font-size-2 com-scroll-y">
                                            <p>실명 인증된 아이디로 가입, 위치기반 서비스 이용약관(선택), 이벤트 및 혜택 정보 수신(선택) 동의를 포함합니다.</p>
                                        </div>
                                    </div>
        
                                    <div class="terms-item">
                                        <div class="terms-checkbox-wrapper com-flex-row com-flex-align-center com-margin-bottom-small com-relative">
                                            <input type="checkbox" id="agree-service" class="terms-checkbox">
                                            <label for="agree-service" class="terms-checkbox-label">
                                                <strong>맛.zip 이용 약관 (필수)</strong>
                                                <a href="javascript:void(0);" class="view-full-terms" data-terms="service">전체보기</a>
                                            </label>
                                        </div>
                                        <div class="terms-item-content font-size-2 com-scroll-y">
                                            <p>맛집의 서비스를 이용해주셔서 감사합니다. 본 약관은 맛.zip 이용과 관련하여 맛집 서비스를 제공하는 Team TasteZip 와 이를 이용하는 Lorem, ipsum dolor sit amet consectetur adipisicing elit. Provident minima suscipit sunt rem temporibus alias hic autem rerum nihil voluptatem ipsa nulla, possimus culpa atque harum debitis omnis ex vel.</p>
                                        </div>
                                    </div>
        
                                    <div class="terms-item">
                                        <div class="terms-checkbox-wrapper com-flex-row com-flex-align-center com-margin-bottom-small com-relative">
                                            <input type="checkbox" id="agree-privacy" class="terms-checkbox">
                                            <label for="agree-privacy" class="terms-checkbox-label">
                                                <strong>개인정보 수집 및 이용 (필수)</strong>
                                                <a href="javascript:void(0);" class="view-full-terms" data-terms="privacy">전체보기</a>
                                            </label>
                                        </div>
                                        <div class="terms-item-content font-size-2 com-scroll-y">
                                            <p>개인정보보호법에 따라 맛.zip 에 회원가입 신청하시는 분께 수집하는 개인정보의 항목, 개인 정보의 수집 및 이용목적, 개인정보의 보유 및 이용기간 Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia voluptate sint sed ut obcaecati illum vero explicabo iusto debitis consequatur? Ad, aspernatur illum nulla molestias assumenda ipsa? Officiis, a suscipit!</p>
                                        </div>
                                    </div>
        
                                    <div class="terms-item">
                                        <div class="terms-checkbox-wrapper com-flex-row com-flex-align-center com-margin-bottom-small com-relative">
                                            <input type="checkbox" id="agree-location" class="terms-checkbox">
                                            <label for="agree-location" class="terms-checkbox-label">
                                                <strong>위치기반 서비스 이용약관 (선택)</strong>
                                                <a href="javascript:void(0);" class="view-full-terms" data-terms="location">전체보기</a>
                                            </label>
                                        </div>
                                        <div class="terms-item-content font-size-2 com-scroll-y">
                                            <p>위치기반 서비스 이용약관에 동의하시면, 위치를 활용한 광고 정보 수신 등을 포함하는 맛.zip 위치기반 서비스를 이용할 수 있습니다 Lorem ipsum dolor sit, amet consectetur adipisicing elit. Id voluptas, aliquam asperiores delectus amet totam dignissimos perspiciatis doloremque repellat deleniti, ipsam voluptates. Sequi tenetur numquam aliquid quos delectus dolorem dicta.</p>
                                        </div>
                                    </div>
                                    <button type="button" id="agree-button" class="com-round-10 com-btn-primary com-padding-primary" disabled>동의하기</button>
                                </div>
                            </div>
                            <!-- 스텝 2, 계정 정보 입력 -->
                            <div id="register-page-2" class="register-step login-input com-flex-col com-gap-15 com-margin-bottom-20 hidden">
                                <div class="email-input-wrapper com-gap-10 com-flex-row">
                                    <input type="text" name="memberId" id="reg_member_id" placeholder="아이디(이메일)" class="input-text com-width-100 com-padding-primary com-margin-bottom-10   ">
                                    <button type="button" id="checkId" class="get-confirm com-round-10 com-btn-primary com-margin-bottom-10 com-flex-no-shrink">중복확인</button>
                                </div>
                                <p id="resultMsg" class="error-message"></p>
                            
                                <div id="auth_num_section" class="email-input-wrapper" style="display: none;">
                                    <input type="text" id="auth_num_input" class="input-text com-width-100 com-padding-primary com-margin-bottom-10   " placeholder="인증번호 6자리 입력" maxlength="6">
                                    <button type="button" id="confirm_email_btn" class="get-confirm com-round com-btn-primary">확인</button>
                                </div>
        
                                <input type="hidden" name="result_confirm" id="result_confirm">
                                <p id="resultEmail" class="error-message"></p>
        
                                <input type="password" name="memberPw" id="reg_member_pw" class="input-text com-width-100 com-padding-primary com-margin-bottom-10   " placeholder="비밀번호">
                                <p id="password-error" class="error-message"></p>
                            
                                <input type="password" name="auth_num_pw" id="confirm_password" class="input-text com-width-100 com-padding-primary com-margin-bottom-10   " placeholder="비밀번호 확인">
                                <p id="confirmPassword-error" class="error-message"></p>
        
                                <div class="login-register-button-wrapper">
                                    <button type="button" id="btn-next-step-2" class="com-width-100 com-padding-primary com-round-10 com-btn-primary" disabled>다음</button>
                                </div>
                            </div>
                            <!-- 스텝 3, 사용자 정보 입력 -->
                            <div id="register-page-3" class="register-step login-input com-flex-col com-gap-15 com-margin-bottom-20 hidden">

                                <div class="welcome-wrapper ">
                                    <h2>거의 다 왔습니다!</h2>
                                    <h3 class="welcome-desc">아래 추가 정보들을 입력하고<br>가입을 완료해주세요</h3>
                                </div>

                                <!-- 이름 -->
                                <input type="text" id="memberName" name="memberName" class="input-text com-width-100 com-padding-primary com-margin-bottom-10   " placeholder="이름">
                                <p id="name-error" class="error-message"></p>
                                
                                <!-- 프론트에서 보낼 때 phone 으로 컬럼명 설정 -->
                                <div class="phone-num-wrapper com-flex-row com-gap-15">
                                    <select id="member_phone_front" name="member_phone_front" class="input-text com-width-100 com-padding-primary com-margin-bottom-10   " readonly>
                                        <option value="010" selected>010</option>
                                    </select>
                                    <input type="text" id="member_phone_middle" name="member_phone_middle" placeholder="1234" class="input-text com-width-100 com-padding-primary com-margin-bottom-10   " maxlength="4">
                                    <input type="text" id="member_phone_back" name="member_phone_back" placeholder="5678" class="input-text com-width-100 com-padding-primary com-margin-bottom-10   " maxlength="4">
                                </div>
                                <p id="phone-num-error" class="error-message"></p>

                                <!-- 생년월일 8자리 -->
                                <input type="text" name="birthday" placeholder="생년월일 8자리" class="input-text com-width-100 com-padding-primary com-margin-bottom-10   " maxlength="8">
                                <p id="birthday-error" class="error-message"></p>
        
                                <!-- 최종 회원가입 폼 제출 -->
                                <div class="login-register-button-wrapper">
                                    <input type="submit" id="btn-register" class="btn-next-step com-btn-primary com-width-100 com-round-5 com-padding-primary com-margin-top-10" value="회원가입" disabled>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <!-- 회원가입 컨테이너 끝 -->
                 
            </div>
        </div>
    </div>

</header>