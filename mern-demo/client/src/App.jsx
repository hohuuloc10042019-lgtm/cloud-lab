import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ studentId: '', name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  const API_URL = 'http://localhost:5000/api/students';

  // Lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
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
    if (editingId) {
      // Gọi API Cập nhật (PUT)
      await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setEditingId(null);
    } else {
      // Gọi API Thêm mới (POST)
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    }
    setFormData({ studentId: '', name: '', email: '' });
    fetchStudents();
  };

  // Chọn sinh viên để sửa
  const handleEdit = (s) => {
    setEditingId(s._id);
    setFormData({ studentId: s.studentId, name: s.name, email: s.email });
  };

  // Hủy chế độ sửa
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ studentId: '', name: '', email: '' });
  };

  // Xóa sinh viên
  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchStudents();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Quản Lý Sinh Viên</h2>

      {/* Form nhập / sửa thông tin */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input 
          placeholder="MSSV" 
          value={formData.studentId} 
          onChange={e => setFormData({...formData, studentId: e.target.value})} 
          required 
          style={{ marginRight: '5px' }}
        />
        <input 
          placeholder="Họ tên" 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})} 
          required 
          style={{ marginRight: '5px' }}
        />
        <input 
          placeholder="Email" 
          value={formData.email} 
          onChange={e => setFormData({...formData, email: e.target.value})} 
          required 
          style={{ marginRight: '5px' }}
        />
        <button type="submit" style={{ marginRight: '5px' }}>
          {editingId ? 'Cập nhật' : 'Thêm sinh viên'}
        </button>
        {editingId && (
          <button type="button" onClick={handleCancelEdit}>Hủy</button>
        )}
      </form>

      {/* Thanh công cụ: Nút Tải lại */}
      <div style={{ marginBottom: '15px' }}>
        <button onClick={fetchStudents} style={{ cursor: 'pointer' }}>
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
              style={{ marginLeft: '10px', marginRight: '5px' }}
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