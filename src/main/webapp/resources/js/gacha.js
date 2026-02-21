$(function () {
    const capsulesContainer = document.querySelector('.gacha-capsules');
    const drawButton = document.querySelector('.gacha-draw-button');
    const dispenseArea = document.querySelector('.gacha-dispense-area');
    const memIdx = $('#globalMemIdx').val();
    const isTestMode = !memIdx;

    let testPoints = parseFloat(localStorage.getItem('testPoints')) || 0.0;
    let testInventory = [];

    try {
        const storedInventory = localStorage.getItem('testInventory');
        if (storedInventory) {
            testInventory = JSON.parse(storedInventory);
        }
    } catch (e) {
        console.warn('로컬 스토리지 데이터 손상 복구');
        localStorage.removeItem('testInventory');
        testInventory = [];
    }

    function formatPointsDisplay(value) {
        const numValue = parseFloat(value);
        if (numValue > 999) {
            return '999';
        }
        return Number.isInteger(numValue) ? numValue.toString() : numValue.toFixed(1);
    }

    if (isTestMode) {
        $('#gacha-modal-title').text('패밀리어 뽑기 체험');
        $('#open-test-collection-btn').removeClass('hidden');
        $('#pointLabel').text('보유 토큰');
        $('#currentPoints').text(formatPointsDisplay(testPoints));
        $(drawButton).text('테스트 뽑기 (10토큰)');

        const machineEl = document.querySelector('.gacha-machine');
        if (machineEl) {
            machineEl.style.cursor = 'pointer';

            machineEl.addEventListener('touchstart', function () {
                this.classList.add('click-bounce');
            }, { passive: true });

            machineEl.addEventListener('touchend', function () {
                this.classList.remove('click-bounce');
            }, { passive: true });

            machineEl.addEventListener('mousedown', function () {
                this.classList.add('click-bounce');
            });

            machineEl.addEventListener('mouseup', function () {
                this.classList.remove('click-bounce');
            });

            machineEl.addEventListener('click', function () {
                if (!window.isAnimating) {
                    testPoints += 0.1;
                    localStorage.setItem('testPoints', testPoints.toFixed(1));
                    $('#currentPoints').text(formatPointsDisplay(testPoints));
                }
            });
        }
    } else {
        $('#gacha-modal-title').text('패밀리어 뽑기');
        $('#pointLabel').text('보유 코인');
        $(drawButton).text('캐릭터 뽑기 (10코인)');
        refreshPoints(memIdx);
    }

    const colors = [
        { top: '#FFD700' }, { top: '#87CEFA' }, { top: '#FF69B4' },
        { top: '#BA55D3' }, { top: '#FFA07A' }, { top: '#4682B4' }
    ];

    function generateCapsulePositions(count, width, height) {
        const positions = [];
        const xStep = width / (count / 2);

        for (let i = 0; i < count; i++) {
            const left = (i % (count / 2)) * xStep + (Math.random() * 15 - 5);
            const row = Math.floor(i / (count / 2));
            const top = height - 40 - (row * 35) + (Math.random() * 10);
            const rotation = Math.random() * 360;

            positions.push({ left, top, rotation });
        }
        return positions;
    }

    function createCapsules() {
        const positions = generateCapsulePositions(20, 150, 200);
        positions.forEach((pos, index) => {
            const capsule = document.createElement('div');
            capsule.classList.add('gacha-capsule');
            const color = colors[index % colors.length];
            capsule.style.setProperty('--color-top', color.top);
            capsule.style.left = pos.left + 'px';
            capsule.style.top = pos.top + 'px';
            capsule.style.setProperty('--rot', pos.rotation + 'deg');
            capsule.style.transform = `rotate(${pos.rotation}deg)`;
            capsulesContainer.appendChild(capsule);
        });
    }

    function refreshPoints(idx) {
        if (!idx) return;
        $.ajax({
            url: `${contextPath}/api/characters/points/${idx}`,
            method: 'GET',
            dataType: 'json',
            success: function (points) {
                $('#currentPoints').attr('data-raw-points', points).text(formatPointsDisplay(points));
            }
        });
    }

    async function isCharacterOwned(characterId) {
        if (isTestMode) return testInventory.includes(String(characterId));

        try {
            const response = await $.ajax({
                url: `${contextPath}/api/characters/member/${memIdx}`,
                method: 'GET'
            });
            const ownedCharacterIds = response.map(character => String(character.characterId));
            return ownedCharacterIds.includes(String(characterId));
        } catch (error) {
            console.error('Error fetching owned characters:', error);
            return false;
        }
    }

    $('#open-test-collection-btn').on('click', function () {
        loadTestCollection();
        $('#test-collection-modal').removeClass('hidden');
    });

    $('.close-test-collection-btn').on('click', function () {
        $('#test-collection-modal').addClass('hidden');
    });

    $('#reset-test-inventory-btn').on('click', function () {
        if (confirm("정말로 테스트 데이터를 초기화하시겠습니까?\n(보유 패밀리어 상태가 모두 초기화됩니다.)")) {
            localStorage.removeItem('testInventory');
            testInventory = [];
            $('#currentPoints').text(formatPointsDisplay(testPoints)).attr('data-raw-points', testPoints);
            loadTestCollection();
            alert("초기화되었습니다.");
        }
    });

    function loadTestCollection() {
        $.ajax({
            url: `${contextPath}/api/characters/list`,
            method: 'GET',
            dataType: 'json',
            success: function (allCharacters) {
                const listContainer = $('#test-collection-grid');
                listContainer.empty();

                allCharacters.forEach(character => {
                    const charId = String(character.characterId);
                    const isOwned = testInventory.includes(charId);
                    const ownedClass = isOwned ? '' : 'not-owned';

                    const characterCard = `
                        <li class="${ownedClass}">
                            <img src="${contextPath}/resources/img/character/${character.characterImage}" alt="${character.characterName}">
                            <span>${character.characterName}</span>
                        </li>
                    `;
                    listContainer.append(characterCard);
                });
            },
            error: function (xhr, status, error) {
                console.error('도감 목록을 불러오는 중 오류 발생:', error);
            }
        });
    }

    async function handleClick() {
        if (window.isAnimating) return;

        if (isTestMode) {
            if (testPoints < 10.0) {
                alert('토큰이 부족합니다! 자판기를 클릭하여 토큰을 모아주세요.');
                return;
            }
        } else {
            const currentPoints = parseInt($('#currentPoints').attr('data-raw-points')) || 0;
            if (currentPoints < 10) {
                alert('코인이 부족합니다!');
                return;
            }
        }

        window.isAnimating = true;
        drawButton.disabled = true;

        if (isTestMode) {
            testPoints -= 10.0;
            localStorage.setItem('testPoints', testPoints.toFixed(1));
            $('#currentPoints').text(formatPointsDisplay(testPoints));
        }

        const capsules = document.querySelectorAll('.gacha-capsule');

        capsules.forEach((capsule, index) => {
            setTimeout(() => {
                capsule.classList.add('jiggle');
                setTimeout(() => {
                    capsule.classList.remove('jiggle');
                }, 600);
            }, (index % 5) * 100);
        });

        setTimeout(async () => {
            const rollingCapsule = document.createElement('div');
            rollingCapsule.classList.add('gacha-capsule', 'roll-out');
            rollingCapsule.style.setProperty('--color-top', colors[Math.floor(Math.random() * colors.length)].top);
            dispenseArea.appendChild(rollingCapsule);
            rollingCapsule.classList.add('roll-out-animation');

            rollingCapsule.addEventListener('animationend', () => {
                rollingCapsule.remove();
            });

            // 비 로그인 상태
            if (isTestMode) {
                try {
                    const allCharacters = await $.ajax({
                        url: `${contextPath}/api/characters/list`,
                        method: 'GET',
                        dataType: 'json'
                    });

                    if (!allCharacters || allCharacters.length === 0) {
                        alert("캐릭터 정보를 불러올 수 없습니다.");
                        window.isAnimating = false;
                        drawButton.disabled = false;
                        return;
                    }

                    const randomIndex = Math.floor(Math.random() * allCharacters.length);
                    const pickedCharacter = allCharacters[randomIndex];
                    const charId = String(pickedCharacter.characterId);

                    const isOwned = testInventory.includes(charId);

                    if (isOwned) {
                        testPoints += 5.0;
                        localStorage.setItem('testPoints', testPoints.toFixed(1));
                        $('#currentPoints').text(formatPointsDisplay(testPoints));
                    } else {
                        testInventory.push(charId);
                        localStorage.setItem('testInventory', JSON.stringify(testInventory));
                    }

                    setTimeout(() => {
                        const messageHtml = isOwned ? "저런, 이미 보유한 패밀리어네요. <br> 5 토큰을 돌려드릴게요." : `${pickedCharacter.characterName} 획득!`;
                        $('#gacha-result-img').attr('src', `/tastezip/resources/img/character/${pickedCharacter.characterImage}`);
                        $('#gacha-result-message').html(messageHtml);

                        $('#gacha-result-modal').removeClass('hidden');

                        window.isAnimating = false;
                        drawButton.disabled = false;
                    }, 2000);

                } catch (error) {
                    window.isAnimating = false;
                    drawButton.disabled = false;
                    alert('캐릭터 목록을 불러오는데 실패했습니다.');
                }
            }
            // 로그인 상태 실제로 사용자 DB에 기록
            else {
                try {
                    const character = await $.ajax({
                        url: `${contextPath}/api/characters/random/${memIdx}`,
                        method: 'POST',
                        contentType: 'application/json',
                        dataType: 'json'
                    });

                    const isOwned = await isCharacterOwned(character.character.characterId);

                    if (isOwned) {
                        try {
                            await $.ajax({
                                url: `${contextPath}/api/characters/points/add/${memIdx}`,
                                method: 'POST',
                                data: JSON.stringify({ points: 5 }),
                                contentType: 'application/json'
                            });
                        } catch (error) { }
                    }

                    setTimeout(() => {
                        const messageHtml = isOwned ? "저런, 이미 보유한 패밀리어네요. <br> 5 코인을 돌려드릴게요." : `${character.character.characterName} 획득!`;

                        $('#gacha-result-img').attr('src', `/tastezip/resources/img/character/${character.character.characterImage}`);
                        $('#gacha-result-message').html(messageHtml);

                        $('#gacha-result-modal').removeClass('hidden');

                        refreshPoints(memIdx);
                        window.isAnimating = false;
                        drawButton.disabled = false;
                    }, 2000);
                } catch (error) {
                    window.isAnimating = false;
                    drawButton.disabled = false;
                    if (error.status === 400) {
                        alert('코인이 부족합니다!');
                    }
                }
            }
        }, 1000);
    }

    $(document).on('click', '.gacha-confirm-btn', function () {
        $('#gacha-result-modal').addClass('hidden');
        window.isAnimating = false;
    });

    createCapsules();
    drawButton.addEventListener('click', handleClick);

});