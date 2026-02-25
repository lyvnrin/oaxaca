# Backend - Flask Scaffolding
The folder contains the initial backend setup for the system.

**Purpose**
- Establish backend folder structure
- Confirm Flask runs correctly in WSL
- Provide a base for future models, routes, and services

## Flask Setup (WSL)
Flask is run inside WSL - which uses a system-managed Python environment. Because of this, it was installed using:
 '''
 bash
 pip install flask --break-system-packages
 '''

### Running the app
 '''
 python3 app.py
 '''

### Flask Components Used
* Flask - main application instance
* Blueprint - planned structure for modular routes (routes/)
* send_from_directory - serving temporary static files
* static/ - seed HTML page for backend verification

## Notes
* Static page is temporary + used only to verify backend execution
* React front will be integrated later
* Models and services are placeholders for future sprints
