<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>     
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>회원가입</title>
<script src="${pageContext.request.contextPath}/resources/js/jquery-3.7.1.min.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/join.js"></script>
</head>
<body>
<h1>회원가입</h1>
    <form method="post" action="joinProcess.do" name="frmJoin">
        <input type="text" name="memberId" id="member_id" placeholder="아이디(이메일)">
        <input type="button" id="checkId" value="중복검사"><br>        
        <div id="resultMsg"></div>
        
        <div>
        	<input type="text" id="auth_num_input" placeholder="인증번호 6자리를 입력해 주세요"
        		disabled="disabled" maxlength="6">
        	<input type="button" id="confirm_email_btn" value="인증확인">	
        </div>
        <input type="hidden" name="result_confirm" id="result_confirm">
        <div id="resultEmail"></div>
        
        <input type="password" name="memberPw" id="member_pw" placeholder="비밀번호"><br>
        <input type="text" name="memberName" placeholder="이름"><br>
        <input type="text" name="phone" placeholder="핸드폰"><br>
        <input type="text" name="birthday" placeholder="생일"><br>
        <input type="submit" value="가입하기">
    </form>
    
	<!-- 회원가입 실패 시 오류 메시지 출력 -->
	<c:if test="${not empty param.msg}">
		<p>${param.msg}</p>
	</c:if>

</body>
</html>