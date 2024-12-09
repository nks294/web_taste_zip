$(document).ready(function () {

    // 모바일 감지 함수
    function isMobile() { return window.matchMedia("(max-width: 1024px)").matches; }
    function isPhone() { return window.matchMedia("(max-width: 480px)").matches; }

    // 타이틀 시간별 아침,점심,저녁 및 랜덤 카테고리 출력
    const hour = new Date().getHours();
    const time = hour < 12 ? '아침' : hour < 18 ? '점심' : '저녁';
    const menuKeyword = ["한식", "중식", "양식", "일식", "카페·디저트"][Math.floor(Math.random() * 3)];
    $('#recommand-title').html(`<i class="fas fa-fish-cooked"></i>오늘 #${time}은 #${menuKeyword} 으로 결정!`);


    // -------------------------------
    // 리뷰 데이터 가져오는 함수
    // -------------------------------
    
    async function fetchReview(targetId, count = 20) {
        try {
            const response = await $.ajax({
                url: '/api/reviews/all',
                method: 'GET',
                data: { page: 0, size: count }
            });
    
            const items = await Promise.all(response.content.map(async (review) => {
                const likeCount = await fetchLikes(review.reviewId);
                return {
                    id: review.placeId,
                    memIdx: review.memIdx,
                    reviewId: review.reviewId,
                    name: review.memberName,
                    desc: review.content || "내용이 없습니다.",
                    rate: review.rating || "N/A",
                    likes: likeCount,
                    img: review.imageUrl ? JSON.parse(review.imageUrl)[0] : '/resources/img/default-image.png',
                    profileImg: review.profileImage || '/resources/img/default-profile.png',
                    title: review.placeTitle
                };
            }));
    
            generateReviewList(targetId, items);
        } catch (error) {
            console.error("데이터를 불러오는 중 오류 발생:", error);
            $(`#${targetId} .card-list`).html('<li>데이터를 불러오는 데 실패했습니다.</li>');
        }
    }

    function fetchLikes(reviewId) {
        return $.ajax({
            url: `/api/reviews/${reviewId}/like/count`,
            method: 'GET',
            dataType: 'json'
        }).then((likeCount) => likeCount)
        .catch((error) => {
            console.error(`좋아요 수를 불러오는 중 오류 발생 (reviewId: ${reviewId}):`, error);
            return 0;
        });
    }

    function generateReviewList(targetId, items) {
        const listContainer = $(`#${targetId} .card-list`);
        listContainer.empty();

        items.forEach((item) => {
            const listItem = `
                <li class="com-list-hover-animate com-pointer com-round-15 com-overflow-hidden com-flex-no-shrink">
                    <a href="/map?placeId=${item.id}">
                        <div class="list-thumb-img com-flex-no-shrink com-width-100 com-overflow-hidden" style="height: 200px">
                            <img src="${item.img}" alt="${item.title || '이미지'}" class="com-img-fit">
                        </div>
                        <div class="list-content-wrapper com-padding-3 com-flex-col com-gap-15">
                            <strong>${item.title}</strong>
                            <div class="review-top-wrapper rv-wrapper com-flex-row com-flex-justify-spacebetween com-font-size-2 com-gap-10">
                                <a href="/myzip?id=${item.memIdx}" class="com-flex-no-shrink com-cursor-pointer"><img src="${item.profileImg}" alt="${item.name}의 프로필 사진" class="profile-image com-round-circle" style="height:50px; width: 50px;"></a>
                                <div class="reiview-info-pane com-flex-col com-gap-5 com-no-shrink com-width-100">
                                    <a href="/myzip?id=${item.memIdx}" class="com-flex-no-shrink com-cursor-pointer"><strong class="rv-name">${item.name}</strong></a>
                                    <div class="rv-desc com-font-size-2 com-height-100">${item.desc}</div>
                                    <div class="review-bottom-wrapper rv-wrapper com-flex-row com-flex-justify-spacebetween com-font-size-2">
                                        <div class="rv-rate"><i class="fas fa-star"></i> ${item.rate}</div>
                                        <div class="rv-like"><i class="fas fa-heart"></i> ${item.likes}</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </a>
                </li>`;
            listContainer.append(listItem);
        });
    }


    // -------------------------------
    // 식당 데이터 가져오는 함수
    // -------------------------------

    function fetchList(targetId, categoryName, theme="none", startIndex = 0, count = 10) {
        const page = Math.floor(startIndex / count);
        const size = count;
    
        $.ajax({
            url: '/places/searchOrCategory',
            method: 'GET',
            data: {
                category: categoryName || 'all',
                searchField: 'title',
                searchWord: '',
                theme: theme,
                page: page,
                size: size
            },
            success: function (response) {

                const items = shuffleArray(
                    response.content.map(place => ({
                        name: place.title,
                        id: place.placeId,
                        title: place.cat3 || "카테고리",
                        desc: place.overview || "상세 정보 없음",
                        rate: place.avgRating || "N/A",
                        likes: place.reviewCount || 0,
                        img: place.firstimage || 'https://via.placeholder.com/245x195'
                    }))
                );

                generateList(targetId, items, startIndex);
                updatePagenation(response.totalPages, response.pageable.pageNumber + 1);
            },
            error: function (error) {
                console.error("데이터를 불러오는 중 오류 발생:", error);
                $(`#${targetId} .card-list`).html('<li>데이터를 불러오는 데 실패했습니다.</li>');
            }
        });
    }

    // -------------------------------
    // 공통 카드형 목록 생성 함수
    // -------------------------------
    function generateList(targetId, items) {
        const listContainer = $(`#${targetId} .card-list`);
        listContainer.empty();

        items.forEach((item) => {
            const listItem = `
                <li class="com-list-hover-animate com-pointer com-round-15 com-overflow-hidden com-flex-no-shrink">
                    <a href="/map?placeId=${item.id}">
                        <div class="list-thumb-img com-flex-no-shrink com-width-100 com-overflow-hidden" style="height: 230px">
                            <img src="${item.img}" alt="${item.title || '이미지'}" class="com-img-fit">
                        </div>
                        <div class="list-content-wrapper com-padding-3 com-flex-col com-gap-5">
                            <div class="review-top-wrapper rv-wrapper com-flex-row com-flex-justify-spacebetween com-font-size-2">
                                <strong class="rv-name">${item.name}</strong>
                            </div>
                            <div class="rv-title">${item.title}</div>
                            <div class="rv-desc com-font-size-2">${item.desc}</div>
                            <div class="review-bottom-wrapper rv-wrapper com-flex-row com-flex-justify-spacebetween com-font-size-2">
                                <div class="rv-rate"><i class="fas fa-star"></i> ${item.rate}</div>
                                <div class="rv-like"><i class="fas fa-heart"></i> ${item.likes}</div>
                            </div>
                        </div>
                    </a>
                </li>`;
            listContainer.append(listItem);
        });
    }

    // -------------------------------
    // 1자형 목록 불러오기
    // -------------------------------
    fetchReview("reviews", 20);
    fetchList("today-theme", "all", "흑백요리사", 0, 20);
    fetchList("smart-zip", "all", "none", 0, 20);


    // -------------------------------
    // 카테고리별 추천 섹션
    // -------------------------------
    function itemsPerPage() { return isPhone() ? 4 : isMobile() ? 6 : 10; }

    const category = [
        { name: "한식", data: "ca001" },
        { name: "중식", data: "ca002" },
        { name: "서양식", data: "ca003" },
        { name: "일식", data: "ca004" },
        { name: "카페/찻집", data: "ca005" },
        { name: "이색음식점", data: "ca006" }
        // { name: "이색요리점", data: "ca007" }
    ];

    const tabHeader = $('#category .category-tab-header');
    const tabContent = $('#category .category-tab-contents');
    const recommandTotalItems = 50;

    let currentPage = 1;
    let recommandTotalPages = Math.ceil(recommandTotalItems / itemsPerPage());

    // 탭별 그리드 리스트를 집어넣고, 첫번째 카테고리 기본 활성화
    category.forEach(item => {
        let tabItem = `<div class="cate-tab-item com-width-100 com-padding-4 com-flex-row com-flex-justify-center com-flex-align-center com-pointer com-font-size-5 com-relative" data-tab="${item.data}">${item.name}</div>`;
        tabHeader.append(tabItem);
        let contentItem = 
            `<div class="cate-tab-content com-width-100" id="${item.data}" style="display:none;">
                <ul class="card-list com-gap-20"></ul>
            </div>`;
        tabContent.append(contentItem);
    });

    $('.cate-tab-item').first().addClass('active');
    $('.cate-tab-content').first().show();

    // 첫 탭 기본 로드
    fetchList("ca001", "한식", "none", 0, itemsPerPage());
    // generateList("ca001", getDummyItems(0, itemsPerPage(), "한식"));

    // 탭 변경 이벤트
    $(".cate-tab-item").click(function () {
        const tabId = $(this).data("tab");
        const categoryName = category.find(c => c.data === tabId)?.name || "all";
        const startIndex = (currentPage - 1) * itemsPerPage();
    
        $(".cate-tab-item").removeClass("active");
        $(this).addClass("active");
        fetchList(tabId, categoryName, "none", startIndex, itemsPerPage());
    
        $(".cate-tab-content").hide();
        $("#" + tabId).show();
    });

    // 페이지네이션
    $("#category .scroll-left").click(function () {
        if (currentPage > 1) {
            currentPage--;
            const tabId = $(".cate-tab-item.active").data("tab");
            const categoryName = category.find(c => c.data === tabId)?.name || "all";
            fetchList(tabId, categoryName, "none", (currentPage - 1) * itemsPerPage(), itemsPerPage());
        }
    });
    
    $("#category .scroll-right").click(function () {
        if (currentPage < recommandTotalPages) {
            currentPage++;
            const tabId = $(".cate-tab-item.active").data("tab");
            const categoryName = category.find(c => c.data === tabId)?.name || "all";
            fetchList(tabId, categoryName, "none", (currentPage - 1) * itemsPerPage(), itemsPerPage());
        }
    });

    // 다음, 이전 페이지 버튼 활성화, 비활성화 상태 업데이트
    function updatePagenation(totalPages, currentPage) {
        $('#category .scroll-left').prop('disabled', currentPage <= 1);
        $('#category .scroll-right').prop('disabled', currentPage >= totalPages);
    }

    // 현재 켜져있는 탭을 반환하는 함수
    function pickTab() {
        return $('.cate-tab-item.active').data('tab');
    }

    // 페이지 변경 함수
    function changePage(direction) {
        const tabId = pickTab();
        const categoryName = category.find(c => c.data === tabId)?.name || "all";
        const maxPages = recommandTotalPages;

        if (direction === "prev" && currentPage > 1) {
            currentPage--;
        } else if (direction === "next" && currentPage < maxPages) {
            currentPage++;
        } else {
            return;
        }

        const startIndex = (currentPage - 1) * itemsPerPage();
        fetchList(tabId, categoryName, "none", startIndex, itemsPerPage());
        updatePagenation(maxPages, currentPage);
    }

    let startX = 0;

    $('.cate-tab-content').on('touchstart', function (event) {
        startX = event.originalEvent.touches[0].clientX;
    });

    $('.cate-tab-content').on('touchend', function (event) {
        const threshold = 50;
        const touchEndX = event.originalEvent.changedTouches[0].clientX;
        const diffX = touchEndX - startX;

        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                changePage("prev");
            } else {
                changePage("next");
            }
        }
    });

    // 창 크기 조정 이벤트
    $(window).resize(function () {
        const tabId = pickTab();
        const categoryName = category.find(c => c.data === tabId)?.name || "all";
        const newItemsPerPage = itemsPerPage();
        const newTotalPages = Math.ceil(recommandTotalItems / newItemsPerPage);
    
        if (newTotalPages !== recommandTotalPages) {
            recommandTotalPages = newTotalPages;
    
            if (currentPage > recommandTotalPages) {
                currentPage = recommandTotalPages;
            }

            const startIndex = (currentPage - 1) * newItemsPerPage;
            fetchList(tabId, categoryName, "none", startIndex, newItemsPerPage);
    
            updatePagenation(recommandTotalPages, currentPage);
        }
    });

});

// 임시 함수
function getDummyItems(startIndex, count, categoryName) {
    return Array.from({ length: count }, (_, i) => ({
        name: `${categoryName} ${startIndex + i + 1}`,
        title: `${categoryName} 식당 ${startIndex + i + 1}`,
        desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
        rate: "5.0",
        likes: Math.floor(Math.random() * 100)
    }));
}

// 무작위로 섞는 함수
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}