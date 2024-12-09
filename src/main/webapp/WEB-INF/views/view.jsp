<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>    
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html lang="ko">

    <!-- <head> 태그 -->
    <%@ include file="module/core.jsp" %>
    
    <body>
        <!-- 헤더 -->
        <%@ include file="module/header.jsp" %>
        <main id="notice" class="com-flex-row com-flex-justify-center com-gap-40">
            
            <section id="view" class="notice-area com-flex-1 com-margin-0">

                <div class="board-header com-flex-row com-flex-justify-spacebetween com-flex-align-center com-margin-bottom-20">
                    
                    <c:choose>
                        <c:when test="${notice.category == 'notice'}">
                            <h2 class="com-font-normal">공지사항.zip</h2>
                        </c:when>
                        <c:when test="${notice.category == 'update'}">
                            <h2 class="com-font-normal">뉴스.zip</h2>
                        </c:when>
                        <c:when test="${notice.category == 'event'}">
                            <h2 class="com-font-normal">이벤트.zip</h2>
                        </c:when>
                    </c:choose>
                    <button onclick="location.href='/notice';" id="back_to_list" class="com-btn-primary com-padding-primary com-round-10">목록보기</button>
                </div>
                    <div class="board-info com-margin-bottom-20 com-flex-row com-flex-justify-spacebetween com-font-size-2 com-padding-2 com-gap-30">
                        <div class="board-title com-font-normal">
                            <h4>${notice.title}</h2>
                        </div>

                        <div class="board-info-wrapper com-flex-row com-flex-align-center com-flex-justify-spacebetween com-gap-25">
                            <span class="board-date com-flex-row com-flex-justify-spacebetween com-flex-align-center com-gap-10">
                                <i class="far fa-clock"></i>
                                <fmt:formatDate value="${notice.createdDate}" pattern="yyyy-MM-dd HH:mm" />
                            </span>
                            <span class="board-views com-flex-row com-flex-justify-spacebetween com-flex-align-center com-gap-10">
                                <i class="far fa-eye"></i><span id="read-count">${notice.readCnt}</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div class="board-content-wrapper com-padding-4 com-border-top-thin com-border-bottom-thin">
                    <div class="board-content">
                        ${notice.content}
                    </div>
                </div>

                <div class="board-button-bundle com-margin-bottom-20 com-flex-row com-flex-justify-center com-flex-align-center com-gap-20">
                    <c:choose>
                        <c:when test="${memIdx == notice.member.memIdx}">
                            <form action="/notice/write" method="get">
                                <input type="hidden" name="id" value="${notice.boardId}">
                                <input type="submit" value="수정하기" id="edit_button" class="com-padding-primary com-border-clear com-btn-primary com-round-5">
                            </form>
                            <form action="/notice/delete" method="post">
                                <input type="hidden" name="id" value="${notice.boardId}">
                                <input type="submit" value="삭제하기" id="delete_button" class="com-padding-primary com-border-clear com-btn-primary com-round-5">
                            </form>
                        </c:when>
                        <c:when test="${grade == 2}">
                            <form action="/notice/delete" method="post">
                                <input type="hidden" name="id" value="${notice.boardId}">
                                <input type="submit" value="삭제하기" id="delete_button" class="com-padding-primary com-border-clear com-btn-primary com-round-5">
                            </form>
                        </c:when>
                    </c:choose>
                
                </div>
            </section>

        </main>

        <%@ include file="module/mobileNav.jsp" %>

        <%@ include file="module/scrollToTop.jsp" %>
 
        <%@ include file="module/footer.jsp" %>

    </body>
</html>