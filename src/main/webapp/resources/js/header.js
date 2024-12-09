$(document).ready(function() {
    // ------------------------------------
    //              헤더 좌측
    // ------------------------------------

    // 초기 식당 데이터 배열
    let restaurants = [];

    // 서버에서 데이터 가져오기
    async function fetchTopRankedPlaces() {
        try {
            const response = await $.ajax({
                url: '/places/rank', // 서버 API 엔드포인트
                method: 'GET',
                dataType: 'json',
            });
            // 가져온 데이터를 restaurants 배열에 추가
            restaurants = response.map((place) => ({
                title: place.title || '이름 없음',
                id: place.placeId
            }));
            
    
    console.log("Restaurants length:", restaurants.length);
    console.log("Restaurants content:", restaurants);

        } catch (error) {
            console.error('Top ranked places를 가져오는 중 오류 발생:', error);
        }
    }

    // 순위 목록을 DOM에 반영
    async function initRestaurantRotation() {
        await fetchTopRankedPlaces();

        // 현재 순서 변수 초기화
        let currentIndex = 0;

        // 첫 번째 순위 표시
        updateRankDisplay(currentIndex);

        // 5초마다 다음 순위 회전하면서 표시
        setInterval(function () {
            $("#restaurant-rotation, #mob-restaurant-rotation")
                .addClass("slide-out")
                .one("animationend", function () {
                    $(this).removeClass("slide-out");
                    currentIndex = (currentIndex + 1) % restaurants.length;
                    updateRankDisplay(currentIndex);
                    $(this).addClass("slide-in").one("animationend", function () {
                        $(this).removeClass("slide-in");
                    });
                });
        }, 5000);

        // 순위 업데이트 함수
        function updateRankDisplay(index) {
            $("#restaurant-rotation, #mob-restaurant-rotation").html(`
                <strong class="popular-rank">${index + 1}</strong> 
                <a href="/map?placeId=${restaurants[index].id}" class="com-text-hover-underline">${restaurants[index].title}</a>
            `);
        }

        // 순위 표시하는 부분에 마우스 올릴 시 전체 목록 보여주기
        $('.popular-restaurant-list').on('mouseenter', function() {
            if (isMobile()) return;
            const $popup = $('.popular-restaurant-popup');
            const $list = $('#restaurant-full-list');

            $list.empty();
            restaurants.forEach((restaurant, index) => {
                $list.append(`
                    <li>
                        <strong class="popular-rank com-font-size-4">${index + 1}</strong>
                        <a href="/map?placeId=${restaurant.id}" class="com-text-hover-underline">${restaurant.title}</a>
                    </li>
                `);
            });
            $popup.addClass('open');

            $('.popular-restaurant-list').on('mouseleave', function() { $popup.removeClass('open'); });
            $('.popular-restaurant-popup').on('mouseenter', function() { $(this).addClass('open'); }).on('mouseleave', function() { $(this).removeClass('open'); });
        });
    }

    // 모바일 확인 함수
    function isMobile() {
        return window.matchMedia("(max-width: 1024px)").matches;
    }

    initRestaurantRotation();
    

    // ------------------------------------
    //              헤더 우측
    // ------------------------------------

    const currentPath = window.location.pathname;

    // 라이트, 다크모드 전환
    function changeMode() {
        $('html').toggleClass('dark-mode');
        $('.fa-sun .fa-moon').toggleClass('hidden');
        const currentMode = $("html").hasClass("dark-mode") ? "dark" : "light";
        // 변경한 모드 상태 저장
        localStorage.setItem("mode", currentMode);
    }

    // 모드 변경 버튼 클릭시 함수 호출
    $('#change-mode').on('click', function() {
        changeMode();
    });

    // 로그인 된 상태: 프로필 보기 버튼 클릭시 프로필 보기
    $('#open-profile').click(function (e) {
        e.stopPropagation();
        $('#profile-modal').toggleClass('hidden');
    });

    // 로그인 안 된 상태: 로그인 창 보이기
    $('#do-login, #mob-do-login').on('click', function (e) {
        e.stopPropagation();
        if (isMobile()) {
            $('#modal-overlay').fadeIn();
            $('#login-register').removeClass('hidden').addClass('slide-in').css('opacity', '1');
        } else {
            $('#modal-overlay').fadeIn();
            $('#login-register').removeClass('hidden').css('opacity', '1');
        }
    });
    
    // 경로에 따라 이동 아이콘 변경
    if (currentPath === '/map') {
        const $mapIcon = $('#goto-map i');
        $mapIcon.removeClass('fa-map').addClass('fa-home');
        $('.title-wrapper').css('max-width', 'none').css('margin', '0 20px');
        $('.mob-popular-restaurant-btn').addClass('hidden');
        $('#goto-map').attr('href', '/');
    }
    

    // ------------------------------------
    //              로그인 창
    // ------------------------------------
    let isLoginVisible = true;
    let isAnimating = false;

    // 로그인, 회원가입 전환 애니메이션
    function transition() {
        if (isAnimating) return;
        isAnimating = true;

        // 화면전환 효과용 div 추가 후 150ms 간격으로 확장
        $('.circle-transition').remove();
        for (let index = 0; index < 5 ; index++) {
            $('.login-register-wrapper').append(`<div class="circle-transition circle-${index}"></div>`);
            
            setTimeout(() => { 
                $(`.circle-${index}`).addClass('circle-active'); 
            }, 150 * (index + 1));
        }

        // 기존 화면 숨기기
        setTimeout(() => {
            $('#error-message, #email-error, #confirm-code, #password-error, #confirmPassword-error').text('');
            $('.login-register-screen').removeClass('screen-expand');
        }, 400)
    
        // 화면 교체
        setTimeout(() => {
            if (isLoginVisible) {
                $('.login-container').addClass('hidden');
                $('.register-container').removeClass('hidden');
            } else {
                $('.register-container').addClass('hidden');
                $('.login-container').removeClass('hidden');
                $('.sns-login-wrapper').removeClass('hidden');
            }
            isLoginVisible = !isLoginVisible;
        }, 600);
    
        // 원 뒤로 보내고 화면 확장
        setTimeout(() => { 
            $('.circle-transition').css('z-index', '-1'); 
            $('.login-register-screen').addClass('screen-expand'); 
        }, 800);
        
        // 원 삭제
        setTimeout(() => { 
            $('.circle-transition').remove(); 
            isAnimating = false; 
        }, 1300);
    }

    // 로그인 하기 / 회원가입 하기 클릭시 화면전환
    $(document).on('click', '.button-login', function (e) { e.preventDefault(); if (!isLoginVisible) transition(); });
    $(document).on('click', '.button-register', function (e) { if (isLoginVisible) transition(); });
    
    // ESC키 혹은 닫기 버튼을 클릭하면 모달 창 닫기
    $(document).on('keydown', function (e) {
        if (e.key === "Escape") close();
    });

    $('#modal-close-btn').on('click', function () {
        close();
    });

    // 로그인창 닫으면서 상태 초기화
    function close() {
        if (isMobile()) {
            $('#login-register').removeClass('slide-in').addClass('hidden');
        } else {
            $('#login-register').css('opacity', '0').addClass('hidden');
        }
        $('#modal-overlay').fadeOut();
        
        // 팝업이 열려 있다면 팝업 닫기
        if ($('#slide-popup').length) {
            Popup.close();
        }

        if (!isLoginVisible) {
            $('.register-container').addClass('hidden');
            $('.login-container').removeClass('hidden');
            isLoginVisible = true;
        }

        resetRegister()
    }


    // ------------------------------------
    //               로그인
    // ------------------------------------

    // 로그인 핸들러
    $('#btn-login').on('click', function(e) {
        e.preventDefault();
        const email = $('input[name="memberId"]').val();
        const password = $('input[name="memberPw"]').val();

        if (!email || !password) {
            $('#error-message').text('아이디와 비밀번호를 입력해주세요.'); return;
        } else {
            $.ajax({
                url: '/member/loginProcess.do',
                type: 'POST',
                data: {
                    memberId: email,
                    memberPw: password
                },
                success: function (response) {
                    if (response.success) {
                        Popup.onClose(() => {
                            window.location.href = response.redirectUrl;
                        });
                        Popup.open('다시 방문하신걸 환영합니다! 🎉<br>즐거운 맛집 탐색을 시작해볼까요?');
    
                    } else {
                        $('#error-message').text(response.msg);
                    }
                },
                error: function () {
                    $('#error-message').text('서버와의 통신에 실패했습니다.');
                }
            });
        }
    });

    // 저장된 아이디를 불러오는 함수
    function loadSavedId() {
        const savedId = localStorage.getItem('rememberedId');
        if (savedId) {
            $('input[name="memberId"]').val(savedId);
            $('#remember_login').prop('checked', true);
        }
    }
    loadSavedId();

    // 아이디를 저장하는 함수
    function saveId() {
        const email = $('input[name="memberId"]').val();
        const isChecked = $('#remember_login').is(':checked');

        if (isChecked && email) {
            localStorage.setItem('rememberedId', email);
        } else {
            localStorage.removeItem('rememberedId');
        }
    }

    // 체크박스 상태 변경 이벤트 핸들러
    $('#remember_login').on('change', function() { saveId(); });

    // 로그인할때도 아이디 저장하기
    $('#btn-login').on('click', function(e) { e.preventDefault(); saveId(); });


    // ------------------------------------
    //               회원가입
    // ------------------------------------

    // 회원가입 스텝 변수 초기화
    let currentStep = 1;

    // 스텝 이동 및 표시 업데이트
    function navigateToStep(step) {
        $(`#register-page-${currentStep}`).addClass('hidden');
        currentStep = step;
        $(`#register-page-${currentStep}`).removeClass('hidden');

        $('.step-indicator div').removeClass('active');
        $(`.step-indicator .step-${step}`).addClass('active');
    }

    // -------------- 스텝 1

    // 약관 동의 화면
    $('#register_agreement, #register_agreement_label').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        if ($('#register_agreement').is(':checked')) return;
        $('#terms-modal').addClass('visible');

        // 약관 동의 모달 띄우기
        if (!$(this).is(':checked')) {
            $('#terms-modal').addClass('visible');
        }
    });


    // 전체 약관 보기 버튼 클릭시 약관 모달 띄우기
    $('.view-full-terms').click(function () {
        const termsType = $(this).data('terms');
        let termsContent = '';
    
        // 약관 내용 설정
        switch (termsType) {
            case 'service':
                termsContent = "맛집의 서비스를 이용해주셔서 감사합니다. Minim id sit excepteur culpa commodo mollit labore cillum veniam voluptate dolor exercitation. Aliquip consectetur ad amet ullamco excepteur do irure aliqua qui non nisi duis commodo. Labore irure mollit dolore do officia labore ex non reprehenderit. Aute deserunt sit aute cupidatat duis laborum eiusmod est.";
                break;
            case 'privacy':
                termsContent = "개인정보보호법에 따라 맛.zip에 회원가입 신청하시는 Nulla eiusmod est pariatur quis. Quis ea nisi consectetur amet. Dolore dolore dolore id mollit laborum excepteur quis. Laborum officia elit consequat ullamco occaecat reprehenderit et labore sunt laborum.";
                break;
            case 'location':
                termsContent = "위치기반 서비스 이용약관에 동의하시면, 위치를 활용한 Mollit id non exercitation id. Laborum cillum dolore qui fugiat est proident laborum laborum. Ea ea do ex sunt reprehenderit quis adipisicing non velit voluptate do.";
                break;
            default:
                termsContent = "약관 내용을 불러올 수 없습니다.";
        }
    
        // 팝업 모듈을 통해 약관 내용 표시
        Popup.open(`
            <h2>전체 약관</h2>
            <p>${termsContent}</p>
        `);
    });

    // 동의 여부에 따라 버튼 활성화/비활성화
    function checkRequired() {
        const isServiceChecked = $('#agree-service').prop('checked');
        const isPrivacyChecked = $('#agree-privacy').prop('checked');

        if (isServiceChecked && isPrivacyChecked) {
            $('#agree-button').prop('disabled', false);
        } else {
            $('#agree-button').prop('disabled', true);
        }
    }

    // 전체 약관 동의 체크박스 변경 시 개별 체크박스 변경
    $('#all-agree').on('change', function() {
        const isChecked = $(this).prop('checked');
        $('.terms-checkbox').prop('checked', isChecked);
        checkRequired();
    });

    // 개별 약관 동의 체크박스 변경 시 전체 체크박스 변경
    $('.terms-checkbox').on('change', function() {
        if ($('#agree-service').prop('checked') && $('#agree-privacy').prop('checked') && $('#agree-location').prop('checked')) {
            $('#all-agree').prop('checked', true);
        } else {
            $('#all-agree').prop('checked', false);
        }
        checkRequired();
    });

    // 동의 버튼 클릭시 체크 처리
    $('#agree-button').on('click', function() {
        $('#register_agreement').prop('checked', true);
        $('#terms-modal').removeClass('visible');
        $('#btn-next-step-1').prop('disabled', false);
    });

    // 스텝 이동
    $('#btn-next-step-1').on('click', function(e) {
        e.preventDefault();
        navigateToStep(2);
    });

    // -------------- 스텝 2
    // 이메일 중복검사 및 인증
    let code; // 서버 통신으로 받은 인증번호 저장용 변수

    function regStep2() {
        $('#reg_member_pw, #confirm_password').prop('disabled', true); // 비밀번호 필드 비활성화
        $('#btn-next-step-2').prop('disabled', true); // 다음 버튼 비활성화
    }
    regStep2();
    
    // 이메일 입력란만 실시간 유횩성 검사
    $('#reg_member_id').on('input', function () {
        const email = $(this).val();
        const emailError = validateField('email', email);
        $('#resultMsg').text(emailError).css('color', emailError ? 'var(--zip-error)' : 'var(--zip-success)');
    });

    // 이메일 중복확인
    $('#checkId').on('click', function(e) {
        e.preventDefault();
        const email = $('#reg_member_id').val();
        const emailError = validateField('email', email);
    
        if (emailError) {
            $('#resultMsg').text(emailError).css('color', 'var(--zip-error)');
            return;
        }
    
        $.ajax({
            url: '/member/checkId.do',
            type: 'POST',
            data: { member_id: email },
            success: function(response) {
                if (response === "FAIL") {
                    $('#resultMsg').text('이미 사용 중인 이메일입니다.').css('color', 'var(--zip-error)');
                } else if (response === "PASS") {
                    $('#resultMsg').text('사용 가능한 이메일입니다.').css('color', 'var(--zip-success)');
                    $('#reg_member_id').prop('readonly', true);
                    $('#checkId').text('인증').off('click').on('click', sendCode);
                } else {
                    $('#resultMsg').text('서버 응답이 올바르지 않습니다.').css('color', 'var(--zip-error)');
                }
            },
            error: function() {
                $('#resultMsg').text('서버와 통신에 실패했습니다.').css('color', 'var(--zip-error)');
            }
        });
    });

    // 인증번호 전송
    function sendCode() {
        const email = $('#reg_member_id').val();
        $('#auth_num_section').show();

        $.ajax({
            type: "post",
            url: "/member/checkEmail.do",
            data: {email: email},
            success: function(data){
                $('#resultEmail').text('인증번호가 전송되었습니다.').css('color', 'var(--zip-success)');
                $('#auth_num_input').prop('disabled', false);
                code = data.trim();
            },
            error: function(e){
                $('#resultEmail').text('인증번호 전송에 실패했습니다.').css('color', 'var(--zip-error)');
            }
        });
        $('#confirm_email_btn').prop('disabled', false);
    }

    // 이메일 인증 메소드
    $('#confirm_email_btn').on('click', function(e) {
        e.preventDefault();
        const authCode = $('#auth_num_input').val();

        if (!authCode) {
            $('#resultEmail').text('인증번호를 입력하세요.');
            return;
        } else if (authCode === code) {
            $('#resultEmail').text('이메일 인증이 완료되었습니다.').css('color', 'var(--zip-success)');
            $('#auth_num_input').prop('disabled', true);
            $('#confirm_email_btn').prop('disabled', true);
            $('#reg_member_pw, #confirm_password').prop('disabled', false);
        } else {
            $('#resultEmail').text('잘못된 인증번호입니다.').css('color', 'var(--zip-error)');
        }
    });

    // 비밀번호 입력창 포커스 시 유호성 검사 모달 표시
    $('#reg_member_pw').on('focus', function () {
        $('#password-tooltip').removeClass('hidden').fadeIn();
    });

    // 다른데 클릭하면 다시 숨기기
    $(document).on('click', function (e) {
        if (!$(e.target).closest('#reg_member_pw, #password-tooltip').length) {
            $('#password-tooltip').fadeOut();
        }
    });

    // 비밀번호 조건 확인 함수
    function checkPasswordConditions(password) {
        const conditions = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };

        $('#length-check').toggleClass('valid', conditions.length).toggleClass('invalid', !conditions.length);
        $('#uppercase-check').toggleClass('valid', conditions.uppercase).toggleClass('invalid', !conditions.uppercase);
        $('#lowercase-check').toggleClass('valid', conditions.lowercase).toggleClass('invalid', !conditions.lowercase);
        $('#number-check').toggleClass('valid', conditions.number).toggleClass('invalid', !conditions.number);
        $('#special-check').toggleClass('valid', conditions.special).toggleClass('invalid', !conditions.special);

        return Object.values(conditions).every(Boolean);
    }

    // 비밀번호 입력 이벤트
    $('#reg_member_pw').on('input', function () {
        const password = $(this).val();
        const isValid = checkPasswordConditions(password);

        if (isValid) {
            $('#password-error').text('').hide();
        } else {
            $('#password-error').text('비밀번호 조건을 충족해주세요.').show();
        }

        $('#confirm_password').trigger('input');
    });

    // 비밀번호 확인 실시간 유효성 검사
    $('#confirm_password').on('input', function () {
        const password = $('#reg_member_pw').val();
        const confirmPassword = $(this).val();

        const confirmPasswordError = confirmPassword === password ? '' : '비밀번호가 일치하지 않습니다.';
        $('#confirmPassword-error')
            .text(confirmPasswordError)
            .css('color', confirmPasswordError ? 'var(--zip-error)' : 'var(--zip-success)');

        // 다음 버튼 활성화 조건
        const isPasswordValid = checkPasswordConditions(password);
        if (isPasswordValid && !confirmPasswordError) {
            $('#btn-next-step-2').prop('disabled', false);
        } else {
            $('#btn-next-step-2').prop('disabled', true);
        }
    });

    // 다음 스텝으로 이동
    $('#btn-next-step-2').on('click', function(e) {
        e.preventDefault();
        navigateToStep(3);
    });

    // -------------- 스텝 3
    // 휴대폰번호 유효성 검사 함수
    function validatePhone() {
        const p1 = $('#member_phone_front').val();
        const p2 = $('#member_phone_middle').val();
        const p3 = $('#member_phone_back').val();

        const phone = `${p1}-${p2}-${p3}`;
        const phoneError = validateField('phone', phone);
        if (phoneError) {
            $('#phone-num-error').text(phoneError).css('color', 'var(--zip-error)');
            return false;
        } else {
            $('#phone-num-error').text('');
            return true;
        }
    }

    // 생년월일 유효성 검사 함수
    function validateBirthday() {
        const birthday = $('input[name="birthday"]').val();
        const birthdayError = validateField('birthday', birthday);
        if (birthdayError) {
            $('#birthday-error').text(birthdayError).css('color', 'var(--zip-error)');
            return false;
        } else {
            $('#birthday-error').text('');
            return true;
        }
    }

    // 이름 유효성 검사 함수
    function validateName() {
        const name = $('#memberName').val();
        const nameRegex = /^[가-힣a-zA-Z]{2,}$/;
        let errorMessage = '';
    
        if (!name) {
            errorMessage = '이름을 입력해주세요.';
        } else if (!nameRegex.test(name)) {
            errorMessage = '이름은 한글 또는 영문으로 2자 이상 입력해주세요.';
        }
    
        $('#name-error').text(errorMessage).css('color', errorMessage ? 'var(--zip-error)' : 'var(--zip-success)');
    
        return !errorMessage;
    }

    // 유효성 검사 호출후 만족시 제출 버튼 활성화
    function validateStep3() {
        const isPhoneValid = validatePhone();
        const isBirthdayValid = validateBirthday();
        const isNameValid = validateName();
    
        // 모든 조건이 만족되면 버튼 활성화
        const isAllValid = isPhoneValid && isBirthdayValid && isNameValid;
        $('#btn-register').prop('disabled', !isAllValid);
    }
    
    $('input[name="memberName"], input[name="member_phone_middle"], input[name="member_phone_back"], input[name="birthday"]').on('input', function () {
        $('#member_phone_front').val('010');
        validateStep3();
    });

    // 최종 회원가입 데이터 제출
    $('#btn-register').on('click', function (e) {
        e.preventDefault();
    
        const memberData = {
            memberId: $('#reg_member_id').val(),
            memberPw: $('#reg_member_pw').val(),
            memberName: $('#memberName').val(),
            birthday: $('input[name="birthday"]').val(),
            phone: `${$('#member_phone_middle').val()}-${$('#member_phone_back').val()}`
        };

        $.ajax({
            url: '/member/joinProcess.do',
            type: 'POST',
            data: memberData,
            success: function (response) {
                if (response.success) {
                    Popup.onClose(() => {
                        transition();
                        resetRegister()
                    });
                    Popup.open('가입이 완료되었습니다. 🎉<br>이제 로그인하고 맛.zip과 함께<br>즐거운 맛집 탐색을 시작해볼까요?');
                } else {
                    alert(response.msg || '회원가입에 실패했습니다. 다시 시도해주세요.');
                }
            },
            error: function () {
                alert('서버와 통신 중 문제가 발생했습니다.');
            }
        });
    });

    // 회원가입 화면 초기화
    function resetRegister() {
        $('input[type="text"], input[type="password"], input[type="email"]').val('');
        $('input[type="checkbox"]').prop('checked', false);
    
        $('#error-message, #email-error, #resultMsg, #resultEmail, #password-error, #confirmPassword-error, #phone-num-error, #birthday-error, #name-error').text('');
        
        $('#auth_num_section').hide();
        $('#auth_num_input').prop('disabled', true);
        $('#confirm_email_btn').prop('disabled', true);
    
        $('.register-step').addClass('hidden');
        $('#register-page-1').removeClass('hidden');
    
        $('.step-indicator div').removeClass('active');
        $('.step-indicator .step-1').addClass('active');
    
        $('#btn-next-step-1, #btn-next-step-2, #btn-register').prop('disabled', true);
    
        currentStep = 1;
    }


    // ------------------------------------
    //       유틸리티 함수들: util.js
    // ------------------------------------

    // 유효성 검사 함수
    function validateField(field, value, compareValue = null) {
        switch (field) {
            case 'email':
                if (!value) return '이메일을 입력해주세요.';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '이메일 형식이 올바르지 않습니다.';
                break;
            case 'password':
                if (!value) return '비밀번호를 입력해주세요.';
                if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)) return '비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.';
                break;
            case 'confirm_password':
                if (!value) return '비밀번호 확인을 입력해주세요.';
                if (value !== compareValue) return '비밀번호가 일치하지 않습니다.';
                break;
            case 'phone':
                if (!value) return '전화번호를 입력해주세요.';
                if (!/^\d{3}-\d{3,4}-\d{4}$/.test(value)) return '전화번호 형식이 올바르지 않습니다.';
                break;
            case 'birthday': 
                if (!value) return '생년월일 8자리를 입력해주세요.';
                if (!/^\d{8}$/.test(value)) return '생년월일 8자리를 입력해주세요.';
                break;
            case 'name': 
                if (!value) return '이름을 입력해주세요.';
                break;
            default:
                return '';
        }
        return '';
    }
    
});