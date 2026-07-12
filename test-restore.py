import json

log_path = r'C:\Users\Sandeep\.gemini\antigravity\brain\b38a9bb5-fa8a-4cc3-83cf-945420f5ec80\.system_generated\logs\transcript_full.jsonl'

lines = []
with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        lines.append(json.loads(line))

for item in reversed(lines):
    if item.get('type') == 'TOOL_RESPONSE' and 'replace_file_content' in str(item) and 'style.css' in str(item):
        content = item.get('content', '')
        if 'diff_block_start' in content:
            diff = content.split('[diff_block_start]')[1].split('[diff_block_end]')[0]
            print("Found diff for style.css:\n", diff)
            break
