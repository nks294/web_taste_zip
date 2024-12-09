$(document).ready(function () {
    const slides = $(".banner-slides img");
    const titles = $(".dot-title");
    const paginationContainer = $(".banner-pagination-dots");
    const currentPageElement = $(".current-page");
    const totalPageElement = $(".total-page");
    const prevButton = $(".main-banner-prev-btn");
    const nextButton = $(".main-banner-next-btn");
    const totalSlides = slides.length;
    let currentIndex = 0;
    let autoSlideTimer;

    totalPageElement.text(totalSlides);

    function generatePaginationDots() {
        slides.each((index, slide) => {
            const imgUrl = $(slide).attr("src");
            const title = $(slide).data("title");
            const link = $(slide).data("link");
            
            const dot = $(` 
                <div class="banner-dot-wrapper com-flex-row com-flex-align-center com-gap-10">
                    <span class="banner-dot" data-index="${index}" style="background-image: url(${imgUrl});"></span>
                    <a href="${link}" class="dot-title com-font-size-1 com-color-white">${title}</a>
                </div>
            `);
            
            if (index === 0) dot.addClass("active");
            paginationContainer.append(dot);
        });
    }

    function goToSlide(index) {
        slides.removeClass("active");
        slides.eq(index).addClass("active");
        updatePagination(index);
        updatePageCounter(index);
        updateNavButtons(index);
        scrollToContent(index);
        updateActiveTitle(index);
    }

    function updatePagination(index) {
        $(".banner-dot").removeClass("active");
        $(`.banner-dot[data-index="${index}"]`).addClass("active");
    }

    function updatePageCounter(index) {
        currentPageElement.text(index + 1);
    }

    function updateActiveTitle(index) {
        titles.removeClass("active");
        titles.eq(index).addClass("active");
    }

    function updateNavButtons(index) {
        prevButton.prop("disabled", index === 0);
        nextButton.prop("disabled", index === totalSlides - 1);
    }

    function scrollToContent(index) {
        const dotWrapper = $(".banner-pagination-dots");
        const activeDot = $(`.banner-dot[data-index="${index}"]`);
        
        if (window.matchMedia("(max-width: 1024px)").matches) {
            const dotWrapperOffset = dotWrapper.offset().top;
            const activeDotOffset = activeDot.offset().top;
            const scrollPosition = dotWrapper.scrollTop() + (activeDotOffset - dotWrapperOffset);

            dotWrapper.animate({ scrollTop: scrollPosition }, 500);
        } else {
            const dotWrapperOffset = dotWrapper.offset().left;
            const activeDotOffset = activeDot.offset().left;
            const scrollPosition = dotWrapper.scrollLeft() + (activeDotOffset - dotWrapperOffset) - dotWrapper.width() / 2 + activeDot.width() / 2;

            dotWrapper.animate({ scrollLeft: scrollPosition }, 500);
        }
    }

    function startAutoSlide() {
        if (autoSlideTimer) clearInterval(autoSlideTimer);
        autoSlideTimer = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalSlides;
            goToSlide(currentIndex);
        }, 4000);
    }

    function stopAutoSlide() {
        if (autoSlideTimer) {
            clearInterval(autoSlideTimer);
            autoSlideTimer = null;
        }
    }

    prevButton.click(function () {
        if (currentIndex > 0) {
            stopAutoSlide();
            currentIndex -= 1;
            goToSlide(currentIndex);
            startAutoSlide();
        }
    });

    nextButton.click(function () {
        if (currentIndex < totalSlides - 1) {
            stopAutoSlide();
            currentIndex += 1;
            goToSlide(currentIndex);
            startAutoSlide();
        }
    });

    $(".banner-pagination-dots").on("click", ".banner-dot", function () {
        stopAutoSlide();
        currentIndex = $(this).data("index");
        goToSlide(currentIndex);
        startAutoSlide();
    });

    $(".main-banner-wrapper").on("mouseenter", stopAutoSlide);
    $(".main-banner-wrapper").on("mouseleave", startAutoSlide);

    generatePaginationDots();
    goToSlide(0);
    startAutoSlide();
    
});
