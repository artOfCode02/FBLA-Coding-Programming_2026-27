import os
import sys
import subprocess

from install_dependencies import create_virtual_environment, get_python_executable


VENV_DIR = "venv"
REQUIRED_MODULES = (
    "flask",
    "numpy",
    "requests",
    "PyQt6",
    "PyQt6.QtWebEngineWidgets",
    "geopy",
)


def dependencies_are_working(python_exe):
    check_code = "import " + "; import ".join(REQUIRED_MODULES)
    try:
        subprocess.run(
            [python_exe, "-c", check_code],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.PIPE,
            text=True,
        )

        subprocess.run(
            [python_exe, "-m", "pip", "check"],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        return True
    except subprocess.CalledProcessError as error:
        if error.stderr:
            print(error.stderr.strip())
        return False


def main():
    create_virtual_environment()
    python_exe = get_python_executable()

    if not dependencies_are_working(python_exe):
        print("Dependencies are missing or broken. Installing requirements...")
        subprocess.check_call([sys.executable, "install_dependencies.py"])

    if not dependencies_are_working(python_exe):
        raise RuntimeError("Dependency validation failed after installation.")

    print("Dependencies are installed and working.")
    print("Running the app...")
    subprocess.check_call([python_exe, "run_app.py", "--disable-gpu"])


if __name__ == "__main__":
    main()
