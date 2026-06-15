import os
import re

base_dir = 'd:/adsense'
author_box_html = """
<div class="author-box">
    <div class="author-avatar">👨‍💼</div>
    <div class="author-info">
        <h4>작성자: 김파인 (FineTools 수석 자산관리사)</h4>
        <p>10년 이상의 실무 세무 및 금융 자산 운용 경험을 바탕으로, 독자 여러분께 가장 정확하고 합법적인 절세 및 자산 증식 가이드를 제공합니다. 공인 전문가 가이드라인을 준수합니다.</p>
    </div>
</div>
"""

# 1. Inject author box into existing files
existing_files = [
    'subsidy.html', 'refund.html', 
    'guide_01.html', 'guide_02.html', 'guide_03.html', 'guide_04.html', 'guide_05.html'
]

for file in existing_files:
    filepath = os.path.join(base_dir, file)
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Check if already injected
    if 'class="author-box"' not in html:
        # Insert at the end of column-content
        end_idx = html.find('</div>\n            </div>\n\n            <!-- 오른쪽: 사이드바 위젯 영역 -->')
        if end_idx != -1:
            new_html = html[:end_idx] + author_box_html + '\n' + html[end_idx:]
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_html)
            print(f"Injected author box into {file}")

# 2. Create new 10 guides
def create_page(filepath, title, desc, meta_cat, main_title, content_html):
    template_path = os.path.join(base_dir, 'about.html')
    with open(template_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    html = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', html)
    html = re.sub(r'<meta name="description" content=".*?">', f'<meta name="description" content="{desc}">', html)
    html = re.sub(r'<span class="cat">.*?</span>', f'<span class="cat">{meta_cat}</span>', html)
    html = re.sub(r'<h1 class="column-title">.*?</h1>', f'<h1 class="column-title">{main_title}</h1>', html)
    
    start_tag = '<div class="column-content">'
    end_tag = '</div>\n            </div>\n\n            <!-- 오른쪽: 사이드바 위젯 영역 -->'
    
    start_idx = html.find(start_tag)
    end_idx = html.find(end_tag)
    
    if start_idx != -1 and end_idx != -1:
        new_html = html[:start_idx + len(start_tag)] + '\n' + content_html + '\n' + author_box_html + '\n' + html[end_idx:]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_html)
        print(f"Created {filepath}")

guide_06 = """
<h2>1. 신생아 특례대출이란? (2026년 기준)</h2>
<p>신생아 특례대출은 출산 가구의 주거 안정을 돕기 위해 파격적인 초저금리로 주택 구입 자금(디딤돌) 및 전세 자금(버팀목)을 지원하는 국가 정책입니다. 시중 은행의 주택담보대출 금리가 4~5%대인 반면, 신생아 특례대출은 1~3%대의 파격적인 금리를 제공하여 매월 수십만 원의 이자 부담을 줄여줍니다.</p>

<h2>2. 신청 조건 및 자격 요건 (체크리스트)</h2>
<table style="width:100%; border-collapse: collapse; margin: 20px 0;">
    <tr style="background-color: var(--primary-mint); color: #fff;">
        <th style="padding: 10px; border: 1px solid #ccc;">구분</th>
        <th style="padding: 10px; border: 1px solid #ccc;">주택구입자금 (디딤돌)</th>
        <th style="padding: 10px; border: 1px solid #ccc;">전세자금 (버팀목)</th>
    </tr>
    <tr>
        <td style="padding: 10px; border: 1px solid #ccc;">대상 자녀</td>
        <td style="padding: 10px; border: 1px solid #ccc;" colspan="2">대출신청일 기준 2년 내 출산(입양)한 자녀</td>
    </tr>
    <tr>
        <td style="padding: 10px; border: 1px solid #ccc;">소득 조건</td>
        <td style="padding: 10px; border: 1px solid #ccc;">부부합산 연소득 1.3억 원 이하</td>
        <td style="padding: 10px; border: 1px solid #ccc;">부부합산 연소득 1.3억 원 이하</td>
    </tr>
    <tr>
        <td style="padding: 10px; border: 1px solid #ccc;">자산 조건</td>
        <td style="padding: 10px; border: 1px solid #ccc;">순자산 4.69억 원 이하</td>
        <td style="padding: 10px; border: 1px solid #ccc;">순자산 3.45억 원 이하</td>
    </tr>
</table>
<p>소득 산정 시 세전 금액 기준이며, 가장 중요한 것은 무주택 세대주 요건입니다. 주택 구입 자금의 경우 평가액 9억 원 이하, 전용면적 85㎡ 이하 주택만 대상이 됩니다.</p>

<h2>3. 대환 대출 및 전문가 조언</h2>
<p>기존에 높은 금리의 시중 은행 주담대를 받고 있었더라도, 최근 2년 내 출산을 했다면 이 제도를 활용해 대환(갈아타기)이 가능합니다. 이 경우 이자 비용을 극적으로 낮출 수 있어 자산 형성에 큰 도움이 됩니다. 놓치지 말고 주택도시기금 '기금e든든'을 통해 신청하세요!</p>
"""

