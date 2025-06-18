    import React, { useEffect, useState } from 'react';
    import { Container, Row, Col, Button, Table, Modal, Alert, Card } from 'react-bootstrap';
    import axios from 'axios';

    const ManajemenRequestDonasi = () => {
    const token = localStorage.getItem('token');
    const [requests, setRequests] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('');

    const getRequests = async () => {
        try {
        const res = await axios.get('http://localhost:8000/api/request-donasi', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(res.data);
        } catch (err) {
        console.error('Gagal ambil request:', err);
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
        }
    };

    const handleAccept = (requestId) => {
        localStorage.setItem('selectedRequestId', requestId);
        window.location.href = `/donasi/:reqId/:barangId`;
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
        <div>
        <h4 className="mb-3">Permintaan Donasi dari Organisasi</h4>
        {message && <Alert variant={message.includes('❌') ? 'danger' : 'success'}>{message}</Alert>}
        <Table bordered hover>
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
        </div>
    );
    };

    export default ManajemenRequestDonasi;
