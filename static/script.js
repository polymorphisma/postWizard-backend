let selectedFiles = []; // Array to store the selected files
let selectedSocialMedia = []; // Array to store the selected social media platforms

document.getElementById('photoInput').addEventListener('change', function (event) {
    const files = Array.from(event.target.files); // Convert the FileList to an array
    
    selectedFiles = selectedFiles.concat(files); // Append the new files to the existing array
    updateFileInput(selectedFiles);
    const photoContainer = document.getElementById('photoContainer');
    photoContainer.innerHTML = ''; // Clear previous images

    selectedFiles.forEach((file, index) => {
        const reader = new FileReader();

        reader.onload = function (e) {
            const photoWrapper = document.createElement('div'); // Create a new div for photo and delete button
            photoWrapper.classList.add('relative', 'inline-block', 'm-2');

            const photoPreview = document.createElement('img'); // Create a new img element
            photoPreview.src = e.target.result;
            photoPreview.classList.add('w-32', 'h-32', 'object-cover', 'rounded-lg', 'shadow');

            const deleteButton = document.createElement('button'); // Create a delete button
            deleteButton.textContent = 'X';
            deleteButton.classList.add('absolute', 'top-1', 'right-1', 'bg-red-500', 'text-white', 'rounded-full', 'w-6', 'h-6', 'flex', 'items-center', 'justify-center', 'cursor-pointer', 'text-sm');
            deleteButton.addEventListener('click', function () {
                selectedFiles.splice(selectedFiles.indexOf(file), 1); // Remove the file from the selected files array
                updateFileInput(selectedFiles); // Update the file input with the new file list
                photoWrapper.remove(); // Remove the photo and button

                if (selectedFiles.length === 0) {
                    document.getElementById('photoInput').value = ''; // Clear the file input value
                }
            });

            photoWrapper.appendChild(photoPreview);
            photoWrapper.appendChild(deleteButton);
            photoContainer.appendChild(photoWrapper);
        };

        reader.readAsDataURL(file);
    });
});

function updateFileInput(files) {
    if (files.length === 0) {
        document.getElementById('photoInput').value = '';
        return;
    }
    const dataTransfer = new DataTransfer();
    files.forEach(file => dataTransfer.items.add(file));
    document.getElementById('photoInput').files = dataTransfer.files;
}

document.getElementById('postButton').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const photos = document.querySelectorAll('#photoContainer img');
    const caption = document.getElementById('caption').value;

    // Validation to check if photos are uploaded
    if (photos.length === 0) {
        alert('Please upload a photo.');
        return;
    }

    // Validation to check if caption is entered
    if (!caption) {
        alert('Please enter a caption.');
        return;
    }

    // Gather selected social media platforms
    selectedSocialMedia = [];
    if (document.getElementById('linkedinCheckbox').checked) {
        selectedSocialMedia.push('LinkedIn');
    }
    if (document.getElementById('twitterCheckbox').checked) {
        selectedSocialMedia.push('Twitter');
    }

    // Validation to check if at least one social media platform is selected
    if (selectedSocialMedia.length === 0) {
        alert('Please select at least one social media platform.');
        return;
    }

    // Prepare FormData to send via fetch
    const input = document.getElementById('photoInput');
    let formData = new FormData();
    for (const file of input.files) {
        formData.append('images', file); // Append each selected file
    }
    formData.append('context', caption);
    formData.append('socialMedia', JSON.stringify(selectedSocialMedia)); // Add selected social media to form data

    const uploadStatus = document.getElementById('uploadStatus');
    uploadStatus.style.display = 'block';

    // Make the POST request to the server
    fetch(`${window.location.origin}/api/v1/ai/upload`, {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json(); // Parse JSON response body
        })
        .then(data => {
            uploadStatus.style.display = 'none';

            // Remove any previous links
            const previousLinks = document.querySelectorAll('.uploadedLink');
            previousLinks.forEach(link => link.remove());

            // Create a container for the new links and messages
            const linkContainer = document.getElementById('linkContainer');
            linkContainer.innerHTML = "<h1 class='text-lg font-bold text-gray-700'>Links</h1>";

            // Iterate over the data array and create links or messages
            data.forEach(item => {
                if (item.success) {
                    const link = document.createElement('a');
                    link.className = 'uploadedLink text-blue-600 underline block my-1';
                    link.href = item.message || item.url;
                    link.textContent = item.method;
                    link.target = '_blank';
                    linkContainer.appendChild(link);
                } else {
                    const message = document.createElement('p');
                    message.className = 'uploadedLink text-red-500';
                    message.textContent = `${item.method}: ${item.message}`;
                    linkContainer.appendChild(message);
                }
            });

            // Reset form fields
            selectedFiles = [];
            document.getElementById('photoInput').value = '';
            document.getElementById('photoContainer').innerHTML = '';
            document.getElementById('caption').value = '';
            document.querySelectorAll('.social-media-selection input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);

            alert(`Post submitted successfully! Click the link below.`);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to submit the post.');
            uploadStatus.style.display = 'none';
        });
});

// Profile dropdown functionality
const profileButton = document.getElementById('profileButton');
const profileMenu = document.getElementById('profileMenu');

profileButton.addEventListener('click', () => {
    profileMenu.classList.toggle('hidden');
});

// Close the dropdown when clicking outside
document.addEventListener('click', (event) => {
    if (!document.getElementById('profileDropdown').contains(event.target)) {
        profileMenu.classList.add('hidden');
    }
});
