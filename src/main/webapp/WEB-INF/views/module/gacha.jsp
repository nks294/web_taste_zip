<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div class="gacha-modal-container com-relative com-bg com-round-20 com-overflow-hidden com-flex-col com-flex-justify-center com-flex-align-center com-shadow-back">
    <button type="button" class="gacha-modal-close-btn com-color-primary com-pointer com-border-clear">
        <i class="far fa-times"></i>
    </button>
    
    <div id="gacha-container" class="com-flex-col com-flex-align-center com-flex-justify-center com-gap-20">
    
        <h2 id="gacha-modal-title" class="com-font-bold com-font-size-7 com-color-primary">
            ${empty member ? '패밀리어 뽑기 체험' : '패밀리어 뽑기'}
        </h2>
    
        <div class="gacha-machine com-shadow-back">
            <div class="gacha-machine-top">
                <div class="gacha-machine-glass">
                    <div class="gacha-glass-overlay"></div>
                    <div class="gacha-capsules"></div>
                </div>
            </div>
            
            <div class="gacha-machine-body">
                <div class="gacha-coin-slot"></div>
                
                <div class="gacha-control-panel com-flex-row com-flex-align-center com-flex-justify-center com-gap-20 com-width-100">
                    <div class="gacha-handle"></div>
                    
                    <div class="gacha-digital-display com-flex-col com-flex-align-center com-flex-justify-center com-round-5">
                        <span id="pointLabel" class="display-label com-font-size-small">보유 포인트</span>
                        <div class="com-flex-row com-flex-align-center com-gap-5">
                            <strong id="currentPoints" class="display-value" data-raw-points="${empty member ? '0' : member.point}">${empty member ? '0.0' : member.point}</strong>
                        </div>
                    </div>
                </div>

                <div class="gacha-dispense-area"></div>
            </div>
        </div>

        <div class="gacha-ui-wrapper com-flex-row com-flex-align-center com-gap-15 com-margin-top-10">
            <button class="gacha-draw-button com-btn-primary com-round-10 com-padding-primary com-font-bold com-font-size-4">캐릭터뽑기 (10코인)</button>
            
            <button id="open-test-collection-btn" class="com-btn-secondary com-color-primary com-round-10 com-border-primary com-pointer hidden" style="width: 45px; height: 45px;" title="도감 보기">
                <i class="fas fa-book-open"></i>
            </button>
        </div>

        <div id="gacha-result-modal" class="gacha-modal-overlay com-flex-row com-flex-justify-center com-flex-align-center hidden">
            <div class="gacha-result-content com-bg com-color com-round-20 com-padding-6 com-flex-col com-gap-20 com-text-center com-shadow-back">
                <div class="gacha-character-info com-flex-col com-flex-align-center com-gap-15">
                    <div class="gacha-image-wrapper com-overflow-hidden">
                        <img id="gacha-result-img" src="" alt="Character Image" class="com-img-fit com-padding-2">
                    </div>
                    <h3 id="gacha-result-message" class="com-font-size-5">결과 메시지</h3>
                </div>
                <div class="gacha-modal-buttons">
                    <button class="gacha-confirm-btn com-btn-primary com-round-10 com-padding-primary com-width-100">확인</button>
                </div>
            </div>
        </div>
        
        <div id="test-collection-modal" class="gacha-modal-overlay com-flex-row com-flex-justify-center com-flex-align-center hidden">
            <div class="gacha-collection-content com-bg com-color com-round-20 com-padding-6 com-flex-col com-gap-20 com-shadow-back com-relative">
                <button type="button" class="close-test-collection-btn com-color-primary com-pointer com-border-clear" style="position: absolute; top: 15px; right: 20px; font-size: 24px;">
                    <i class="far fa-times"></i>
                </button>
                
                <h3 class="com-font-bold com-text-center com-margin-bottom-10 com-color-primary">패밀리어 목록</h3>
                
                <div class="collection-grid-container com-scroll-y com-padding-2">
                    <ul id="test-collection-grid" class="com-flex-row com-flex-wrap com-gap-15 com-flex-justify-left"></ul>
                </div>
                
                <div class="com-flex-row com-flex-justify-center com-margin-top-10">
                    <button id="reset-test-inventory-btn" class="com-btn-secondary com-color-primary com-border-primary com-round-10 com-padding-primary com-width-100">
                        <i class="fas fa-trash-alt com-margin-right-small"></i> 보유 기록 초기화
                    </button>
                </div>
            </div>
        </div>

    </div>
</div>

<script type="text/javascript" src="${pageContext.request.contextPath}/resources/js/gacha.js?v=<%=System.currentTimeMillis()%>"></script>