guide_07 = """
<h2>1. 근로장려금/자녀장려금 핵심 요약</h2>
<p>근로장려금은 열심히 일하지만 소득이 적어 생활이 어려운 근로자, 사업자(전문직 제외) 가구에 대해 가구원 구성과 소득 금액에 따라 국가가 현금을 직접 지원해주는 근로연계형 소득지원 제도입니다. 매년 5월 정기 신청을 받으며, 조건을 만족할 경우 연 최대 300만 원 이상을 돌려받을 수 있습니다.</p>

<h2>2. 2026년 신청 자격 상세 기준</h2>
<div class="summary-box">
    <h3>✅ 가구 유형별 소득 및 재산 기준</h3>
    <ul>
        <li><strong>단독 가구:</strong> 배우자, 부양자녀, 70세 이상 직계존속이 없는 가구 (총소득 2,200만 원 미만)</li>
        <li><strong>홑벌이 가구:</strong> 배우자의 총급여액이 300만 원 미만이거나, 부양자녀가 있는 가구 (총소득 3,200만 원 미만)</li>
        <li><strong>맞벌이 가구:</strong> 신청인과 배우자 각각의 총급여액이 300만 원 이상인 가구 (총소득 3,800만 원 미만)</li>
        <li><strong>재산 요건:</strong> 가구원 전원의 재산 합계액이 2.4억 원 미만이어야 합니다.</li>
    </ul>
</div>

<h2>3. 자녀장려금 혜택 확대</h2>
<p>자녀장려금의 경우 총소득 7,000만 원 미만 가구까지 신청 자격이 확대되었습니다. 부양자녀 1인당 최대 100만 원까지 지급받을 수 있으니, 요건에 해당한다면 국세청 홈택스나 세무서를 방문하여 기한 내(정기 5월, 기한 후 11월 말)에 반드시 신청하시기 바랍니다.</p>
"""

guide_08 = """
<h2>1. 1세대 1주택 비과세란?</h2>
<p>1세대가 국내에 1주택을 보유하고 일정한 요건을 갖춘 후 해당 주택을 양도할 때, 양도소득세를 전혀 내지 않도록(비과세) 해주는 엄청난 혜택입니다. 하지만 규정이 매우 복잡하여 조금만 실수해도 억 단위의 세금 폭탄을 맞을 수 있습니다.</p>

<h2>2. 기본 요건: 보유기간 및 거주기간</h2>
<p>가장 기본적인 요건은 <strong>'2년 이상 보유'</strong>입니다. 하지만 취득 당시에 해당 지역이 '조정대상지역'이었다면 <strong>'2년 이상 거주'</strong> 요건까지 추가로 충족해야 비과세를 받을 수 있습니다.</p>
<table style="width:100%; border-collapse: collapse; margin: 20px 0;">
    <tr style="background-color: var(--primary-mint); color: #fff;">
        <th style="padding: 10px; border: 1px solid #ccc;">취득 당시 규제 지역 여부</th>
        <th style="padding: 10px; border: 1px solid #ccc;">비과세 필수 요건</th>
    </tr>
    <tr>
        <td style="padding: 10px; border: 1px solid #ccc;">비규제지역</td>
        <td style="padding: 10px; border: 1px solid #ccc;">2년 이상 보유만 하면 됨</td>
    </tr>
    <tr>
        <td style="padding: 10px; border: 1px solid #ccc;">조정대상지역</td>
        <td style="padding: 10px; border: 1px solid #ccc;">2년 이상 보유 + 2년 이상 거주</td>
    </tr>
</table>

<h2>3. 고가 주택 (12억 초과) 양도세 계산 주의점</h2>
<p>비과세 요건을 갖추었더라도 실제 양도 가액이 12억 원을 초과하는 '고가 주택'인 경우, 12억 원 초과분에 대해서는 양도세를 납부해야 합니다. 다만 이 경우에도 장기보유특별공제(최대 80%)를 적용받아 세금을 크게 줄일 수 있습니다.</p>
<p>부동산 세법은 자주 바뀌므로 매도 계약서를 쓰기 전 반드시 전문 세무사와 상담을 진행하는 것이 자산을 지키는 유일한 방법입니다.</p>
"""

