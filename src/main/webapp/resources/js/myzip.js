
$(function () {

    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;

        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return '방금 전';
        if (minutes < 60) return minutes + '분 전';
        if (hours < 24) return hours + '시간 전';
        if (days < 7) return days + '일 전';

        return date.getFullYear() + '.' +
            String(date.getMonth() + 1).padStart(2, '0') + '.' +
            String(date.getDate()).padStart(2, '0');
    }

    function loadMemberReviews(memIdx) {
        console.log('Starting to load reviews for member:', memIdx);
        $.ajax({
            url: `/api/reviews/member/${memIdx}`,
            method: 'GET',
            dataType: 'json',
            success: function (reviews) {
                console.log('Raw reviews data received:', reviews);
                reviews = typeof reviews === 'string' ? JSON.parse(reviews) : reviews;
                console.log('Processed reviews data:', reviews);
    
                const listContainer = $('#review .item-grid');
                listContainer.empty(); 
    
                reviews.forEach((review, index) => {
                    let imageHtml = '';
    
                    if (review.imageUrl && review.imageUrl.length > 0) {
                        try {
                            let urls = review.imageUrl;
                            if (typeof urls === 'string') {
                                urls = JSON.parse(urls);
                            }
                            const fullUrl = urls[0].startsWith('/') ? urls[0] : `/${urls[0]}`;
                            imageHtml = `<img src="${fullUrl}" alt="Restaurant Image" class="com-img-fit">`;
                        } catch (e) {
                            imageHtml = '<img src="/resources/img/default-image.png" alt="Default Image" class="com-img-fit">';
                        }
                    } else {
                        imageHtml = '<img src="/resources/img/default-image.png" alt="Default Image" class="com-img-fit">';
                    }
    
                    const listItem = `
                    <li class="com-list-hover-animate com-pointer com-round-15 com-overflow-hidden com-flex-no-shrink com-border-thin" onclick="loadReviewDetail(${review.reviewId})">
                        <a href="javascript:void(0)">
                            <div class="list-thumb-img com-flex-no-shrink com-width-100 com-overflow-hidden" style="height: 200px">
                                ${imageHtml}
                            </div>
                            <div class="list-content-wrapper com-padding-3 com-flex-col com-gap-15">
                                
                                <div class="review-top-wrapper com-flex-row com-flex-justify-spacebetween com-font-size-2">
                                    <strong>${review.placeTitle}</strong>
                                    <small class="text-muted">${formatDate(review.createdDate)}</small>
                                </div>

                                <div class="review-middle-wrapper rv-wrapper com-flex-row com-flex-justify-spacebetween com-font-size-2 com-gap-10">
                                    <div class="reiview-info-pane com-flex-col com-gap-5 com-no-shrink com-width-100">
                                        <div class="rv-desc com-font-size-2 com-height-100">${review.content}</div>
                                    </div>
                                </div>
                    
                                <div class="review-bottom-wrapper rv-wrapper com-flex-row com-flex-justify-spacebetween com-font-size-2">
                                    <div class="rv-rate"><i class="fas fa-star"></i> ${review.rating}</div>
                                </div>
                            </div>
                        </a>
                    </li>`;

                    listContainer.append(listItem);
                });
            },
            error: function (xhr, status, error) {
                console.log('Ajax error:', {
                    status: status,
                    error: error,
                    response: xhr.responseText
                });
            }
        });
    }

    function loadLikedReviews() {
        const memIdx = $('#myzip').data('member');
        $.ajax({
            url: `/api/reviews/member/${memIdx}/liked`,
            method: 'GET',
            dataType: 'json',
            success: function (reviews) {
                const listContainer = $('#like .item-grid');
                listContainer.empty();
    
                console.log(reviews)

                reviews.forEach((review) => {
                    let imageHtml = '';
                    if (review.imageUrl && review.imageUrl.length > 0) {
                        try {
                            let urls = review.imageUrl;
                            if (typeof urls === 'string') {
                                urls = JSON.parse(urls);
                            }
                            const fullUrl = urls[0].startsWith('/') ? urls[0] : `/${urls[0]}`;
                            imageHtml = `<img src="${fullUrl}" alt="Restaurant Image" class="com-img-fit">`;
                        } catch (e) {
                            imageHtml = `<img src="/resources/img/default-image.png" alt="Default Image"> class="com-img-fit"`;
                        }
                    } else {
                        imageHtml = `<img src="/resources/img/default-image.png" alt="Default Image"> class="com-img-fit"`;
                    }
    
                    const listItem = `
                        <li data-review-id="${review.reviewId}" class="com-pointer com-round-15 com-overflow-hidden com-flex-no-shrink com-border-thin" onclick="loadReviewDetail(${review.reviewId})">
                            <div class="list-thumb-img com-flex-no-shrink com-width-100 com-overflow-hidden" style="height: 200px">
                                ${imageHtml}
                            </div>
                            <div class="list-content-wrapper com-padding-3 com-flex-col com-gap-15">
                                
                                <div class="review-top-wrapper com-flex-row com-flex-justify-spacebetween com-font-size-2">
                                    <strong>${review.placeTitle}</strong>
                                    <small class="text-muted">${formatDate(review.createdDate)}</small>
                                </div>

                                <div class="review-middle-wrapper rv-wrapper com-flex-row com-flex-justify-spacebetween com-font-size-2 com-gap-10">
                                    <div class="reiview-info-pane com-flex-col com-gap-5 com-no-shrink com-width-100">
                                        <div class="rv-desc com-font-size-2 com-height-100">${review.content}</div>
                                    </div>
                                </div>
                    
                                <div class="review-bottom-wrapper rv-wrapper com-flex-row com-flex-justify-spacebetween com-font-size-2">
                                    <div class="rv-rate"><i class="fas fa-star"></i> ${review.rating}</div>
                                </div>
                            </div>
                        </li>`;

                    listContainer.append(listItem);
                });
            }
        });
    }
    
    function loadBookmarkedPlaces() {
        const memberId = $('#myzip').data('member');
        $.ajax({
            url: `/places/api/bookmarks/${memberId}`,
            method: 'GET',
            dataType: 'json',
            success: function (places) {
                const listContainer = $('#bookmark .item-grid');
                listContainer.empty();
    
                places.forEach(place => {
                    const listItem = `
                        <li class="com-pointer com-round-15 com-overflow-hidden com-flex-no-shrink com-border-thin">
                            <a href="/map?placeId=${place.placeId}">
                                <div class="list-thumb-img com-flex-no-shrink com-width-100 com-overflow-hidden" style="height: 200px">
                                    <img src="${place.firstimage}" alt="${place.title || '이미지'}" class="com-img-fit">
                                </div>
                                <div class="list-content-wrapper com-padding-3 com-flex-col com-gap-15">
                                    <strong>${place.title}</strong>
                                    <div class="com-flex-col com-gap-10">
                                        <div class="category">${place.cat3}</div>
                                        <small class="text-muted">${place.addr1}</small>
                                    </div>
                                </div>
                            </a>
                        </li>`;

                    listContainer.append(listItem);
                });
            }
        });
    }
    
    function loadCharacterCollection() {
        const memberId = $('#myzip').data('member');
    
        $.ajax({
            url: `/api/characters/list`,
            method: 'GET',
            success: function(allCharacters) {
                $.ajax({
                    url: `/api/characters/member/${memberId}`,
                    method: 'GET',
                    success: function(ownedCharacters) {
                        const ownedCharacterIds = ownedCharacters.map(character => character.characterId);

                        const listContainer = $('#collection .collection-grid');
                        listContainer.empty();
            
                        allCharacters.forEach(character => {
                            const isOwned = ownedCharacterIds.includes(character.characterId);
    
                            const characterCard = $(`
                                <li class="item-card character-card com-flex-col com-flex-align-center com-flex-justify-center">
                                    <img src="${character.characterImage}" alt="${character.characterName}" style="width: 200px;">
                                    <span class="com-font-size-6 com-font-jua">
                                        ${character.characterName}
                                    </span>
                                </li>
                            `);
    
                            if (!isOwned) {
                                characterCard.find('img').css('filter', 'grayscale(100%) brightness(10%)');
                            }
    
                            listContainer.append(characterCard);
                        });
                    },
                    error: function(xhr, status, error) {
                        console.error('Error fetching owned characters:', error);
                    }
                });
            },
            error: function(xhr, status, error) {
                console.error('Error fetching all characters:', error);
            }
        });
    }
    
    function loadPofile(type) {
        const memberId = $('#myzip').data('member');
        switch (type) {
            case 'review':
                loadMemberReviews(memberId);
                break;
            case 'like':
                loadLikedReviews();
                break;
            case 'bookmark':
                loadBookmarkedPlaces();
                break;
            case 'collection':
                loadCharacterCollection();
                break;
        }
    }

    $('#openGachaBtn').click(function() {
        $('#gachaModal').removeClass('hidden');
    });

    // Close modal when clicking outside
    $('#gachaModal').click(function(e) {
        if (e.target === this) {
            $(this).addClass('hidden');
        }
    });

    function initializeReviewOptions(reviewId) {
        const currentUserMemIdx = $('#memberIdx').val();
        
        $.ajax({
            url: `/api/reviews/${reviewId}/isOwner?memIdx=${currentUserMemIdx}`,
            method: 'GET',
            dataType: 'json',
            success: function(isOwner) {
                if(isOwner) {
                    const moreOptions = $('#reviewDetailModal .more-options');
                    moreOptions.show();
                    
                    moreOptions.find('.edit-review').off('click');
                    moreOptions.find('.delete-review').off('click');
                    
                    moreOptions.find('.edit-review').on('click', function() {
                        $.ajax({
                            url: `/api/reviews/${reviewId}`,
                            method: 'GET',
                            dataType: 'json',
                            success: function(review) {
                                $('.review-modal').removeClass('hidden').css('display', 'block');
                                $('.review-modal-content').css({
                                    'position': 'fixed',
                                    'top': '50%',
                                    'left': '50%',
                                    'transform': 'translate(-50%, -50%)',
                                    'z-index': '20000'
                                });
    
                                // Populate existing data
                                $('.review-modal .restaurant-name').text(review.placeTitle);
                                $('.review-modal .stars i').removeClass('fas').addClass('far');
                                for(let i = 0; i < review.rating; i++) {
                                    $('.review-modal .stars i').eq(i).removeClass('far').addClass('fas');
                                }
                                $('.review-modal .review-text-input').val(review.content);
    
                                // Handle photo preview if exists
                                if (review.imageUrl) {
                                    let urls = typeof review.imageUrl === 'string' ? JSON.parse(review.imageUrl) : review.imageUrl;
                                    $('.photo-preview-container').empty();
                                    urls.forEach(url => {
                                        const img = $('<img>', {
                                            src: url,
                                            class: 'preview-image',
                                            style: 'width: 100px; height: 100px; object-fit: cover;'
                                        });
                                        const container = $('<div>', {
                                            class: 'preview-image-container'
                                        }).append(img).append('<button type="button" class="remove-preview">×</button>');
                                        $('.photo-preview-container').append(container);
                                    });
                                }
    
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
                            
                                // Photo upload button handler
                                $('.photo-upload-box').click(function() {
                                    $('#reviewImage').trigger('click');
                                });

                                // Image preview handling
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

                                $('.review-modal .back-btn').on('click', function() {
                                    $('.review-modal').addClass('hidden');
                                    $('.stars i').removeClass('fas').addClass('far');
                                    $('.rating-text').text('');
                                    $('.review-text-input').val('');
                                    $('.photo-preview-container').empty();
                                    $('#reviewImage').val('');
                                });
                                
                                // Remove preview functionality
                                $(document).on('click', '.remove-preview', function() {
                                    $('.photo-preview-container').empty();
                                    $('#reviewImage').val('');
                                });

    
                                // Submit functionality
                                $('.submit-review-btn').off('click').on('click', function() {
                                    const formData = new FormData();
                                    const fileInput = $('.photo-input')[0];
                                    
                                    Array.from(fileInput.files).forEach((file, index) => {
                                        formData.append(`images[${index}]`, file);
                                    });
    
                                    const updatedReview = {
                                        rating: $('.stars .fas').length,
                                        content: $('.review-text-input').val(),
                                        status: 1
                                    };
    
                                    formData.append("review", JSON.stringify(updatedReview));
    
                                    $.ajax({
                                        url: `/api/reviews/${reviewId}`,
                                        method: 'PUT',
                                        contentType: 'application/json',
                                        data: JSON.stringify(updatedReview),
                                        success: function() {
                                            alert('리뷰가 수정되었습니다.');
                                            $('.review-modal').addClass('hidden');
                                            loadReviewDetail(reviewId);
                                        }
                                    });
                                });
                            }
                        });
                    });
                    
                    moreOptions.find('.delete-review').on('click', function() {
                        if(confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
                            $.ajax({
                                url: `/api/reviews/${reviewId}`,
                                method: 'DELETE',
                                success: function() {
                                    alert('리뷰가 삭제되었습니다.');
                                    $('#reviewDetailModal').hide();
                                    loadPofile('review');
                                }
                            });
                        }
                    });
                } else {
                    $('#reviewDetailModal .more-options').hide();
                }
            }
        });
    }
    
    
    
    



    // 탭 버튼 클릭 이벤트
    let activeTab = '';

    // 탭 버튼 클릭 이벤트
    $('.tab-btn').on('click', function () {
        // 탭 전환 처리
        $('.tab-section').hide();
        $('.tab-btn').removeClass('active');
        $(this).addClass('active');

        const sectionId = $(this).data('section');
        $(sectionId).show();

        // 새 탭이 클릭될 때만 데이터 로드
        if (activeTab !== sectionId) {
            activeTab = sectionId;

            switch (sectionId) {
                case '#review':
                    loadMemberReviews($('#myzip').data('member'));
                    break;
                case '#like':
                    loadLikedReviews();
                    break;
                case '#bookmark':
                    loadBookmarkedPlaces();
                    break;
                case '#collection':
                    loadCharacterCollection();
                    break;
                default:
                    console.warn('Unknown section:', sectionId);
            }
        }
    });

    // 초기 로드: 리뷰 탭 활성화
    $('.tab-btn[data-section="#review"]').trigger('click');


    $(document).on('click', '.item-card', function () {
        const reviewId = $(this).data('review-id');
        loadReviewDetail(reviewId);
    });
    
    // 로그인 안 된 상태: 로그인 창 보이기
    $('#btn-edit-profile').click(function(e) {
        e.stopPropagation();
        if (isMobile()) {
            $('#modal-overlay').fadeIn();
            $('#edit-profile').removeClass('hidden').addClass('slide-in').css('opacity', '1');
        } else {
            $('#modal-overlay').fadeIn();
            $('#edit-profile').removeClass('hidden').css('opacity', '1');
        }
    });

    $('#myzip-modal-close-btn').click(function() {
        close();
    });

    $('#modal-close-btn').on('click', function () {
        close();
    });

    $(document).on('keydown', function (e) {
        if (e.key === "Escape") close();
    });

    function close() {
        if (isMobile()) {
            $('#edit-profile').removeClass('slide-in').addClass('hidden');
        } else {
            $('#edit-profile').css('opacity', '0').addClass('hidden');
        }
        $('#modal-overlay').fadeOut();
    }


    // 모바일 확인 함수
    function isMobile() {
        return window.matchMedia("(max-width: 1024px)").matches;
    }

    // // Show profile edit modal
    // $('.btn-outline-primary').click(function () {
    //     $('.profile-edit-modal').removeClass('hidden');
    // });

    // // Hide profile edit modal
    // $('.back-btn').click(function () {
    //     $('.profile-edit-modal').addClass('hidden');
    // });

    $('body').append(`
        <div id="characterSelectModal" class="modal hidden" style="z-index: 10000;">
            <div class="modal-content">
                <h3>캐릭터 선택</h3>
                <div class="character-select-grid"></div>
                <button class="close-btn">닫기</button>
            </div>
        </div>
    `);
    
    // Modify profile image click handler
    $('.profile-image-circle').off('click').on('click', function() {
        const memberId = $('#myzip').data('member');
        
        $.ajax({
            url: '/api/characters/member/' + memberId,
            method: 'GET',
            success: function(characters) {
                const characterGrid = $('#characterSelectModal .character-select-grid');
                characterGrid.empty();
                
                if (Array.isArray(characters)) {
                    characters.forEach(character => {
                        const characterCard = $('<div>').addClass('character-card');
                        characterCard.append($('<img>').attr('src', character.characterImage));
                        characterGrid.append(characterCard);
                    });
                }
                $('#characterSelectModal').removeClass('hidden');
            }
        });
    });
    
    // Handle character selection
    $(document).on('click', '#characterSelectModal .character-card', function() {
        const selectedImage = $(this).find('img').attr('src');
        $('.profile-image-circle img').attr('src', selectedImage);
        $('input[name="profileImage"]').val(selectedImage);
        $('#characterSelectModal').addClass('hidden');
    });
    
    // Close modal button
    $('#characterSelectModal .close-btn').click(function() {
        $('#characterSelectModal').addClass('hidden');
    });

    // Profile image edit handling
    $('.image-upload-overlay').on('click', function() {
        $('#characterSelectModal').show();
    });

    // Character selection handling
    $('.character-card').on('click', function() {
        const selectedImageUrl = $(this).find('img').attr('src');
        
        // Update hidden input and visible images
        $('#profileImageInput').val(selectedImageUrl);
        $('.profile-image-circle img').attr('src', selectedImageUrl);
        $('.profile-circle img').attr('src', selectedImageUrl);
        
        // Close modal
        $('#characterSelectModal').hide();
    });

    // Close character select modal
    $('#characterSelectModal .close-btn').on('click', function() {
        $('#characterSelectModal').hide();
    });


    // Profile edit form submission
    $('.profile-edit-content form').submit(function (e) {
        e.preventDefault();

        if (this.action.includes('updateProcess.do')) {
            this.submit();
            alert('프로필이 성공적으로 수정되었습니다.');
        } else if (this.action.includes('updatePassword.do')) {
            const newPw = $('#memberPw').val();
            const confirmPw = $('input[name="confirmPassword"]').val();

            if (newPw === confirmPw) {
                this.submit();
                alert('비밀번호가 성공적으로 변경되었습니다.');
                window.location.href = '/';
            } else {
                alert('새 비밀번호가 일치하지 않습니다.');
            }
        }
    });

    // Password change modal handling
    $('#changePasswordBtn').click(function () {
        $('.password-change-modal').removeClass('hidden');
    });

    $('.back-btn-pw').click(function () {
        $('.password-change-modal').addClass('hidden');
    });

    function cancel() {
        const answer = confirm("정말 회원탈퇴 하시겠습니까?");
        if (answer) {
            location.href = "member/cancelProcess.do";
        }
    }

    function initializeLikeState(reviewId) {
        const currentUserMemIdx = $('#memberIdx').val();
        console.log('Initializing like state for review:', reviewId, 'user:', currentUserMemIdx);
    
        if (currentUserMemIdx) {
            $.ajax({
                url: `/api/reviews/${reviewId}/like/check`,
                method: 'GET',
                dataType: 'json',
                data: { memIdx: currentUserMemIdx },
                success: function(isLiked) {
                    console.log('Like check response:', isLiked);
                    const likeIcon = $(`.like-btn[data-review-id="${reviewId}"] i`);
                    if(isLiked) {
                        likeIcon.removeClass('far').addClass('fas');
                    }
                },
                error: function(xhr, status, error) {
                    console.log('Like check error:', {xhr, status, error});
                }
            });
        }
    }
    
    $(document).on('click', '.like-btn', function(e) {
        e.preventDefault();
        console.log('Like button clicked');
        const currentUserMemIdx = $('#memberIdx').val();
        
        if (!currentUserMemIdx) {
            alert('로그인이 필요한 서비스입니다.');
            return;
        }
    
        const $btn = $(this);
        const $icon = $btn.find('i');
        const reviewId = $btn.data('review-id');
        const isLiked = $icon.hasClass('fas');

        console.log('Review ID:', reviewId);
        console.log('Is currently liked:', isLiked);
    
    
        const method = isLiked ? 'DELETE' : 'POST';
        const likeUrl = `/api/reviews/${reviewId}/like?memIdx=${currentUserMemIdx}`;
    
        console.log('Making request:', {method, url: likeUrl});

        $.ajax({
            url: likeUrl,
            method: method,
            success: function(response) {
                console.log('Like toggle success:', response);
                $icon.toggleClass('far fas');
                
                $.ajax({
                    url: `/api/reviews/${reviewId}/like/count`,
                    method: 'GET',
                    dataType: 'json',
                    success: function(count) {
                        console.log('New like count:', count);
                        $btn.find('.like-count').text(count);
                    }
                });
            }
        });
    });
    
    function loadReviewDetail(reviewId) {
        console.log('Loading review detail for ID:', reviewId);
        initializeReviewOptions(reviewId);
        $('#reviewDetailModal .review-rating').html('<i class="fas fa-star"></i>');
    
        $.ajax({
            url: '/api/reviews/' + reviewId,
            method: 'GET',
            dataType: 'json',
            success: function (review) {
                console.log('Received review data:', review);
    
                if (review.imageUrl) {
                    let imageUrls = review.imageUrl;
                    if (typeof imageUrls === 'string') {
                        imageUrls = JSON.parse(imageUrls);
                    }
                    if (imageUrls && imageUrls.length > 0) {
                        $('#reviewDetailModal .review-detail-header img').attr('src', imageUrls[0]);
                    }
                } else {
                    $('#reviewDetailModal .review-detail-header img').attr('src', '/resources/img/default-image.png');
                }
    
                console.log('Updating UI elements with review data');
    
                console.log('Setting restaurant name:', review.placeTitle);
                $('#reviewDetailModal .restaurant-name')
                    .text(review.placeTitle)
                    .data('place-id', review.placeId);
    
                const infoText = review.addr1 + ' • ' + review.cat3 + ' •  ★' + review.avgRating + '(리뷰 ' + review.reviewCount + '개)';
                $('#reviewDetailModal .restaurant-info').text(infoText);
                $('#reviewDetailModal .review-profile-image img').attr('src', review.profileImage || '/resources/img/default-profile.png');
                $('#reviewDetailModal .reviewer-name').text(review.memberName);
    
                $('#reviewDetailModal .review-rating i').after(' ' + review.rating);
    
                $('#reviewDetailModal .review-text').text(review.content);
    
                $('#reviewDetailModal .review-date').text(formatDate(review.createdDate));
    

                const likeButton = $('<button>')
                    .addClass('like-btn')
                    .attr('data-review-id', reviewId)
                    .html('<i class="far fa-heart"></i> <span class="like-count">0</span>');

                $('#reviewDetailModal .review-like').html(likeButton);

                $.ajax({
                    url: `/api/reviews/${reviewId}/like/count`,
                    method: 'GET',
                    dataType: 'json',
                    success: function(count) {
                        likeButton.find('.like-count').text(count);
                    }
                });

                initializeLikeState(reviewId);
    
                $('#reviewDetailModal .review-profile-image, #reviewDetailModal .reviewer-name')
                    .css('cursor', 'pointer')
                    .click(function() {
                        window.location.href = `/myzip?id=${review.memIdx}`;
                    });
                
                $('#reviewDetailModal').show();
                $('#reviewDetailModal .review-detail-modal').show();
            },
            error: function (xhr, status, error) {
                console.log('Ajax error details:', {
                    status: status,
                    error: error,
                    response: xhr.responseText
                });
            }
        });
    }
    
    
    
    
    


    $('#reviewDetailModal .close-button').click(function () {
        console.log('Close button clicked');
        $('#reviewDetailModal').hide();
        $('#reviewDetailModal .review-detail-modal').hide();
    });

    $('#reviewDetailModal .more-options-btn').click(function (e) {
        console.log('More options button clicked');
        e.stopPropagation();
        $('#reviewDetailModal .options-dropdown').toggleClass('show');
    });

    $('#reviewDetailModal .restaurant-name').click(function () {
        const placeId = $(this).data('place-id');
        window.location.href = '/map?from=review&placeId=' + placeId;
    });


    $(document).click(function (e) {
        if (!$(e.target).closest('#reviewDetailModal .more-options').length) {
            $('#reviewDetailModal .options-dropdown').removeClass('show');
        }
    });

    window.loadReviewDetail = loadReviewDetail;
    console.log('Review detail functionality initialized');
});
