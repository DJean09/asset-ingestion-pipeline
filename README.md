# asset-ingestion-pipeline
An automated backend microservice built with FastAPI and Pillow that optimizes, formats, and standardizes e-commerce product assets to accelerate storefront ingestion workflows.

The primary objective of this tool is to accelerate and streamline the e-commerce asset ingestion pipeline. It converts a traditionally slow, error-prone manual process into an automated, single-step upload.

### Prerequisites & System Dependencies

Before running the server, you must install the required Python packages. This project relies on the following libraries:

* **FastAPI**: The asynchronous web framework powering the backend API routes.
* **Uvicorn**: The lightning-fast ASGI server implementation used to run the FastAPI application.
* **python-multipart**: Required by FastAPI to enable stream-based multi-file and form-data uploads.
* **Pillow**: The robust digital imaging library used to handle image decoding, matrix re-padding, and WebP compression logic.

### 1. Install Dependencies

Open your **Command Prompt** (Windows) or **Terminal** (Mac) and execute the following deployment command to install all required libraries at once:

```bash
pip install fastapi uvicorn python-multipart Pillow
```

### 2. Launch the Python Backend Server
1. Open **Command Prompt** (Windows) or **Terminal** (Mac)
2. Navigate to the folder where your code is saved
3. Start the server by running this command (you can end it with Ctrl + C)
```bash
uvicorn converter:app --reload
```

### 3. Launch the Frontend Interface
1. Open **display.html**
2. Input your variant SKU
3. Drag and drop your product assets and hit start processing
4. The converted assets will be found in your downloads folder