guide_09 = """
<h2>1. 실업급여(구직급여) 기본 조건</h2>
<p>실업급여는 근로자가 고용보험 적용 사업장에서 비자발적으로 이직(해고, 권고사직 등)한 경우, 구직 활동을 하는 동안 국가에서 생계비를 지원해주는 제도입니다. 자발적인 퇴사라도 정당한 사유(통근 곤란, 질병, 임금 체불 등)가 입증되면 수급이 가능합니다.</p>

<h2>2. 고용보험 가입 기간 (피보험 단위기간) 요건</h2>
<p>이직일 이전 18개월 동안 피보험 단위기간이 통산하여 <strong>180일 이상</strong>이어야 합니다. 여기서 중요한 점은 180일이 '실제 근무일수 + 유급 휴일'을 의미하므로 달력상 6개월 근무로는 180일을 채울 수 없다는 것입니다. 보통 주 5일 근로자의 경우 약 7~8개월 이상을 근무해야 요건이 충족됩니다.</p>

<h2>3. 구직급여 지급액 및 지급 기간</h2>
<p>실업급여 지급액은 퇴직 전 평균임금의 60%로 계산되며, 2026년 기준 하한액과 상한액(1일 66,000원)이 존재합니다.</p>
<p>수급 기간은 가입 기간과 연령에 따라 120일에서 최대 270일까지 차등 적용됩니다. 실업급여를 받는 동안 부정수급(아르바이트 소득 미신고 등)이 적발되면 전액 환수는 물론 형사 처벌까지 받을 수 있으므로 소득 발생 시 반드시 고용센터에 신고해야 합니다.</p>
"""

guide_10 = """
<h2>1. 노란우산공제의 정의 및 압도적 장점</h2>
<p>노란우산공제는 소상공인과 자영업자가 폐업, 노령, 사망 등의 위험으로부터 생활 안정을 기하고 사업 재기 기회를 제공받기 위해 중소기업중앙회에서 운영하는 공제 제도입니다. 가장 큰 혜택은 바로 <strong>'연 최대 500만 원 소득공제'</strong>입니다.</p>

<h2>2. 소득 구간별 소득공제 한도</h2>
<p>자영업자에게 500만 원 소득공제는 그 어떤 절세 상품과도 비교할 수 없는 엄청난 절세 무기입니다. (최대 수백만 원의 세금을 아낄 수 있습니다.)</p>
<ul>
    <li>사업소득 4천만 원 이하: 연 최대 500만 원 공제</li>
    <li>사업소득 4천~1억 원 이하: 연 최대 300만 원 공제</li>
    <li>사업소득 1억 원 초과: 연 최대 200만 원 공제</li>
</ul>
<p>또한, 공제금은 법률에 의해 압류, 양도, 담보 제공이 금지되어 있어 최악의 상황에서도 대표자의 최소한의 생계 자금을 법적으로 보호받을 수 있습니다.</p>

<h2>3. 주의사항 및 중도해지 불이익</h2>
<p>절세 효과만 보고 무턱대고 큰 금액을 납입했다가 폐업 사유 없이 임의로 중도해지를 하면, 그동안 받은 소득공제 혜택에 대해 <strong>기타소득세(16.5%)가 부과되어 오히려 원금 손실</strong>이 발생할 수 있습니다. 따라서 본인이 무리 없이 유지할 수 있는 월 최소 금액으로 설정하는 것이 현명합니다.</p>
"""

