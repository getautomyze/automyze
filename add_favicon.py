import os, glob

favicon_tag = '<link rel="icon" type="image/jpeg" href="/favicon.jpg">\n'
for filename in glob.glob('*.html'):
    if 'google' in filename: continue
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        if favicon_tag not in content:
            if '<head>' in content:
                new_content = content.replace('<head>', '<head>\n' + favicon_tag)
            elif '<HEAD>' in content:
                new_content = content.replace('<HEAD>', '<HEAD>\n' + favicon_tag)
            else:
                continue
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(new_content)
    except:
        pass
