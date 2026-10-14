
import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: ''
  });
  const [editingId, setEditingId] = useState(null);

  // Sử dụng Nginx Reverse Proxy
  const API_URL = '/api/students';

  // Lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Xử lý Thêm mới hoặc Cập nhật sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;

      if (editingId) {
        // Gọi API Cập nhật (PUT)
        res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
      } else {
        // Gọi API Thêm mới (POST)
        res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      setEditingId(null);
      setFormData({
        studentId: '',
        name: '',
        email: ''
      });

      await fetchStudents();
    } catch (err) {
      console.error("Lỗi lưu sinh viên:", err);
      alert("Không thể lưu thông tin sinh viên!");
    }
  };

  // Chọn sinh viên để sửa
  const handleEdit = (s) => {
    setEditingId(s._id);
    setFormData({
      studentId: s.studentId,
      name: s.name,
      email: s.email
    });
  };

  // Hủy chế độ sửa
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      studentId: '',
      name: '',
      email: ''
    });
  };

  // Xóa sinh viên
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      await fetchStudents();
    } catch (err) {
      console.error("Lỗi xóa sinh viên:", err);
      alert("Không thể xóa sinh viên!");
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>

      <h2>Quản Lý Sinh Viên</h2>

      {/* CÂU 45 - BUỔI 6: Hiển thị phiên bản v2.0 */}
      <p style={{
        color: '#4CAF50',
        fontWeight: 'bold',
        fontSize: '14px',
        marginTop: '-5px',
        marginBottom: '20px'
      }}>
        Phiên bản 2.0 - Cloud Production
      </p>

      {/* Form nhập / sửa thông tin */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          placeholder="MSSV"
          value={formData.studentId}
          onChange={e => setFormData({
            ...formData,
            studentId: e.target.value
          })}
          required
          style={{ marginRight: '5px' }}
        />

        <input
          placeholder="Họ tên"
          value={formData.name}
          onChange={e => setFormData({
            ...formData,
            name: e.target.value
          })}
          required
          style={{ marginRight: '5px' }}
        />

        <input
          placeholder="Email"
          value={formData.email}
          onChange={e => setFormData({
            ...formData,
            email: e.target.value
          })}
          required
          style={{ marginRight: '5px' }}
        />

        <button type="submit" style={{ marginRight: '5px' }}>
          {editingId ? 'Cập nhật' : 'Thêm sinh viên'}
        </button>

        {editingId && (
          <button type="button" onClick={handleCancelEdit}>
            Hủy
          </button>
        )}
      </form>

      {/* Thanh công cụ: Nút Tải lại */}
      <div style={{ marginBottom: '15px' }}>
        <button
          onClick={fetchStudents}
          style={{ cursor: 'pointer' }}
        >
          🔄 Tải lại danh sách
        </button>
      </div>

      {/* Danh sách sinh viên */}
      <h3>Danh sách sinh viên ({students.length})</h3>

      <ul>
        {students.map(s => (
          <li key={s._id} style={{ marginBottom: '8px' }}>
            <strong>{s.studentId}</strong> - {s.name} - {s.email}

            <button
              onClick={() => handleEdit(s)}
              style={{
                marginLeft: '10px',
                marginRight: '5px'
              }}
            >
              Sửa
            </button>

            <button onClick={() => handleDelete(s._id)}>
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