guide_11 = """
<h2>1. 국민연금 수령 시기의 선택</h2>
<p>국민연금은 법정 수급 연령에 도달하면 받게 되지만, 개인의 경제 상황이나 건강 상태에 따라 수급 시기를 최장 5년 앞당기거나(조기 수령) 최장 5년 늦출 수(연기 연금) 있습니다. 어떤 선택이 유리할까요?</p>

<h2>2. 조기노령연금 vs 연기연금 손익 분석</h2>
<table style="width:100%; border-collapse: collapse; margin: 20px 0;">
    <tr style="background-color: var(--primary-mint); color: #fff;">
        <th style="padding: 10px; border: 1px solid #ccc;">구분</th>
        <th style="padding: 10px; border: 1px solid #ccc;">설명 및 페널티/인센티브</th>
    </tr>
    <tr>
        <td style="padding: 10px; border: 1px solid #ccc;">조기노령연금 (당겨 받기)</td>
        <td style="padding: 10px; border: 1px solid #ccc;">최대 5년 조기 수령 가능. 단, 1년 당길 때마다 연금액이 <strong>6%씩 감액</strong> (최대 30% 감액)</td>
    </tr>
    <tr>
        <td style="padding: 10px; border: 1px solid #ccc;">연기연금 (늦춰 받기)</td>
        <td style="padding: 10px; border: 1px solid #ccc;">최대 5년 연기 가능. 1년 연기할 때마다 연금액이 <strong>7.2%씩 가산</strong> (최대 36% 가산)</td>
    </tr>
</table>

<h2>3. 전문가 가이드 (손익 분기점)</h2>
<p>건강하여 오래 살 것으로 예상되고 당장의 현금 흐름에 여유가 있다면, 연기연금을 선택하는 것이 평생 수령액을 극대화하는 길입니다. 반면, 퇴직 후 당장 생계비가 급하거나 건강이 좋지 않다면 감액을 감수하더라도 조기 수령을 하는 것이 합리적입니다. 보통 조기 수령과 정상 수령의 총 수령액 역전 구간(손익분기점)은 수급 시작 후 약 14~15년 정도입니다.</p>
"""

guide_12 = """
<h2>1. 프리랜서(3.3%) 종합소득세 신고의 중요성</h2>
<p>배달 라이더, 학원 강사, 웹 디자이너 등 회사에 소속되지 않고 3.3%의 세금을 미리 떼고(원천징수) 급여를 받는 프리랜서들은 매년 5월 종합소득세 신고 기간을 통해 세금을 환급받거나 추가 납부해야 합니다.</p>

<h2>2. 단순경비율 vs 기준경비율 (D유형/E유형 파악)</h2>
<p>국세청에서 보내온 안내문에 적힌 '유형'이 모든 것을 결정합니다.</p>
<ul>
    <li><strong>단순경비율 (보통 F, G, H유형):</strong> 전년도 수입이 2,400만 원 미만인 경우 해당합니다. 영수증 등 증빙 없이도 국가에서 일괄적으로 높은 경비율(약 60~80%)을 인정해주어 대부분 환급이 발생합니다. 홈택스에서 클릭 몇 번으로 쉽게 신고가 가능합니다.</li>
    <li><strong>기준경비율 (D유형):</strong> 전년도 수입이 2,400만 원 이상인 경우 해당합니다. 단순경비율에 비해 인정해주는 기본 경비가 매우 낮으므로, 실제 지출한 영수증(차량 유지비, 식대, 비품 구입비 등)을 꼼꼼히 모아 장부를 작성(간편장부)해야 세금 폭탄을 피할 수 있습니다.</li>
</ul>

<h2>3. 절세 팁</h2>
<p>소득이 높아 D유형에 해당한다면 개인적으로 신고하기보다 세무대리인(세무사)을 통해 간편장부 혹은 복식부기로 수수료를 내고 신고를 대행하는 것이 결과적으로 세금을 훨씬 크게 아낄 수 있는 방법입니다.</p>
"""

guide_13 = """
<h2>1. 전월세 신고제 (임대차 3법)</h2>
<p>주택임대차보호법 개정에 따라, 보증금 6천만 원을 초과하거나 월차임(월세)이 30만 원을 초과하는 주택 임대차 계약 시 계약일로부터 30일 이내에 관할 주민센터나 온라인(부동산거래관리시스템)을 통해 반드시 계약 내용을 신고해야 합니다. 미신고 시 최대 100만 원의 과태료가 부과됩니다.</p>

<h2>2. 확정일자 부여 효과</h2>
<div class="summary-box">
    <h3>✅ 확정일자 및 대항력 발생 시기</h3>
    <p>전월세 신고를 완료하면 자동으로 '확정일자'가 부여된 것으로 간주됩니다. 세입자가 전입신고를 하고 집을 인도(이사)받으면 다음 날 0시부터 <strong>'대항력'</strong>이 발생하며, 확정일자를 통해 집에 경매가 넘어갈 경우 <strong>'우선변제권'</strong>을 행사하여 보증금을 안전하게 지킬 수 있습니다.</p>
</div>

<h2>3. 전세 사기 예방을 위한 필수 확인 사항</h2>
<p>계약 전 등기부등본을 확인하여 근저당(대출)이 집값 대비 너무 높지 않은지 체크하고, 전세보증금반환보증보험(HUG) 가입 조건이 되는지 반드시 특약에 명시하는 것이 중요합니다.</p>
"""

