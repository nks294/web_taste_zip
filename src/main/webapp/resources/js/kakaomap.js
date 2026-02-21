$(document).ready(function () {
    kakao.maps.load(function () {
        const container = document.getElementById('map');
        const options = {
            center: new kakao.maps.LatLng(37.5665, 126.9780),
            level: 9,
        };
        const map = new kakao.maps.Map(container, options);
    });

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

    loadRestaurants();

    $(document).on('click', '.bookmark-btn', function () {
        $(this).find('i').toggleClass('far fas');
    });

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

    $('.restaurant-detail-container .close-button').click(function () {
        $('.restaurant-detail-container').removeClass('show');
    });

    $('.mobile-toggle-handle').click(function () {
        $('.restaurant-container').toggleClass('collapsed');
        $('.map-container').toggleClass('expanded');
    });
});