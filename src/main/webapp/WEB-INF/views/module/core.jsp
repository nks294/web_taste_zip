<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- CSS  -->
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/css/common.css?v=<%=System.currentTimeMillis()%>"> <!-- 공용 스타일 -->
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/css/style.css?v=<%=System.currentTimeMillis()%>"> <!-- 전체 스타일시트 -->
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/css/mobile.css?v=<%=System.currentTimeMillis()%>"> <!-- 모바일 미디어 쿼리 -->

    <!-- JQuery -->
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    
    <!-- JS -->
    <script type="text/javascript" src="${pageContext.request.contextPath}/resources/js/script.js"></script>

    <!-- Kakao SDK -->
    <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=7d0b93d4daafc27bea0f6f9037b0e730&libraries=services&autoload=false"></script>
    <script type="text/javascript" src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"></script>

    <!-- Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com"> 
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap" rel="stylesheet"> <!-- Noto Sans -->
    <link href="https://fonts.googleapis.com/css2?family=Jua&display=swap" rel="stylesheet"> <!-- Jua -->

    <!-- Icon -->
    <link rel="icon" sizes="16x16" type="image/x-icon" href="${pageContext.request.contextPath}/resources/img/ico/favi16.ico">
    <link rel="icon" sizes="32x32" type="image/x-icon" href="${pageContext.request.contextPath}/resources/img/ico/favi32.ico">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/hung1001/font-awesome-pro@4cac1a6/css/all.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    <!-- Script -->
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