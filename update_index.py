"""
update_index.py v2 - 안전한 앵커 기반 삽입
footer-bottom 직전을 정확한 앵커로 삼아 삽입합니다.
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')

file_path = r'd:\adsense\index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

guides_to_add = [
    (
        'guide_38.html',
        '2026년 1인 법인 vs 개인사업자: 세금 차이와 법인 전환 시점 완벽 가이드',
        '연 소득 얼마부터 법인이 유리할까? 개인사업자와 1인 법인의 소득세·법인세 비교, 4대보험 절감 효과, 법인 전환 시 주의사항까지 이도현 회계사가 실전 데이터로 분석합니다.'
    ),
    (
        'guide_39.html',
        '2026년 가상자산(코인) 과세 완전 가이드: 250만 원 공제와 신고 방법 총정리',
        '2025년부터 시행된 가상자산 과세, 내 코인 수익에 세금 얼마? 250만 원 기본공제, 이동평균법 취득가액 계산, 손실 상계까지 이도현 회계사가 가상자산 세금 총정리합니다.'
    ),
]

new_cards_html = ''
for href, title, desc in guides_to_add:
    new_cards_html += f"""                <div class="trend-card" style="margin-bottom:15px; padding:15px 20px;">
                    <h3 class="trend-card-title" style="margin-bottom:5px;"><a href="{href}">{title}</a></h3>
                    <p class="trend-card-desc" style="margin-bottom:0;">{desc}</p>
                </div>
"""

# 안전 앵커: CRLF 먼저, 없으면 LF
ANCHOR_CRLF = '            </div>\r\n            <div class="footer-bottom">'
ANCHOR_LF   = '            </div>\n            <div class="footer-bottom">'

if ANCHOR_CRLF in content:
    content = content.replace(ANCHOR_CRLF, new_cards_html + ANCHOR_CRLF, 1)
    print("SUCCESS (CRLF)")
elif ANCHOR_LF in content:
    content = content.replace(ANCHOR_LF, new_cards_html + ANCHOR_LF, 1)
    print("SUCCESS (LF)")
else:
    print("ERROR: 앵커를 찾을 수 없습니다. index.html 구조를 확인하세요.")
    sys.exit(1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
