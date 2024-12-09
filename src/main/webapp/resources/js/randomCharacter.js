$(function () {
    const capsulesContainer = document.querySelector('.capsules');
    const drawButton = document.querySelector('.draw-button');
    const dispenseArea = document.querySelector('.dispense-area');
    const memIdx = $('#memIdx').val();
    if (memIdx) {
        refreshPoints(memIdx);
    }

    const colors = [
        { top: '#FFD700' },
        { top: '#87CEFA' },
        { top: '#FF69B4' },
        { top: '#BA55D3' },
        { top: '#FFA07A' },
        { top: '#4682B4' }
    ];


    function generateCapsulePositions(count, width, height) {
        const positions = [];
        const gap = width / count;
        for (let i = 0; i < count; i++) {
            const left = gap * i + gap / 4;
            const top = Math.random() * (height / 3) + height / 1;
            const rotation = Math.random() * 30 - 15;
            positions.push({ left, top, rotation });
        }
        return positions;
    }

    function createCapsules() {
        const positions = generateCapsulePositions(10, 200, 150);
        positions.forEach((pos, index) => {
            const capsule = document.createElement('div');
            capsule.classList.add('capsule');
            const color = colors[index % colors.length];
            capsule.style.setProperty('--color-top', color.top);
            capsule.style.left = pos.left + 'px';
            capsule.style.top = pos.top + 'px';
            capsule.style.transform = 'rotate(' + pos.rotation + 'deg)';
            capsulesContainer.appendChild(capsule);
        });
    }

    function refreshPoints(memIdx) {
        $.ajax({
            url: `/api/characters/points/${memIdx}`,
            method: 'GET',
            dataType: 'json',
            success: function(points) {
                $('#currentPoints').text(points);
            }
        });
    }



    async function isCharacterOwned(characterId) {
        const memberId = $('#memIdx').val();
        console.log(memberId)
        
        try {
            const response = await $.ajax({
                url: `/api/characters/member/${memberId}`,
                method: 'GET'
            });
    
            const ownedCharacterIds = response.map(character => character.characterId);
            return ownedCharacterIds.includes(characterId);
        } catch (error) {
            console.error('Error fetching owned characters:', error);
            return false;
        }
    }
    
    async function handleClick() {
        if (window.isAnimating) return;
    
        const currentPoints = parseInt($('#currentPoints').text());
        if (currentPoints < 10) {
            alert('포인트가 부족합니다!');
            return;
        }
    
        window.isAnimating = true;
        drawButton.disabled = true;
    
        const memIdx = $('#memIdx').val();
        if (!memIdx) {
            console.error('Member ID (memIdx) is not available.');
            window.isAnimating = false;
            drawButton.disabled = false;
            return;
        }
    
        const capsules = document.querySelectorAll('.capsule');
    
        capsules.forEach((capsule, index) => {
            setTimeout(() => {
                capsule.classList.add('jiggle');
                setTimeout(() => {
                    capsule.classList.remove('jiggle');
                }, 600);
            }, index * 100);
        });
    
        setTimeout(async () => {
            const rollingCapsule = document.createElement('div');
            rollingCapsule.classList.add('capsule', 'roll-out');
            rollingCapsule.style.setProperty('--color-top', colors[Math.floor(Math.random() * colors.length)].top);
            dispenseArea.appendChild(rollingCapsule);
            rollingCapsule.classList.add('roll-out-animation');

    
            try {
                const character = await $.ajax({
                    url: `/api/characters/random/${memIdx}`,
                    method: 'POST',
                    contentType: 'application/json',
                    dataType: 'json'
                });
    
                const isOwned = await isCharacterOwned(character.character.characterId);
    
                if (isOwned) {
                    try {
                        await $.ajax({
                            url: `/api/characters/points/add/${memIdx}`,
                            method: 'POST',
                            data: JSON.stringify({ points: 5 }),
                            contentType: 'application/json'
                        });
                    } catch (error) {
                        console.error('Error adding points:', error);
                    }
                }
                
                rollingCapsule.addEventListener('animationend', () => {
                    rollingCapsule.remove();
                });                
    
                setTimeout(() => {
                    const modalContent = `
                        <div class="character-modal">
                            <div class="character-modal-content">
                                <div class="character-info">
                                    <img src="${character.character.characterImage}" alt="Character Image">
                                    <h3>${isOwned ? "저런, 이미 보유한 패밀리어네요. <br> 5 포인트를 돌려드릴게요." : `${character.character.characterName} 획득!`}</h3>
                                </div>
                                <div class="character-modal-buttons">
                                    <button class="confirm-btn com-btn-primary com-round">확인</button>
                                </div>
                            </div>
                        </div>
                    `;
    
                    $('#characterResultModal').show().find('.modal-content').html(modalContent);

                    refreshPoints(memIdx);
                    window.isAnimating = false;
                    drawButton.disabled = false;
                }, 2000);
            } catch (error) {
                console.error('API call failed:', error);
                window.isAnimating = false;
                drawButton.disabled = false;
                if (error.status === 400) {
                    alert('포인트가 부족합니다!');
                }
            }
        }, capsules.length * 100 + 500);
    }
    
    $(document).on('click', '.confirm-btn', function() {
        $('#characterResultModal').hide();
        window.isAnimating = false;
    });
    
    createCapsules();
    drawButton.addEventListener('click', handleClick);
});
