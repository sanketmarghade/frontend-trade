"""
Installation script for TA-Lib
Run this script to install TA-Lib dependencies
"""
import subprocess
import sys
import platform

def install_talib():
    system = platform.system().lower()
    
    print("Installing TA-Lib dependencies...")
    
    if system == "windows":
        print("For Windows, please:")
        print("1. Download TA-Lib from: https://www.lfd.uci.edu/~gohlke/pythonlibs/#ta-lib")
        print("2. Install using: pip install TA_Lib-0.4.28-cp311-cp311-win_amd64.whl")
        print("   (adjust filename based on your Python version)")
    
    elif system == "darwin":  # macOS
        try:
            subprocess.run(["brew", "install", "ta-lib"], check=True)
            print("TA-Lib installed successfully via Homebrew")
        except subprocess.CalledProcessError:
            print("Please install Homebrew first, then run: brew install ta-lib")
    
    elif system == "linux":
        print("For Linux, run these commands:")
        print("sudo apt-get update")
        print("sudo apt-get install build-essential")
        print("wget http://prdownloads.sourceforge.net/ta-lib/ta-lib-0.4.0-src.tar.gz")
        print("tar -xzf ta-lib-0.4.0-src.tar.gz")
        print("cd ta-lib/")
        print("./configure --prefix=/usr")
        print("make")
        print("sudo make install")
    
    # Install Python packages
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], check=True)
        print("Python packages installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"Error installing Python packages: {e}")

if __name__ == "__main__":
    install_talib()