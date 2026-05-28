# FastAPI allows us to create APIs quickly and easily.
# UploadFile and File are used to handle file uploads in our API.
# HTTPException is used to handle errors and return appropriate responses.
# List is imported from the typing module to specify that we expect a list of files.
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware # This is the middleware that allows cross-origin requests, which is necessary for our frontend to communicate with this backend.
from typing import List # This is used to specify that we expect a list of files in our API endpoint.
from PIL import Image # For image processing in Python, which we will use to resize and convert images.
import io # Handle in-memory byte streams, allowing us to process images without saving them to disk first.
import os # Handle file operations, such as saving the processed images to disk.

app = FastAPI()

# THE FIX: This tells the browser to allow the connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Accepts requests from any HTML file
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def process_image(file_bytes, bg_color=(243, 241, 237, 255)):
    """
    Resizes the image to a square and returns the WebP bytes.
    Args:
        file_bytes (bytes): The raw bytes of the uploaded image.
        bg_color (tuple): RGBA color for the background. Default is a light beige.
    """
    with Image.open(io.BytesIO(file_bytes)) as img:
        img = img.convert("RGBA")
        max_dim = max(img.width, img.height)
        
        canvas = Image.new("RGBA", (max_dim, max_dim), bg_color)
        x_offset = (max_dim - img.width) // 2
        y_offset = (max_dim - img.height) // 2
        
        canvas.paste(img, (x_offset, y_offset), img)
        
        # Save to memory instead of a hard drive
        output_buffer = io.BytesIO()
        canvas.save(output_buffer, format="webp", quality=85, method=6)
        return output_buffer.getvalue()

@app.post("/upload-assets/")
async def upload_assets(sku: str = Form(...), files: List[UploadFile] = File(...)):
    """
    API endpoint to handle image uploads, process them, and save the results.
    Args:
        sku (str): The SKU associated with the images, provided as a form field.
        files (List[UploadFile]): A list of uploaded image files.
    """
    # Define the output folder for processed images
    # ~ automatically finds your home directory and adds \Downloads to the end
    output_folder = os.path.join(os.path.expanduser("~"), "Downloads")

    processed_count = 0
    
    # Loop through each uploaded file and convert it to WebP format
    for index, file in enumerate(files, start=1):
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail=f"{file.filename} is not an image.")
            
        # Read the raw file the user dragged in
        raw_bytes = await file.read()
        
        # Run the Pillow logic
        final_webp_bytes = process_image(raw_bytes)
        
        # Create the new filename
        new_filename = f"{sku}_{index}.webp"
        save_path = os.path.join(output_folder, new_filename)
        
        # Write the finished file to your folder
        with open(save_path, "wb") as out_file:
            out_file.write(final_webp_bytes)
            
        processed_count += 1
    
    # Return a success message with the count of processed images
    return {
        "status": "Success",
        "message": f"Successfully processed {processed_count} images for SKU {sku}."
    }
