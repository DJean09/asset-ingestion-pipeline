// This JavaScript file handles the drag-and-drop functionality and communication with the Python FastAPI backend.
// Create an array to hold the queued files and get references to the drop zone and file list elements in the DOM.
let queuedFiles = [];
const dropZone = document.getElementById("dropZone");
const fileList = document.getElementById("fileList");

// Add event listeners to handle drag-and-drop interactions.
// When files are dragged over the drop zone
dropZone.addEventListener("dragover", (event) => {
    event.preventDefault(); 
    dropZone.classList.add("dragover"); // add the highlight class when dragging files over the drop zone
});

// When files are dragged out of the drop zone
dropZone.addEventListener("dragleave", (event) => {
    event.preventDefault();
    dropZone.classList.remove("dragover"); // remove the highlight class when dragging files out of the drop zone
});

// When files are dropped into the drop zone
dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("dragover"); // remove the highlight class when files are dropped into the drop zone
    
    // Check if any files were dropped and add them to the queue
    if (event.dataTransfer.files.length > 0) {
        const droppedFiles = Array.from(event.dataTransfer.files);
        queuedFiles = queuedFiles.concat(droppedFiles);
        updateFileListUI();
        console.log("Successfully queued:", droppedFiles); 
    } else {
        alert("Error: The browser couldn't read those files.");
    }
});

// Function to update the file list UI with the currently queued files
function updateFileListUI() {
    // Clear the current file list
    fileList.innerHTML = ""; 
    
    // If there are no files in the queue, show a message
    if (queuedFiles.length === 0) {
        fileList.innerHTML = "<li>No files selected yet.</li>";
        return;
    } else {
        fileList.innerHTML = "<p>Total files: " + queuedFiles.length + "</p>";
    }
    
    // Add each queued file to the list in the UI
    queuedFiles.forEach((file) => {
        const li = document.createElement("li");
        li.textContent = file.name;
        fileList.appendChild(li);
    });
}


// Function to send the queued files and SKU to the Python FastAPI backend
async function sendFilesToPython() {
    const skuValue = document.getElementById("skuInput").value;
    
    // Validate that the SKU is entered and that there are files in the queue before sending
    if (!skuValue) {
        alert("Please enter a Variant SKU first!");
        return;
    }

    // Validate that there are files in the queue before sending
    if (queuedFiles.length === 0) {
        alert("Please drop some images in the box first!");
        return;
    }

    // Create a FormData object to hold the SKU and files for the POST request
    // FormData allows us to easily send files and other data in a format that the backend can process as multipart/form-data.
    const formData = new FormData();
    formData.append("sku", skuValue);
    
    // Append each queued file to the FormData object under the "files" key. The backend will expect this key to access the uploaded files.
    queuedFiles.forEach(file => {
        formData.append("files", file); 
    });

    // Send the POST request to the backend and handle the response
    try {
        const response = await fetch("http://localhost:8000/upload-assets/", {
            method: "POST",
            body: formData 
        });

        const result = await response.json();
        alert("Success: " + result.message);

    } catch (error) {
        console.error("Error sending to backend:", error);
        alert("Connection failed. Is your Python FastAPI server running?");
    }
}

function clearQueue() {
    queuedFiles = [];
    updateFileListUI();
}
