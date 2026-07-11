import os
import glob

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            
        original = content
        
        replacements = [
            ('<span class=\"hero-gallery-btn-icon\"></span>', '<span class=\"hero-gallery-btn-icon\">&rarr;</span>'),
            ('<span class=\"hero-scroll-arrow\"></span>', '<span class=\"hero-scroll-arrow\">&darr;</span>'),
            ('Drag to Explore ', 'Drag to Explore &rarr;'),
            ('<span class=\"handle-arrow-left\"></span>', '<span class=\"handle-arrow-left\">&larr;</span>'),
            ('<span class=\"handle-arrow-right\"></span>', '<span class=\"handle-arrow-right\">&rarr;</span>'),
            ('<div class=\"btn-arrow\"></div>', '<div class=\"btn-arrow\">&rarr;</div>'),
            ('c 2026', '&copy; 2026'),
            (' Creative Studio', '&mdash; Creative Studio'),
            ('DESIGNER  DELHI', 'DESIGNER &mdash; DELHI'),
            (' India', '&mdash; India'),
            ('uploaded ', 'uploaded &check;'),
            ('converted ', 'converted &check;'),
            (' Size:', '&mdash; Size:'),
            (' Will download as', '&mdash; Will download as'),
            ('? Link converted', '&check; Link converted'),
            ('? Link saved', '&check; Link saved'),
            ('Site content published! ?', 'Site content published! &check;'),
            ('<span class=\"pb-drag-handle\">?</span>', '<span class=\"pb-drag-handle\">&#9776;</span>'),
            ('? Visible', '&#128065; Visible'),
            ('	 Hidden', '&#128064; Hidden'),
            ('06 - THE ARCHIVE', '06 &mdash; THE ARCHIVE'),
            ('01 - ABOUT ME', '01 &mdash; ABOUT ME'),
            ('02 - WHAT I DO', '02 &mdash; WHAT I DO'),
            ('03 - JOURNEY', '03 &mdash; JOURNEY'),
            ('04 - EDUCATION', '04 &mdash; EDUCATION'),
            ('05 - SELECTED WORK & EXPLORATIONS', '05 &mdash; SELECTED WORK'),
            ('06 - LIGHT & SOUND SHOWS', '06 &mdash; LIGHT & SOUND SHOWS')
        ]
        
        for old, new in replacements:
            content = content.replace(old, new)
            
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f\"Fixed {filepath}\")
    except Exception as e:
        print(f\"Error on {filepath}: {e}\")

for f in glob.glob('*.html') + glob.glob('js/*.js'):
    fix_file(f)
