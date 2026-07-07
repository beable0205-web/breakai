"""
update_index.py - 안전한 앵커 기반 삽입 방식 (v2)
- footer-bottom 직전의 닫는 </div>를 정확히 타겟으로 삼아
  trend-card를 올바른 위치에 삽입합니다.
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')

file_path = r'd:\adsense\index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 안전한 앵커: footer-bottom 클래스 바로 직전의 닫는 </div>\n 패턴을 타겟
# 이 패턴은 트렌드 카드 그리드를 닫는 </div> 다음에 footer-bottom이 오는 구조
ANCHOR = '            </div>\r\n            <div class="footer-bottom">'

if ANCHOR not in content:
    # CRLF가 아닌 경우 LF로 재시도
    ANCHOR = '            </div>\n            <div class="footer-bottom">'

def add_guide_cards(guide_pairs):
    """
    guide_pairs: [(href, title, desc), ...]
    """
    global content
    
    new_cards_html = ''
    for href, title, desc in guide_pairs:
        new_cards_html += f"""                <div class="trend-card" style="margin-bottom:15px; padding:15px 20px;">
                    <h3 class="trend-card-title" style="margin-bottom:5px;"><a href="{href}">{title}</a></h3>
                    <p class="trend-card-desc" style="margin-bottom:0;">{desc}</p>
                </div>
"""
    
    close_div = '            </div>\r\n            <div class="footer-bottom">'
    close_div_lf = '            </div>\n            <div class="footer-bottom">'
    
    if close_div in content:
        content = content.replace(close_div, new_cards_html + close_div, 1)
    elif close_div_lf in content:
        content = content.replace(close_div_lf, new_cards_html + close_div_lf, 1)
    else:
        print("ERROR: 앵커를 찾을 수 없습니다. index.html 구조를 확인하세요.")
        return False
    return True


# ===== 여기에 추가할 가이드 카드 정보를 입력 =====
guides_to_add = [
    # (href, title, description)
    # 예시: ('guide_38.html', '제목', '설명')
]

if guides_to_add:
    if add_guide_cards(guides_to_add):
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"SUCCESS: {len(guides_to_add)}개 카드 삽입 완료")
    else:
        print("FAILED: 삽입 실패")
else:
    print("INFO: 추가할 가이드가 없습니다. guides_to_add 리스트를 채워주세요.")
