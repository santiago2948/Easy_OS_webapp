"""
Convierte CSV a XLSX.
Uso:
  python csv_to_xlsx.py              # lee ./data, escribe ./xlsx
  python csv_to_xlsx.py ruta/csv     # lee esa carpeta, escribe ./xlsx junto a este script
  python csv_to_xlsx.py ruta/csv salida/xlsx
"""

from __future__ import annotations

import csv
import sys
from pathlib import Path

try:
    from openpyxl import Workbook
except ImportError as exc:
    raise SystemExit(
        "Falta openpyxl. Instálalo con:\n  pip install openpyxl"
    ) from exc


def csv_to_xlsx(csv_path: Path, xlsx_path: Path) -> None:
    wb = Workbook()
    ws = wb.active
    ws.title = "Sheet1"

    # utf-8-sig quita BOM típico de exports Airtable/Excel
    with csv_path.open("r", encoding="utf-8-sig", newline="") as fh:
        reader = csv.reader(fh)
        for row in reader:
            ws.append(row)

    xlsx_path.parent.mkdir(parents=True, exist_ok=True)
    wb.save(xlsx_path)


def main() -> int:
    root = Path(__file__).resolve().parent
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else root / "data"
    dst = Path(sys.argv[2]) if len(sys.argv) > 2 else root / "xlsx"

    if not src.is_dir():
        print(f"No existe la carpeta de origen: {src}")
        return 1

    files = sorted(src.glob("*.csv"))
    if not files:
        print(f"No hay CSV en: {src}")
        return 1

    dst.mkdir(parents=True, exist_ok=True)
    print(f"Origen: {src}")
    print(f"Destino: {dst}\n")

    ok = 0
    for csv_path in files:
        xlsx_path = dst / f"{csv_path.stem}.xlsx"
        try:
            csv_to_xlsx(csv_path, xlsx_path)
            print(f"OK  {csv_path.name} -> {xlsx_path.name}")
            ok += 1
        except Exception as err:  # noqa: BLE001
            print(f"ERR {csv_path.name}: {err}")

    print(f"\nConvertidos: {ok}/{len(files)}")
    return 0 if ok == len(files) else 1


if __name__ == "__main__":
    raise SystemExit(main())
