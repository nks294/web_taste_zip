<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!-- 사이드바 모듈 sidebar.jsp -->
<!-- 일단 빼두면 언젠간 쓰겠지 -->
<a href="javascript:void(0)" class="mob-popular-restaurant-btn">
    <div class="hamburger com-color">
        <span class="bar"></span>
        <div class="line-with-triangle">
            <div class="triangle"></div>
            <div class="half-bars">
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
        </div>
        <span class="bar"></span>
    </div>
</a>

<div class="sidebar com-bg com-color com-border-right">
    <div class="sidebar-header">
        <h3 class="sidebar-title">#요즘_핫한_맛집</h5>
        <button id="close-sidebar" class="close-btn com-color-primary"><i class="fas fa-times"></i></button>
    </div>
    
    <ul id="mob-restaurant-full-list"></ul>
</div>

<script>
    // 사이드바 모듈
    $('.mob-popular-restaurant-btn').on('click', function () {
        const $sidebar = $('.sidebar');
        const $list = $('#mob-restaurant-full-list');

        $list.empty();
        restaurants.forEach((restaurant, index) => {
            $list.append(`<li class="com-border-bottom-thin"><strong class="popular-rank">${index + 1}</strong><a href="#">${restaurant}</a></li>`);
        });

        $('.hamburger').addClass('sidebar-open')
        $sidebar.addClass('open');
    });

    $('#close-sidebar').on('click', function () {
        $('.sidebar').removeClass('open');
        $('.hamburger').removeClass('sidebar-open')
    });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('.sidebar, .mob-popular-restaurant-btn').length) {
            $('.sidebar').removeClass('open');
            $('.hamburger').removeClass('sidebar-open')
        }
    });

    $('#close-sidebar').on('click', function () {
        $('.sidebar').removeClass('open');
    });
    
</script>