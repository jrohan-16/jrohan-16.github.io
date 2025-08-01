import importlib
import inspect
from pathlib import Path


def main():
    module = importlib.import_module('capital_engine')
    src = inspect.getsource(module)
    dest = Path('src/lib/model.py')
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(src)


if __name__ == '__main__':
    main()
