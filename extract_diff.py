import json

log_path = r'C:\Users\Sandeep\.gemini\antigravity\brain\b38a9bb5-fa8a-4cc3-83cf-945420f5ec80\.system_generated\logs\transcript_full.jsonl'

with open(log_path, 'r', encoding='utf-8') as f:
    lines = [json.loads(line) for line in f]

for item in reversed(lines):
    if item.get('type') == 'TOOL_RESPONSE':
        content = str(item)
        if 'diff_block_start' in content:
            diff = item['content'].split('[diff_block_start]')[1].split('[diff_block_end]')[0]
            with open('diff.txt', 'w', encoding='utf-8') as out:
                out.write(diff)
            print('Diff written to diff.txt')
            break
