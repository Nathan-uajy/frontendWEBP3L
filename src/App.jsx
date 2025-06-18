import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import Banner from './components/banner';
import NewArrivalSection from './components/newArrival';

import Login from './pages/login';
import Register from './pages/register';
import Profile from './pages/profile';
import Cart from './pages/cart';
import Address from './pages/myAddress';
import AddAddress from './pages/AddAddres';
import EditAddress from './pages/EditAddres';
import ForgotPassword from './pages/ForgotPassword';
import UserForgotPassword from './pages/UserForgotPassword';
import DetailProduk from './pages/DetailProduk';
import Checkout from './pages/Checkout';
import Pembayaran from './pages/Pembayaran';
import UploadBuktiPembayaran from './pages/UploadBuktiPembayaran';
import About from './pages/about';
import History from './pages/history';

import AdminDashboard from './pages/AdminDashboard';
import CSDashboard from './pages/CSDashboard';
import PegawaiDashboard from './pages/PegawaiDashboard';
import PenitipDashboard from './pages/PenitipDashboard';
import GudangDashboard from './pages/GudangDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import OrganisasiDashboard from './pages/OrganisasiDashboard';

import FormPenitip from './pages/FormPenitip';
import DaftarPenitip from './pages/DaftarPenitip';
import FormPegawai from './pages/FormPegawai';
import Diskusi from './pages/Diskusi';

const App = () => {
  const jabatan = localStorage.getItem('jabatan');
  const isAdmin = jabatan === 'admin';

  return (
    <Router>
      {!isAdmin && <Header />}

      <Routes>
        {/* Halaman umum */}
        <Route path="/" element={<><Banner /><NewArrivalSection /></>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/myAddress" element={<Address />} />
        <Route path="/AddAddres" element={<AddAddress />} />
        <Route path="/Editaddres/:id" element={<EditAddress />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/user-forgot-password" element={<UserForgotPassword />} />
        <Route path="/detailProduk/:id" element={<DetailProduk />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pembayaran" element={<Pembayaran />} />
        <Route path="/upload/:orderId" element={<UploadBuktiPembayaran />} />
        <Route path="/about" element={<About />} />
        <Route path="/history" element={<History />} />

        {/* Role-based dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/cs" element={<CSDashboard />} />
        <Route path="/pegawai" element={<PegawaiDashboard />} />
        <Route path="/penitip" element={<PenitipDashboard />} />
        <Route path="/gudang" element={<GudangDashboard />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/organisasi" element={<OrganisasiDashboard />} />

        {/* Formulir */}
        <Route path="/tambah-penitip" element={<FormPenitip />} />
        <Route path="/daftar-penitip" element={<DaftarPenitip />} />
        <Route path="/tambah-pegawai" element={<FormPegawai />} />
        <Route path="/diskusi" element={<Diskusi />} />
      </Routes>

      {!isAdmin && <Footer />}
    </Router>
  );
};

export default App;
