"""
update_index.py v4 - 구조 분석 기반 정밀 삽입 (최종 확정 버전)

index.html 트렌드 카드 영역 구조:
    ... [마지막 trend-card] ...
                </div>          ← 카드의 </div>  (들여쓰기 16칸)
            </div>              ← 카드 리스트의 </div> (들여쓰기 12칸)
        </div>                  ← 섹션 컨테이너의 </div> (들여쓰기 8칸)
    </section>

새 카드는 '마지막 카드의 </div>' 바로 다음,
'카드 리스트의 </div>' 바로 이전에 삽입해야 합니다.
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')

file_path = r'd:\adsense\index.html'

# ─── 여기에 추가할 가이드 카드를 입력하세요 ───────────────────────────────
guides_to_add = [
    # ('guide_40.html', '제목', '설명'),
]
# ───────────────────────────────────────────────────────────────────────────

if not guides_to_add:
    print("INFO: guides_to_add 가 비어 있습니다.")
    sys.exit(0)

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 1) 마지막 trend-card 태그가 있는 라인 번호(0-indexed) 찾기
last_trend_line = max(
    (i for i, l in enumerate(lines) if 'trend-card' in l),
    default=None
)
if last_trend_line is None:
    print("ERROR: trend-card 를 찾을 수 없습니다.")
    sys.exit(1)

# 2) last_trend_line 이후 처음 나오는 '</section>' 라인 찾기
section_line = next(
    (i for i in range(last_trend_line, len(lines)) if '</section>' in lines[i]),
    None
)
if section_line is None:
    print("ERROR: </section> 을 찾을 수 없습니다.")
    sys.exit(1)

# 3) section_line 이전에 있는 마지막 카드의 </div> 다음 줄 = section_line - 2
#    구조: [last trend card</div>] → [리스트</div>] → [컨테이너</div>] → [</section>]
#    삽입 위치 = section_line - 2  (리스트 닫는 </div> 바로 앞)
insert_at = section_line - 2

# 4) 검증
print(f"마지막 trend-card 라인: {last_trend_line + 1}")
print(f"</section> 라인: {section_line + 1}")
print(f"삽입 위치: {insert_at + 1}번 줄 앞")
print(f"해당 줄 내용: {repr(lines[insert_at])}")

# '            </div>' (12칸 들여쓰기) 인지 확인
if lines[insert_at].strip() != '</div>':
    print(f"WARNING: 예상과 다른 내용입니다. 내용: {repr(lines[insert_at])}")
    print("삽입을 중단합니다. index.html 구조를 수동으로 확인하세요.")
    sys.exit(1)

# 5) 새 카드 HTML 생성 (LF 라인엔딩)
new_card_lines = []
for href, title, desc in guides_to_add:
    new_card_lines += [
        f'                <div class="trend-card" style="margin-bottom:15px; padding:15px 20px;">\n',
        f'                    <h3 class="trend-card-title" style="margin-bottom:5px;"><a href="{href}">{title}</a></h3>\n',
        f'                    <p class="trend-card-desc" style="margin-bottom:0;">{desc}</p>\n',
        f'                </div>\n',
    ]

# 6) 삽입
for i, line in enumerate(new_card_lines):
    lines.insert(insert_at + i, line)

# 7) 저장
with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print(f"SUCCESS: {len(guides_to_add)}개 카드 정상 삽입 완료")
