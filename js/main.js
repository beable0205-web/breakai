/**
 * "파인툴스 (FineTools)" 마스터 자바스크립트
 * 7대 핵심 계산기(실수령액, 예적금, 만나이, 취득세, 평단가, 퇴직금, 해외주식 양도세)의 실시간 연산 및 
 * 반응형 UI, 모바일 메뉴 드로어, 아코디언 컴포넌트 통합 통제
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. 모바일 드로어 네비게이션 제어
    initMobileNav();

    // 2. 자주 묻는 질문 아코디언 토글
    initFaqAccordion();

    // 3. 문의 폼 가상 전송 및 유효성 검사
    initContactForm();

    // 4. [계산기 1] 연봉 및 월 실수령액 계산기
    initSalaryCalculator();

    // 5. [계산기 2] 예금 및 적금 이자 계산기
    initInterestCalculator();

    // 6. [계산기 3] 만 나이 & 전역일/기념일 계산기
    initAgeCalculator();

    // 7. [계산기 4] 부동산 취득세 & 중개수수료 계산기
    initPropertyCalculator();

    // 8. [계산기 5] 주식/코인 평단가 물타기 계산기
    initStockCalculator();

    // 9. [계산기 6] 정밀 퇴직금 계산기
    initSeveranceCalculator();

    // 10. [계산기 7] 해외주식 양도소득세 계산기
    initOverseasTaxCalculator();
});

/* ==========================================================================
   1. 모바일 드로어 네비게이션
   ========================================================================== */
function initMobileNav() {
    const menuToggle = document.querySelector('.menu-toggle');
    if (!menuToggle) return;

    // 모바일 드로어 동적 주입
    const drawer = document.createElement('div');
    drawer.className = 'mobile-nav-drawer';
    drawer.innerHTML = `
        <a href="index.html" class="mobile-nav-link">홈 화면</a>
        <a href="salary.html" class="mobile-nav-link">실수령액 계산기</a>
        <a href="interest.html" class="mobile-nav-link">예적금 이자 계산기</a>
        <a href="age.html" class="mobile-nav-link">만 나이 계산기</a>
        <a href="property.html" class="mobile-nav-link">취득세/복비 계산기</a>
        <a href="stock.html" class="mobile-nav-link">주식 평단가 계산기</a>
        <a href="severance.html" class="mobile-nav-link">퇴직금 계산기</a>
        <a href="overseas.html" class="mobile-nav-link">해외주식 양도세 계산기</a>
        <a href="faq.html" class="mobile-nav-link">금융 FAQ</a>
        <a href="contact.html" class="mobile-nav-link">건의 및 문의</a>
    `;
    document.body.appendChild(drawer);

    menuToggle.addEventListener('click', () => {
        const isOpen = drawer.style.display === 'flex';
        drawer.style.display = isOpen ? 'none' : 'flex';
        
        // 햄버거 스팬 트랜지션
        const spans = menuToggle.querySelectorAll('span');
        if (isOpen) {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        } else {
            spans[0].style.transform = 'translateY(8px) rotate(45deg)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
        }
    });

    // 활성 페이지 하이라이트
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-link, .mobile-nav-link');
    links.forEach(l => {
        if (l.getAttribute('href') === currentPath) {
            l.classList.add('active');
        } else {
            l.classList.remove('active');
        }
    });
}

/* ==========================================================================
   2. 아코디언 토글 faq
   ========================================================================== */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question-btn');
        const answer = item.querySelector('.faq-answer');
        if (!btn || !answer) return;

        btn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // 아코디언 모드 구현 (전부 닫고 현재 클릭건만 열기)
            faqItems.forEach(other => {
                other.classList.remove('active');
                const otherAns = other.querySelector('.faq-answer');
                if (otherAns) otherAns.style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
}

/* ==========================================================================
   3. 문의 폼 유효성 및 가상 전송
   ========================================================================== */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const msg = document.getElementById('contact-message').value.trim();

        if (!name || !email || !msg) {
            alert("⚠️ 모든 입력란을 무오류로 기입해주십시오.");
            return;
        }

        alert("🎉 파인툴스에 소중한 피드백이 가상 접수되었습니다! 검토 후 신속히 반영하겠습니다.");
        contactForm.reset();
    });
}

