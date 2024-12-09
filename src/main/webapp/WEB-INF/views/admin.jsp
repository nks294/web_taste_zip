<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html lang="ko">

<%@ include file="module/core.jsp" %>

<script type="text/javascript" src="/resources/js/admin.js"></script>

<body>

    <style>
        
main {
    padding: 10px;
    max-width: 1200px;
    margin: 5px;
}

#reviewContainer {
    display: none;
}

#groupedReviewsContainer {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 10px;
}

.review-item {
    background: var(--zip-lightmode-bg);
    padding: 10px;
    border-radius: 5px;
    font-size: 0.85em;
    border: 1px solid var(--zip-lightmode-primary);
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.similarity-group {
    background: white;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid var(--zip-lightmode-primary);
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    position: relative;
}

.original-review {
    background: var(--zip-lightmode-hover);
    padding: 8px;
    margin: 5px 0;
    border-radius: 4px;
    font-size: 0.85em;
}

.similar-reviews {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
    z-index: 10;
    background: white;
    border: 1px solid var(--zip-lightmode-primary);
    border-radius: 0 0 5px 5px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.similar-reviews.expanded {
    max-height: 800px;
}

.similar-review {
    background: white;
    padding: 8px;
    margin: 5px 0;
    border-radius: 4px;
    font-size: 0.85em;
    border-left: 2px solid var(--zip-lightmode-primary);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.toggle-similar {
    padding: 4px 8px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 0.8em;
    margin-top: 5px;
}

.toggle-similar:hover {
    background: var(--zip-lightmode-hover);
}

.similarity-score {
    color: var(--zip-lightmode-primary);
    font-weight: bold;
    min-width: 80px;
    text-align: right;
    padding: 3px 6px;
    background: rgba(0,0,0,0.03);
    border-radius: 3px;
}


    .delete-review {
        top: 10px;
        right: 10px;
        padding: 4px 8px;
        cursor: pointer;
        font-size: 0.8em;
    }
    </style>

    <!-- 헤더 -->
    <%@ include file="module/header.jsp" %>

    <main id="review-check" class="com-margin-center">
        <section>

            <h2 class="com-text-center com-margin-bottom-20 com-padding-2">리뷰필터링</h1>

            <div class="btn-bundle com-flex-row com-gap-20 com-margin-bottom-20">
                <button id="loadReviews" class="com-btn-primary com-round-5 com-padding-primary com-flex-no-shrink">
                    리뷰 불러오기
                </button>

                <button id="calculateButton" class="com-btn-primary com-round-5 com-padding-primary com-flex-no-shrink" disabled>
                    중복 리뷰 찾기
                </button>

                <button id="deleteAllReviews" class="com-btn-primary com-round-5 com-padding-primary com-flex-no-shrink" disabled>
                    전체 삭제
                </button>
            </div>

            <div id="loadedReviewsContainer" class="hidden">
            </div>

            <p id="reviewCount" class="com-margin-bottom-20"></p>
            <div id="groupedReviewsContainer" class="com-border com-padding-2 com-round-10">
            </div>

        </section>
    </main>

</body>
</html>