"""
update_index.py v4 - 구조 분석 기반 정밀 삽입 (최종 확정 버전)
guide_40, guide_41 추가
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')

file_path = r'd:\adsense\index.html'

guides_to_add = [
    (
        'guide_40.html',
        '2026년 ISA 계좌 완전 가이드: 비과세·분리과세 혜택과 중개형 vs 신탁형 비교',
        'ISA 계좌 하나로 세금 최대 200만 원 절약? 2026년 중개형·신탁형·일임형 완벽 비교, 비과세 한도·분리과세 9.9% 혜택, ISA→연금계좌 연계 전략까지 총정리합니다.'
    ),
    (
        'guide_41.html',
        '2026년 건강보험료 절감 완전 가이드: 직장·지역가입자 보험료 줄이는 법',
        '매달 나가는 건강보험료 합법적으로 줄일 수 있다! 피부양자 등재 요건, 지역가입자 재산점수 줄이기, 퇴직자 임의계속가입 전략까지 핵심만 정리합니다.'
    ),
]

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

last_trend_line = max(
    (i for i, l in enumerate(lines) if 'trend-card' in l),
    default=None
)
if last_trend_line is None:
    print("ERROR: trend-card 를 찾을 수 없습니다.")
    sys.exit(1)

section_line = next(
    (i for i in range(last_trend_line, len(lines)) if '</section>' in lines[i]),
    None
)
if section_line is None:
    print("ERROR: </section> 을 찾을 수 없습니다.")
    sys.exit(1)

insert_at = section_line - 2

print(f"마지막 trend-card 라인: {last_trend_line + 1}")
print(f"</section> 라인: {section_line + 1}")
print(f"삽입 위치: {insert_at + 1}번 줄 앞")
print(f"해당 줄 내용: {repr(lines[insert_at])}")

if lines[insert_at].strip() != '</div>':
    print(f"WARNING: 예상과 다른 내용. 내용: {repr(lines[insert_at])}")
    print("삽입 중단. index.html 구조를 확인하세요.")
    sys.exit(1)

new_card_lines = []
for href, title, desc in guides_to_add:
    new_card_lines += [
        f'                <div class="trend-card" style="margin-bottom:15px; padding:15px 20px;">\n',
        f'                    <h3 class="trend-card-title" style="margin-bottom:5px;"><a href="{href}">{title}</a></h3>\n',
        f'                    <p class="trend-card-desc" style="margin-bottom:0;">{desc}</p>\n',
        f'                </div>\n',
    ]

for i, line in enumerate(new_card_lines):
    lines.insert(insert_at + i, line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print(f"SUCCESS: {len(guides_to_add)}개 카드 정상 삽입 완료")
