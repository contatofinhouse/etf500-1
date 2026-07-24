with open('src/data/etfData.ts', encoding='utf-8') as f:
    content = f.read()

with open('scratch/missing_etfs_snippet.ts', encoding='utf-8') as f:
    snippet = f.read()

target = "    holdings: [\n      { name: 'US Treasury TIPS (CPI Index)', percentage: 100.0 }\n    ]\n  }\n];"

replacement = f"    holdings: [\n      {{ name: 'US Treasury TIPS (CPI Index)', percentage: 100.0 }}\n    ]\n  }},\n{snippet}\n];"

if target in content:
    new_content = content.replace(target, replacement)
    with open('src/data/etfData.ts', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully updated etfData.ts with missing ETFs!")
else:
    print("Error: Target insertion point not found in etfData.ts!")
