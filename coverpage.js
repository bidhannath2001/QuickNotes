function generateCoverPage() {
    const inputs = [
        "courseName", "courseCode", "assignmentName", "assignmentNo", "submissionDate",
        "submittedToName", "submittedToDesignation", "submittedToDept",
        "submittedByName", "submittedByID", "submittedBySemester",
        "submittedByBatch", "submittedBySession", "submittedBySection"
    ];
    inputs.forEach(id => document.getElementById('display' + id.charAt(0).toUpperCase() + id.slice(1)).textContent = document.getElementById(id).value);

    document.getElementById('inputForm').classList.add('d-none');
    document.getElementById('coverPage').classList.remove('d-none');
    document.querySelector('.button-container').classList.remove('d-none');
}

function editCoverPage() {
    document.getElementById('inputForm').classList.remove('d-none');
    document.getElementById('coverPage').classList.add('d-none');
    document.querySelector('.button-container').classList.add('d-none');
}

function downloadPDF() {
    const element = document.getElementById('coverPage');
    const options = {
        margin: 0,
        filename: 'Assignment_Cover_Page.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, scrollY: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf()
        .from(element)
        .set(options)
        .toPdf()
        .get('pdf')
        .then((pdf) => {
            const totalPages = pdf.internal.getNumberOfPages();
            for (let i = totalPages; i > 1; i--) {
                pdf.deletePage(i);
            }

            pdf.setPage(1);
            pdf.setLineWidth(0.5);
            const borderOffset = 5;
            const width = 210 - (2 * borderOffset);
            const height = 297 - (2 * borderOffset);

            pdf.rect(borderOffset, borderOffset, width, height);
            pdf.save('Assignment_Cover_Page.pdf');
        });
}