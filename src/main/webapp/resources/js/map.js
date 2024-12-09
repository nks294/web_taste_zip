$(function () {

    // 맵 초기화 함수
    function initMap() {
        const container = document.getElementById('map');
        const options = {
            center: new kakao.maps.LatLng(37.5665, 126.9780),
            level: 4,
            draggable: true,
            zoomable: true
        };
        const map = new kakao.maps.Map(container, options);

        map.setZoomable(true);
        map.setDraggable(true);

        navigator.geolocation.getCurrentPosition(
            function(position) {
                currentPosition = new kakao.maps.LatLng(
                    position.coords.latitude, 
                    position.coords.longitude
                );

                currentPositionMarker = new kakao.maps.Marker({
                    position: currentPosition,
                    map: map,
                    image: new kakao.maps.MarkerImage(
                        $('#currentUserProfileImage').val() || '/resources/img/default-profile.png',
                        new kakao.maps.Size(50, 50),
                        {offset: new kakao.maps.Point(25, 25)}
                    )
                });

                let moveLatLng = new kakao.maps.LatLng(
                    position.coords.latitude - 0.002,
                    position.coords.longitude - 0.003
                );
                map.panTo(moveLatLng);
            },
            function(error) {
                console.log("Geolocation failed:", error);
            }
        );
        map.setDraggable(true);
        return map;
    }


    // ───────────────────────────────────────────
    //            지도 목록 관련 기능
    // ───────────────────────────────────────────

    let currentPage = 0;
    let currentKeyword = "";
    let currentCategory = "all";
    let currentSortType = 'distance';
    let currentTheme = "none";
    const pageSize = 20;
    
    // 페이지네이션 업데이트
    function updatePaginationUI(totalPages) {
        const maxPageButtons = 10;
        const currentGroup = Math.floor(currentPage / maxPageButtons);
        const startPage = currentGroup * maxPageButtons;
        const endPage = Math.min(startPage + maxPageButtons, totalPages);
    
        const pageNumbersContainer = $('.page-numbers');
        pageNumbersContainer.empty();
    
        $('.first-page').prop('disabled', currentPage === 0);
        $('.prev-page').prop('disabled', currentPage === 0);
    
        for (let i = startPage; i < endPage; i++) {
            const pageButton = $('<button>')
                .addClass('pagination-btn page-number')
                .text(i + 1)
                .toggleClass('active', i === currentPage)
                .data('page', i);
            pageNumbersContainer.append(pageButton);
        }
    
        $('.next-page').prop('disabled', currentPage >= totalPages - 1);
        $('.last-page').prop('disabled', currentPage >= totalPages - 1);
    }
    
    // 페이지네이션 버튼 클릭 이벤트
    $('.pagination-container').on('click', '.pagination-btn', function () {
        if ($(this).hasClass('first-page')) {
            currentPage = 0;
        } else if ($(this).hasClass('prev-page')) {
            currentPage = Math.max(0, currentPage - 1);
        } else if ($(this).hasClass('next-page')) {
            currentPage = Math.min(totalPages - 1, currentPage + 1);
        } else if ($(this).hasClass('last-page')) {
            currentPage = totalPages - 1;
        } else if ($(this).hasClass('page-number')) {
            currentPage = $(this).data('page');
        }
        loadPlaces();
    });

    // 식당 목록 집어넣기
    function displayPlaces(places) {
        places = sortPlaces(places, currentSortType);
        $('.restaurant-list').empty();
        placesData.forEach(place => {
            place.marker?.setMap(null);
        });

        placesData = places;
        places.forEach(function(place) {
            let markerPosition = new kakao.maps.LatLng(place.mapy, place.mapx);
            let marker = new kakao.maps.Marker({
                position: markerPosition,
                map: map
            });
            place.marker = marker;

            let restaurantItem = $('<div>').addClass('restaurant-item com-flex-row com-border-bottom-thin com-gap-15 com-pointer').attr('data-id', place.placeId);
            let thumbDiv = $('<div>').addClass('restaurant-thumb com-flex-no-shrink com-overflow-hidden com-round-5');
            let infoDiv = $('<div>').addClass('restaurant-info com-color com-flex-col com-flex-1 com-gap-5');
            let bookmarkBtn = $('<button>')
                .addClass('bookmark-btn com-flex-no-shrink com-border-clear com-pointer com-color com-font-size-4')
                .attr('data-place-id', place.placeId)
                .append($('<i>').addClass('far fa-bookmark'));

            thumbDiv.append($('<img>').attr('src', place.firstimage || 'https://via.placeholder.com/100').addClass('com-img-fit'));
            infoDiv.append($('<div>').addClass('restaurant-name').text(place.title));
            const ratingDiv = $('<div>').addClass('restaurant-rating rv-rate com-font-size-2');

            getPlaceStats(place.placeId).then(stats => {
                ratingDiv.html(stats.formattedHtml);
            });

            infoDiv.append(ratingDiv);
            infoDiv.append($('<div>').addClass('restaurant-details')
                .append($('<div>').text(place.cat3))
                .append($('<div>').text(place.addr1))
                .append($('<div>').text(place.opentimefood))
                .append($('<div>').addClass('distance-info').text(function() {
                    if (currentPosition && place.mapy && place.mapx) {
                        let lat1 = Number(currentPosition.getLat());
                        let lng1 = Number(currentPosition.getLng());
                        let lat2 = Number(place.mapy);
                        let lng2 = Number(place.mapx);

                        if (!isNaN(lat1) && !isNaN(lng1) && !isNaN(lat2) && !isNaN(lng2)) {
                            let distance = calculateDistance(lat1, lng1, lat2, lng2);
                            if (distance < 1) {
                                return (distance * 1000).toFixed(0) + 'm';
                            }
                            return distance.toFixed(1) + 'km';
                        }
                    }
                    return '위치 정보 없음';
                }))
            );

            restaurantItem.append(thumbDiv).append(infoDiv).append(bookmarkBtn);
            $('.restaurant-list').append(restaurantItem);

            initializeBookmarkState(place.placeId);

            kakao.maps.event.addListener(marker, 'click', function() {
                $('.restaurant-detail-container').addClass('show');
                currentPlaceId = place.placeId;
                updateDetailView(place);
                loadPlaceReviews(place.placeId);
            });
        });
    }

    // 데이터 가져오기
    function loadPlaces() {
        $.ajax({
            url: '/places/searchOrCategory',
            method: 'GET',
            data: {
                category: currentCategory,
                theme: currentTheme,
                searchField: 'title',
                searchWord: currentKeyword,
                page: currentPage,
                size: pageSize
            },
            success: function(response) {
                displayPlaces(response.content);
                totalPages = response.totalPages;
                updatePaginationUI(totalPages);
                console.log("Sending theme:", currentTheme);
            },
            error: function (error) {
                console.error("데이터를 불러오는 중 오류 발생:", error);
            }
        });
    }

    // 리스트 정렬
    function sortPlaces(places, sortType = 'distance') {
        if (sortType === 'distance' && currentPosition) {
            return places.sort((a, b) => {
                const lat1 = Number(currentPosition.getLat());
                const lng1 = Number(currentPosition.getLng());
                
                const distA = calculateDistance(lat1, lng1, Number(a.mapy), Number(a.mapx));
                const distB = calculateDistance(lat1, lng1, Number(b.mapy), Number(b.mapx));
                
                return distA - distB;
            });
        } else if (sortType === 'popularity') {
            return places.sort((a, b) => {
                const aStats = placeStatsCache.get(a.placeId) || { rating: 0, count: 0 };
                const bStats = placeStatsCache.get(b.placeId) || { rating: 0, count: 0 };

                if (bStats.rating === aStats.rating) {
                    return bStats.count - aStats.count;
                }
        
                return bStats.rating - aStats.rating;
            });
        }
        return places;
    }

    //별점 평균, 리뷰 수 표시
    function getPlaceStats(placeId) {
        if (placeStatsCache.has(placeId)) {
            return Promise.resolve(placeStatsCache.get(placeId));
        }
    
        return $.ajax({
            url: `/places/api/places/${placeId}/stats`,
            method: 'GET',
            dataType: 'json'
        }).then(stats => {
            const rating = stats && stats.avgRating ? stats.avgRating : 0;
            const count = stats && stats.reviewCount ? stats.reviewCount : 0;
            const formattedStats = {
                rating: rating,
                count: count,
                formattedRating: rating.toFixed(1),
                formattedHtml: `
                    <span class="stars">★ ${rating.toFixed(1)}</span>
                    <span class="review-count">리뷰 ${count}개</span>
                `,
                formattedDetailHtml: `
                    <span class="detail-stars">★ ${rating.toFixed(1)}</span>
                    <span class="detail-review-count">리뷰 ${count}개</span>
                `
            };
            placeStatsCache.set(placeId, formattedStats);
            return formattedStats;
        });
    }

    // 필터 버튼 처리: 카테고리
    $('.filter-button').eq(0).click(function() {
        if($('.category-options').hasClass('hidden')) {
            $('.theme-options').addClass('hidden');
            $('.category-options').removeClass('hidden');
            $('.filter-button').removeClass('active');
            $(this).addClass('active');
        } else {
            $('.category-options').addClass('hidden');
            $(this).removeClass('active');
        }
    });
    
    // 필터 버튼 처리: 테마
    $('.filter-button').eq(1).click(function() {
        if($('.theme-options').hasClass('hidden')) {
            $('.category-options').addClass('hidden');
            $('.theme-options').removeClass('hidden');
            $('.filter-button').removeClass('active');
            $(this).addClass('active');
        } else {
            $('.theme-options').addClass('hidden');
            $(this).removeClass('active');
        }
    });
    
    // 카테고리 옵션 변경
    $('.category-options .option-btn').click(function() {
        currentCategory = $(this).text();
        currentTheme = "none";
        currentPage = 0;
        loadPlaces();
    });

    // 테마 옵션 변경
    $('.theme-options .option-btn').click(function() {
        currentTheme = $(this).text(); 
        $('.filter-button').eq(1).text($(this).text());
        $('.theme-options').addClass('hidden');
        $('.filter-button').eq(1).removeClass('active');
        currentPage = 0;  
        loadPlaces(); 
    });


    // 검색
    function handleSearch() {
        const keyword = $('.search-bar input').val().trim();
        if (keyword) {
            currentKeyword = keyword;
            currentPage = 0;
            loadPlaces();
        }
    }
    
    // 검색 버튼 클릭 이벤트
    $('.search-btn').on('click', handleSearch);
    
    // 검색 입력창에서 엔터 키 입력 이벤트
    $('.search-bar input').on('keydown', function (e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // 정렬 옵션 변경
    $('.filter-button').eq(2).click(function() {
        let $btn = $(this);
        const isDistanceSort = $btn.text() === '거리순';
        $btn.text(isDistanceSort ? '인기순' : '거리순');
        
        currentSortType = isDistanceSort ? 'popularity' : 'distance';
        placesData = sortPlaces(placesData, currentSortType);
        displayPlaces(placesData);
    });
    
    // 기본 식당 목록 불러오기
    loadPlaces();


    // 식당 목록에 있는 아이템 클릭시 세부정보 보이기
    $(document).on('click', '.restaurant-item', function() {
        let placeId = $(this).data('id');
        let place = placesData.find(p => p.placeId === placeId);
        currentPlaceId = placeId;

        let moveLatLng = new kakao.maps.LatLng(
            place.mapy, 
            Number(place.mapx) - 0.009 
        );
        map.panTo(moveLatLng);

        updateDetailView(place);
        $('.restaurant-detail-container').addClass('show');
        loadPlaceReviews(placeId);
    });

    // 리뷰 작성 버튼 클릭
    $('.detail-button').on('click', function(e) {
        if($(this).find('i').hasClass('fa-edit')) {
            
            e.preventDefault();
            const currentUserMemIdx = $('#currentUserMemIdx').val();
            
            if (!currentUserMemIdx) {
                alert('로그인후 이용 가능한 서비스입니다.');
                return;
            }
            
            $('.review-modal').removeClass('hidden');
        }
    });

    // 북마크 활성화 비활성화
    function toggleBookmark(placeId) {
        const bookmarkIcon = $('.bookmark-btn[data-place-id="' + placeId + '"] i');
        const isCurrentlyBookmarked = bookmarkIcon.hasClass('fas');
        const currentUserMemIdx = $('#currentUserMemIdx').val();
        
        if (!currentUserMemIdx) {
            alert('로그인후 이용 가능한 서비스입니다.');
            return;
        }

        bookmarkIcon.toggleClass('far fas');

        $.ajax({
            url: '/places/api/bookmarks/toggle',
            method: 'POST',
            data: JSON.stringify({ placeId: placeId }),
            contentType: 'application/json'
        });
    }

    // 북마크 초기화
    function initializeBookmarkState(placeId) {
        $.ajax({
            url: '/places/api/bookmarks/check/' + placeId,
            method: 'GET',
            dataType: 'json',
            success: function(isBookmarked) {
                const bookmarkIcon = $('.bookmark-btn[data-place-id="' + placeId + '"] i');
                if(isBookmarked === true) {
                    bookmarkIcon.removeClass('far').addClass('fas');
                    const place = placesData.find(p => p.placeId === placeId);
                    if(place && place.marker) {
                        const bookmarkedMarkerImage = new kakao.maps.MarkerImage(
                            '/resources/img/marker_bookmarked.png',
                            new kakao.maps.Size(30, 35),
                            { offset: new kakao.maps.Point(12, 35) }
                        );
                        place.marker.setImage(bookmarkedMarkerImage);
                    }
                }
            }
        });
    }

    const map = initMap();
    let placeStatsCache = new Map();
    let placesData = [];
    let currentPlaceId;
    let currentPosition;
    let currentPositionMarker;
    let bookmarkMarkers = [];


    // ───────────────────────────────────────────
    //            맵 컨트롤 섹션 버튼들
    // ───────────────────────────────────────────

    // 북마크 표시
    $('.bookmark-control').click(function() {
        $(this).find('i').toggleClass('far fas');
        const isBookmarkMode = $(this).find('i').hasClass('fas');

        if(isBookmarkMode) {
            $.ajax({
                url: '/places/api/bookmarks',
                method: 'GET',
                dataType: 'json',
                success: function(bookmarkedPlaces) {
                    bookmarkedPlaces.forEach(place => {
                        const isVisible = placesData.some(p => p.placeId === place.placeId);
                        if(isVisible) return;

                        const markerPosition = new kakao.maps.LatLng(place.mapy, place.mapx);
                        const bookmarkedMarkerImage = new kakao.maps.MarkerImage(
                            '/resources/img/marker_bookmarked.png',
                            new kakao.maps.Size(30, 35),
                            { offset: new kakao.maps.Point(12, 35) }
                        );

                        const bookmarkMarker = new kakao.maps.Marker({
                            position: markerPosition,
                            map: map,
                            image: bookmarkedMarkerImage
                        });

                        kakao.maps.event.addListener(bookmarkMarker, 'click', function() {
                            $('.restaurant-detail-container').addClass('show');
                            currentPlaceId = place.placeId;
                            updateDetailView(place);
                            loadPlaceReviews(place.placeId);
                        });

                        bookmarkMarkers.push(bookmarkMarker);
                    });
                }
            });
        } else {
            bookmarkMarkers.forEach(marker => {
                marker.setMap(null);
            });
            bookmarkMarkers = [];
        }
    });

    // 현재 위치로 이동
    $('.location-control').click(function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    currentPosition = new kakao.maps.LatLng(
                        position.coords.latitude, 
                        position.coords.longitude
                    );

                    if (currentPositionMarker) {
                        currentPositionMarker.setMap(null);
                    }

                    currentPositionMarker = new kakao.maps.Marker({
                        position: currentPosition,
                        map: map,
                        image: new kakao.maps.MarkerImage(
                            $('#currentUserProfileImage').val() || '/resources/img/default-profile.png',
                            new kakao.maps.Size(50, 50),
                            {offset: new kakao.maps.Point(25, 25)}
                        )
                    });

                    map.setCenter(currentPosition);
                    map.setLevel(4);
                },
                function(error) {
                    console.error(error);
                    alert('위치 정보를 가져올 수 없습니다.');
                }
            );
        } else {
            alert('이 브라우저에서는 위치 정보를 지원하지 않습니다.');
        }
    });

    // 식당 세부정보 업데이트
    function updateDetailView(place) {
        $('.restaurant-detail-name').text(place.title);
        $('.detail-rating-stats').remove();
        const ratingStatsDiv = $('<div>').addClass('detail-rating-stats rv-rate com-margin-bottom-20');
        getPlaceStats(place.placeId).then(stats => {
            ratingStatsDiv.html(stats.formattedDetailHtml);
        });
        $('.restaurant-detail-name').after(ratingStatsDiv);
        $('.restaurant-detail-header img').attr('src', place.firstimage || 'https://via.placeholder.com/500x350');
        $('.restaurant-info p:nth-child(1)').text('주소: ' + place.addr1);
        $('.restaurant-info p:nth-child(2)').text('전화번호: ' +place.infocenterfood);
        $('.restaurant-info p:nth-child(3)').text('영업시간: ' +place.opentimefood);
        $('.restaurant-info p:nth-child(4)').text(place.restdatefood);
        $('.restaurant-info p:nth-child(5)').text(place.parkingfood);
        $('.restaurant-info p:nth-child(6)').text(place.treatmenu);
        $('.restaurant-info p:nth-child(7)').text(place.chkcreditcardfood);
        $('.restaurant-info p:nth-child(8)').text(place.packing);
        $('.restaurant-info p:nth-child(9)').text(place.overview);
        $('.restaurant-detail-buttons .detail-button:first')
            .attr('data-place-id', place.placeId)
            .find('i')
            .removeClass('fas')
            .addClass('far');

        initializeBookmarkState(place.placeId);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const placeId = urlParams.get('placeId');
    console.log('Initial URL params:', { placeId, from: urlParams.get('from') });

    $(document).on('click', '.navi-button', function() {
        const place = placesData.find(p => p.placeId === currentPlaceId);
        if (place) {
            navigateToPlace(place.mapy, place.mapx, place.title);
        }
    });

    $(document).on('click', '.detail-button', function() {
        if($(this).find('i').hasClass('fa-share-alt')) {
            const place = placesData.find(p => p.placeId === currentPlaceId);
            if(place) {
                Kakao.Share.sendDefault({
                    objectType: 'feed',
                    content: {
                        title: place.title,
                        description: `${place.cat3}\n${place.addr1}\n${place.opentimefood || ''}`,
                        imageUrl: place.firstimage || 'https://via.placeholder.com/500x350',
                        link: {
                            mobileWebUrl: window.location.origin + '/map?placeId=' + place.placeId,
                            webUrl: window.location.origin + '/map?placeId=' + place.placeId
                        }
                    },
                    buttons: [
                        {
                            title: '맛집 보러가기',
                            link: {
                                mobileWebUrl: window.location.origin + '/map?placeId=' + place.placeId,
                                webUrl: window.location.origin + '/map?placeId=' + place.placeId
                            }
                        }
                    ]
                });
            }
        }
    });

    $(document).on('click', '.bookmark-btn', function(e) {
        e.stopPropagation();
        const currentUserMemIdx = $('#currentUserMemIdx').val();
        
        if (!currentUserMemIdx) {
            alert('로그인후 이용 가능한 서비스입니다.');
            return;
        }

        const placeId = $(this).attr('data-place-id');
        toggleBookmark(placeId);
    });

    $(document).on('click', '.detail-bookmark-btn', function(e) {
        e.stopPropagation();
        const currentUserMemIdx = $('#currentUserMemIdx').val();
        
        if (!currentUserMemIdx) {
            alert('로그인후 이용 가능한 서비스입니다.');
            return;
        }

        const placeId = $(this).attr('data-place-id');
        toggleBookmark(placeId);
    });

    // 좋아요 버튼 처리
    $(document).on('click', '.like-btn', function(e) {
        e.preventDefault();
        const currentUserMemIdx = $('#currentUserMemIdx').val();
        
        if (!currentUserMemIdx) {
            alert('로그인이 필요한 서비스입니다.');
            return;
        }
    
        const $btn = $(this);
        const $icon = $btn.find('i');
        const reviewId = $btn.data('review-id');
        const isLiked = $icon.hasClass('fas');
    
        const method = isLiked ? 'DELETE' : 'POST';
        const likeUrl = `/api/reviews/${reviewId}/like?memIdx=${currentUserMemIdx}`;
    
        $.ajax({
            url: likeUrl,
            method: method,
            success: function() {
                $icon.toggleClass('far fas');
                
                $.ajax({
                    url: `/api/reviews/${reviewId}/like/count`,
                    method: 'GET',
                    dataType: 'json',
                    success: function(count) {
                        $btn.find('.like-count').text(count);
                    }
                });
            }
        });
    });

    
    // 별점 선택
    $('.stars i').on('click', function() {
        const rating = $(this).data('rating');
        $('.stars i').each(function(index) {
            if (index < rating) {
                $(this).removeClass('far').addClass('fas');
            } else {
                $(this).removeClass('fas').addClass('far');
            }
        });
        $('.rating-text').text(`${rating}점을 선택하셨습니다`);
    });

    // 리뷰 업로드 버튼 처리
    $('.photo-upload-box').click(function() {
        $('#reviewImage').trigger('click');
    });

    // 리뷰 이미지 재업로드
    $('#reviewImage').on('change', function() {
        const files = Array.from(this.files);
        
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = function(event) {
                const dataUrl = event.target.result;
                
                const img = $('<img>', {
                    src: dataUrl,
                    class: 'preview-image',
                    style: 'display: block !important; width: 100px !important; height: 100px !important; object-fit: cover !important;'
                });
                
                const container = $('<div>', {
                    class: 'preview-image-container'
                }).append(img).append('<button type="button" class="remove-preview">×</button>');
                
                $('.photo-preview-container').append(container);
            };
            reader.readAsDataURL(file);
        });
    });

    // 리뷰 사진 지우기
    $(document).on('click', '.remove-preview', function() {
        $('.photo-preview-container').empty();
        $('#reviewImage').val('');
    });

    // 리뷰 등록
    $('.submit-review-btn').on('click', function() {
        const formData = new FormData();
        const fileInput = document.getElementById('reviewImage');

        console.log('Total files selected:', fileInput.files.length);

        Array.from(fileInput.files).forEach((file, index) => {
            console.log('File being added:', file.name, file.size);
            formData.append(`images[]`, file);  
        });

        const reviewData = {
            rating: $('.stars .fas').length || 0,
            content: $('.review-text-input').val(),
            place: { placeId: currentPlaceId },
            member: { memIdx: parseInt($('#currentUserMemIdx').val()) || 0 },
            status: 1
        };

        formData.append("review", JSON.stringify(reviewData));

        $.ajax({
            url: '/api/reviews/create',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                console.log('Server response:', response);
                $('.review-modal').addClass('hidden');
                loadPlaceReviews(currentPlaceId);
                // Reset form
                $('.stars i').removeClass('fas').addClass('far');
                $('.rating-text').text('평가해주세요');
                $('.review-text-input').val('');
                $('.photo-preview-container').empty();
                $('#reviewImage').val('');

                $.ajax({
                    url: `/api/characters/points/add/${$('#currentUserMemIdx').val()}`,
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ points: 1 }),
                    success: function(newPoints) {
                        alert('리뷰 작성 완료! 1포인트가 적립되었습니다.');
                    }
                });
            },
            error: function(xhr, status, error) {
                console.error('Error details:', xhr.responseText);
            }
        });
    });

    $('.review-modal .back-btn').on('click', function() {
        $('.review-modal').addClass('hidden');
        $('.stars i').removeClass('fas').addClass('far');
        $('.rating-text').text('평가해주세요');
        $('.review-text-input').val('');
        $('.photo-preview-container').empty();
        $('#reviewImage').val('');
    });



    $('.toggle-button').click(function() {
        $('.restaurant-list-container').toggleClass('expanded collapsed');
    });



    // 다른 페이지에서의 리다이렉트 핸들러
    if((urlParams.get('from') === 'review' || urlParams.get('from') === 'myzip' || !urlParams.get('from')) && placeId) {
        setTimeout(() => {
            $.ajax({
                url: '/places/api/getPlace/' + placeId,
                method: 'GET',
                success: function(place) {
                    currentPlaceId = place.placeId;

                    const lat = parseFloat(place.mapy);
                    const lng = parseFloat(place.mapx);

                    let moveLatLng = new kakao.maps.LatLng(lat, lng - 0.009);
                    console.log('Moving map to:', {lat, lng, moveLatLng});

                    map.setCenter(moveLatLng);
                    map.setLevel(4);

                    placesData.forEach(p => p.marker?.setMap(null));
                    placesData = [place];

                    displayPlaces([place]);
                    updateDetailView(place);
                    loadPlaceReviews(place.placeId);
                    $('.restaurant-detail-container').addClass('show');
                }
            });
        }, 100);
    }

    // 좋아요 상태 초기화
    function initializeLikeState(reviewId) {
        const currentUserMemIdx = $('#currentUserMemIdx').val();
        if (currentUserMemIdx) {
            $.ajax({
                url: `/api/reviews/${reviewId}/like/check`,
                method: 'GET',
                dataType: 'json',
                data: { memIdx: currentUserMemIdx },
                success: function(isLiked) {
                    const likeIcon = $(`.like-btn[data-review-id="${reviewId}"] i`);
                    if(isLiked) {
                        likeIcon.removeClass('far').addClass('fas');
                    }
                }
            });
        }
    }
    
    // 선택한 식당의 리뷰 목록 불러오기
    function loadPlaceReviews(placeId) {
        $.ajax({
            url: '/api/reviews/place/' + placeId,
            method: 'GET',
            dataType: 'json',
            success: function(reviews) {
                const reviewsContainer = $('.restaurant-reviews');
                reviewsContainer.empty().append('<h3>리뷰</h3>');
    
                reviews = typeof reviews === 'string' ? JSON.parse(reviews) : reviews;
    
                if(!reviews || reviews.length === 0) {
                    reviewsContainer.append('<p>첫 리뷰를 작성해보세요!</p>');
                    return;
                }
    
                reviews.forEach(review => {
                    const reviewItem = $('<div>').addClass('review-item');
                    const content = $('<div>').addClass('review-content');
                    const meta = $('<div>').addClass('review-meta');
    
                    const profileSection = $('<div>').addClass('review-profile');
                    const profileImg = $('<img>')
                        .addClass('review-profile-image')
                        .attr('src', review.profileImage || '/resources/img/default-profile.png')
                        .attr('alt', 'Profile Image')
                        .css('cursor', 'pointer')
                        .click(function() {
                            window.location.href = `/myzip?id=${review.memIdx}`;
                        });
                    profileSection.append(profileImg);
                    content.append(profileSection);
    
                    const reviewInfo = $('<div>').addClass('review-info');
                    const userName = $('<div>')
                        .addClass('review-user-name')
                        .text(review.memberName)
                        .css('cursor', 'pointer')
                        .click(function() {
                            window.location.href = `/myzip?id=${review.memIdx}`;
                        });
                    reviewInfo.append(userName);
                    reviewInfo.append($('<div>').addClass('review-rating').text('★'.repeat(review.rating || 0)));
                    content.append(reviewInfo);
                    
                    if (review.imageUrl) {
                        const photos = $('<div>').addClass('review-photos com-flex-row com-gap-5 com-flex-no-wrap');
                        try {
                            let urls = review.imageUrl;
                            if (typeof urls === 'string') {
                                urls = JSON.parse(urls);
                            }
                            urls.forEach(url => {
                                const fullUrl = url.startsWith('/') ? url : '/' + url;
                                photos.append($('<img>').addClass('com-img-fit').attr('src', fullUrl));
                            });
                            content.append(photos);
                        } catch (e) {
                            console.log('Image processing error:', e);
                        }
                    }
    
                    content.append($('<div>').addClass('review-text').text(review.content || ''));
                    
                    const likeButton = $('<button>')
                        .addClass('like-btn')
                        .attr('data-review-id', review.reviewId)
                        .html(`
                            <i class="far fa-heart"></i>
                            <span class="like-count">0</span>
                        `);
    
                    // 좋아요 수 가져오기
                    $.ajax({
                        url: `/api/reviews/${review.reviewId}/like/count`,
                        method: 'GET',
                        dataType: 'json',
                        success: function(count) {
                            likeButton.find('.like-count').text(count);
                        }
                    });
    
                    meta.append($('<div>').addClass('review-date')
                        .text(new Date(review.createdDate).toLocaleDateString()));
                    meta.append($('<div>').addClass('review-like').append(likeButton));
    
                    reviewItem.append(content).append(meta);
                    reviewsContainer.append(reviewItem);
    
                    // 로그인한 사용자의 좋아요 상태 확인
                    initializeLikeState(review.reviewId);
                });
            }
        });
    }
    
    // 사이드바 접기 펼치기
    $('.toggle-button').click(function() { $('.restaurant-list-container').toggleClass('expanded collapsed'); });
    $('.mobile-toggle-handle').click(function() { $('.restaurant-list-container').toggleClass('expanded collapsed'); });

    // 식당 세부정보 닫기
    $('.restaurant-detail-container .close-button').click(function() { $('.restaurant-detail-container').removeClass('show'); });

    // 사이드바 접기 펴기
    $('.toggle-button').click(function() { $('.restaurant-container').toggleClass('collapsed'); $(this).find('i').toggleClass('fa-chevron-left fa-chevron-right'); });

    // 모바일일때 모바일 전용 핸들 추가
    if (window.matchMedia("(max-width: 1024px)").matches) {
        $('.mobile-toggle-handle').click(function() {
            $('.restaurant-list-container').toggleClass('expanded collapsed');
        });
    }

    // 플레이스로 지도 이동
    function navigateToPlace(latitude, longitude, name) {
        if (currentPosition) {
            const startLat = currentPosition.getLat();
            const startLng = currentPosition.getLng();
            const kakaoNaviUrl = 'https://map.kakao.com/link/to/'+name+','+latitude+','+longitude+'/from/현위치'+','+startLat+','+startLng;
            window.open(kakaoNaviUrl, "_blank");
        } else {
            const kakaoNaviUrl = 'https://map.kakao.com/link/to/'+name+','+latitude+','+longitude;
            window.open(kakaoNaviUrl, "_blank");
        }
    }

    // (유틸리티) 거리 계산
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        return distance;
    }



    $('.mobile-toggle-handle').click(function() {
        const container = $('.restaurant-container');
        if (container.hasClass('expanded')) {
            container.removeClass('expanded').addClass('collapsed');
        } else if (container.hasClass('collapsed')) {
            container.removeClass('collapsed');
        } else {
            container.addClass('expanded');
        }
    });
    

    let startY = 0;
    let currentY = 0;
    
    $('.mobile-toggle-handle').on('touchstart', function(e) {
        startY = e.originalEvent.touches[0].clientY;
    });
    
    $(document).on('touchmove', function(e) {
        if (startY === 0) return;
        
        currentY = e.originalEvent.touches[0].clientY;
        const deltaY = currentY - startY;
        const container = $('.restaurant-container');
        
        // Swipe down
        if (deltaY > 50) {
            if (container.hasClass('expanded')) {
                container.removeClass('expanded');
            } else {
                container.addClass('collapsed');
            }
            startY = 0;
        }
        // Swipe up 
        else if (deltaY < -50) {
            if (container.hasClass('collapsed')) {
                container.removeClass('collapsed');
            } else {
                container.addClass('expanded');
            }
            startY = 0;
        }
    });
    
    $(document).on('touchend', function() {
        startY = 0;
    });
    


    

})


// 기존 스크립트들

    // $('.category-options .option-btn').click(function() {
    //     let category = $(this).text();

    //     $.ajax({
    //         url: '/places/category',
    //         method: 'GET',
    //         data: { category: category },
    //         success: displayPlaces
    //     });

    //     $('.filter-button').eq(0).text($(this).text());
    //     $('.category-options').addClass('hidden');
    //     $('.filter-button').eq(0).removeClass('active');
    // });
