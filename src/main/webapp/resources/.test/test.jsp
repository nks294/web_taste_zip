<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>    
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>메인페이지</title>
</head>
<body>
    <h3>메인페이지</h3>
    <hr>
    
    <c:choose>
    	<c:when test="${empty member}">
   		    <!-- 로그인을 하지 않은 경우: 비회원용 내용 -->
		    <a href="member/join.do">회원가입</a><br>
		    <a href="member/login.do">로그인</a><br>
    	</c:when>
    	<c:otherwise>
    	    <!-- 로그인을 한 경우: 회원용 내용 -->
		    ${member.memberName} 님 환영합니다<br>
		    <a href="member/update.do">회원정보변경</a><br>
		    <a href="member/logout.do">로그아웃</a><br>
    	</c:otherwise>
    </c:choose>
    
    <hr>
    
    
    
    
	
</body>
</html>