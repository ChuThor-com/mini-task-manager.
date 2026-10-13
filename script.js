// ===== 1. DỮ LIỆU MẪU BAN ĐẦU =====
// Đề bài yêu cầu: hiển thị 5 công việc mẫu từ mảng đối tượng trong script.js
let tasks = [
    { id: 1, name: "Làm bài tập HTML/CSS", deadline: "2023-11-01", priority: "Cao", completed: false },
    { id: 2, name: "Học JavaScript cơ bản", deadline: "2023-11-05", priority: "Trung bình", completed: true },
    { id: 3, name: "Dọn dẹp nhà cửa", deadline: "2023-10-30", priority: "Thấp", completed: false },
    { id: 4, name: "Đi chợ mua đồ ăn", deadline: "2023-10-29", priority: "Trung bình", completed: false },
    { id: 5, name: "Đọc sách 30 phút", deadline: "2023-11-10", priority: "Thấp", completed: true }
];

// ===== 2. LẤY CÁC PHẦN TỬ DOM =====
const taskForm = document.getElementById('task-form');
const taskNameInput = document.getElementById('task-name');
const taskDeadlineInput = document.getElementById('task-deadline');
const taskPriorityInput = document.getElementById('task-priority');
const errorMessage = document.getElementById('error-message');
const taskList = document.getElementById('task-list');
const searchInput = document.getElementById('search-input');
const filterStatus = document.getElementById('filter-status');
const emptyMessage = document.getElementById('empty-message');

// ===== 3. HÀM RENDER (HIỂN THỊ) DANH SÁCH =====
function renderTasks() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const filter = filterStatus.value;

    // Lọc dữ liệu theo tên và trạng thái
    const filteredTasks = tasks.filter(function(task) {
        // Kiểm tra tên có chứa từ khóa tìm kiếm không (không phân biệt hoa/thường)
        const matchesSearch = task.name.toLowerCase().includes(searchTerm);
        
        // Kiểm tra trạng thái
        let matchesFilter = true;
        if (filter === 'completed') {
            matchesFilter = task.completed === true;
        } else if (filter === 'pending') {
            matchesFilter = task.completed === false;
        }
        
        return matchesSearch && matchesFilter;
    });

    // Xóa danh sách cũ trên giao diện
    taskList.innerHTML = '';

    // Nếu không có công việc nào thì hiện thông báo
    if (filteredTasks.length === 0) {
        emptyMessage.style.display = 'block';
    } else {
        emptyMessage.style.display = 'none';
    }

    // Duyệt mảng và tạo từng thẻ <li>
    filteredTasks.forEach(function(task) {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.completed) {
            li.classList.add('completed');
        }

        // Xử lý ngày hạn
        let deadlineText = 'Không có hạn';
        if (task.deadline) {
            deadlineText = 'Hạn: ' + task.deadline;
        }

        // Tạo nội dung bên trong thẻ li
        li.innerHTML = `
            <div class="task-info">
                <div class="task-name">${task.name}</div>
                <div class="task-details">
                    ${deadlineText} | 
                    Ưu tiên: <span class="priority-${task.priority.replace(' ', '-')}">${task.priority}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-toggle" onclick="toggleTask(${task.id})">
                    ${task.completed ? 'Hoàn tác' : 'Xong'}
                </button>
                <button class="btn-delete" onclick="deleteTask(${task.id})">Xóa</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

// ===== 4. HÀM THÊM CÔNG VIỆC MỚI =====
taskForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn chặn load lại trang

    const name = taskNameInput.value.trim();

    // Kiểm tra tên không được rỗng
    if (name === '') {
        errorMessage.textContent = 'Vui lòng nhập tên công việc!';
        taskNameInput.focus();
        return;
    }

    // Xóa thông báo lỗi cũ
    errorMessage.textContent = '';

    // Tạo đối tượng công việc mới
    const newTask = {
        id: Date.now(), // Dùng thời gian làm ID duy nhất
        name: name,
        deadline: taskDeadlineInput.value,
        priority: taskPriorityInput.value,
        completed: false
    };

    // Thêm vào mảng
    tasks.push(newTask);

    // Render lại danh sách
    renderTasks();

    // Reset form
    taskForm.reset();
    taskPriorityInput.value = 'Trung bình';
    taskNameInput.focus();
});

// ===== 5. HÀM ĐÁNH DẤU HOÀN THÀNH =====
function toggleTask(id) {
    // Tìm công việc theo id
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            tasks[i].completed = !tasks[i].completed;
            break;
        }
    }
    renderTasks();
}

// ===== 6. HÀM XÓA CÔNG VIỆC =====
function deleteTask(id) {
    const confirmDelete = confirm('Bạn có chắc muốn xóa công việc này?');
    if (confirmDelete) {
        // Lọc bỏ công việc có id trùng
        tasks = tasks.filter(function(task) {
            return task.id !== id;
        });
        renderTasks();
    }
}

// ===== 7. LẮNG NGHE SỰ KIỆN TÌM KIẾM & LỌC =====
searchInput.addEventListener('input', renderTasks);
filterStatus.addEventListener('change', renderTasks);

// ===== 8. CHẠY RENDER LẦN ĐẦU TIÊN =====
renderTasks();