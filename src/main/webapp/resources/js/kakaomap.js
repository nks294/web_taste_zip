$(document).ready(function () {
    const container = document.getElementById('map');
    const options = {
        center: new kakao.maps.LatLng(37.5665, 126.9780),
        level: 9,
    };
    const map = new kakao.maps.Map(container, options);

    // 음식점 리스트 동적 로딩
    function loadRestaurants() {
        for (let i = 0; i < 8; i++) {
            let listItem = `
                <div class="restaurant-item">
                    <div class="restaurant-thumb">
                        <img src="https://via.placeholder.com/100" alt="식당 썸네일">
                    </div>
                    <div class="restaurant-info">
                        <div class="restaurant-name">맛있는 식당 ${i + 1}</div>
                        <div class="restaurant-rating">
                            <i class="fas fa-star"></i> 4.5
                        </div>
                        <div class="restaurant-details">한식 • 서울시 강남구</div>
                        <div class="restaurant-details">1.2km</div>
                    </div>
                    <button class="bookmark-btn">
                        <i class="far fa-bookmark"></i>
                    </button>
                </div>
            `;
            $('.restaurant-list').append(listItem);
        }
    }

    // 초기 로딩
    loadRestaurants();

    // 북마크 버튼
    $(document).on('click', '.bookmark-btn', function () {
        $(this).find('i').toggleClass('far fas');
    });

    // 필터 버튼 이벤트
    $('.filter-button').click(function () {
        const filterIndex = $('.filter-button').index(this);
        const options = $('.filter-options').eq(filterIndex);
        $('.filter-options').addClass('hidden');
        $('.filter-button').removeClass('active');
        if (options.hasClass('hidden')) {
            options.removeClass('hidden');
            $(this).addClass('active');
        }
    });

    // 상세 보기 닫기
    $('.restaurant-detail-container .close-button').click(function () {
        $('.restaurant-detail-container').removeClass('show');
    });

    // 모바일 토글 버튼
    $('.mobile-toggle-handle').click(function () {
        $('.restaurant-container').toggleClass('collapsed');
        $('.map-container').toggleClass('expanded');
    });
});
