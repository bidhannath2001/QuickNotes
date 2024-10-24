document.addEventListener('DOMContentLoaded', function () {
    const semesterDropdown = document.getElementById('semester-dropdown');
    const subjectDropdown = document.getElementById('subject-dropdown');
    const lectureTableBody = document.querySelector('#lecture-table tbody');
    const pdfSection = document.getElementById('pdf-section');
    const pdfViewer = document.getElementById('pdf-viewer');
    const downloadButton = document.getElementById('download-button');
    const closePdfViewerButton = document.getElementById('close-pdf-viewer');

    let semesterSubjects = {};

    // Load JSON data
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            semesterSubjects = data;
            // Initialize the dropdown
            populateSemesters();
        })
        .catch(error => console.error('Error loading JSON data:', error));

    // Populate semesters in the dropdown
    function populateSemesters() {
        Object.keys(semesterSubjects).forEach(semester => {
            const option = document.createElement('option');
            option.value = semester;
            option.textContent = semester;
            semesterDropdown.appendChild(option);
        });
    }

    // Handle semester selection
    semesterDropdown.addEventListener('change', function () {
        const selectedSemester = semesterDropdown.value;
        if (selectedSemester) {
            populateSubjects(selectedSemester);
            document.getElementById('subject-selection').style.display = 'block';
        }
    });

    // Handle subject selection
    subjectDropdown.addEventListener('change', function () {
        const selectedSemester = semesterDropdown.value;
        const selectedSubject = subjectDropdown.value;
        if (selectedSubject) {
            populateLectures(selectedSemester, selectedSubject);
            document.getElementById('lecture-selection').style.display = 'block';
        }
    });

    // Populate subjects based on semester
    function populateSubjects(semester) {
        subjectDropdown.innerHTML = '<option value="" disabled selected>Choose your subject</option>';
        Object.keys(semesterSubjects[semester]).forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            option.textContent = subject;
            subjectDropdown.appendChild(option);
        });
    }

    // Populate lecture table based on subject
function populateLectures(semester, subject) {
    lectureTableBody.innerHTML = '';
    semesterSubjects[semester][subject].forEach(lectureData => {
        const row = document.createElement('tr');

        // Serial Number column
        const serialCell = document.createElement('td');
        serialCell.textContent = lectureData.serialNumber;
        row.appendChild(serialCell);

        // PDF column with clickable lecture name
        const pdfCell = document.createElement('td');
        const pdfLink = document.createElement('a');
        pdfLink.href = '#';
        pdfLink.textContent = lectureData.lecture;
        pdfLink.setAttribute('data-pdf', lectureData.pdf); // Store PDF link in data attribute
        pdfLink.classList.add('pdf-link');
        pdfCell.appendChild(pdfLink);

        // Video column
        const videoCell = document.createElement('td');
        const videoLink = document.createElement('a');
        videoLink.href = lectureData.video;
        videoLink.textContent = 'Watch Video';
        videoLink.target = '_blank';
        videoCell.appendChild(videoLink);

        // Online resources column
        const resourceCell = document.createElement('td');
        const resourceLink = document.createElement('a');
        resourceLink.href = lectureData.resources;
        resourceLink.textContent = 'View Resources';
        resourceLink.target = '_blank';
        resourceCell.appendChild(resourceLink);

        // Download button column
        const downloadCell = document.createElement('td');
        const downloadBtn = document.createElement('a');
        downloadBtn.href = lectureData.pdf; // Correct link for download
        downloadBtn.textContent = 'Download PDF';
        downloadBtn.setAttribute('download', ''); // This attribute is important for the download to work
        downloadBtn.classList.add('download-btn');
        downloadCell.appendChild(downloadBtn);

        // Append cells to the row
        row.appendChild(serialCell);
        row.appendChild(pdfCell);
        row.appendChild(videoCell);
        row.appendChild(resourceCell);
        row.appendChild(downloadCell);

        // Append the row to the table body
        lectureTableBody.appendChild(row);
    });

    // Handle PDF link click to show in iframe
    document.querySelectorAll('.pdf-link').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const pdfUrl = this.getAttribute('data-pdf'); // Get PDF URL from data attribute
            if (pdfUrl) {
                pdfViewer.src = pdfUrl; // Set the source of the iframe to display the PDF
                downloadButton.href = pdfUrl; // Update the download button to the same URL
                pdfSection.style.display = 'block'; // Show the PDF section with the iframe
            }
        });
    });
}

// Close the PDF viewer
closePdfViewerButton.addEventListener('click', function() {
    pdfSection.style.display = 'none'; // Hide the PDF section
    pdfViewer.src = ''; // Reset the iframe
});

});
