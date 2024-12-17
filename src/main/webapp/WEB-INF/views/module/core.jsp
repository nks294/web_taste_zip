<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- CSS  -->
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/css/common.css"> <!-- 공용 스타일 -->
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/css/style.css"> <!-- 전체 스타일 -->
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/css/mobile.css"> <!-- 미디어쿼리 -->
 
    <!-- JS -->
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script> <!-- jquery -->
    <script type="text/javascript" src="${pageContext.request.contextPath}/resources/js/script.js"></script> <!-- 유틸리티 스크립트 -->

    <!-- Kakao SDK -->
    <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=7d0b93d4daafc27bea0f6f9037b0e730&libraries=services"></script>
    <script type="text/javascript" src="https://t1.kakaocdn.net/kakao_js_sdk/2.6.0/kakao.min.js"></script>

    <!-- Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com"> <!-- notosans -->
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com"> <!-- Jua -->
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Jua&display=swap" rel="stylesheet">

    <!-- Icon -->
    <link rel="icon" type="image/x-icon" href="${pageContext.request.contextPath}/resources/img/ico/favicon.ico">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/hung1001/font-awesome-pro@4cac1a6/css/all.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    <script> 
        // 다크모드 감지
        if (localStorage.getItem("mode") === "dark") { document.documentElement.classList.add("dark-mode"); }
        
        // 전역변수로 contextPath 설정
        window.contextPath = "${pageContext.request.contextPath}";

        // 카카오 SDK 호출
        Kakao.init('7d0b93d4daafc27bea0f6f9037b0e730');
    </script>

    <!-- 타이틀 -->
    <title>우리들의 맛집 정보 모음집 - 맛.zip</title>
</head>