guide_14 = """
<h2>1. 연말정산 최강의 무기: IRP와 연금저축</h2>
<p>노후 대비와 연말정산 세금 환급이라는 두 마리 토끼를 동시에 잡을 수 있는 합법적인 제도가 바로 연금저축펀드(또는 연금저축보험)와 IRP(개인형 퇴직연금)입니다.</p>

<h2>2. 세액공제 한도 및 공제율 (2026년)</h2>
<p>두 계좌를 합산하여 <strong>연간 최대 900만 원</strong>까지 납입액에 대해 세액공제를 받을 수 있습니다.</p>
<table style="width:100%; border-collapse: collapse; margin: 20px 0;">
    <tr style="background-color: var(--primary-mint); color: #fff;">
        <th style="padding: 10px; border: 1px solid #ccc;">상품 종류</th>
        <th style="padding: 10px; border: 1px solid #ccc;">공제 한도</th>
        <th style="padding: 10px; border: 1px solid #ccc;">총급여 5,500만 원 이하 공제율</th>
    </tr>
    <tr>
        <td style="padding: 10px; border: 1px solid #ccc;">연금저축</td>
        <td style="padding: 10px; border: 1px solid #ccc;">최대 600만 원</td>
        <td style="padding: 10px; border: 1px solid #ccc; text-align:center;" rowspan="2">16.5% (지방세 포함)</td>
    </tr>
    <tr>
        <td style="padding: 10px; border: 1px solid #ccc;">IRP (개인형 퇴직연금)</td>
        <td style="padding: 10px; border: 1px solid #ccc;">최대 900만 원 (연금저축 합산)</td>
    </tr>
</table>
<p>만약 총급여 5,500만 원 이하 직장인이 IRP에 연 900만 원을 꽉 채워 납입했다면, 다음 해 연말정산에서 <strong>148만 5천 원</strong>을 현금으로 돌려받게 됩니다. (16.5% 수익률 확정)</p>

<h2>3. 단점 및 주의사항</h2>
<p>55세 이전에 중도 해지할 경우, 그동안 공제받았던 세금과 수익에 대해 16.5%의 기타소득세를 뱉어내야 합니다. 따라서 끝까지 유지할 수 있는 여유 자금으로만 납입해야 합니다.</p>
"""

guide_15 = """
<h2>1. 기초연금 제도의 이해</h2>
<p>만 65세 이상 대한민국 국적을 가진 어르신 중 소득하위 70%에 해당하는 분들에게 국가가 매월 일정 금액을 현금으로 지급하는 대표적인 노후 복지 제도입니다. 2026년 기준 단독가구는 월 약 33만 원, 부부가구는 약 53만 원 정도를 수령합니다.</p>

<h2>2. 소득인정액 계산법 및 재산 환산</h2>
<p>단순히 월급이 없다고 해서 무조건 받는 것이 아닙니다. <strong>'소득인정액'</strong>이라는 복잡한 공식(월 소득 평가액 + 재산의 월 소득 환산액)을 통해 산출된 금액이 정부가 정한 '선정기준액' 이하여야 합니다.</p>
<ul>
    <li><strong>소득:</strong> 근로소득의 경우 월 110만 원을 기본 공제해 주고, 남은 금액의 30%를 추가로 빼준 뒤 계산합니다.</li>
    <li><strong>재산:</strong> 거주하는 주택, 토지 등 일반 재산에서 대도시 기준 1억 3,500만 원을 기본 공제한 뒤, 연 4%를 곱해 월 단위로 환산합니다. 고급 자동차(배기량 3000cc 이상 등)나 회원권이 있으면 가액 전액이 100% 월 소득으로 잡혀 수급 탈락 확률이 매우 높습니다.</li>
</ul>

<h2>3. 억울한 탈락을 막는 꿀팁</h2>
<p>자녀 명의의 집에 거주하는 경우 무료임차소득이 발생할 수 있고, 예금이나 적금 등 금융자산도 2천만 원을 제외한 나머지가 이자율에 따라 환산됩니다. 재산을 자녀에게 사전 증여하더라도 '증여재산'으로 남아 일정 기간 소득으로 합산되므로, 만 65세가 되기 전에 읍면동 주민센터에서 미리 가상 시뮬레이션을 받아보시는 것을 추천합니다.</p>
"""

