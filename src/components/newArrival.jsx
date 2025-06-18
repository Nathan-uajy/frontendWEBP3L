import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from './productCard';

const NewArrivalSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/api/produk')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error fetching produk:', err);
        setLoading(false);
      });
  }, []);

  const handleCardClick = (product) => {
    navigate(`/detailProduk/${product.idProduk}`); // Pastikan idProduk sesuai dengan key dari backend
  };

  return (
    <section className="py-5 bg-white">
      <Container fluid className="px-4 px-md-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold">NEW ARRIVAL</h4>
          <a href="#" className="text-decoration-none fw-semibold small">View All</a>
        </div>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p>Memuat produk terbaru...</p>
          </div>
        ) : (
          <Row xs={1} sm={2} md={3} lg={5} className="g-4">
            {products.map((product, idx) => (
              <Col key={idx} onClick={() => handleCardClick(product)} style={{ cursor: 'pointer' }}>
                <ProductCard
                  image={product.gambar_url}
                  title={product.namaProduk}
                  price={product.harga}
                  discount={null}
                  status={product.status}
                />
                <small className="text-muted d-block mt-2">
                  {product.diskusis?.length
                    ? `${product.diskusis.length} Diskusi`
                    : 'Belum ada diskusi'}
                </small>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </section>
  );
};

export default NewArrivalSection;
