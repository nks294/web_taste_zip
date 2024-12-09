<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>   
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>회원정보 변경</title>
</head>
<body>

<h1>회원정보 변경</h1>
    <form method="post" action="updateProcess.do">
    	<input type="hidden" name="m_idx" value="${member.m_idx}" >
        <input type="text" name="member_id" value="${member.member_id}" readonly><br>
        <input type="password" name="member_pw" value="${member.member_pw}"><br>
        <input type="text" name="member_name" value="${member.member_name}"><br>
        <input type="text" name="phone" value="${member.phone }"><br>
        <input type="text" name="birthday" value="${member.birthday}"><br>
        <input type="submit" value="변경하기">
        <input type="button" value="취소하기" onclick="location.href='../index.do'">
    </form>
    <br>
    <p>
    	<a href="#">회원 특별 이벤트</a>
    	<a href="#">포인트 조회</a>
    	<a href="javascript:cancel()">회원 탈퇴</a>
    </p>
    
    
	<!-- 회원정보 변경 실패 시 오류 메시지 출력 -->
	<c:if test="${not empty msg}">
		<p> ${msg} </p>
	</c:if>

	<script>
		function cancel(){
			const answer = confirm("정말 회원탈퇴 하겠습니까?");
			if(answer){
				location.href = "cancelProcess.do";
			}
		}
	
	</script>



</body>
</html>