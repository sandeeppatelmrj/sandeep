import json
import os
import re

log_path = r'C:\Users\Sandeep\.gemini\antigravity\brain\b38a9bb5-fa8a-4cc3-83cf-945420f5ec80\.system_generated\logs\transcript_full.jsonl'
css_path = r'e:\website-updated-fixed - last changes\css\style.css'

lines = []
with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        lines.append(json.loads(line))

for item in reversed(lines):
    if item.get('type') == 'TOOL_RESPONSE' and 'multi_replace_file_content' in str(item):
        content = item.get('content', '')
        if 'diff_block_start' in content:
            diff = content.split('[diff_block_start]')[1].split('[diff_block_end]')[0]
            
            # Reconstruct the original text
            original_text = []
            for line in diff.split('\n'):
                if line.startswith('-') or line.startswith(' '):
                    original_text.append(line[1:])
            
            # Reconstruct the new text
            new_text = []
            for line in diff.split('\n'):
                if line.startswith('+') or line.startswith(' '):
                    new_text.append(line[1:])
                    
            original_block = '\n'.join(original_text).strip()
            new_block = '\n'.join(new_text).strip()
            
            with open(css_path, 'r', encoding='utf-8') as f:
                css_content = f.read()
                
            css_content = css_content.replace(new_block, original_block)
            
            with open(css_path, 'w', encoding='utf-8') as f:
                f.write(css_content)
                
            print('Successfully restored style.css!')
            break
