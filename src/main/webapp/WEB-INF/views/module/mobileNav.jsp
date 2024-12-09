<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>    

<nav class="mobile-nav com-bg com-border-primary-top com-width-100 com-flex-row com-flex-justify-spacearound com-flex-align-center">
    <div id="home-btn" class="tap-item com-text-center com-font-size-7 com-padding-1">
        <a href="/" class="com-flex-col com-flex-align-center">
            <i class="fas fa-home-lg"></i>
        </a>
    </div>
    <div class="tap-item com-text-center com-font-size-7 com-padding-1">
        <a href="/map" class="com-flex-col com-flex-align-center">
            <i class="fas fa-map"></i>
        </a>
    </div>
    
    <div class="tap-item com-text-center com-font-size-7 com-padding-1">
        
        <c:choose>
            <c:when test="${empty member}">
                <a href="javascript:void(0)" id="mob-do-login" class="com-flex-col com-flex-align-center">
                    <i class="fas fa-user-circle"></i>
                </a>
            </c:when>
            <c:otherwise>
                <a href="/myzip?id=${member.memIdx}"><i class="fas fa-user"></i></a>
            </c:otherwise>
        </c:choose>
    </div>
</nav>
<script>
    $(document).ready(function () {
        $('#home-btn').on('click', function (event) {
            if (window.location.pathname === '/') {
                event.preventDefault(); 
                $('html, body').animate({ scrollTop: 0 }, 500);
            }
        });
    });
</script>