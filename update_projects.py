import json
import re

backup_file = "cms_backup_2026-07-12.json"
js_file = "js/projects-data.js"

with open(backup_file, "r", encoding="utf-8") as f:
    backup_data = json.load(f)

projects_json_str = backup_data.get("sandeep_projects_v25")
if not projects_json_str:
    print("Error: sandeep_projects_v25 not found in backup")
    exit(1)

with open(js_file, "r", encoding="utf-8") as f:
    js_content = f.read()

# The pattern is: const DEFAULT_PROJECTS = [...];
# followed by function getAllProjects()
pattern = re.compile(r'(const DEFAULT_PROJECTS\s*=\s*)(.*?)(;\s*function getAllProjects\(\))', re.DOTALL)
match = pattern.search(js_content)
if match:
    new_js_content = js_content[:match.start(2)] + projects_json_str + js_content[match.end(2):]
    with open(js_file, "w", encoding="utf-8") as f:
        f.write(new_js_content)
    print("Successfully updated projects-data.js!")
else:
    print("Error: Could not find DEFAULT_PROJECTS pattern in js file")
