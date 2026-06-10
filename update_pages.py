import os

def update_html(filepath, title, desc, meta_cat, main_title, content_html):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Replace title
    import re
    html = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', html)
    html = re.sub(r'<meta name="description" content=".*?">', f'<meta name="description" content="{desc}">', html)
    
    # Replace column-top-meta cat
    html = re.sub(r'<span class="cat">.*?</span>', f'<span class="cat">{meta_cat}</span>', html)
    
    # Replace column-title
    html = re.sub(r'<h1 class="column-title">.*?</h1>', f'<h1 class="column-title">{main_title}</h1>', html)
    
    # Replace column-content
    start_tag = '<div class="column-content">'
    end_tag = '</div>\n            </div>\n\n            <!-- 오른쪽: 사이드바 위젯 영역 -->'
    
    start_idx = html.find(start_tag)
    end_idx = html.find(end_tag)
    
    if start_idx != -1 and end_idx != -1:
        new_html = html[:start_idx + len(start_tag)] + '\n' + content_html + '\n' + html[end_idx:]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_html)
        print(f"Updated {filepath}")
    else:
        print(f"Could not find content bounds in {filepath}")

subsidy_content = """
                    <div class="summary-box">
                        <h3>🔥 정부 지원금 핵심 요약</h3>
                        <ul>
                            <li>청년, 소상공인, 저소득층을 위한 미수령 정부 지원금이 매년 수천억 원 발생합니다.</li>
                            <li>복지로, 보건복지부 홈페이지를 통해 '나에게 맞는 지원금'을 즉시 확인 가능합니다.</li>
                            <li>신청 기한이 지나면 소멸되므로 <strong>지금 바로 조회</strong>하는 것이 필수입니다.</li>
                        </ul>
                    </div>

                    <h2>1. 내가 받을 수 있는 숨은 정부 지원금이란?</h2>
                    <p>정부에서는 다양한 복지 정책과 취업, 창업, 주거 안정을 위한 지원금을 매년 발표합니다. 하지만 많은 사람들이 <strong>자신이 대상자인지 알지 못하거나, 신청 방법을 몰라서</strong> 놓치는 경우가 매우 많습니다. 특히 청년월세지원, 소상공인 정책자금, 국민취업지원제도 등은 신청 기간이 짧아 정부 보도자료를 수시로 확인하는 것이 중요합니다.</p>

                    <h2>2. 지원금 통합 조회: '보조금24' 및 '복지로' 활용법</h2>
                    <p>정부 지원금을 일일이 찾아다닐 필요 없이, <strong>정부24(보조금24)</strong>나 <strong>복지로</strong> 사이트에 접속하면 나의 소득, 연령, 가구 특성에 맞춘 맞춤형 지원금을 한 번에 조회할 수 있습니다. 공동인증서나 간편인증으로 로그인만 하면 자동으로 내가 받을 수 있는 혜택이 목록으로 뜹니다.</p>

                    <a href="https://www.bokjiro.go.kr" target="_blank" class="btn-cta">💰 복지로 맞춤형 급여안내(복지멤버십) 바로가기</a>

                    <h2>3. 주요 고단가 지원금 카테고리 (우선 확인 요망)</h2>
                    <ul>
                        <li><strong>청년 지원금:</strong> 청년월세 특별지원, 청년도약계좌, 청년내일채움공제 등 (고용노동부, 국토교통부 주관)</li>
                        <li><strong>소상공인 지원금:</strong> 소상공인 정책자금, 폐업 점포 철거비 지원, 대환대출 (중소벤처기업부 주관)</li>
                        <li><strong>서민 금융 지원:</strong> 햇살론, 미소금융, 소액생계비대출 (서민금융진흥원 주관)</li>
                    </ul>
                    <p>이러한 지원금은 예산이 소진되면 조기 마감될 수 있으므로, 해당 부처 홈페이지 공지사항을 정기적으로 모니터링하는 것이 가장 확실한 재테크입니다.</p>

                    <a href="https://www.gov.kr/portal/rcvfvrSvc/main" target="_blank" class="btn-cta">🔍 정부24(보조금24) 통합 조회 바로가기</a>
"""

refund_content = """
                    <div class="summary-box">
                        <h3>🔥 세금 및 건보료 환급 핵심 요약</h3>
                        <ul>
                            <li>나도 모르게 더 낸 세금, 건강보험료 환급금이 국세청과 공단에 잠자고 있습니다.</li>
                            <li>건강보험공단 홈페이지와 홈택스에서 단 1분 만에 일괄 조회가 가능합니다.</li>
                            <li><strong>소멸시효(5년)가 지나기 전</strong>에 반드시 본인 계좌로 환급 신청하세요.</li>
                        </ul>
                    </div>

                    <h2>1. 잠자는 내 돈, 미환급금이란?</h2>
                    <p>미환급금은 세금이나 건강보험료 등을 납부할 때 이중 납부, 착오 납부, 혹은 연말정산이나 종합소득세 신고 시 법정 신고 기한을 놓쳐 발생한 초과 납부액을 말합니다. 매년 국민들이 찾아가지 않은 환급금이 수백억 원에 달합니다.</p>

                    <h2>2. 건강보험료 및 국민연금 환급금 조회 방법</h2>
                    <p>국민건강보험공단이나 국민연금공단 홈페이지에 접속하면 미환급금 내역을 쉽게 확인할 수 있습니다. 보험료 정산 과정에서 발생한 본인부담상한액 초과금이나 과오납금이 주로 대상이 됩니다.</p>

                    <a href="https://www.nhis.or.kr" target="_blank" class="btn-cta">🏥 건강보험공단 미환급금 조회 바로가기</a>

                    <h2>3. 국세 미환급금 및 종합소득세 경정청구 (홈택스)</h2>
                    <p>국세청 홈택스(손택스)의 <strong>'국세 미환급금 찾기'</strong> 메뉴를 이용하면 연말정산 누락분이나 종합소득세 기한 후 신고에 따른 환급액을 조회할 수 있습니다. 5년 이내의 세금은 '경정청구'를 통해 돌려받을 수 있습니다.</p>

                    <a href="https://www.hometax.go.kr" target="_blank" class="btn-cta">💸 국세청 홈택스 환급금 조회 바로가기</a>
"""

update_html('d:/adsense/subsidy.html', 
            '숨은 정부 지원금 조회 및 신청 가이드 - 파인툴스',
            '보조금24, 복지로를 통한 숨은 정부 지원금(청년월세지원, 소상공인 정책자금 등) 1분 통합 조회 및 신청 방법 완벽 가이드.',
            'GOV SUBSIDY GUIDE',
            '나도 모르게 놓치고 있는 숨은 정부 지원금 1분 조회 가이드',
            subsidy_content)

update_html('d:/adsense/refund.html', 
            '건강보험/국세 미환급금 조회 및 신청 가이드 - 파인툴스',
            '국세청 홈택스 및 국민건강보험공단에 잠자고 있는 종합소득세, 연말정산 미환급금을 단 1분 만에 조회하고 환급받는 비법 가이드.',
            'TAX REFUND GUIDE',
            '잠자는 내 돈 찾기: 건강보험료 및 세금 미환급금 조회 완벽 가이드',
            refund_content)
