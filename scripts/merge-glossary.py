from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
entries={}
for p in sorted((root/'docs').glob('glossary*.json')):
    value=json.loads(p.read_text(encoding='utf-8-sig'))
    if isinstance(value,list):
        value={e.pop('term'):e for e in value}
    entries.update(value)
suffix='''
const INDEX = new Map();
for (const [key, e] of Object.entries(GLOSSARY)) {
  e.key = key;
  for (const name of [key, ...(e.aliases || [])]) INDEX.set(name.toLowerCase(), e);
}
export const lookupTerm = name => INDEX.get(name.trim().toLowerCase());
'''
(root/'js/content/glossary.js').write_text('export const GLOSSARY = '+json.dumps(entries,ensure_ascii=False,indent=2)+';\n'+suffix,encoding='utf-8')
print(f'Merged {len(entries)} glossary entries')
