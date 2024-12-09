<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>    
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>로그인</title>
</head>
<body>
<h3>로그인</h3>
<hr>
<form method="post" action="loginProcess.do">
    <input type="text" name="memberId" placeholder="아이디"><br>
    <input type="password" name="memberPw" placeholder="비밀번호"><br>
    <input type="submit" value="로그인">
</form>
<!-- 카카오 로그인 링크 -->
<a href="/social/kakao/login">카카오 로그인하기</a>

<!-- 네이버 로그인 링크 -->
<a href="/social/naver/login">네이버 로그인하기</a>

<a href="/social/google/login>">구글 로그인하기</a>
	<!-- 로그인 실패 시 오류 메시지 출력 
	MemberController의 loginProcess()메소드에서 로그인 실패시 메시지를 Model객체에 저장함
	Model객체는 JSP페이지에서 다른 영역객체와 같이 EL로 쉽게 접근해서 사용할 수 있음
	-->
	<c:if test="${not empty msg}">
		<p> ${msg} </p>
	</c:if>

</body>
</html>