import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ studentId: '', name: '', email: '' });

  const API_URL = '/api/students';

  // Câu 47: Lấy danh sách sinh viên
  const fetchStudents = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => { fetchStudents(); }, []);

  // Câu 49: Thêm sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setFormData({ studentId: '', name: '', email: '' });
    fetchStudents();
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchStudents();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Quản Lý Sinh Viên</h2>
      {/* Câu 48: Form nhập thông tin */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input placeholder="MSSV" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} required />
        <input placeholder="Họ tên" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
        <input placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
        <button type="submit">Thêm sinh viên</button>
      </form>

      {/* Danh sách sinh viên */}
      <ul>
        {students.map(s => (
          <li key={s._id}>
            {s.studentId} - {s.name} - {s.email}
            <button onClick={() => handleDelete(s._id)} style={{ marginLeft: '10px' }}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;