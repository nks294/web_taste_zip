$(function () {

    // --------------------------------
    // 1자형 리스트 스크롤 버튼 스크립트
    // --------------------------------
    $('.scroll-left').click(function() { doScroll($(this), 'left'); });
    $('.scroll-right').click(function() { doScroll($(this), 'right'); });
    
    function doScroll($button, direction) {
        const $wrapper = $button.closest('.card-list-wrapper');
        const $list = $wrapper.find('.card-list');
        const itemWidth = $list.find('li').outerWidth(true);
        const scrollAmount = direction === 'left' ? '-=' + (itemWidth * 3) : '+=' + (itemWidth * 3);
    
        $list.animate({ scrollLeft: scrollAmount }, 100, function() {
            updateButton($wrapper, $list);
        });
    }
    
    function updateButton($wrapper, $list) {
        const $scrollLeftBtn = $wrapper.find('.scroll-left');
        const $scrollRightBtn = $wrapper.find('.scroll-right');
        const scrollLeft = $list.scrollLeft();
        const maxScrollLeft = $list[0].scrollWidth - $list.outerWidth();
    
        $scrollLeftBtn.prop('disabled', scrollLeft <= 0);
        $scrollRightBtn.prop('disabled', scrollLeft >= maxScrollLeft);
    }
    
    $('.card-list').on('scroll', function() {
        const $list = $(this);
        const $wrapper = $list.closest('.card-list-wrapper');
        updateButton($wrapper, $list);
    });


    // ---------------------------------------------------------
    // 가로 스크롤 휠 동작 함수 (.horizontal-scroll 있으면 작동)
    // ---------------------------------------------------------
    $('.horizontal-scroll').each(function () {
        const scrollContainer = $(this);
        scrollContainer.on('wheel', function (event) {
            if (isMobile()) {
                event.preventDefault();
              
                const delta = event.originalEvent.deltaY;
                const scrollAmount = 5;
              
                $(this).stop().animate({
                  scrollLeft: this.scrollLeft + (delta * scrollAmount)
                }, 200);
            }
        });
    });


    // ---------------------------------------------------------
    //                  사이트 자체 팝업 함수
    // ---------------------------------------------------------
    window.Popup = (() => {
        let popupElement = null;
        let customCloseCallback = null;

        const popupTemplate = `
        <div id="slide-popup" class="popup">
            <div class="popup-content com-flex-col com-gap-10 com-bg com-color com-border-primary com-shadow com-round-10">
                <span class="popup-message"></span>
                <button id="popup-close-btn" class="com-btn-primary com-padding-primary com-round-5">닫기</button>
            </div>
        </div>
        `;

        function createPopup() {
            if (popupElement) popupElement.remove();
            popupElement = $(popupTemplate).appendTo('body');

            popupElement.on('click', (e) => {
                e.stopPropagation();
            });

            popupElement.find('#popup-close-btn').on('click', (e) => {
                e.stopPropagation();
                close();
            });
        }

        function open(message) {
            createPopup();
            popupElement.find('.popup-message').html(message);
            requestAnimationFrame(() => {
                popupElement.addClass('active');
            });
        }

        function close() {
            if (popupElement) {
                popupElement.removeClass('active').addClass('closing');
                setTimeout(() => {
                    popupElement.remove();
                    popupElement = null;

                    if (typeof customCloseCallback === 'function') {
                        customCloseCallback();
                        customCloseCallback = null;
                    }
                }, 500); 
            }
        }

        function onClose(callback) {
            customCloseCallback = callback;
        }

        return { open, close, onClose };
    })();


    // ----------------------------------------------------
    // 헤더 타이틀 타이핑 애니메이션 스크립트
    // ----------------------------------------------------
    const $spanEl = $(".header-center h1 span");
    const txtArr = ['맛.zip', '우리가 만드는 맛집 모음.zip'];
    let index = 0;
    let currentTxt = txtArr[index].split("");
    let isFinished = false;

    function isMobile() { return window.matchMedia("(max-width: 1024px)").matches; }

    function writeTxt() {
        if (isMobile() || isFinished) {
            $spanEl.text('맛.zip');
            return;
        }

        $spanEl.text($spanEl.text() + currentTxt.shift());
        if (currentTxt.length !== 0) {
            setTimeout(writeTxt, Math.floor(Math.random() * 100));
        } else {
            currentTxt = $spanEl.text().split("");
            setTimeout(deleteTxt, 4000);
        }
    }

    function deleteTxt() {
        if (isMobile() || isFinished) return;

        currentTxt.pop();
        $spanEl.text(currentTxt.join(""));
        if (currentTxt.length !== 0) {
            setTimeout(deleteTxt, Math.floor(Math.random() * 100));
        } else {
            if (index < txtArr.length - 1) {
                index++;
                currentTxt = txtArr[index].split("");
                writeTxt();
            } else {
                isFinished = true;
                $spanEl.text('맛.zip');
                $spanEl.addClass('stop');
            }
        }
    }

    $(window).resize(function() { if (isMobile()) $spanEl.text('맛.zip'); });

    writeTxt();


    // ----------------------------------------------------
    // 클릭시 위로 스크롤하는 버튼 기능
    // ----------------------------------------------------
    const $scrollButton = $('#scrollToTop');
    
    $('body').on('scroll', function () {
        if ($(this).scrollTop() > 550) {
            $scrollButton.addClass('visible');
        } else {
            $scrollButton.removeClass('visible');
        }
    });

    $scrollButton.on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 500);
    });
})