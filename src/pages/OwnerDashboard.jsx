import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Button, Table, Modal, Form, Alert, Card, Toast, ToastContainer } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BarChart, CalendarX } from 'lucide-react';
import axios from 'axios';
import LaporanKategori from '../components/owner/LaporanKategori';
import LaporanPenitipanHabis from '../components/owner/LaporanPenitipanHabis';
import LaporanDonasiBarang from '../components/owner/LaporanDonasiBarang';
import LaporanRequestDonasi from '../components/owner/LaporanRequestDonasi';
import LaporanTransaksiPenitip from '../components/owner/LaporanTransaksiPenitip';
import ManajemenRequestDonasi from '../components/owner/ManajemenRequestDonasi';

const OwnerDashboard = () => {
  const token = localStorage.getItem('token');
  const [requests, setRequests] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedMenu, setSelectedMenu] = useState('laporan-kategori');
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  const getRequests = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/request-donasi', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (err) {
      console.error('Gagal ambil request:', err);
      setMessage('Gagal mengambil data request donasi');
    }
  };

  const getDonatableItems = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/barang-donasi', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(res.data.filter(item => item.status === 'barang untuk donasi'));
    } catch (err) {
      console.error('Gagal ambil barang:', err);
      setMessage('Gagal mengambil data barang donasi');
    }
  };

  const handleAccept = (requestId) => {
    localStorage.setItem('selectedRequestId', requestId);
    window.location.href = `/donasi/${requestId}`;
  };

  const handleReject = async (requestId) => {
    try {
      await axios.delete(`http://localhost:8000/api/request-donasi/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('❌ Request ditolak dan dihapus');
      getRequests();
    } catch (err) {
      setMessage('Gagal menolak request');
    }
  };

  const handleShowItem = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleSendItem = () => {
    localStorage.setItem('selectedItemId', selectedItem.id);
    window.location.href = `/form-donasi/${selectedItem.id}`;
  };

  const renderMenuItem = (key, icon, label) => (
    <Nav.Link
      onClick={() => setSelectedMenu(key)}
      className={`py-2 px-3 mb-2 rounded d-flex align-items-center transition 
        ${selectedMenu === key ? 'bg-white text-dark border-start border-4 border-primary shadow-sm' : 'text-dark bg-light'} 
        hover-shadow`}
      style={{ fontWeight: 500, fontSize: '0.95rem', cursor: 'pointer' }}
    >
      <span className="me-2">{icon}</span>
      {label}
    </Nav.Link>
  );

  const renderContent = () => {
    switch (selectedMenu) {
      case 'laporan-kategori':
        return <LaporanKategori setToast={setToast} />;
      case 'laporan-habis':
        return <LaporanPenitipanHabis />;
      case 'donasi_barang':
        return <LaporanDonasiBarang />;
      case 'request_barang':
        return <LaporanRequestDonasi />;
      case 'transaksi_penitip':
        return <LaporanTransaksiPenitip />;
      case 'manajemen_request':
        return <ManajemenRequestDonasi />;
      case 'request_donasi':
        return (
          <>
            <h5 className="mb-3">Permintaan Donasi dari Organisasi</h5>
            <Table bordered hover style={{ marginLeft: '0' }}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Request</th>
                  <th>Kategori</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, index) => (
                  <tr key={req.idReqDonasi}>
                    <td>{index + 1}</td>
                    <td>{req.namaReqDonasi}</td>
                    <td>{req.kategoriReqDonasi}</td>
                    <td>
                      <Button size="sm" variant="success" onClick={() => handleAccept(req.idReqDonasi)}>Acc</Button>{' '}
                      <Button size="sm" variant="danger" onClick={() => handleReject(req.idReqDonasi)}>Tolak</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <h5 className="mt-4 mb-3">Barang Tersedia untuk Donasi</h5>
            <Row>
              {items.map(item => (
                <Col md={4} key={item.id} className="mb-4">
                  <Card onClick={() => handleShowItem(item)} style={{ cursor: 'pointer', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <Card.Img variant="top" src={`http://localhost:8000/storage/${item.thumbnail}`} />
                    <Card.Body>
                      <Card.Title>{item.namaBarang}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        );
      default:
        return <p className="text-muted">Pilih menu di sidebar.</p>;
    }
  };

  useEffect(() => {
    getRequests();
    getDonatableItems();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="bg-gradient" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)' }}>
      <Container fluid className="px-0">
        <Row className="g-0">
          {/* SIDEBAR */}
          <Col md={2} className="bg-white border-end shadow-sm min-vh-100 p-3">
            <div className="text-center mb-3">
              <h6 className="text-success fw-bold">ReUseMart</h6>
            </div>
            <h6 className="text-primary mb-3">📋 Menu Owner</h6>
            <Nav className="flex-column">
              {renderMenuItem('laporan-kategori', <BarChart size={18} />, 'Laporan per Kategori')}
              {renderMenuItem('laporan-habis', <CalendarX size={18} />, 'Laporan Penitipan Habis')}
              {renderMenuItem('donasi_barang', <BarChart size={18} />, 'Laporan Donasi Barang')}
              {renderMenuItem('request_barang', <CalendarX size={18} />, 'Laporan Request Donasi')}
              {renderMenuItem('transaksi_penitip', <CalendarX size={18} />, 'Laporan Transaksi Penitip')}
              {renderMenuItem('manajemen_request', <BarChart size={18} />, 'Manajemen Request Donasi')}
              {renderMenuItem('request_donasi', <BarChart size={18} />, 'Request Donasi')}
              <Nav.Link
                as={Link}
                to="/laporan-penjualan-bulanan"
                className="py-2 px-3 mb-2 rounded d-flex align-items-center transition text-dark bg-light hover-shadow"
                style={{ fontWeight: 500, fontSize: '0.95rem' }}
              >
                <span className="me-2"><BarChart size={18} /></span>
                Laporan Penjualan Bulanan
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/laporan-komisi-bulanan"
                className="py-2 px-3 mb-2 rounded d-flex align-items-center transition text-dark bg-light hover-shadow"
                style={{ fontWeight: 500, fontSize: '0.95rem' }}
              >
                <span className="me-2"><BarChart size={18} /></span>
                Laporan Komisi Bulanan
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/laporan-stok-gudang"
                className="py-2 px-3 mb-2 rounded d-flex align-items-center transition text-dark bg-light hover-shadow"
                style={{ fontWeight: 500, fontSize: '0.95rem' }}
              >
                <span className="me-2"><BarChart size={18} /></span>
                Laporan Stok Gudang
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/claim-report"
                className="py-2 px-3 mb-2 rounded d-flex align-items-center transition text-dark bg-light hover-shadow"
                style={{ fontWeight: 500, fontSize: '0.95rem' }}
              >
                <span className="me-2"><BarChart size={18} /></span>
                Laporan Klaim Merchandise
              </Nav.Link>
            </Nav>
          </Col>

          {/* MAIN CONTENT */}
          <Col md={10} className="p-4 bg-light min-vh-100">
            <h3 className="fw-bold mb-4 border-bottom pb-2">
              {selectedMenu === 'laporan-kategori' && '📊 Laporan Penjualan per Kategori'}
              {selectedMenu === 'laporan-habis' && '📉 Laporan Penitipan Sudah Habis'}
              {selectedMenu === 'donasi_barang' && '📊 Laporan Donasi Barang'}
              {selectedMenu === 'request_barang' && '📉 Laporan Request Donasi'}
              {selectedMenu === 'transaksi_penitip' && '📊 Laporan Transaksi Penitip'}
              {selectedMenu === 'manajemen_request' && '📋 Manajemen Permintaan Donasi'}
              {selectedMenu === 'request_donasi' && '📋 Permintaan Donasi dari Organisasi'}
            </h3>
            {message && <Alert variant={message.includes('❌') ? 'danger' : 'success'}>{message}</Alert>}
            {renderContent()}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Detail Barang</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedItem && (
                  <>
                    <img
                      src={`http://localhost:8000/storage/${selectedItem.thumbnail}`}
                      alt="Barang"
                      className="img-fluid mb-3"
                    />
                    <p><strong>Nama:</strong> {selectedItem.namaBarang}</p>
                    <p><strong>Deskripsi:</strong> {selectedItem.deskripsi}</p>
                    <p><strong>Status:</strong> {selectedItem.status}</p>
                  </>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>Tutup</Button>
                <Button variant="primary" onClick={handleSendItem}>Kirim untuk Donasi</Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>

        {/* TOAST */}
        <ToastContainer position="bottom-end" className="p-3">
          <Toast
            bg={toast.variant}
            show={toast.show}
            onClose={() => setToast({ ...toast, show: false })}
            delay={3000}
            autohide
          >
            <Toast.Body className="text-white">{toast.message}</Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    </div>
  );
};

export default OwnerDashboard;