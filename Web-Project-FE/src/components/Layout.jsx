import { Outlet, Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext.jsx";


const Layout = () => {
  const { user, logout } = useContext(UserContext);

  // useEffect(() => {
  //   console.log('User updated:', user);
  // }, [user]);

  const handleLogout = () => {
    logout();
    window.location.href = '/login'; // 跳转登录页
  };
  console.log('User object:', user);

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo和品牌名称 */}
          <div className="flex items-center">
            {/* <img src={logo} alt="Cook Ease Logo" className="h-10 mr-3" /> */}
            <Link to="/" className="text-2xl font-bold text-orange-500 hover:text-orange-600 transition duration-200">
              CookEase
            </Link>
          </div>

          {/* 主导航链接 */}
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="text-gray-700 hover:text-orange-500 transition duration-200">Home</Link>
            </li>
            <li>
              <Link to="/recipes" className="text-gray-700 hover:text-orange-500 transition duration-200">Recipes</Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-700 hover:text-orange-500 transition duration-200">About</Link>
            </li>
            {user && (
              <li>
                <Link to="/cart" className="text-gray-700 hover:text-orange-500 transition duration-200">Cart</Link>
              </li>
            )}
          </ul>

          {/* 次要导航链接 */}
          <ul className="flex space-x-4">
            {user ? (
              <>
                <li className="flex items-center text-gray-700 px-3 py-2">Hi, {user.username}</li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition duration-200"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition duration-200"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>


      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>


      <footer className="bg-gray-800 text-white mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* 品牌信息 */}
            <div>
              <h2 className="text-2xl font-bold text-orange-400 mb-4">Cook Ease</h2>
              <h3 className="text-lg font-semibold mb-2">About us</h3>
              <p className="text-gray-300 mb-4">
                CookEase aims to make cooking enjoyable, as we believe it contributes to a healthy lifestyle for individuals, communities, and the environment. Our platform connects home cooks worldwide to share recipes and culinary ideas.
              </p>
            </div>

            {/* 链接区域 */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Blog</h4>
              <div className="mb-4">
                <p className="text-gray-300 hover:text-orange-400 cursor-pointer transition duration-200">Terms & Services</p>
                <p className="text-gray-300 hover:text-orange-400 cursor-pointer transition duration-200">Privacy Policy</p>
              </div>

              {/* 社交媒体链接 */}
              <div className="flex space-x-4">
                {/* Instagram */}
                <a href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-700 hover:bg-orange-500 text-white p-2 rounded-full transition duration-200"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C8.396 0 7.826.022 6.624.072 2.607.272.273 2.606.073 6.624.022 7.826 0 8.396 0 12.017c0 3.624.022 4.194.072 5.396.2 4.017 2.534 6.351 6.552 6.551 1.202.05 1.772.072 5.396.072 3.624 0 4.194-.022 5.396-.072 4.017-.2 6.351-2.534 6.551-6.551.05-1.203.072-1.773.072-5.397 0-3.624-.022-4.194-.072-5.396C23.767 2.606 21.433.272 17.413.072 16.211.022 15.641.001 12.017.001h0zm0 2.158c3.556 0 3.977.018 5.38.066 1.294.059 1.996.274 2.464.456.619.24 1.061.527 1.527.993.466.466.753.908.993 1.527.182.468.397 1.17.456 2.464.048 1.403.066 1.824.066 5.38 0 3.556-.018 3.977-.066 5.38-.059 1.294-.274 1.996-.456 2.464-.24.619-.527 1.061-.993 1.527-.466.466-.908.753-1.527.993-.468.182-1.17.397-2.464.456-1.403.048-1.824.066-5.38.066-3.556 0-3.977-.018-5.38-.066-1.294-.059-1.996-.274-2.464-.456-.619-.24-1.061-.527-1.527-.993-.466-.466-.753-.908-.993-1.527-.182-.468-.397-1.17-.456-2.464-.048-1.403-.066-1.824-.066-5.38 0-3.556.018-3.977.066-5.38.059-1.294.274-1.996.456-2.464.24-.619.527-1.061.993-1.527.466-.466.908-.753 1.527-.993.468-.182 1.17-.397 2.464-.456 1.403-.048 1.824-.066 5.38-.066zm0 3.676c-3.707 0-6.717 3.01-6.717 6.717 0 3.707 3.01 6.717 6.717 6.717 3.707 0 6.717-3.01 6.717-6.717 0-3.707-3.01-6.717-6.717-6.717zm0 11.076c-2.409 0-4.359-1.95-4.359-4.359 0-2.409 1.95-4.359 4.359-4.359 2.409 0 4.359 1.95 4.359 4.359 0 2.409-1.95 4.359-4.359 4.359zM19.846 5.795c0 .867-.703 1.57-1.57 1.57-.867 0-1.57-.703-1.57-1.57 0-.867.703-1.57 1.57-1.57.867 0 1.57.703 1.57 1.57z" />
                  </svg>
                </a>
                {/* Facebook */}
                <a href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-700 hover:bg-orange-500 text-white p-2 rounded-full transition duration-200"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                {/* Twitter/X */}
                <a href="https://www.x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-700 hover:bg-orange-500 text-white p-2 rounded-full transition duration-200"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* 底部版权信息 */}
          <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-400">
            <p>&copy; 2025 CookEase. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Layout;
