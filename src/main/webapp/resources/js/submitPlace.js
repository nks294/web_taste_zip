$(document).ready(function() {
    // Initialize form validation
    function validateForm() {
        let isValid = true;
        $('.form-control[required]').each(function() {
            if (!$(this).val()) {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });
        return isValid;
    }

    $.ajax({
        url: '/places/getAllThemes',
        method: 'GET',
        dataType: 'json',
        success: function(themes) {
            const $themeButtons = $('.theme-buttons');
            themes.forEach(theme => {
                $themeButtons.append(`
                    <button type="button" class="theme-btn" data-value="${theme}">${theme}</button>
                `);
            });
        }
    });

    // Map initialization
    var mapContainer = document.getElementById('map');
    var mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567),
        level: 3
    };

    var map = new kakao.maps.Map(mapContainer, mapOption);
    var geocoder = new kakao.maps.services.Geocoder();

    // Search Address button - Show map and search location
    $('#searchAddress').on('click', function() {
        const address = $('#addr1').val();
        if (!address) {
            alert('주소를 입력해주세요.');
            return;
        }

        $('#getCoordinates').show();

        geocoder.addressSearch(address, function(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                
                var marker = new kakao.maps.Marker({
                    map: map,
                    position: coords
                });

                map.setCenter(coords);
            } else {
                alert('주소를 찾을 수 없습니다. 주소를 확인해주세요.');
            }
        });
    });

    // Get Coordinates button - Set coordinates in form
    $('#getCoordinates').on('click', function() {
        const address = $('#addr1').val();
        if (!address) {
            alert('주소를 입력해주세요.');
            return;
        }

        geocoder.addressSearch(address, function(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                $('#mapx').val(result[0].x);
                $('#mapy').val(result[0].y);
            } else {
                alert('좌표를 찾을 수 없습니다. 주소를 확인해주세요.');
            }
        });
    });


    $('#checkTitleBtn').on('click', function() {
    const title = $('#title').val().trim();
    console.log('검색어:', title);
    if (!title) {
        alert('가게명을 입력해주세요.');
        return;
    }

    $.ajax({
        url: '/places/search',
        method: 'GET',
        data: { keyword: title },
        success: function(results) {
            console.log('검색 결과:', results);
            const $resultsContainer = $('.results-container');
            $resultsContainer.empty();
            
            if (results.length === 0) {
                $resultsContainer.append('<div class="result-item">검색 결과가 없습니다.</div>');
            } else {
                results.forEach(place => {
                    $resultsContainer.append(`
                        <div class="result-item" data-place-id="${place.placeId}">
                            <div>가게명: ${place.title}</div>
                            <div>주소: ${place.addr1}</div>
                        </div>
                    `);
                });
            }
            $('#searchResults').show();
        }
    });
});
    let isUpdateMode = false;

// Modify the result-item click handler
$(document).on('click', '.result-item', function() {
    const placeId = $(this).data('place-id');
    
    $.ajax({
        url: `/places/api/getPlace/${placeId}`,
        method: 'GET',
        dataType: 'json',
        success: function(place) {
            console.log('Retrieved Place Data:', place);
            $('#title').val(place.title);
            $('#addr1').val(place.addr1);
            $('#cat3').val(place.cat3);
            $('#theme').val(place.theme);
            $('#areaname').val(place.areaname);
            $('#firstimage').val(place.firstimage);
            $('#firstmenu').val(place.firstmenu);
            $('#homepage').val(place.homepage);
            $('#mapx').val(place.mapx);
            $('#mapy').val(place.mapy);
            $('#tel').val(place.tel);
            $('#opentimefood').val(place.opentimefood);
            $('#restdatefood').val(place.restdatefood);
            $('#treatmenu').val(place.treatmenu);
            
            isUpdateMode = true;
            $('#placeSubmitForm').data('placeId', placeId);
            $('.submit-btn').text('수정하기');
            $('#searchResults').hide();
        }
    });
});