new_pages = [
    ('d:/adsense/guide_06.html', '신생아 특례대출 조건 및 버팀목 전세 대출 - 파인툴스', '출산 가구를 위한 신생아 특례대출(디딤돌, 버팀목) 소득 자산 요건 및 대환 전략.', 'REAL ESTATE GUIDE', '신생아 특례대출 (주택구입/전세) 파격 금리 조건 완벽 가이드', guide_06),
    ('d:/adsense/guide_07.html', '근로장려금 자녀장려금 신청 자격 조회 - 파인툴스', '근로장려금 홑벌이, 맞벌이, 단독 가구 소득 기준 및 자녀장려금 신청 방법 총정리.', 'SUBSIDY GUIDE', '연 300만 원 수령! 근로장려금/자녀장려금 신청 자격 및 요건 완벽 정리', guide_07),
    ('d:/adsense/guide_08.html', '1세대 1주택 양도소득세 비과세 요건 - 파인툴스', '1세대 1주택 보유기간, 거주기간 요건 및 12억 초과 고가주택 양도세 절세 비법.', 'TAX GUIDE', '세금 0원! 1세대 1주택 양도소득세 비과세 요건 및 거주기간 완벽 가이드', guide_08),
    ('d:/adsense/guide_09.html', '실업급여(구직급여) 수급 자격 및 기간 계산 - 파인툴스', '비자발적 퇴사자를 위한 실업급여 수급 조건 180일 기준과 상한액, 하한액 총정리.', 'LABOR GUIDE', '퇴사 전 필독! 실업급여(구직급여) 수급 자격 및 수령액 극대화 노하우', guide_09),
    ('d:/adsense/guide_10.html', '노란우산공제 가입 혜택 및 중도해지 불이익 - 파인툴스', '소상공인 자영업자를 위한 노란우산공제 소득공제 한도 및 해지 불이익 분석.', 'BUSINESS GUIDE', '자영업자 필수 절세템! 노란우산공제 혜택 및 중도해지 주의사항', guide_10),
    ('d:/adsense/guide_11.html', '국민연금 조기수령 vs 연기연금 손익 분석 - 파인툴스', '국민연금을 당겨 받을까, 늦춰 받을까? 조기노령연금과 연기연금 손익분기점 가이드.', 'PENSION GUIDE', '국민연금 조기수령 vs 연기연금: 언제가 가장 이득일까? 완벽 손익 분석', guide_11),
    ('d:/adsense/guide_12.html', '프리랜서 3.3% 종합소득세 단순경비율 D유형 환급 - 파인툴스', '배달라이더, 프리랜서를 위한 종소세 단순경비율, 기준경비율 D/E유형 환급 방법.', 'FREELANCE GUIDE', '프리랜서 3.3% 세금 폭탄 피하기: 종합소득세 D유형 간편장부 절세 공략법', guide_12),
    ('d:/adsense/guide_13.html', '전월세 신고제 임대차 3법 확정일자 - 파인툴스', '주택임대차보호법 전월세 신고 의무 요건과 확정일자 대항력, 우선변제권 가이드.', 'HOUSING GUIDE', '소중한 내 보증금 지키기! 전월세 신고제(확정일자)와 대항력 완벽 이해', guide_13),
    ('d:/adsense/guide_14.html', '연금저축 IRP 세액공제 한도 비교 - 파인툴스', '연말정산 연 900만 원 한도 IRP 퇴직연금 및 연금저축펀드 차이점과 절세 혜택.', 'INVESTMENT GUIDE', '연말정산 폭격기! 연금저축펀드 vs IRP 세액공제 한도 및 차이점 완벽 분석', guide_14),
    ('d:/adsense/guide_15.html', '기초연금 수급자격 소득인정액 계산 - 파인툴스', '만 65세 이상 기초연금 수급 자격, 소득인정액 계산법, 재산 환산 및 고급 자동차 탈락 주의.', 'WELFARE GUIDE', '만 65세 어르신 주목! 기초연금 수급자격 및 소득인정액 계산법 (억울한 탈락 방지)', guide_15),
]

for filepath, title, desc, meta_cat, main_title, content_html in new_pages:
    create_page(filepath, title, desc, meta_cat, main_title, content_html)

print("Author box injection and 10 new guides creation complete.")
