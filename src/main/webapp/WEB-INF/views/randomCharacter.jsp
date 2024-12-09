<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Toy Capsule Machine</title>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script> 
    <script type="text/javascript" src="/resources/js/randomCharacter.js"></script>

    <style>
/* Reset */
body {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: none;
    font-family: Arial, sans-serif;
    gap: 20px;
}

.draw-button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
    margin-top: 20px;
}

.points-display {
    font-size: 16px;
    font-weight: bold;
    background-color: #E5E5E5;
}

/* Capsule Machine Styles */
.machine {
    width: 220px;
    height: 450px;
    background: #FF4C4C;
    border-radius: 10px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

/* Machine Top Section */
.machine-top {
    width: 200px;
    height: 250px;
    background: #FF6961;
    border-radius: 10px 10px 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
}

.machine-glass {
    width: 85%;
    height: 85%;
    background: rgba(173, 216, 230, 0.7);
    border-radius: 10px;
    border: 5px solid #E5E5E5;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
}

/* Glass Overlay */
.glass-overlay {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 20px;
    background: rgba(255, 76, 76, 0.9);
    z-index: 2;
}

/* Capsules Container */
.capsules {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: flex-end;
}

/* Capsules */
.capsule {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(to bottom, var(--color-top, #FFD700) 50%, white 50%);
    position: absolute;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    animation: none;
}

/* Capsule Animation */
.capsule.jiggle {
    animation: jiggle 0.2s ease-in-out 3;
}

@keyframes jiggle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

/* Machine Body Section */
.machine-body {
    width: 200px;
    height: 200px;
    background: #FF4C4C;
    border-radius: 0 0 10px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 3;
}

/* Coin Slot */
.coin-slot {
    width: 50px;
    height: 10px;
    background: #444;
    border-radius: 5px;
    margin: 20px 0;
}

/* Handle */
.handle {
    width: 40px;
    height: 40px;
    background: #E5E5E5;
    border: 3px solid #999;
    border-radius: 50%;
    margin: 10px 0;
    cursor: pointer;
    position: relative;
    z-index: 5;
}

.handle::after {
    content: '';
    width: 15px;
    height: 15px;
    background: #999;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* Dispense Area */
.dispense-area {
    width: 80px;
    height: 45px;
    background: #444;
    border-radius: 5px;
    margin-top: auto;
    position: relative;
    bottom: -10px;
    box-shadow: inset 0 -2px 6px rgba(0, 0, 0, 0.5);
    overflow: visible;
    z-index: 1;
}

/* Rolling Capsule */
.capsule.roll-out {
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(to bottom, var(--color-top, #FFD700) 50%, white 50%);
    z-index: 10;
}

/* Rolling Animation */
.capsule.roll-out-animation {
    animation: rollOut 2s ease-out forwards;
}

@keyframes rollOut {
    0% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(50px, 20px) rotate(90deg); }
    100% { transform: translate(120px, 40px) rotate(180deg); }
}

/* Character Result Modal */
#characterResultModal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
}

.character-modal {
    background: white;
    padding: 30px;
    border-radius: 15px;
    z-index: 10000;
    text-align: center;
}

.character-modal-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.character-info img {
    width: 200px;
    height: 200px;
    object-fit: contain;
    margin-bottom: 15px;
}

.character-modal-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
}

.character-modal-buttons button {
    padding: 12px 24px;
    cursor: pointer;
}


</style>

</head>
<body>

    <input type="hidden" id="memIdx" value="${memIdx}">

    <div class="machine">
        <div class="machine-top">
            <div class="machine-glass">
                <div class="glass-overlay"></div>
                <div class="capsules"></div>
            </div>
        </div>
        <div class="machine-body">
            <div class="coin-slot"></div>
            <div class="handle"></div>
            <div class="dispense-area"></div>
        </div>
    </div>

    <button class="draw-button">캐릭터뽑기 (10포인트)</button>

    <div class="points-display">
        현재 포인트: <span id="currentPoints">${member.point}</span>
    </div>


    <div id="characterResultModal" style="display: none;">
        <div class="modal-content"></div>
    </div>
</body>


</html>
