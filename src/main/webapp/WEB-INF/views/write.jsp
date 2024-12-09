<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="ko">

    <!-- <head> 태그 -->
    <%@ include file="module/core.jsp" %>

    <script src="${pageContext.request.contextPath}/resources/js/board.js"></script>
	<script src="https://cdn.ckeditor.com/ckeditor5/29.1.0/classic/ckeditor.js"></script>
    
    <body>
        <!-- 헤더 -->
        <%@ include file="module/header.jsp" %>
        
        <main id="notice-write">
            <section id="write" class="write">
                <form id="frmBoardWrite" class="com-flex-col com-width-100 com-height-100 com-gap-10" name="frmBoardWrite" action="/notice/save" method="post" enctype="multipart/form-data">
            
                    <h4 id="write-title" class="com-text-center com-width-100 com-border-primary-bottom com-color-primary com-margin-bottom-20">
                        <c:choose>
                            <c:when test="${not empty notice.boardId}">공지사항 수정</c:when>
                            <c:otherwise>새 공지사항 작성</c:otherwise>
                        </c:choose>
                    </h4>
            
                    <c:if test="${not empty notice.boardId}">
                        <input type="hidden" name="boardId" value="${notice.boardId}">
                    </c:if>
                    
                    <div class="input-title-wrapper com-flex-row com-flex-align-center com-gap-15">
                        <!-- 카테고리 선택 부분 -->
                        <select id="category" name="category" class="com-padding-primary com-round-5 com-pointer com-border-clear">
                            <option value="notice" ${notice.category == 'notice' ? 'selected' : ''}>공지</option>
                            <option value="update" ${notice.category == 'update' ? 'selected' : ''}>업데이트</option>
                            <option value="event" ${notice.category == 'event' ? 'selected' : ''}>이벤트</option>
                        </select>
            
                        <!-- 글 제목 입력 부분 -->
                        <input type="text" name="title" class="com-flex-1 com-border-clear" placeholder="글 제목" required value="${notice.title}">
        
                    </div>
            
                    <!-- 글 내용 입력 부분 -->
                    <div class="input-content-wrapper com-padding-3 com-height-100 com-border-top-thin com-border-bottom-thin">
                        <textarea id="editor" name="content" class="com-flex-1 com-border-clear" cols="30" rows="10" style="resize: none; min-height: 200px; max-height: 400px;">${notice.content}</textarea>
                    </div>
            
                    <!-- 버튼 부분 -->
                    <div class="board-button-bundle">
                        <a href="/notice" class="com-btn-primary">취소</a>
                        <input type="reset" value="다시입력" class="com-btn-primary">
                        <input type="submit" value="<c:choose><c:when test='${not empty notice.boardId}'>수정완료</c:when><c:otherwise>작성완료</c:otherwise></c:choose>" class="com-btn-primary">
                    </div>
                </form>
            </section>
        </main>
        
        <%@ include file="module/mobileNav.jsp" %>
        <script>

            const form = document.getElementById("frmBoardWrite");
        
            form.addEventListener("submit", function (event) {
                const confirmed = confirm("글을 등록하시겠습니까?");
                if (!confirmed) {
                    event.preventDefault();
                }
            });

            ClassicEditor.create(document.querySelector('#editor'), {
                toolbar: [
                    'heading', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'insertTable',
                    'imageUpload', 'mediaEmbed'
                ],
                ckfinder: {
                    uploadUrl: '/board/upload.do'
                },
                language: 'ko',
                table: {
                    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
                },
            }).catch(error => {
                console.error(error);
            });
        </script>
    </body>
</html>