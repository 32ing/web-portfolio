// Options selection styling feedback
document.querySelectorAll('.options-group').forEach(group => {
    const labels = group.querySelectorAll('.option-label');
    labels.forEach(label => {
        const input = label.querySelector('input');
        input.addEventListener('change', () => {
            labels.forEach(l => l.classList.remove('selected'));
            if (input.checked) {
                label.classList.add('selected');
            }
        });
    });
});

// Diagnostic questionnaire scoring & feedback
const form = document.getElementById('gad7-form');
const resultContainer = document.getElementById('diagnostic-result');
const totalScoreEl = document.getElementById('total-score');
const statusTitleEl = document.getElementById('status-title');
const statusDescEl = document.getElementById('status-desc');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    let score = 0;
    const data = new FormData(form);
    
    for (let value of data.values()) {
        score += parseInt(value, 10);
    }

    // Update UI with calculated scores
    totalScoreEl.textContent = score;

    let level = "";
    let description = "";

    if (score <= 4) {
        level = "정상 범위 (Normal)";
        description = "마음이 비교적 평온하고 일상생활에 지장이 거의 없는 상태입니다. 긴장을 풀어주는 취미 활동 등으로 지금처럼 건강하게 마음을 가꿔보세요.";
    } else if (score <= 9) {
        level = "가벼운 불안 (Mild)";
        description = "약간의 불안감이나 스트레스가 감지되는 시기입니다. 4-7-8 호흡법이나 가벼운 유산소 운동으로 심신의 긴장을 주도적으로 해소해주시는 걸 권장합니다.";
    } else if (score <= 14) {
        level = "중간 정도의 불안 (Moderate)";
        description = "불안으로 인해 수면이나 대인 관계, 일상 업무에 소폭 영향이 가고 있을 수 있습니다. 생각 정리하기, 카페인 단절 등의 적극적인 생활 가이드 행동이 요구됩니다.";
    } else {
        level = "심한 불안 (Severe)";
        description = "일상 수행 능력에 뚜렷한 장애를 가져오는 높은 수준의 불안 및 긴장 상태입니다. 깊은 극복을 위해 의료기관 또는 심리상담 치료 전문가의 정밀 조언과 약물/행동 요법 등을 함께 살펴보는 것을 추천합니다.";
    }

    statusTitleEl.textContent = level;
    statusDescEl.textContent = description;

    // Hide the questions and description
    document.querySelector('.survey-info').style.display = 'none';
    form.style.display = 'none';

    // Show result container
    resultContainer.style.display = 'block';
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// Retry button event registration (for the dynamically generated retry button)
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'retry-btn') {
        // Reset the form values
        form.reset();
        
        // Remove selection classes on options labels
        document.querySelectorAll('.option-label').forEach(label => {
            label.classList.remove('selected');
        });

        // Show test and hide results
        document.querySelector('.survey-info').style.display = 'block';
        form.style.display = 'block';
        resultContainer.style.display = 'none';

        // Scroll back to top of diagnose section
        document.getElementById('diagnose').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

// Breathing Helper Tool (4-7-8 Breath System)
const breathBtn = document.getElementById('breath-btn');
const breathingBall = document.getElementById('breathing-ball');
const breathingInst = document.getElementById('breathing-inst');
const breathingTimerEl = document.getElementById('breathing-timer');

let breathingActive = false;
let breathCycleInterval;
let countdownInterval;

function clearBreathingTimers() {
    clearInterval(breathCycleInterval);
    clearInterval(countdownInterval);
    breathingBall.className = 'breathing-circle';
    breathingBall.textContent = '준비';
    breathingInst.textContent = '시작을 눌러주세요';
    breathingTimerEl.textContent = '0초';
    breathBtn.textContent = '호흡 시작하기';
    breathBtn.classList.remove('stop');
}

function runBreathingStep(actionText, durationSec, currentClass, nextCallback) {
    if (!breathingActive) return;

    breathingInst.textContent = actionText;
    breathingBall.textContent = actionText === '숨 들이쉬기' ? '들숨' : actionText === '숨 참기' ? '참기' : '날숨';
    
    // Apply scale classes dynamically to match inhale/hold/exhale
    breathingBall.className = 'breathing-circle ' + currentClass;

    let remaining = durationSec;
    breathingTimerEl.textContent = remaining + '초';

    countdownInterval = setInterval(() => {
        remaining--;
        breathingTimerEl.textContent = remaining + '초';
        if (remaining <= 0) {
            clearInterval(countdownInterval);
            nextCallback();
        }
    }, 1000);
}

function cycleBreathing() {
    if (!breathingActive) return;

    // 1. Inhale (4s)
    runBreathingStep('숨 들이쉬기', 4, 'inhale', () => {
        // 2. Hold (7s)
        runBreathingStep('숨 참기', 7, 'hold', () => {
            // 3. Exhale (8s)
            runBreathingStep('숨 내쉬기', 8, 'exhale', () => {
                // Loop cycle
                cycleBreathing();
            });
        });
    });
}

breathBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent triggering the section toggle
    if (breathingActive) {
        breathingActive = false;
        clearBreathingTimers();
    } else {
        breathingActive = true;
        breathBtn.textContent = '호흡 중단';
        breathBtn.classList.add('stop');
        cycleBreathing();
    }
});

// Expand widget when collapsed and clicked
const breathingSection = document.getElementById('breathing');
const breathCloseBtn = document.getElementById('breath-close-btn');

breathingSection.addEventListener('click', (e) => {
    if (breathingSection.classList.contains('collapsed')) {
        breathingSection.classList.remove('collapsed');
    }
});

// Collapse function to reuse
function collapseBreathingWidget() {
    breathingSection.classList.add('collapsed');
    if (breathingActive) {
        breathingActive = false;
        clearBreathingTimers();
    }
}

// Collapse widget when close (x) button is clicked
breathCloseBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent immediate reopening
    collapseBreathingWidget();
});

// Close widget when clicking anywhere outside of the breathing widget
document.addEventListener('click', (e) => {
    // If the widget is open (not collapsed) and the click occurred outside it
    if (!breathingSection.classList.contains('collapsed') && !breathingSection.contains(e.target)) {
        collapseBreathingWidget();
    }
});
