// DOM Elements
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const studentModal = document.getElementById('studentModal');
const studentForm = document.getElementById('studentForm');
const resultTableBody = document.getElementById('resultTableBody');
const emptyRow = document.getElementById('emptyRow');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');

document.getElementById('pdfDate').innerText = new Date().toLocaleDateString('bn-BD') + " ইং";

// লোকাল স্টোরেজ থেকে আগের ডাটা লোড করা, না থাকলে খালি অ্যারে [] নেওয়া
let students = JSON.parse(localStorage.getItem('resultSheetData')) || [];

// পেজ লোড হওয়ার সাথে সাথে আগের ডাটা টেবিলে দেখানোর জন্য ফাংশন কল
renderTable();

// গ্রেড হিসাব করার ফাংশন
function calculateGrade(bangla, english, math, average) {
    if (bangla < 33 || english < 33 || math < 33) {
        return { letter: 'F', color: 'text-red-600 font-bold' };
    }
    if (average >= 80) return { letter: 'A+', color: 'text-green-600 font-bold' };
    if (average >= 70) return { letter: 'A', color: 'text-green-500 font-bold' };
    if (average >= 60) return { letter: 'A-', color: 'text-blue-500 font-bold' };
    if (average >= 50) return { letter: 'B', color: 'text-yellow-600 font-bold' };
    if (average >= 40) return { letter: 'C', color: 'text-orange-500 font-bold' };
    if (average >= 33) return { letter: 'D', color: 'text-gray-600' };
    return { letter: 'F', color: 'text-red-600 font-bold' };
}

// মোডাল ওপেন ও ক্লোজ অ্যানিমেশন
function toggleModal(show) {
    if (show) {
        studentModal.classList.remove('hidden');
        setTimeout(() => {
            studentModal.classList.remove('opacity-0');
            studentModal.querySelector('.transform').classList.remove('scale-95');
        }, 10);
    } else {
        studentModal.classList.add('opacity-0');
        studentModal.querySelector('.transform').classList.add('scale-95');
        setTimeout(() => {
            studentModal.classList.add('hidden');
            studentForm.reset();
        }, 300);
    }
}

openModalBtn.addEventListener('click', () => toggleModal(true));
closeModalBtn.addEventListener('click', () => toggleModal(false));
cancelModalBtn.addEventListener('click', () => toggleModal(false));

// টেবিলে ডাটা রেন্ডার/প্রদর্শন করার মেইন ফাংশন
function renderTable() {
    // টেবিল বডি ক্লিয়ার করা
    resultTableBody.innerHTML = '';

    if (students.length === 0) {
        // ডাটা না থাকলে নোটিফিকেশন রো দেখানো
        resultTableBody.appendChild(emptyRow);
        return;
    }

    // লুপ চালিয়ে ডাটা টেবিলে পুশ করা
    students.forEach((student, index) => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-gray-50 transition-colors";

        const grade = calculateGrade(student.bangla, student.english, student.math, student.average);

        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${index + 1}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">${student.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">${student.bangla}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">${student.english}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">${student.math}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-gray-800">${student.total}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">${student.average}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center ${grade.color}">${grade.letter}</td>
        `;
        resultTableBody.appendChild(tr);
    });
}

// ফর্ম সাবমিট হ্যান্ডলার (নতুন ডাটা যোগ করা)
studentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('studentName').value;
    const bangla = parseInt(document.getElementById('marksBangla').value);
    const english = parseInt(document.getElementById('marksEnglish').value);
    const math = parseInt(document.getElementById('marksMath').value);

    const total = bangla + english + math;
    const average = parseFloat((total / 3).toFixed(2));

    // অবজেক্ট তৈরি করে মেইন অ্যারে-তে পুশ করা
    const newStudent = { name, bangla, english, math, total, average };
    students.push(newStudent);

    // ১. লোকাল স্টোরেজে ডাটা সেভ করা (Stringify করে)
    localStorage.setItem('resultSheetData', JSON.stringify(students));

    // ২. টেবিল আপডেট করা
    renderTable();

    // মোডাল বন্ধ করা
    toggleModal(false);
});

// পিডিএফ ডাউনলোড লজিক
downloadPdfBtn.addEventListener('click', () => {
    if (students.length === 0) {
        alert("পিডিএফ তৈরি করার জন্য প্রথমে অন্তত একজন স্টুডেন্টের তথ্য যোগ করুন।");
        return;
    }

    window.print();
});
