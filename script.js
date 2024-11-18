document.addEventListener('DOMContentLoaded', function () {
    const semesterDropdown = document.getElementById('semester-dropdown');
    const subjectDropdown = document.getElementById('subject-dropdown');
    const lectureTableBody = document.querySelector('#lecture-table tbody');
    const pdfSection = document.getElementById('pdf-section');
    const videoSection = document.getElementById('video-section');
    const pdfViewer = document.getElementById('pdf-viewer');
    const videoViewer = document.getElementById('video-viewer');
    const downloadButton = document.getElementById('download-button');
    const closePdfViewerButton = document.getElementById('close-pdf-viewer');
    const closeVideoViewerButton = document.getElementById('close-video-viewer');
    const menuButton = document.getElementById('menu-button');
    const menu = document.getElementById('menu');

    let semesterSubjects = {};

    // Toggle menu visibility
    menuButton.addEventListener('click', function (event) {
        event.stopPropagation();
        menu.classList.toggle('hidden');
        menu.style.display = menu.classList.contains('hidden') ? 'none' : 'block';
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', function (event) {
        if (!menuButton.contains(event.target) && !menu.contains(event.target)) {
            menu.classList.add('hidden');
            menu.style.display = 'none';
        }
    });

    // Load JSON data
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            semesterSubjects = data;
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

            // Lecture column
            const lectureCell = document.createElement('td');
            lectureCell.textContent = lectureData.lecture;
            lectureCell.style.color = 'green';
            row.appendChild(lectureCell);

            // PDF column
            const pdfCell = document.createElement('td');
            lectureData.pdf.forEach(pdfUrl => {
                const pdfLink = document.createElement('a');
                pdfLink.href = '#';
                pdfLink.innerHTML = '<i class="bx bxs-file-pdf" style="font-size: 25px; color: red;"></i>';
                pdfLink.setAttribute('data-pdf', pdfUrl);
                pdfLink.classList.add('pdf-link');
                pdfLink.style.marginRight = '10px';
                pdfCell.appendChild(pdfLink);
            });
            row.appendChild(pdfCell);

            // HandNotes column
            const handNotesCell = document.createElement('td');
            lectureData.handNotes.forEach(noteUrl => {
                const handNoteLink = document.createElement('a');
                handNoteLink.href = noteUrl;
                handNoteLink.innerHTML = '<i class="bx bx-note" style="font-size: 25px; color: green;"></i>';
                handNoteLink.target = '_blank';
                handNotesCell.appendChild(handNoteLink);
            });
            row.appendChild(handNotesCell);

            // Video column
            const videoCell = document.createElement('td');
            lectureData.video.forEach(videoUrl => {
                const videoLink = document.createElement('a');
                videoLink.href = '#';
                videoLink.innerHTML = '<i class="bx bxl-youtube" style="font-size: 25px; color: red;"></i>';
                videoLink.setAttribute('data-video', videoUrl);
                videoLink.classList.add('video-link');
                videoCell.appendChild(videoLink);
            });
            row.appendChild(videoCell);

            // Resources column
            const resourceCell = document.createElement('td');
            lectureData.resources.forEach(resourceUrl => {
                const resourceLink = document.createElement('a');
                resourceLink.href = resourceUrl;
                resourceLink.innerHTML = '<i class="bx bx-book-bookmark" style="font-size: 25px;"></i>';
                resourceLink.target = '_blank';
                resourceCell.appendChild(resourceLink);
            });
            row.appendChild(resourceCell);

            // Append the row to the table
            lectureTableBody.appendChild(row);
        });

        // Handle PDF linksa
        document.querySelectorAll('.pdf-link').forEach(link => {
            link.addEventListener('click', function (event) {
                event.preventDefault();
                const pdfPreviewUrl = this.getAttribute('data-pdf');
                const pdfDownloadUrl = convertToDownloadLink(pdfPreviewUrl);
                if (pdfPreviewUrl) {
                    pdfViewer.src = pdfPreviewUrl;
                    downloadButton.href = pdfDownloadUrl;
                    pdfSection.style.display = 'block';
                    videoSection.style.display = 'none';
                    pdfSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Handle Video links
        document.querySelectorAll('.video-link').forEach(link => {
            link.addEventListener('click', function (event) {
                event.preventDefault();
                const videoUrl = this.getAttribute('data-video');
                if (videoUrl) {
                    videoViewer.src = videoUrl;
                    videoSection.style.display = 'block';
                    pdfSection.style.display = 'none';
                    videoSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Function to convert Google Drive preview link to download link
        function convertToDownloadLink(previewUrl) {
            const fileIdMatch = previewUrl.match(/\/d\/(.+?)\//);
            return fileIdMatch ? `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}` : previewUrl;
        }
    }

    // Close the PDF viewer
    closePdfViewerButton.addEventListener('click', function () {
        pdfSection.style.display = 'none';
        pdfViewer.src = '';
    });

    // Close the Video viewer
    closeVideoViewerButton.addEventListener('click', function () {
        videoSection.style.display = 'none';
        videoViewer.src = '';
    });
});
