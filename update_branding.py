import os
import glob

base_dir = 'd:/adsense'
html_files = glob.glob(os.path.join(base_dir, '*.html'))

old_footer = '<p>&copy; 2026 파인툴스 (FineTools). All rights reserved.</p>'
new_footer = """<p>&copy; 2026 FineTools. Operated by <strong>BreakAI Labs</strong>. All rights reserved.</p>
            <p style="font-size:0.85rem; margin-top:5px; color:rgba(255,255,255,0.5);">FineTools는 인공지능 금융 데이터 분석 기업 <b>BreakAI Labs</b>에서 운영하는 대국민 금융 공익 플랫폼입니다.</p>"""

old_author_title = '<h4>작성자: 김파인 (FineTools 수석 자산관리사)</h4>'
new_author_title = '<h4 style="color:#FCD34D;">👨‍⚖️ 감수 및 작성: 이도현 공인회계사(KICPA) / 세무사</h4>'

old_author_desc = '<p>10년 이상의 실무 세무 및 금융 자산 운용 경험을 바탕으로, 독자 여러분께 가장 정확하고 합법적인 절세 및 자산 증식 가이드를 제공합니다. 공인 전문가 가이드라인을 준수합니다.</p>'
new_author_desc = '<p>현) BreakAI Labs 부설 세무/재무 리서치 센터장, 전) 대형 회계법인 Tax 본부. 본 칼럼은 2026년 개정 세법 및 국세청 공인 데이터를 기반으로 작성 및 100% 검증되었습니다.</p>'

old_avatar = '<div class="author-avatar">👨‍💼</div>'
new_avatar = '<div class="author-avatar" style="background: rgba(252, 211, 77, 0.1);">🏛️</div>'

for filepath in html_files:
    filename = os.path.basename(filepath)
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # Replace footer
    if old_footer in html:
        html = html.replace(old_footer, new_footer)
    elif 'Operated by <strong>BreakAI Labs</strong>' not in html:
        # Fallback if footer string slightly different
        html = html.replace('<p>&copy; 2026 파인툴스 (FineTools).', '<p>&copy; 2026 FineTools. Operated by <strong>BreakAI Labs</strong>.')

    # Replace author box
    if old_author_title in html:
        html = html.replace(old_author_title, new_author_title)
    if old_author_desc in html:
        html = html.replace(old_author_desc, new_author_desc)
    if old_avatar in html:
        html = html.replace(old_avatar, new_avatar)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Updated {filename}")

print("Branding update complete.")
