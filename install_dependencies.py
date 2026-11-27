import os
import sys
import subprocess

VENV_DIR = "venv"


def get_python_executable():
    if os.name == "nt":
        return os.path.join(VENV_DIR, "Scripts", "python.exe")
    return os.path.join(VENV_DIR, "bin", "python")


def create_virtual_environment():
    if not os.path.exists(VENV_DIR):
        print("Creating virtual environment...")
        subprocess.check_call([sys.executable, "-m", "venv", VENV_DIR])
    else:
        print("Virtual environment already exists.")


def install_dependencies():
    python_exe = get_python_executable()
    requirements_file = os.path.join(os.path.dirname(__file__), "requirements.txt")

    subprocess.check_call([python_exe, "-m", "pip", "install", "--upgrade", "pip"])

    # Remove legacy Qt bindings; run_app.py uses PyQt6 only.
    subprocess.run(
        [python_exe, "-m", "pip", "uninstall", "-y", "PyQt5", "PyQtWebEngine"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    subprocess.check_call(
        [python_exe, "-m", "pip", "install", "-r", requirements_file]
    )


if __name__ == "__main__":
    create_virtual_environment()
    install_dependencies()
    print("Dependencies installed.")
