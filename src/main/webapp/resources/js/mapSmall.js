
// ---------------------------------------------------
// 지역별 추천 섹션 작은 지도 기능 스크립트 mapSmall.js
// ---------------------------------------------------

$(document).ready(function() {
    const regions = [
        { name: "서울", data: "서울", lat: 37.5665, lng: 126.9780, img: "001" },
        { name: "인천", data: "인천", lat: 37.4563, lng: 126.7052, img: "002" },
        { name: "대전", data: "대전", lat: 36.3504, lng: 127.3845, img: "003" },
        { name: "대구", data: "대구", lat: 35.8722, lng: 128.6018, img: "004" },
        { name: "광주", data: "광주", lat: 35.1595, lng: 126.8526, img: "005" },
        { name: "부산", data: "부산", lat: 35.1796, lng: 129.0756, img: "006" },
        { name: "울산", data: "울산", lat: 35.5384, lng: 129.3114, img: "007" },
        { name: "경기", data: "경기도", lat: 37.4138, lng: 127.5183, img: "008" },
        { name: "강원", data: "강원", lat: 37.8228, lng: 128.1555, img: "009" },
        { name: "충북", data: "충청북도", lat: 36.6357, lng: 127.4917, img: "010" },
        { name: "충남", data: "충청남도", lat: 36.5184, lng: 126.8000, img: "011" },
        { name: "경북", data: "경상북도", lat: 36.5760, lng: 128.5056, img: "012" },
        { name: "경남", data: "경상남도", lat: 35.2377, lng: 128.6923, img: "013" },
        { name: "전북", data: "전북", lat: 35.7175, lng: 127.1530, img: "014" },
        { name: "전남", data: "전라남도", lat: 34.8679, lng: 126.9910, img: "015" },
        { name: "제주", data: "제주", lat: 33.4996, lng: 126.5312, img: "016" }
    ];
    
    const regionsPerPage = 8;
    const totalPages = Math.ceil(regions.length / regionsPerPage);
    const regionListWrapper = document.querySelector('.region-list-wrapper');
    let currentRegionPage = 1;
    let isDragging = false, startX;
    
    const mapContainer = document.getElementById('map-small');
    const mapOptions = { center: new kakao.maps.LatLng(37.5665, 126.9780), level: 9 };
    const map = new kakao.maps.Map(mapContainer, mapOptions);
    
    // 지역목록 렌더링 함수
    function renderRegions() {
        regionListWrapper.innerHTML = '';
        if (isMobile()) {
            const regionListHTML = `
                <ul class="region-list com-width-100 com-height-100 com-gap-25">
                    ${regions
                        .map(
                            (region) =>
                                `<li data-region="${region.data}" data-lat="${region.lat}" data-lng="${region.lng}" class="com-border-primary com-text-center com-pointer com-overflow-hidden com-bg com-shadow-back com-relative com-flex-row com-flex-justify-center com-flex-align-center com-round-30">
                                    <img src="/resources/img/ico/region/${region.img}.png" class="com-img-fit">
                                    <span class="region-title com-color-white com-bg-primary-tr com-font-size-3 com-width-100">${region.name}</span>
                                </li>`
                        )
                        .join("")}
                </ul>
            `;
            regionListWrapper.innerHTML = regionListHTML;
            $("#prev-arrow, #next-arrow").addClass("hidden");
        } else {
            const regionListHTML = `
                <div class="region-slider com-flex-row">
                    ${Array.from({ length: totalPages }).map((_, i) => {
                        const start = i * regionsPerPage;
                        const end = start + regionsPerPage;
                        const pageRegions = regions.slice(start, end);
                    
                        return `
                            <ul class="region-list com-width-100 com-height-100 com-gap-25 page page-${i + 1}" style="left: ${i * 100}%; transition: transform 0.5s ease;">
                                ${pageRegions
                                    .map(
                                        (region) =>
                                            `<li class="com-border-primary com-text-center com-pointer com-overflow-hidden com-bg com-shadow-back com-relative com-flex-row com-flex-justify-center com-flex-align-center com-round-30" data-region="${region.data}" data-lat="${region.lat}" data-lng="${region.lng}">
                                                <img src="/resources/img/ico/region/${region.img}.png" class="com-img-fit">
                                                <span class="region-title com-color-white com-bg-primary-tr com-font-size-3 com-width-100">${region.name}</span>
                                            </li>`
                                    )
                                    .join("")}
                            </ul>
                        `;
                    }).join("")}
                </div>
            `;
            regionListWrapper.innerHTML = regionListHTML;
            $("#prev-arrow, #next-arrow").removeClass("hidden");
        }
    }
    
    // 페이지 이동함수
    function goToPage(page) {
        if (page < 1 || page > totalPages) return;
        currentRegionPage = page;
    
        const slider = document.querySelector('.region-slider');
        if (slider) {
            slider.style.transition = 'transform 0.5s ease';
            slider.style.transform = `translateX(-${(page - 1) * 50}%)`;
        }

    }
    
    // 초기화 메소드
    function init() {
        renderRegions(currentRegionPage);
    
        const restaurantList = $(".map-small-restaruant-list");
        restaurantList.empty();
        restaurantList.append('<li class="placeholder-message com-bg com-border-primary com-round-10 com-text-center com-font-size-3 com-padding-4">지역을 선택해주세요</li>');
    
        updateArrowVisibility();

        $("#prev-arrow").on("click", function () {
            if (currentRegionPage > 1) {
                goToPage(currentRegionPage - 1);
            }
            updateArrowVisibility();
        });
    
        $("#next-arrow").on("click", function () {
            if (currentRegionPage < totalPages) {
                goToPage(currentRegionPage + 1);
            }
            updateArrowVisibility();
        });
    
        $(document).on("click", ".region-list li", function () {
            const lat = $(this).data("lat");
            const lng = $(this).data("lng");
            const regionName = $(this).data("region");
    
            map.setCenter(new kakao.maps.LatLng(lat, lng));
            loadRestaurant(regionName, map);
        });

        $(document).on("click", ".region-list li", function () {
            const lat = $(this).data("lat");
            const lng = $(this).data("lng");
            const regionName = $(this).data('region');
            
            map.setCenter(new kakao.maps.LatLng(lat, lng));
            
            loadRestaurant(regionName, map);
        });
    
        $(".region-list-wrapper").on("mousedown touchstart", function (e) {
            startX = e.pageX || e.originalEvent.touches[0].pageX;
            isDragging = true;
        });
    
        $(document).on("mousemove touchmove", function (e) {
            if (isDragging) {
                const moveX = e.pageX || e.originalEvent.touches[0].pageX;
                const diffX = startX - moveX;
            
                if (Math.abs(diffX) > 50) {
                    isDragging = false;
                    if (diffX > 0 && currentRegionPage < Math.ceil(regions.length / regionsPerPage)) {
                        goToPage(currentRegionPage + 1);
                        updateArrowVisibility();
                    } else if (diffX < 0 && currentRegionPage > 1) {
                        goToPage(currentRegionPage - 1);
                        updateArrowVisibility();
                    }
                }
            }
        });
    
        $(document).on("mouseup touchend", function () {
            isDragging = false;
        });
    
        $(document).on("click", ".region-list li", function () {
            const lat = $(this).data("lat");
            const lng = $(this).data("lng");
            map.setCenter(new kakao.maps.LatLng(lat, lng));
        });

        $(window).resize(() => {
            renderRegions();
        });

    }
    
    function updateArrowVisibility() {
        if (currentRegionPage <= 1) {
            $("#prev-arrow").addClass("com-hide");
        } else {
            $("#prev-arrow").removeClass("com-hide");
        }

        if (currentRegionPage >= totalPages) {
            $("#next-arrow").addClass("com-hide");
        } else {
            $("#next-arrow").removeClass("com-hide");
        }
    }

    // 모바일 확인함수
    function isMobile() {
        return window.matchMedia("(max-width: 1024px)").matches;
    }

    let overlays = [];
    let markers = [];

    // 식당 목록 불러오는 메소드
    function loadRestaurant(regionName, map) {
        markers.forEach((marker) => marker.setMap(null));
        overlays.forEach((overlay) => overlay.setMap(null));
        markers = [];
        overlays = [];

        $.ajax({
            url: '/places/region',
            method: 'GET',
            data: {
                region: regionName
            },
            success: function (response) {
                const restaurantList = $(".map-small-restaruant-list");
                restaurantList.empty();
            
                if (response.length === 0) {
                    restaurantList.html(
                        '<li class="placeholder-message com-bg com-border-primary com-round-10 com-text-center com-font-size-3 com-padding-4">등록된 식당이 없습니다.</li>'
                    );
                    return;
                }
            
                response.forEach((place) => {
                    const listItem = `
                        <li class="com-padding-2 com-border-primary com-round-10 com-bg com-shadow-back">
                            <a href="/map?placeId=${place.placeId}" class="com-flex-row com-gap-15">
                                <div class="map-small-restaruant-list-img-container com-flex-no-shrink">
                                    <img src="${place.firstimage || 'https://via.placeholder.com/100x80'}" 
                                         alt="${place.title || '이미지'}" 
                                         class="com-img-fit com-round-10">
                                </div>
                                <div class="restraunt-info-wrapper com-flex-col com-width-100 com-gap-5">
                                    <div class="restraunt-name-container com-flex-row com-flex-align-center com-gap-10">
                                        <strong class="restraunt-name com-font-size-4">${place.title || '식당 이름'}</strong>
                                        <p class="restraunt-cat com-font-size-2 com-flex-no-shrink">${place.cat3 || '카테고리'}</p>
                                    </div>
                                    <p class="restraunt-desc com-font-size-2 com-overflow-hidden">
                                        ${place.addr1 || '주소 정보 없음'}
                                    </p>
                                </div>
                            </a>
                        </li>`;
                    restaurantList.append(listItem);
                
                    let markerPosition = new kakao.maps.LatLng(place.mapy, place.mapx);
                    let marker = new kakao.maps.Marker({
                        position: markerPosition,
                        map: map
                    });

                    const overlayContent = `
                        <div class="com-bg com-border-thin com-padding-1 com-round-5 com-text-center com-font-size-1 com-shadow-back">
                            <strong>${place.title || '식당 이름'}</strong><br>
                            <span style="color: gray;">${place.cat3 || '카테고리'}</span>
                        </div>
                    `;
    
                    let customOverlay = new kakao.maps.CustomOverlay({
                        position: markerPosition,
                        content: overlayContent,
                        yAnchor: 1.8
                    });
    
                    customOverlay.setMap(map);

                    markers.push(marker);
                    overlays.push(customOverlay);

                    kakao.maps.event.addListener(marker, 'click', function() {
                        window.location = `/map?placeId=${place.placeId}`;
                    });

                });
            },
            error: function (error) {
                console.error("지역 기반 식당 데이터를 불러오는 중 오류 발생:", error);
                $(".map-small-restaruant-list").html(
                    '<li class="error-message com-bg com-border-primary com-round-10 com-text-center com-font-size-3 com-padding-4">데이터를 불러오지 못했습니다.</li>'
                );
            }
        });
    }

    init();
})
