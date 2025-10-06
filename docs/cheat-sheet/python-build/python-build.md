# Python Build - Cheat Sheet

## Overview

This guide covers the various tools and methods for building, packaging, and distributing Python applications.

## Distribution Formats

### Wheel (.whl)

Standard binary distribution format for Python. Wheels are faster to install than source archives.

**Characteristics:**

- ZIP format with `.whl` extension
- No compilation needed during installation
- Can contain compiled C extensions
- Name format: `{distribution}-{version}(-{build})?-{python}-{abi}-{platform}.whl`

**Create a wheel:**

```bash
# With build (recommended - modern)
python -m build --wheel

# With setuptools (legacy)
python setup.py bdist_wheel

# With pip
pip wheel .
```

**Install a wheel:**

```bash
pip install package-1.0.0-py3-none-any.whl
```

### Source Distribution (.tar.gz)

Source archive that requires compilation/build during installation.

```bash
# Create a source distribution
python -m build --sdist

# Legacy
python setup.py sdist
```

## Build Tools

### `build` (Modern - PEP 517)

Standard recommended tool for building Python packages.

**Installation:**

```bash
pip install build
```

**Usage:**

```bash
# Build wheel + sdist
python -m build

# Wheel only
python -m build --wheel

# Source distribution only
python -m build --sdist

# Specify output directory
python -m build --outdir dist/
```

**Advantages:**

- Follows PEP 517/518 standard
- Build isolation in a virtual environment
- Compatible with all build systems (setuptools, flit, poetry, etc.)
- No pollution of current environment

### `setuptools` (Legacy but still used)

Traditional build system for Python.

```bash
# Installation
pip install setuptools wheel

# Build
python setup.py build
python setup.py sdist bdist_wheel

# Development (editable install)
pip install -e .
```

## Configuration Files

### `pyproject.toml` (Modern - PEP 518)

Standard configuration file for modern Python projects.

**Minimal structure:**

```toml
[build-system]
requires = ["setuptools>=45", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "my-package"
version = "1.0.0"
description = "Package description"
readme = "README.md"
requires-python = ">=3.8"
license = {text = "MIT"}
authors = [
    {name = "Your Name", email = "email@example.com"}
]
dependencies = [
    "requests>=2.28.0",
    "numpy>=1.20.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.0.0",
    "black>=22.0.0",
]

[project.scripts]
my-cli = "my_package.cli:main"

[tool.setuptools.packages.find]
where = ["src"]
```

**With different backends:**

=== "setuptools"
    ```toml
    [build-system]
    requires = ["setuptools>=61.0", "wheel"]
    build-backend = "setuptools.build_meta"
    ```

=== "flit"
    ```toml
    [build-system]
    requires = ["flit_core>=3.2"]
    build-backend = "flit_core.buildapi"
    ```

=== "poetry"
    ```toml
    [build-system]
    requires = ["poetry-core>=1.0.0"]
    build-backend = "poetry.core.masonry.api"
    ```

=== "hatchling"
    ```toml
    [build-system]
    requires = ["hatchling"]
    build-backend = "hatchling.build"
    ```

### `setup.py` (Legacy)

Python script for package configuration. Still supported but `pyproject.toml` is preferred.

**Minimal example:**

```python
from setuptools import setup, find_packages

setup(
    name="my-package",
    version="1.0.0",
    description="Package description",
    author="Your Name",
    author_email="email@example.com",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    python_requires=">=3.8",
    install_requires=[
        "requests>=2.28.0",
        "numpy>=1.20.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.0.0",
            "black>=22.0.0",
        ],
    },
    entry_points={
        "console_scripts": [
            "my-cli=my_package.cli:main",
        ],
    },
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
    ],
)
```

**With C extensions:**

```python
from setuptools import setup, Extension

ext_modules = [
    Extension(
        "my_package.fast_module",
        sources=["src/my_package/fast_module.c"],
        include_dirs=["src/my_package/include"],
    )
]

setup(
    name="my-package",
    version="1.0.0",
    ext_modules=ext_modules,
)
```

