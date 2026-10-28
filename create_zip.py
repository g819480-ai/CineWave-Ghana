```python
#!/usr/bin/env python3
import os
import zipfile
from pathlib import Path

PACKAGE_DIR = Path(__file__).resolve().parent
OUTPUT_NAME = 'NOCTURA_Licensed_Movie_Collection.zip'
OUTPUT_PATH = PACKAGE_DIR.parent / OUTPUT_NAME

with zipfile.ZipFile(OUTPUT_PATH, 'w', compression=zipfile.ZIP_DEFLATED) as zf:
    for file in PACKAGE_DIR.rglob('*'):
        if file.is_dir():
            continue
        rel = file.relative_to(PACKAGE_DIR.parent)
        zf.write(file, arcname=str(rel))

print(f'Created ZIP archive: {OUTPUT_PATH}')
