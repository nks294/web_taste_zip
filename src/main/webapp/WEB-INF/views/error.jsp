<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>    
<!DOCTYPE html>
<html lang="ko">

    <!-- <head> 태그 -->
    <%@ include file="module/core.jsp" %>
    <title>에러.zip</title>
    
    <style>
        #error {
            display: flex;
            align-items: center;
            justify-content: center;
            max-width: 800px;
            text-align: center;
        }

        #error-container {
            min-width: 600px;
            margin: 0;
        }

        #error-container h1 {
            font-size: 28px;
            margin-bottom: 10px;
            color: #dc3545;
        }
        #error-container p {
            margin: 10px 0;
            font-size: 16px;
        }
        #error-container .details {
            margin-top: 20px;
            text-align: left;
            font-size: 14px;
            color: #666;
            word-wrap: break-word;
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #e0e0e0;
        }
        #error-container .btn {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
        }
        #error-container .btn:hover {
            background: #0056b3;
        }
    </style>

<body>
    <main id="error">
        <section id="error-container">

            <h1>오류 발생!</h1>
            <p>처리 중 문제가 발생했습니다. 아래 정보를 확인하세요.</p>
    
            <div class="details">
                <strong>예외 발생 시간:</strong>
                <p>${time}</p>
    
                <strong>예외 발생 URL:</strong>
                <p>${url}</p>
    
                <strong>예외 메시지:</strong>
                <p>${message}</p>
    
                <strong>스택 트레이스:</strong>
                <pre>${stackTrace}</pre>
            </div>
    
            <a href="/" class="btn">홈으로 돌아가기</a>
        </section>

        
    </main>
    
    <!-- 위로 스크롤 -->
    <%@ include file="module/scrollToTop.jsp" %>

</body>
</html>