### `setup.cfg` (Intermediate)

Declarative alternative to `setup.py`, often used with a minimal `setup.py`.

```ini
[metadata]
name = my-package
version = 1.0.0
description = Package description
author = Your Name
author_email = email@example.com
license = MIT
classifiers =
    Programming Language :: Python :: 3.8
    Programming Language :: Python :: 3.9

[options]
packages = find:
package_dir =
    = src
python_requires = >=3.8
install_requires =
    requests>=2.28.0
    numpy>=1.20.0

[options.packages.find]
where = src

[options.extras_require]
dev =
    pytest>=7.0.0
    black>=22.0.0

[options.entry_points]
console_scripts =
    my-cli = my_package.cli:main
```

## PEX - Python EXecutable

Tool for creating self-contained Python executable files.

**Installation:**

```bash
pip install pex
```

**Create a PEX:**

```bash
# Simple PEX with dependencies
pex requests -o my-app.pex

# PEX with an entry point
pex requests -c my_script.py -o my-app.pex

# PEX with module and entry point
pex my_package -c my_package.cli:main -o my-cli.pex

# PEX with source files
pex -D src/ -e my_package.main -o my-app.pex

# PEX with requirements.txt
pex -r requirements.txt -o my-app.pex

# Specify Python version
pex --python=python3.9 -r requirements.txt -o my-app.pex

# Multi-platform PEX
pex --platform linux-x86_64 --platform macosx-x86_64 -r requirements.txt -o my-app.pex
```

**Use a PEX:**

```bash
# Execute directly
./my-app.pex

# With Python
python my-app.pex

# Pass arguments
./my-app.pex arg1 arg2 --option=value

# Inspect contents
PEX_TOOLS=1 ./my-app.pex

# Extract contents
unzip my-app.pex -d extracted/
```

**Advanced options:**

```bash
# With custom shebang
pex --python-shebang="/usr/bin/env python3.9" -r requirements.txt -o my-app.pex

# Compile to bytecode
pex --compile -r requirements.txt -o my-app.pex

# Disable cache
pex --disable-cache -r requirements.txt -o my-app.pex

# Include resources
pex --resources-directory resources/ -r requirements.txt -o my-app.pex
```

**PEX Advantages:**

- ✅ Single executable file
- ✅ Isolated and reproducible environment
- ✅ No installation needed
- ✅ Multi-platform
- ✅ Dependency caching

**Disadvantages:**

- ❌ Larger file size
- ❌ Slightly longer startup time
- ❌ Complexity with some native dependencies

## Recommended Project Structure

### Modern layout (src-layout)

```
my-project/
├── src/
│   └── my_package/
│       ├── __init__.py
│       ├── module1.py
│       ├── module2.py
│       └── cli.py
├── tests/
│   ├── __init__.py
│   ├── test_module1.py
│   └── test_module2.py
├── docs/
├── pyproject.toml
├── README.md
├── LICENSE
└── .gitignore
```

**Src-layout advantages:**

- Avoids accidental imports from source directory
- Forces package installation for tests
- Better source/build separation

### Traditional layout

```
my-project/
├── my_package/
│   ├── __init__.py
│   ├── module1.py
│   └── module2.py
├── tests/
├── setup.py
├── pyproject.toml
└── README.md
```

## Build Workflows

### Local development

```bash
# Editable install (recommended for development)
pip install -e .

# With development dependencies
pip install -e ".[dev]"

# With pyproject.toml only
pip install -e ".[dev,test]"
```

### Build for distribution

```bash
# 1. Clean previous builds
rm -rf build/ dist/ *.egg-info

# 2. Build the package
python -m build

# 3. Check the package
pip install twine
twine check dist/*

# 4. Upload to PyPI
twine upload dist/*

# 4bis. Test on TestPyPI first
twine upload --repository testpypi dist/*
```

### Build with PEX for deployment

