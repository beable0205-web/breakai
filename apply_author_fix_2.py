import os
import re

base_dir = 'd:/adsense'

author_content = """
    <!-- 작성자 프로필 컨테이너 -->
    <section class="container" style="padding-top: 40px; padding-bottom: 80px; max-width: 800px;">
        <h1 class="page-title" style="margin-bottom: 40px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px;">
            파인툴스 전문가 소개 <span>.</span>
        </h1>
        
        <div style="background: var(--glass-bg); padding: 40px; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.1); box-shadow: var(--shadow-sm); display:flex; flex-direction:column; gap:20px;">
            <div style="display:flex; align-items:center; gap:20px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom:20px;">
                <div style="font-size: 5rem; background: rgba(252, 211, 77, 0.1); padding: 20px; border-radius: 50%;">🏛️</div>
                <div>
                    <h2 style="color: var(--primary-mint); font-size: 1.8rem; margin:0 0 10px 0;">이도현 (Lee Do-hyun)</h2>
                    <h3 style="color: #FCD34D; font-size: 1.2rem; margin:0;">공인회계사(KICPA) / 세무사</h3>
                </div>
            </div>
            
            <div>
                <h4 style="color: #fff; margin-bottom: 10px; font-size: 1.1rem;">📝 약력 및 경력</h4>
                <ul style="color: var(--glass-text); line-height: 1.8; padding-left: 20px;">
                    <li><strong>현)</strong> 인공지능 금융 데이터 분석 기업 <strong>BreakAI Labs</strong> 부설 세무/재무 리서치 센터장</li>
                    <li><strong>전)</strong> 국내 대형 회계법인 (Big 4) Tax 본부 시니어 매니저</li>
                    <li><strong>전)</strong> 국세청 연말정산 및 종합소득세 실무 자문위원</li>
                    <li>한국공인회계사회(KICPA) 및 한국세무사회 정회원</li>
                </ul>
            </div>
            
            <div>
                <h4 style="color: #fff; margin-bottom: 10px; font-size: 1.1rem; margin-top:20px;">💡 전문 분야</h4>
                <p style="color: var(--glass-text); line-height: 1.8;">
                    양도소득세, 종합소득세, 상속/증여세 등 부동산 및 개인/법인 절세 컨설팅의 권위자입니다. 파인툴스의 모든 계산기 로직과 지식 가이드 문서(세법, 정책자금, 연금 등)는 이도현 회계사의 철저한 감수 및 2026년 최신 국세청 공인 데이터를 기반으로 100% 검증 후 배포됩니다.
                </p>
            </div>
            
            <div style="margin-top: 20px; background: rgba(16, 185, 129, 0.05); padding: 20px; border-radius: 8px; border-left: 4px solid var(--primary-mint);">
                <p style="margin:0; color: #fff; font-size: 0.95rem;">
                    "복잡하고 어려운 세법과 금융 계산을 AI 기술과 접목하여 누구나 쉽고 정확하게 이용할 수 있도록 돕는 것이 파인툴스의 목표입니다. 여러분의 소중한 자산을 지켜드리겠습니다."
                </p>
            </div>
        </div>
    </section>
"""

about_path = os.path.join(base_dir, 'about.html')
with open(about_path, 'r', encoding='utf-8') as f:
    about_html = f.read()

author_html = re.sub(r'<title>.*?</title>', '<title>전문가 소개 (이도현 공인회계사) - 파인툴스</title>', about_html)
author_html = re.sub(r'<meta name="description" content=".*?">', '<meta name="description" content="파인툴스의 모든 금융/세무 계산기와 칼럼을 감수하는 이도현 공인회계사(KICPA) 및 세무사를 소개합니다.">', author_html)

start_idx = author_html.find('<!-- 상단 네비게이션 헤더 -->')
if start_idx == -1:
    start_idx = author_html.find('<!-- 상단 네비게이션 헤더 (글래스모피즘) -->')
end_idx = author_html.find('<!-- 하단 푸터 영역 -->')

if start_idx != -1 and end_idx != -1:
    header_part = author_html[:start_idx]
    header_end_idx = author_html.find('</header>') + 9
    header_str = author_html[start_idx:header_end_idx]
    final_author_html = header_part + header_str + '\n' + author_content + '\n' + author_html[end_idx:]
    
    author_filepath = os.path.join(base_dir, 'author.html')
    with open(author_filepath, 'w', encoding='utf-8') as f:
        f.write(final_author_html)
    print("Created author.html")
else:
    print("Failed to find header or footer")
