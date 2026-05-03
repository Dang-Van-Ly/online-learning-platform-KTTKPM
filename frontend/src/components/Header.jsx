import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, UserCircle, LayoutDashboard } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Logo from './Logo';

const KHOKHOAHOCHeader = () => {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');

  const userName =
    user?.fullName ||
    user?.name ||
    user?.username ||
    user?.email ||
    'Tài khoản';

  const userInitial = userName.trim().charAt(0).toUpperCase();

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const handlePriceNavigation = (priceFilter) => {
    navigate(`/search?price=${priceFilter}`);
  };

  return (
    <header className="w-full font-sans bg-white shadow-[0_1px_5px_rgba(0,0,0,0.1)]">
      <div className="bg-[#b31c1c] text-white py-1.5 px-5 flex items-center justify-center gap-3 text-xs">
        <span>💥 <b>DEAL GIÁ HỜI HÔM NAY - GIẢM CỰC SÂU</b></span>
        <div className="flex items-center">
          Chỉ còn: <span className="bg-black/30 py-0.5 px-2 rounded-md font-mono text-[13px] font-bold mx-1.5">09:21:04</span>
        </div>
        <button className="bg-[#ffd700] text-[#b31c1c] py-[3px] px-3 rounded-full font-bold border-none text-[11px] cursor-pointer flex items-center gap-1">👉 NHẬN DEAL NGAY</button>
      </div>

      <div className="flex items-center justify-between py-[15px] px-5 gap-4 max-w-[1280px] mx-auto">
        <div className="flex-1 flex justify-start">
          <Logo />
        </div>

        <form className="w-full max-w-[450px] mx-4 shrink flex h-[36px] border-[1.5px] border-blue-500 rounded-lg overflow-hidden" onSubmit={handleSearch}>
          <input
            className="flex-1 border-none px-3 outline-none text-[13px]"
            placeholder="Nhập tên khóa học hoặc giảng viên..."
            value={searchQuery}
            onChange={(e)=>setSearchQuery(e.target.value)}
          />

          <button className="bg-blue-500 border-none text-white w-[45px] cursor-pointer flex items-center justify-center" type="submit">
            <Search size={16}/>
          </button>
        </form>

        <div className="flex-1 flex justify-end gap-2.5 items-center">
          {user && user.role === 'INSTRUCTOR' && (
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white border-none px-4 h-[36px] rounded-lg font-bold text-[13px] flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-md transition-all duration-200 hover:-translate-y-[1px]"
              onClick={()=>navigate('/instructor')}
            >
              <LayoutDashboard size={16} />
              Quản lý khóa học
            </button>
          )}

          {user ? (
            <button
              className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 h-[36px] rounded-full text-[13px] font-medium flex items-center gap-2.5 cursor-pointer shadow-sm whitespace-nowrap transition-all duration-200"
              onClick={()=>navigate('/profile')}
            >
              <span className="w-[26px] h-[26px] rounded-full bg-blue-500 text-white grid place-items-center text-xs font-bold">{userInitial}</span>
              <span>{userName}</span>
            </button>
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white border-none px-4 h-[36px] rounded-lg font-semibold text-[13px] flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-sm transition-colors duration-200"
              onClick={()=>navigate('/login')}
            >
              <UserCircle size={18}/>
              ĐĂNG NHẬP
            </button>
          )}

          <button className="bg-white hover:bg-gray-50 hover:text-blue-600 hover:border-blue-400 border border-gray-300 px-4 h-[36px] rounded-lg text-[13px] font-semibold flex items-center gap-2 cursor-pointer text-gray-700 whitespace-nowrap shadow-sm transition-all duration-200">
            <ShoppingCart size={18}/>
            Giỏ hàng 
          </button>
        </div>
      </div>

      <nav className="bg-blue-500 py-2.5 px-[5%]">
        <ul className="list-none m-0 p-0 flex justify-center gap-5 flex-wrap">
          <li
            className="text-white text-[13px] font-medium cursor-pointer flex items-center gap-1 whitespace-nowrap"
            onClick={()=>navigate('/filtered-courses')}
          >
            Khóa Học Free
          </li>

          <li className="text-white text-[13px] font-medium cursor-pointer flex items-center gap-1 whitespace-nowrap">
            Nâng Cấp Hội Viên
            <span className="bg-[#b31c1c] text-[9px] py-[1px] px-[5px] rounded-sm font-bold ml-0.5">GIẢM GIÁ</span>
          </li>

          <li className="text-white text-[13px] font-medium cursor-pointer flex items-center gap-1 whitespace-nowrap">COMBO</li>

          <li
            className="text-white text-[13px] font-medium cursor-pointer flex items-center gap-1 whitespace-nowrap"
            onClick={()=>handlePriceNavigation('under100k')}
          >
            Khóa học dưới 100k
          </li>

          <li
            className="text-white text-[13px] font-medium cursor-pointer flex items-center gap-1 whitespace-nowrap"
            onClick={()=>handlePriceNavigation('under150k')}
          >
            Khóa học dưới 150k
          </li>

          <li
            className="text-white text-[13px] font-medium cursor-pointer flex items-center gap-1 whitespace-nowrap"
            onClick={()=>handlePriceNavigation('under500k')}
          >
            Khóa học dưới 500k
          </li>

          <li className="text-white text-[13px] font-medium cursor-pointer flex items-center gap-1 whitespace-nowrap">Hướng dẫn</li>
          <li className="text-white text-[13px] font-medium cursor-pointer flex items-center gap-1 whitespace-nowrap">Blog</li>
        </ul>
      </nav>
    </header>
  );
};

export default KHOKHOAHOCHeader;