/* ==========================================================================
   4. [계산기 1] 연봉 및 실수령액 계산기
   ========================================================================== */
function initSalaryCalculator() {
    const btnSubmit = document.getElementById('salary-btn');
    if (!btnSubmit) return;

    const inputSal = document.getElementById('salary-input');
    const inputNonTax = document.getElementById('salary-nontax');
    const selectDepend = document.getElementById('salary-dependents');
    const resultBox = document.getElementById('salary-result-box');

    // 3자리 콤마 자동 세팅
    [inputSal, inputNonTax].forEach(input => {
        if (input) {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^0-9]/g, '');
                e.target.value = value ? parseInt(value).toLocaleString() : '';
            });
        }
    });

    btnSubmit.addEventListener('click', () => {
        const rawSal = parseInt(inputSal.value.replace(/,/g, '')) || 0;
        const nonTax = parseInt(inputNonTax.value.replace(/,/g, '')) || 0;
        const dependents = parseInt(selectDepend.value) || 1;

        if (rawSal < 1000000) {
            alert("⚠️ 연봉은 최소 1,000,000원 이상 입력해야 정확한 요율 계산이 가능합니다.");
            return;
        }

        // 연봉 -> 월급 변환
        const monthlyBase = Math.floor(rawSal / 12);
        
        // 과세 대상액
        const taxable = Math.max(0, monthlyBase - nonTax);

        // 4대보험 2026년 모의 요율 적용 연산
        const nationalPension = Math.floor(Math.min(5900000, taxable) * 0.045); // 상한액 반영
        const healthInsurance = Math.floor(taxable * 0.03545);
        const longTermCare = Math.floor(healthInsurance * 0.1295);
        const employmentIns = Math.floor(taxable * 0.009);

        // 근로소득세 간이 계산 모형 (부양가족 수 반영 간이 공식)
        let incomeTax = 0;
        if (taxable > 1500000) {
            const excess = taxable - 1500000;
            // 부양가족이 많을수록 세율을 깎아주는 비례 할인 모의 공식
            const deductionRatio = Math.max(0.3, 1 - (dependents - 1) * 0.15);
            incomeTax = Math.floor((excess * 0.08 + 20000) * deductionRatio);
        }
        const localIncomeTax = Math.floor(incomeTax * 0.1);

        const totalDeductions = nationalPension + healthInsurance + longTermCare + employmentIns + incomeTax + localIncomeTax;
        const realPay = monthlyBase - totalDeductions;

        // 결과 주입
        document.getElementById('salary-res-monthly').textContent = monthlyBase.toLocaleString() + " 원";
        document.getElementById('salary-res-pension').textContent = "-" + nationalPension.toLocaleString() + " 원";
        document.getElementById('salary-res-health').textContent = "-" + healthInsurance.toLocaleString() + " 원";
        document.getElementById('salary-res-care').textContent = "-" + longTermCare.toLocaleString() + " 원";
        document.getElementById('salary-res-emp').textContent = "-" + employmentIns.toLocaleString() + " 원";
        document.getElementById('salary-res-tax').textContent = "-" + (incomeTax + localIncomeTax).toLocaleString() + " 원";
        document.getElementById('salary-res-deduct').textContent = totalDeductions.toLocaleString() + " 원";
        
        const finalVal = document.getElementById('salary-res-total');
        finalVal.textContent = realPay.toLocaleString() + " 원";

        resultBox.style.display = 'block';
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

/* ==========================================================================
   5. [계산기 2] 예적금 이자 계산기
   ========================================================================== */
function initInterestCalculator() {
    const btnSubmit = document.getElementById('interest-btn');
    if (!btnSubmit) return;

    const inputMoney = document.getElementById('interest-money');
    const inputRate = document.getElementById('interest-rate');
    const inputPeriod = document.getElementById('interest-period');
    const resultBox = document.getElementById('interest-result-box');

    // 콤마 포맷팅
    inputMoney.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = value ? parseInt(value).toLocaleString() : '';
    });

    btnSubmit.addEventListener('click', () => {
        const money = parseInt(inputMoney.value.replace(/,/g, '')) || 0;
        const rate = parseFloat(inputRate.value) / 100 || 0;
        const period = parseInt(inputPeriod.value) || 0;
        const type = document.querySelector('input[name="interest-type"]:checked').value; // deposit or savings
        const comp = document.querySelector('input[name="interest-comp"]:checked').value; // single or compound
        const taxType = document.getElementById('interest-taxtype').value; // general, preferential, taxfree

        if (money <= 0 || rate <= 0 || period <= 0) {
            alert("⚠️ 이자 연산을 위해 올바른 금액, 이자율, 기간을 기입해 주십시오.");
            return;
        }

        let rawInterest = 0;

        if (type === 'deposit') {
            // 예금 (거치식)
            if (comp === 'single') {
                // 단리
                rawInterest = money * rate * (period / 12);
            } else {
                // 복리 (월복리)
                rawInterest = money * (Math.pow(1 + (rate / 12), period) - 1);
            }
        } else {
            // 적금 (적립식)
            if (comp === 'single') {
                // 단리 적금: 매월 납입액에 따른 잔여 월수 가중 합산
                // 연리/12 * 월납입액 * {n*(n+1)/2}
                rawInterest = (money * (rate / 12) * (period * (period + 1) / 2));
            } else {
                // 복리 적금 (월복리 적립식)
                rawInterest = 0;
                for (let i = 1; i <= period; i++) {
                    rawInterest += money * (Math.pow(1 + (rate / 12), i));
                }
                rawInterest = rawInterest - (money * period);
            }
        }

        rawInterest = Math.floor(rawInterest);
        const totalPrincipal = money * (type === 'savings' ? period : 1);

        // 세율 계산
        let taxRate = 0.154; // 일반
        if (taxType === 'preferential') taxRate = 0.095;
        else if (taxType === 'taxfree') taxRate = 0;

        const taxAmount = Math.floor(rawInterest * taxRate);
        const netInterest = rawInterest - taxAmount;
        const totalPay = totalPrincipal + netInterest;

        // 화면 갱신
        document.getElementById('interest-res-principal').textContent = totalPrincipal.toLocaleString() + " 원";
        document.getElementById('interest-res-raw').textContent = rawInterest.toLocaleString() + " 원";
        document.getElementById('interest-res-tax').textContent = "-" + taxAmount.toLocaleString() + " 원";
        
        const finalVal = document.getElementById('interest-res-total');
        finalVal.textContent = totalPay.toLocaleString() + " 원";

        resultBox.style.display = 'block';
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

/* ==========================================================================
   6. [계산기 3] 만 나이 & 전역일/기념일 계산기
   ========================================================================== */
function initAgeCalculator() {
    const btnSubmit = document.getElementById('age-btn');
    if (!btnSubmit) return;

    const inputBirth = document.getElementById('age-birth');
    const inputBase = document.getElementById('age-base');
    const selectArmy = document.getElementById('age-army');
    const resultBox = document.getElementById('age-result-box');

    btnSubmit.addEventListener('click', () => {
        const birthStr = inputBirth.value;
        const baseStr = inputBase.value;

        if (!birthStr || !baseStr) {
            alert("⚠️ 출생일과 계산 기준일을 모두 선택해 주십시오.");
            return;
        }

        const birth = new Date(birthStr);
        const base = new Date(baseStr);

        if (birth > base) {
            alert("⚠️ 출생일이 계산 기준일보다 미래일 수 없습니다.");
            return;
        }

        // 1. 만 나이 계산
        let age = base.getFullYear() - birth.getFullYear();
        const monthDiff = base.getMonth() - birth.getMonth();
        const dayDiff = base.getDate() - birth.getDate();

        // 생일이 안 지났으면 -1세 연산
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }

        // 2. 띠 계산 (12간지 자바식 공식)
        const zodiacs = ["원숭이띠", "닭띠", "개띠", "돼지띠", "쥐띠", "소띠", "호랑이띠", "토끼띠", "용띠", "뱀띠", "말띠", "양띠"];
        const zodiac = zodiacs[birth.getFullYear() % 12];

        // 3. 전역 예정일 연산 (입대 예정일 기준)
        const armyType = selectArmy.value;
        let serviceMonths = 18; // 육군
        if (armyType === 'navy') serviceMonths = 20;
        else if (armyType === 'airforce') serviceMonths = 21;
        else if (armyType === 'marine') serviceMonths = 18;

        const dischargeDate = new Date(base);
        dischargeDate.setMonth(dischargeDate.getMonth() + serviceMonths);
        dischargeDate.setDate(dischargeDate.getDate() - 1); // 군 복무 통상 전역일 공식

        // 4. 기념일 계산 (100일, 1주년)
        const day100 = new Date(base);
        day100.setDate(day100.getDate() + 99); // 100일째 되는 날

        const year1 = new Date(base);
        year1.setFullYear(year1.getFullYear() + 1);

        // UI 바인딩
        document.getElementById('age-res-val').textContent = `만 ${age}세 (${zodiac})`;
        document.getElementById('age-res-details').textContent = `연 나이: ${base.getFullYear() - birth.getFullYear()}세`;
        document.getElementById('age-res-army').textContent = formatDate(dischargeDate);
        document.getElementById('age-res-100d').textContent = formatDate(day100);
        document.getElementById('age-res-1yr').textContent = formatDate(year1);

        resultBox.style.display = 'block';
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    function formatDate(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}년 ${m}월 ${d}일`;
    }
}

/* ==========================================================================
   7. [계산기 4] 부동산 취득세 & 중개수수료 계산기
   ========================================================================== */
function initPropertyCalculator() {
    const btnSubmit = document.getElementById('prop-btn');
    if (!btnSubmit) return;

    const inputPrice = document.getElementById('prop-price');
    const selectArea = document.getElementById('prop-area');
    const selectHouseNum = document.getElementById('prop-housenum');
    const selectRegulated = document.getElementById('prop-regulated');
    const resultBox = document.getElementById('prop-result-box');

    // 콤마 포맷팅
    inputPrice.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = value ? parseInt(value).toLocaleString() : '';
    });

    btnSubmit.addEventListener('click', () => {
        const price = parseInt(inputPrice.value.replace(/,/g, '')) || 0;
        const isSmallArea = selectArea.value === 'small'; // 85㎡ 이하
        const houseNum = selectHouseNum.value; // 1, 2, 3, 4
        const isRegulated = selectRegulated.value === 'yes';

        if (price <= 0) {
            alert("⚠️ 취득세와 복비 연산을 위해 올바른 부동산 거래가액을 기입해 주십시오.");
            return;
        }

        // 1. 취득세율 연산 공식 (지방세법 2026 표준 중과세 반영 모의)
        let taxRate = 0.01; // 기본 1%

        if (houseNum === '1') {
            // 1주택자 가액별 누진
            if (price <= 600000000) taxRate = 0.01;
            else if (price <= 900000000) {
                // 사다리 공식: (가액 * 2/3억 - 3) * 0.01
                taxRate = ((price * 2 / 300000000) - 3) / 100;
            } else taxRate = 0.03;
        } else if (houseNum === '2') {
            // 2주택자 규제 지역 중과
            taxRate = isRegulated ? 0.08 : 0.01;
        } else if (houseNum === '3') {
            taxRate = isRegulated ? 0.12 : 0.08;
        } else {
            taxRate = 0.12; // 4주택 이상 무조건 12%
        }

        // 2. 지방교육세율 (취득세의 10%)
        let eduTaxRate = taxRate * 0.1;

        // 3. 농어촌특별세 (85㎡ 이하 비과세, 초과 시 취득세의 0.2%)
        let ruralTaxRate = isSmallArea ? 0 : 0.002;

        const mainTax = Math.floor(price * taxRate);
        const eduTax = Math.floor(price * eduTaxRate);
        const ruralTax = Math.floor(price * ruralTaxRate);
        const totalAcquisitionTax = mainTax + eduTax + ruralTax;

        // 4. 부동산 중개수수료 (복비) 표준 상한 요율 (한국공인중개사협회 표준)
        let brokerRate = 0.009; // 기본 0.9%
        let brokerLimit = 0;

        if (price < 50000000) {
            brokerRate = 0.006;
            brokerLimit = 250000;
        } else if (price < 200000000) {
            brokerRate = 0.005;
            brokerLimit = 800000;
        } else if (price < 900000000) {
            brokerRate = 0.004;
            brokerLimit = 0;
        } else if (price < 1200000000) {
            brokerRate = 0.005;
            brokerLimit = 0;
        } else if (price < 1500000000) {
            brokerRate = 0.006;
            brokerLimit = 0;
        } else {
            brokerRate = 0.007;
            brokerLimit = 0;
        }

        let maxBrokerFee = Math.floor(price * brokerRate);
        if (brokerLimit > 0 && maxBrokerFee > brokerLimit) {
            maxBrokerFee = brokerLimit;
        }

        // UI 세팅
        document.getElementById('prop-res-main').textContent = mainTax.toLocaleString() + " 원" + ` (${(taxRate*100).toFixed(2)}%)`;
        document.getElementById('prop-res-edu').textContent = eduTax.toLocaleString() + " 원";
        document.getElementById('prop-res-rural').textContent = ruralTax.toLocaleString() + " 원";
        document.getElementById('prop-res-broker').textContent = maxBrokerFee.toLocaleString() + " 원" + ` (상한율 ${(brokerRate*100).toFixed(1)}%)`;
        
        const finalVal = document.getElementById('prop-res-total');
        finalVal.textContent = totalAcquisitionTax.toLocaleString() + " 원";

        resultBox.style.display = 'block';
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

/* ==========================================================================
   8. [계산기 5] 주식/코인 평단가 물타기 계산기
   ========================================================================== */
function initStockCalculator() {
    const btnSubmit = document.getElementById('stock-btn');
    if (!btnSubmit) return;

    const price1Input = document.getElementById('stock-price-1');
    const qty1Input = document.getElementById('stock-qty-1');
    const price2Input = document.getElementById('stock-price-2');
    const qty2Input = document.getElementById('stock-qty-2');
    const targetPriceInput = document.getElementById('stock-target-price');
    const resultBox = document.getElementById('stock-result-box');

    // 콤마 포맷팅
    [price1Input, qty1Input, price2Input, qty2Input, targetPriceInput].forEach(input => {
        if (input) {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^0-9.]/g, ''); // 코인도 포함되므로 소수점 허용
                let parts = value.split('.');
                parts[0] = parts[0] ? parseInt(parts[0]).toLocaleString() : '';
                e.target.value = parts.join('.');
            });
        }
    });

    btnSubmit.addEventListener('click', () => {
        const price1 = parseFloat(price1Input.value.replace(/,/g, '')) || 0;
        const qty1 = parseFloat(qty1Input.value.replace(/,/g, '')) || 0;
        const price2 = parseFloat(price2Input.value.replace(/,/g, '')) || 0;
        const qty2 = parseFloat(qty2Input.value.replace(/,/g, '')) || 0;
        const targetPrice = parseFloat(targetPriceInput.value.replace(/,/g, '')) || 0;

        if (price1 <= 0 || qty1 <= 0) {
            alert("⚠️ 1차 매수 평단가와 수량을 올바르게 입력해 주십시오.");
            return;
        }

        const totalQty = qty1 + qty2;
        const totalAmount = (price1 * qty1) + (price2 * qty2);
        const avgPrice = totalQty > 0 ? (totalAmount / totalQty) : 0;

        document.getElementById('stock-res-total-qty').textContent = totalQty.toLocaleString(undefined, {maximumFractionDigits: 4}) + " 주/개";
        document.getElementById('stock-res-total-price').textContent = Math.floor(totalAmount).toLocaleString() + " 원";
        document.getElementById('stock-res-avg-price').textContent = avgPrice.toLocaleString(undefined, {maximumFractionDigits: 2}) + " 원";

        // 목표 평단가 도달 연산 (역산)
        const targetBox = document.getElementById('stock-res-target-wrapper');
        const targetNeededElement = document.getElementById('stock-res-target-needed');
        
        if (targetPrice > 0 && targetBox && targetNeededElement) {
            if (targetPrice >= price1) {
                targetNeededElement.textContent = "목표 평단가가 이미 현재 평단가보다 높거나 같습니다.";
            } else if (targetPrice <= price2) {
                targetNeededElement.textContent = "목표 평단가가 추가 매수 가격보다 낮거나 같아 도달할 수 없습니다.";
            } else {
                // targetPrice = (price1 * qty1 + price2 * qty_needed) / (qty1 + qty_needed)
                // targetPrice * qty1 + targetPrice * qty_needed = price1 * qty1 + price2 * qty_needed
                // (targetPrice - price2) * qty_needed = (price1 - targetPrice) * qty1
                // qty_needed = ((price1 - targetPrice) * qty1) / (targetPrice - price2)
                const qtyNeeded = ((price1 - targetPrice) * qty1) / (targetPrice - price2);
                if (qtyNeeded > 0) {
                    const amountNeeded = qtyNeeded * price2;
                    targetNeededElement.innerHTML = `추가 매수 필요한 수량: <strong style="color: var(--accent-mint);">${qtyNeeded.toLocaleString(undefined, {maximumFractionDigits: 4})}</strong> 주/개<br>필요 추가 자금: <strong style="color: var(--accent-mint);">${Math.floor(amountNeeded).toLocaleString()}</strong> 원`;
                } else {
                    targetNeededElement.textContent = "계산 불가 (입력값을 다시 확인해 주십시오)";
                }
            }
            targetBox.style.display = 'block';
        } else if (targetBox) {
            targetBox.style.display = 'none';
        }

        resultBox.style.display = 'block';
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

/* ==========================================================================
   9. [계산기 6] 정밀 퇴직금 계산기
   ========================================================================== */
function initSeveranceCalculator() {
    const btnSubmit = document.getElementById('sev-btn');
    if (!btnSubmit) return;

    const joinDateInput = document.getElementById('sev-join-date');
    const leaveDateInput = document.getElementById('sev-leave-date');
    const pay1Input = document.getElementById('sev-pay-1');
    const pay2Input = document.getElementById('sev-pay-2');
    const pay3Input = document.getElementById('sev-pay-3');
    const bonusInput = document.getElementById('sev-bonus');
    const annualInput = document.getElementById('sev-annual');
    const resultBox = document.getElementById('sev-result-box');

    // 콤마 포맷팅
    [pay1Input, pay2Input, pay3Input, bonusInput, annualInput].forEach(input => {
        if (input) {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^0-9]/g, '');
                e.target.value = value ? parseInt(value).toLocaleString() : '';
            });
        }
    });

    btnSubmit.addEventListener('click', () => {
        const joinStr = joinDateInput.value;
        const leaveStr = leaveDateInput.value;

        if (!joinStr || !leaveStr) {
            alert("⚠️ 입사일과 퇴사일을 모두 입력해 주십시오.");
            return;
        }

        const joinDate = new Date(joinStr);
        const leaveDate = new Date(leaveStr);

        if (joinDate >= leaveDate) {
            alert("⚠️ 퇴사일은 입사일보다 이후여야 합니다.");
            return;
        }

        // 재직일수 계산
        const diffTime = Math.abs(leaveDate - joinDate);
        const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (totalDays < 365) {
            alert(`⚠️ 재직일수가 ${totalDays}일입니다. 근로기준법상 퇴직금은 1년(365일) 이상 근속 시에만 지급 의무가 발생합니다. (참고용으로 연산은 진행됩니다.)`);
        }

        const pay1 = parseInt(pay1Input.value.replace(/,/g, '')) || 0;
        const pay2 = parseInt(pay2Input.value.replace(/,/g, '')) || 0;
        const pay3 = parseInt(pay3Input.value.replace(/,/g, '')) || 0;
        const bonus = parseInt(bonusInput.value.replace(/,/g, '')) || 0;
        const annual = parseInt(annualInput.value.replace(/,/g, '')) || 0;

        // 직전 3개월 총 일수 계산 (퇴사일 기준 이전 3개월의 일수)
        let last3MonthsDays = 0;
        const tempDate = new Date(leaveDate);
        for (let i = 0; i < 3; i++) {
            const currentMonth = tempDate.getMonth();
            // 각 월의 일수를 구함
            tempDate.setMonth(tempDate.getMonth() - 1);
            const year = tempDate.getFullYear();
            const month = tempDate.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            last3MonthsDays += daysInMonth;
        }
        if (last3MonthsDays < 80 || last3MonthsDays > 95) {
            last3MonthsDays = 92; // 안전 보정값
        }

        const basePaySum = pay1 + pay2 + pay3;
        const bonusFraction = bonus * (3 / 12);
        const annualFraction = annual * (3 / 12);

        const total3MonthsSalary = basePaySum + bonusFraction + annualFraction;
        const avgDailyWage = total3MonthsSalary / last3MonthsDays;

        // 예상 퇴직금 계산 공식: 1일 평균임금 * 30 * (재직일수 / 365)
        const severancePay = avgDailyWage * 30 * (totalDays / 365);

        // UI 세팅
        document.getElementById('sev-res-days').textContent = totalDays.toLocaleString() + " 일";
        document.getElementById('sev-res-avg-daily').textContent = Math.floor(avgDailyWage).toLocaleString() + " 원";
        
        const finalVal = document.getElementById('sev-res-total');
        finalVal.textContent = Math.floor(severancePay).toLocaleString() + " 원";

        resultBox.style.display = 'block';
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

/* ==========================================================================
   10. [계산기 7] 해외주식 양도소득세 계산기
   ========================================================================== */
function initOverseasTaxCalculator() {
    const btnSubmit = document.getElementById('tax-btn');
    if (!btnSubmit) return;

    const sellInput = document.getElementById('tax-sell');
    const buyInput = document.getElementById('tax-buy');
    const feeInput = document.getElementById('tax-fee');
    const resultBox = document.getElementById('tax-result-box');

    // 콤마 포맷팅
    [sellInput, buyInput, feeInput].forEach(input => {
        if (input) {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^0-9]/g, '');
                e.target.value = value ? parseInt(value).toLocaleString() : '';
            });
        }
    });

    btnSubmit.addEventListener('click', () => {
        const sellAmount = parseInt(sellInput.value.replace(/,/g, '')) || 0;
        const buyAmount = parseInt(buyInput.value.replace(/,/g, '')) || 0;
        const feeAmount = parseInt(feeInput.value.replace(/,/g, '')) || 0;

        if (sellAmount <= 0) {
            alert("⚠️ 올바른 총 매도금액을 입력해 주십시오.");
            return;
        }

        // 양도차익 = 매도금액 - 매입금액 - 제비용
        const profit = sellAmount - buyAmount - feeAmount;
        const deduction = 2500000; // 연간 기본 공제액 250만 원

        // 과세표준 = 양도차익 - 기본공제
        const taxBase = Math.max(0, profit - deduction);
        
        // 양도소득세 20%
        const nationalTax = Math.floor(taxBase * 0.20);
        // 지방소득세 2%
        const localTax = Math.floor(nationalTax * 0.10);
        // 총 납부 세액
        const totalTax = nationalTax + localTax;

        // UI 세팅
        document.getElementById('tax-res-profit').textContent = profit.toLocaleString() + " 원";
        document.getElementById('tax-res-deduction').textContent = (profit > 0 ? Math.min(profit, deduction) : 0).toLocaleString() + " 원";
        document.getElementById('tax-res-base').textContent = taxBase.toLocaleString() + " 원";
        document.getElementById('tax-res-tax20').textContent = nationalTax.toLocaleString() + " 원";
        document.getElementById('tax-res-tax2').textContent = localTax.toLocaleString() + " 원";
        
        const finalVal = document.getElementById('tax-res-total');
        finalVal.textContent = totalTax.toLocaleString() + " 원";

        resultBox.style.display = 'block';
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}
