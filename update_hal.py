import json
import traceback

try:
    with open('js/projects-data.js', 'r', encoding='utf-8') as f:
        content = f.read()

    start_idx = content.find('const DEFAULT_PROJECTS = ') + 25
    end_idx = content.find('];', start_idx) + 1
    if end_idx == 0:
        end_idx = content.rfind(']') + 1

    json_str = content[start_idx:end_idx]
    projects = json.loads(json_str)

    for p in projects:
        if p['id'] == 'hal-museum':
            p['subtitle'] = "Museum & Experience Design"
            p['order'] = 2
            p['tags'] = "museum, interaction, visual-layout, spatial, experience, exhibition"
            p['shortDescription'] = "Interactive exhibition experience design celebrating aviation heritage and technology integration."
            p['about'] = "The HAL Heritage Museum project aimed to display historic aviation milestones in a modern, interactive museum environment. We needed to create visitor flow models and conceptual layouts that respect historical accuracy while engaging next-gen visitors."
            p['approach'] = "Leveraged layout precision and generative AI for pre-visualization of exhibition halls. Created structured graphic boards, interactive touch interfaces, and spatial visual flow charts."
            p['conclusion'] = "Designed and planned multiple exhibition bays with immersive visual narratives, leading to a highly praised visitor layout approved by heritage curators."
            p['roles'] = ["Museum Experience Designer", "Lead Layout Artist", "Exhibition Planner"]
            p['isFeatured'] = True
            p['title'] = "HAL Heritage Museum"
            p['ctaLabel'] = "View Case Study"

    new_json = json.dumps(projects, indent=4)
    new_content = content[:start_idx] + new_json + content[end_idx:]

    with open('js/projects-data.js', 'w', encoding='utf-8') as f:
        f.write(new_content)

    print("Updated successfully")
except Exception as e:
    print("Error:", str(e))
    traceback.print_exc()
