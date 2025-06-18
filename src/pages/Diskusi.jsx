import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Diskusi = ({ produkID, pembeliID, pegawaiID }) => {
  const [isi, setIsi] = useState('');
  const [diskusiList, setDiskusiList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (produkID) {
      fetchDiskusi();
    }
  }, [produkID]);

  const fetchDiskusi = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:8000/api/diskusi/${produkID}`);
      setDiskusiList(res.data);
    } catch (err) {
      setError('❌ Gagal memuat diskusi.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isi.trim()) return;

    try {
      await axios.post('http://localhost:8000/api/diskusi', {
        isi,
        produkID,
        pembeliID: pembeliID || null,
        pegawaiID: pegawaiID || null,
      });
      setIsi('');
      fetchDiskusi();
    } catch (err) {
      alert('❌ Gagal mengirim diskusi.');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h4 className="mb-3">💬 Diskusi Produk</h4>

      {loading && <p>⏳ Memuat diskusi...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {diskusiList.map((d) => (
          <li key={d.diskusiID} style={{ marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <div>
              <strong>{d.nama}</strong> <em>({d.role})</em> -{' '}
              <small>{new Date(d.tanggal).toLocaleString('id-ID')}</small>
            </div>
            <p>{d.isi}</p>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <textarea
          value={isi}
          onChange={(e) => setIsi(e.target.value)}
          placeholder="Tulis pertanyaan atau komentar..."
          required
          rows={4}
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <button type="submit" className="btn btn-primary">Kirim</button>
      </form>
    </div>
  );
};

export default Diskusi;