$('.category-btn').on('click', function() {
    const selectedCategory = $(this).data('value');
    console.log('Selected category:', selectedCategory);
    $('.category-btn').removeClass('active');
    $(this).addClass('active');
    $('#cat3').val($(this).data('value'));
});

// Theme button handler
$(document).on('click', '.theme-btn', function() {
    const selectedTheme = $(this).data('value');
    console.log('Selected theme:', selectedTheme);
    $('.theme-btn').removeClass('active');
    $(this).addClass('active');
    $('#theme').val(selectedTheme);
});

// Custom theme input handler
$('#custom-theme').on('input', function() {
    $('.theme-btn').removeClass('active');
    $('#theme').val($(this).val());
});

// Modify the form submission handler
$('#placeSubmitForm').on('submit', function(e) {
    e.preventDefault();

    if (!validateForm()) {
        alert('식당 이름을 입력해주세요.');
        return;
    }

    if (isUpdateMode) {
        const placeId = $(this).data('placeId');
        const placeData = {
            placeId: placeId,
            title: $('#title').val().trim(),
            theme: $('#theme').val().trim(),
            addr1: $('#addr1').val().trim(),
            areaname: $('#areaname').val().trim(),
            cat3: $('#cat3').val(),
            firstimage: $('#firstimage').val().trim(),
            firstmenu: $('#firstmenu').val().trim(),
            homepage: $('#homepage').val().trim(),
            mapx: $('#mapx').val().trim(),
            mapy: $('#mapy').val().trim(),
            tel: $('#tel').val().trim(),
            opentimefood: $('#opentimefood').val().trim(),
            restdatefood: $('#restdatefood').val().trim(),
            treatmenu: $('#treatmenu').val().trim()
        };

        $.ajax({
            url: '/places/update',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(placeData),
            success: function(response) {
                alert('맛집 정보가 수정되었습니다.');
                location.reload();
            },
            error: function(xhr, status, error) {
                alert('수정에 실패했습니다.');
            }
        });
    } else {
        const formData = new FormData();
        formData.append('place', JSON.stringify({
            title: $('#title').val().trim(),
            theme: $('#theme').val().trim(),
            addr1: $('#addr1').val().trim(),
            areaname: $('#areaname').val().trim(),
            cat3: $('#cat3').val(),
            firstimage: $('#firstimage').val().trim(),
            firstmenu: $('#firstmenu').val().trim(),
            homepage: $('#homepage').val().trim(),
            mapx: $('#mapx').val().trim(),
            mapy: $('#mapy').val().trim(),
            tel: $('#tel').val().trim(),
            opentimefood: $('#opentimefood').val().trim(),
            restdatefood: $('#restdatefood').val().trim(),
            treatmenu: $('#treatmenu').val().trim()
        }));

        $.ajax({
            url: '/places/submit',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                alert('맛집이 성공적으로 등록되었습니다.');
                location.reload();
            },
            error: function(xhr, status, error) {
                alert('등록에 실패했습니다.');
            }
        });
    }
});

    // Real-time validation feedback
    $('.form-control').on('input', function() {
        if ($(this).val()) {
            $(this).removeClass('error');
        }
    });

    // Number input validation
    $('#mapx, #mapy').on('input', function() {
        let value = $(this).val();
        if (value && !$.isNumeric(value)) {
            $(this).addClass('error');
        } else {
            $(this).removeClass('error');
        }
    });

    // URL validation for firstimage
    // $('#firstimage').on('input', function() {
    //     let url = $(this).val();
    //     let urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    //     if (url && !urlPattern.test(url)) {
    //         $(this).addClass('error');
    //     } else {
    //         $(this).removeClass('error');
    //     }
    // });

    // Phone number format validation
    $('#tel').on('input', function() {
        let tel = $(this).val();
        let telPattern = /^[\d-]+$/;
        if (tel && !telPattern.test(tel)) {
            $(this).addClass('error');
        } else {
            $(this).removeClass('error');
        }
    });
});