```bash
# 1. Build the wheel
python -m build --wheel

# 2. Create PEX from wheel
pex dist/my_package-1.0.0-py3-none-any.whl -c my_package.cli:main -o my-cli.pex

# Or directly from installable package
pex . -c my_package.cli:main -o my-cli.pex
```

## Useful Commands

### Package inspection

```bash
# List files in a wheel
unzip -l package.whl

# Extract a wheel
unzip package.whl -d extracted/

# View metadata
pip show package-name

# View dependencies
pip show -f package-name
```

### Dependency management

```bash
# Generate requirements.txt from environment
pip freeze > requirements.txt

# Generate only direct dependencies (with pip-tools)
pip install pip-tools
pip-compile pyproject.toml
pip-compile requirements.in

# Update dependencies
pip-compile --upgrade

# Sync environment
pip-sync requirements.txt
```

### Tests before publication

```bash
# Install from local wheel
pip install dist/package-1.0.0-py3-none-any.whl

# Install from TestPyPI
pip install --index-url https://test.pypi.org/simple/ package-name

# Verify imports
python -c "import my_package; print(my_package.__version__)"
```

## Approach Comparison

| Aspect | setup.py | pyproject.toml | PEX |
|--------|----------|----------------|-----|
| **Standard** | Legacy | Modern (PEP 518) | Executable |
| **Format** | Python | TOML | Binary ZIP |
| **Flexibility** | +++++ | +++ | ++ |
| **Simplicity** | ++ | ++++ | ++++ |
| **Distribution** | PyPI | PyPI | Single file |
| **Isolation** | No | No | Yes |
| **Size** | Small | Small | Large |

## Best Practices

### ✅ Recommendations

1. **Use `pyproject.toml`** as main configuration (PEP 518)
2. **Use `python -m build`** to build packages
3. **Adopt src-layout** for new projects
4. **Semantic versioning** (SemVer: MAJOR.MINOR.PATCH)
5. **Include README.md** and LICENSE
6. **Test package** before publication (TestPyPI)
7. **Use PEX** for deployable CLI applications
8. **Pin versions** in requirements.txt, not in pyproject.toml

### ❌ Avoid

1. ❌ Mixing setup.py and pyproject.toml without reason
2. ❌ Using `python setup.py install` (deprecated)
3. ❌ Forgetting `__init__.py` in packages
4. ❌ Including secrets in package
5. ❌ Unpinned versions in production

## Complete Examples

### Simple CLI application

**pyproject.toml:**

```toml
[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[project]
name = "my-cli"
version = "1.0.0"
dependencies = ["click>=8.0", "requests>=2.28"]

[project.scripts]
my-cli = "my_cli.main:cli"
```

**Build and distribution:**

```bash
# Development
pip install -e .
my-cli --help

# Production - Wheel
python -m build
pip install dist/my_cli-1.0.0-py3-none-any.whl

# Production - PEX
pex . -c my_cli.main:cli -o my-cli.pex
./my-cli.pex --help
```

### Library with C extensions

**pyproject.toml:**

```toml
[build-system]
requires = ["setuptools>=61.0", "wheel", "Cython>=0.29"]
build-backend = "setuptools.build_meta"

[project]
name = "my-lib"
version = "2.0.0"
```

**setup.py (required for C extensions):**

```python
from setuptools import setup, Extension
from Cython.Build import cythonize

extensions = [
    Extension(
        "my_lib.fast",
        ["src/my_lib/fast.pyx"],
    )
]

setup(
    ext_modules=cythonize(extensions),
)
```

**Build:**

```bash
python -m build
```

## Resources

- [PEP 517 - Build Backend](https://peps.python.org/pep-0517/)
- [PEP 518 - pyproject.toml](https://peps.python.org/pep-0518/)
- [PEP 621 - Project Metadata](https://peps.python.org/pep-0621/)
- [Python Packaging Guide](https://packaging.python.org/)
- [PEX Documentation](https://pex.readthedocs.io/)
- [setuptools Documentation](https://setuptools.pypa.io/)
