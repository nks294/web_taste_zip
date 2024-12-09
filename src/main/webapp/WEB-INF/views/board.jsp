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

            <section id="board" class="notice-area com-flex-1 com-margin-0">
                <div class="board-header com-flex-row com-flex-justify-spacebetween com-flex-align-center com-margin-bottom-50">
                    <h2 class="com-font-normal">공지사항.zip</h2>
                    <form action="/notice" method="get" class="com-flex-row com-gap-20">
                        <select name="searchField" class="search-field com-border-thin com-round-5 com-color com-padding-1">
                            <option value="title">제목</option>
                            <option value="content">내용</option>
                            <option value="writer">작성자</option>
                        </select>
                        <div class="search-container com-flex-row com-flex-align-center com-border-thin com-round-5" style="max-width: 400px;">
                            <button type="submit" id="search_btn" class="com-padding-primary com-color-primary com-margin-0"><i class="fas fa-search"></i></button>
                            <input type="text" name="searchWord" class="search-word com-border-clear" placeholder="검색">
                        </div>
                        <c:if test="${grade == 2}">
                            <a href="/notice/write" id="write_btn" class="write_btn com-btn-primary com-round-10 com-padding-primary com-text-center">새 글 작성</a>
                        </c:if>
                    </form>
                </div>
    
                <div class="board-contents">
                    <div class="tabs">
                        <ul class="com-flex-row com-font-size-5">
                            <li class="${category eq 'all' ? 'active' : ''} com-width-100 com-inline-flex"><a href="/notice?category=all" class="com-width-100 com-border-bottom-bold com-text-center com-padding-4">전체</a></li>
                            <li class="${category eq 'notice' ? 'active' : ''} com-width-100 com-inline-flex"><a href="/notice?category=notice" class="com-width-100 com-border-bottom-bold com-text-center com-padding-4">공지</a></li>
                            <li class="${category eq 'update' ? 'active' : ''} com-width-100 com-inline-flex"><a href="/notice?category=update" class="com-width-100 com-border-bottom-bold com-text-center com-padding-4">뉴스</a></li>
                            <li class="${category eq 'event' ? 'active' : ''} com-width-100 com-inline-flex"><a href="/notice?category=event" class="com-width-100 com-border-bottom-bold com-text-center com-padding-4">이벤트</a></li>
                        </ul>
                    </div>
                    
                    <div class="board-list com-padding-4">
                        <ul class="com-flex-col com-flex-justify-spacebetween com-flex-align-center com-border-bottom-thin">
                            <c:choose>
                                <c:when test="${empty boardList}">
                                    <li class="no-contents com-text-center com-font-size-4">등록된 게시글이 없습니다.</li>
                                </c:when>
                                <c:otherwise>
                                    <c:forEach var="board" items="${boardList}">
                                        <li class="com-width-100 com-padding-list-big com-flex-row com-flex-align-center com-flex-justify-spacebetween com-border-bottom-thin com-margin-bottom-10">
                                            <div class="board-title com-font-size-5">
                                                <a href="/notice/${board.boardId}">
                                                    ${board.title}
                                                </a>
                                            </div>
                                            <div class="board-info com-flex-row com-flex-align-center com-flex-justify-spacebetween com-gap-25">
                                                <span class="board-date com-flex-row com-flex-justify-spacebetween com-flex-align-center com-gap-10">
                                                    <i class="far fa-clock"></i>
                                                    <fmt:formatDate value="${board.createdDate}" pattern="yyyy-MM-dd HH:mm" />
                                                </span>
                                                <span class="board-views com-flex-row com-flex-justify-spacebetween com-flex-align-center com-gap-10">
                                                    <i class="far fa-eye"></i> ${board.readCnt}
                                                </span>
                                            </div>
                                        </li>
                                    </c:forEach>
                                </c:otherwise>
                            </c:choose>
                        </ul>
                    </div>
                
                    <div class="board-footer com-flex-row com-flex-align-center com-flex-justify-center com-relative com-margin-top-20 com-margin-bottom-30">
                        <div class="pagination com-flex-row com-flex-justify-center com-flex-align-center com-gap-30">
                            <c:if test="${totalPages > 1}">
                                <c:if test="${currentPage > 1}">
                                    <a href="/notice?category=${category}&page=${currentPage - 1}" class="page-link com-padding-1 com-font-size-3 com-font-normal com-color com-pointer">이전</a>
                                </c:if>
                            
                                <c:forEach var="i" begin="1" end="${totalPages}">
                                    <c:choose>
                                        <c:when test="${i == currentPage}">
                                            <span class="current-page page-link com-padding-1 com-font-size-3 com-font-normal com-color com-pointer">${i}</span>
                                        </c:when>
                                        <c:otherwise>
                                            <a href="/notice?category=${category}&page=${i}" class="page-link com-padding-1 com-font-size-3 com-font-normal com-color com-pointer">${i}</a>
                                        </c:otherwise>
                                    </c:choose>
                                </c:forEach>
                            
                                <c:if test="${currentPage < totalPages}">
                                    <a href="/notice?category=${category}&page=${currentPage + 1}" class="page-link com-padding-1 com-font-size-3 com-font-normal com-color com-pointer">다음</a>
                                </c:if>
                            </c:if>
                        </div>
                    </div>
                </div>
            </section>

        </main>
        
        <%@ include file="module/mobileNav.jsp" %>

        <%@ include file="module/scrollToTop.jsp" %>

        <%@ include file="module/footer.jsp" %>

    </body>
</html>