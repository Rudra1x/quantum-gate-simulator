#!/usr/bin/env python3
"""
Quantum Portfolio Launcher
Serves the portfolio website and quantum simulator
"""

import subprocess
import sys
import os
import time
import webbrowser
from pathlib import Path
import threading
import http.server
import socketserver
from urllib.parse import urlparse

def check_dependencies():
    """Check if required packages are installed"""
    required_packages = ['streamlit', 'qiskit', 'matplotlib', 'numpy', 'pandas']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"⚠️  Missing packages: {', '.join(missing_packages)}")
        print("Installing missing packages...")
        
        for package in missing_packages:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])
        
        print("✅ All dependencies installed!")

def serve_portfolio(port=8000):
    """Serve the portfolio website"""
    class PortfolioHandler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=Path(__file__).parent, **kwargs)
        
        def end_headers(self):
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
            super().end_headers()
    
    try:
        with socketserver.TCPServer(("", port), PortfolioHandler) as httpd:
            print(f"🌐 Portfolio server running at http://localhost:{port}")
            httpd.serve_forever()
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"⚠️  Port {port} is already in use. Trying port {port + 1}...")
            serve_portfolio(port + 1)
        else:
            raise

def run_quantum_simulator(port=8501):
    """Run the Streamlit quantum simulator"""
    try:
        env = os.environ.copy()
        env['STREAMLIT_SERVER_PORT'] = str(port)
        env['STREAMLIT_SERVER_HEADLESS'] = 'true'
        
        process = subprocess.Popen([
            sys.executable, '-m', 'streamlit', 'run', 
            'quantum_gate_simulator.py',
            '--server.port', str(port),
            '--server.headless', 'true',
            '--server.enableCORS', 'false'
        ], env=env)
        
        print(f"🔬 Quantum simulator running at http://localhost:{port}")
        return process
    except Exception as e:
        print(f"❌ Error starting quantum simulator: {e}")
        return None

def create_integrated_launcher():
    """Create an integrated HTML page that combines both"""
    html_content = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quantum Portfolio Hub</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #0a0a0a, #1a1a2e);
            color: white;
            margin: 0;
            padding: 20px;
            text-align: center;
        }
        .hub-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
        }
        .logo {
            font-size: 3rem;
            font-weight: bold;
            background: linear-gradient(135deg, #00d4ff, #8338ec, #ff006e);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 2rem;
        }
        .links {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 3rem 0;
        }
        .link-card {
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid #00d4ff;
            border-radius: 15px;
            padding: 2rem;
            text-decoration: none;
            color: white;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        .link-card:hover {
            transform: translateY(-10px);
            border-color: #ff006e;
            box-shadow: 0 20px 40px rgba(0, 212, 255, 0.3);
        }
        .link-card h3 {
            color: #00d4ff;
            margin-bottom: 1rem;
        }
        .link-card p {
            color: #b3b3b3;
            line-height: 1.6;
        }
        .status {
            margin: 2rem 0;
            padding: 1rem;
            background: rgba(0, 212, 255, 0.1);
            border-radius: 10px;
            border: 1px solid #00d4ff;
        }
    </style>
</head>
<body>
    <div class="hub-container">
        <div class="logo">🌌 Quantum Portfolio Hub</div>
        
        <div class="status">
            <h3>🚀 System Status</h3>
            <p>Portfolio Website: <span style="color: #00ff00;">● RUNNING</span></p>
            <p>Quantum Simulator: <span style="color: #00ff00;">● RUNNING</span></p>
        </div>
        
        <div class="links">
            <a href="http://localhost:8000" target="_blank" class="link-card">
                <h3>💼 Portfolio Website</h3>
                <p>Explore the main portfolio with interactive quantum visualizations, project showcases, and stunning animations.</p>
            </a>
            
            <a href="http://localhost:8501" target="_blank" class="link-card">
                <h3>🔬 Quantum Simulator</h3>
                <p>Launch the interactive quantum gate simulator with real-time circuit visualization and state analysis.</p>
            </a>
        </div>
        
        <div style="margin-top: 3rem; color: #666;">
            <p>Press <strong>Ctrl+C</strong> in the terminal to stop all services</p>
        </div>
    </div>
</body>
</html>
    """
    
    with open('quantum_hub.html', 'w') as f:
        f.write(html_content)
    
    return 'quantum_hub.html'

def main():
    """Main launcher function"""
    print("🌌 Quantum Portfolio Launcher Starting...")
    print("=" * 50)
    
    # Check dependencies
    check_dependencies()
    
    # Create hub page
    hub_file = create_integrated_launcher()
    
    # Start quantum simulator in background
    print("\n🔬 Starting Quantum Simulator...")
    simulator_process = run_quantum_simulator()
    
    # Wait a moment for simulator to start
    if simulator_process:
        time.sleep(3)
    
    # Start portfolio server in background thread
    print("\n🌐 Starting Portfolio Website...")
    portfolio_thread = threading.Thread(target=serve_portfolio, daemon=True)
    portfolio_thread.start()
    
    # Wait a moment for portfolio server to start
    time.sleep(2)
    
    # Open hub page in browser
    hub_path = Path(hub_file).absolute()
    hub_url = f"file://{hub_path}"
    
    print(f"\n🚀 Opening Quantum Portfolio Hub...")
    webbrowser.open(hub_url)
    
    print("\n" + "=" * 50)
    print("🎉 QUANTUM PORTFOLIO IS NOW LIVE!")
    print("=" * 50)
    print("📱 Portfolio Website: http://localhost:8000")
    print("🔬 Quantum Simulator: http://localhost:8501")
    print("🌟 Hub Page: Opened in your browser")
    print("\n💡 Features Available:")
    print("   • Interactive quantum circuit simulator")
    print("   • Stunning portfolio animations")
    print("   • Bloch sphere visualizations")
    print("   • Particle system backgrounds")
    print("   • Responsive mobile design")
    print("   • Contact form with quantum effects")
    print("\n🎮 Keyboard Shortcuts:")
    print("   • Press 1-6 to navigate sections")
    print("   • Try the Konami code for a surprise!")
    print("   • ESC to close modals")
    print("\n🛑 Press Ctrl+C to stop all services")
    print("=" * 50)
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\n🛑 Shutting down Quantum Portfolio...")
        if simulator_process:
            simulator_process.terminate()
        print("✅ All services stopped. Thank you for using Quantum Portfolio!")

if __name__ == "__main__":
    main()