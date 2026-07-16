import os
import re
import glob
import json

base_dir = 'd:/adsense'
base_url = 'https://www.getbreakai.com'
naver_tag = '<meta name="naver-site-verification" content="64f5a18b1c0a9468e65d059e35d8fd75d64736aa" />'

html_files = glob.glob(os.path.join(base_dir, '*.html'))

def inject_seo(filepath):
    filename = os.path.basename(filepath)
    url = f"{base_url}/{filename}" if filename != "index.html" else f"{base_url}/"

    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # Extract Title and Description
    title_match = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE)
    desc_match = re.search(r'<meta\s+name="description"\s+content="(.*?)"\s*>', html, re.IGNORECASE)
    
    title = title_match.group(1) if title_match else "파인툴스 (FineTools) - 쉽고 빠른 실무 생활 계산기 & 금융 가이드 허브"
    desc = desc_match.group(1) if desc_match else "직장인과 프리랜서, 자영업자들을 위해 생활 연산 툴과 절세 칼럼을 제공합니다."

    # Remove previously injected SEO tags if they exist
    html = re.sub(r'<!-- SEO META TAGS START -->.*?<!-- SEO META TAGS END -->\s*', '', html, flags=re.DOTALL)
    
    # Also remove existing canonical and naver verification if they were placed outside the block
    html = re.sub(r'<meta name="naver-site-verification".*?>\s*', '', html, flags=re.IGNORECASE)
    html = re.sub(r'<link rel="canonical".*?>\s*', '', html, flags=re.IGNORECASE)

    # Determine schema type based on filename
    if "guide_" in filename or filename in ["subsidy.html", "refund.html"]:
        schema_type = "Article"
        schema_data = {
            "@context": "https://schema.org",
            "@type": schema_type,
            "headline": title,
            "description": desc,
            "url": url,
            "author": {
                "@type": "Organization",
                "name": "FineTools",
                "url": base_url
            },
            "publisher": {
                "@type": "Organization",
                "name": "FineTools",
                "logo": {
                    "@type": "ImageObject",
                    "url": f"{base_url}/images/logo.png"
                }
            },
            "datePublished": "2026-05-27",
            "dateModified": "2026-06-10"
        }
    else:
        schema_type = "WebSite"
        schema_data = {
            "@context": "https://schema.org",
            "@type": schema_type,
            "name": title,
            "description": desc,
            "url": url,
            "publisher": {
                "@type": "Organization",
                "name": "FineTools"
            }
        }

    schema_json = json.dumps(schema_data, ensure_ascii=False, indent=4)

    # Prepare new SEO block
    seo_block = f"""
    <!-- SEO META TAGS START -->
    {naver_tag}
    <link rel="canonical" href="{url}" />
    <meta property="og:title" content="{title}" />
    <meta property="og:description" content="{desc}" />
    <meta property="og:url" content="{url}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="파인툴스 (FineTools)" />
    <meta property="og:image" content="{base_url}/images/og-image.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{title}" />
    <meta name="twitter:description" content="{desc}" />
    <meta name="twitter:image" content="{base_url}/images/og-image.jpg" />
    <script type="application/ld+json">
{schema_json}
    </script>
    <!-- SEO META TAGS END -->
"""

    # Inject right before </head>
    head_end_idx = html.find('</head>')
    if head_end_idx != -1:
        new_html = html[:head_end_idx] + seo_block + html[head_end_idx:]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_html)
        print(f"Injected SEO tags into {filename}")
    else:
        print(f"Failed to find </head> in {filename}")

for f in html_files:
    inject_seo(f)

print("SEO tags injection complete.")
