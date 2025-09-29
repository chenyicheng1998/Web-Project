import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import sKaupatLogo from '../../assets/markets/S-Kaupat.png';

function FishSauceDetail() {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Fish Sauce 商品信息
  const fishSauceData = {
    name: "Santa Maria Fish Sauce 200ml",
    price: 2.25,
    unit: "200ml",
    image: "/assets/Fish sauce.png",
    description: "This classic fish sauce is an essential condiment in Southeast Asian cuisine. Made from fermented fish, it adds a unique umami flavor to dishes like pho, pad thai, and other traditional recipes. Perfect for authentic Vietnamese cooking.",
    sKaupatUrl: "https://www.s-kaupat.fi/tuote/santa-maria-kalakastike-200-ml/7311310035280"
  };

  // 处理数量变化
  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  // 处理直接输入数量
  const handleQuantityInput = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };

  // 添加到购物车（目前只是模拟功能）
  const handleAddToCart = () => {
    setIsAddingToCart(true);
    
    // 模拟添加过程
    setTimeout(() => {
      alert(`Successfully added ${quantity} ${fishSauceData.unit} of ${fishSauceData.name} to cart!`);
      setIsAddingToCart(false);
    }, 1000);
  };

  // 跳转到S-Kaupat超市
  const handleSKaupatClick = () => {
    window.open(fishSauceData.sKaupatUrl, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* 面包屑导航 */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link to="/recipes" className="hover:text-orange-500 transition-colors">Recipes</Link>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link to="/recipes" className="hover:text-orange-500 transition-colors">Vietnamese Beef Pho</Link>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-800 font-medium">Fish Sauce</span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧 - 商品图片 */}
          <div className="aspect-square">
            <img
              src={fishSauceData.image}
              alt={fishSauceData.name}
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* 右侧 - 商品信息 */}
          <div className="flex flex-col justify-start space-y-6">
            {/* 商品标题 */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-3">{fishSauceData.name}</h1>
            </div>

            {/* 价格与单位 */}
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-green-600">
                  €{fishSauceData.price.toFixed(2)}
                </span>
                <span className="text-lg text-gray-600">/{fishSauceData.unit}</span>
              </div>
            </div>

            {/* 商品描述 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Product Description</h3>
              <p className="text-gray-600 leading-relaxed">{fishSauceData.description}</p>
            </div>

            {/* 数量选择器 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>

                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityInput}
                    step="1"
                    min="1"
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <span className="text-gray-600">{fishSauceData.unit}</span>
                </div>

                <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>

              {/* 总价显示 */}
              <div className="mt-3">
                <span className="text-sm text-gray-600">
                  Total: <span className="font-semibold text-gray-800">€{(quantity * fishSauceData.price).toFixed(2)}</span>
                </span>
              </div>
            </div>

            {/* 按钮组 */}
            <div className="space-y-3">
              {/* 添加到购物车按钮 */}
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isAddingToCart ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Adding to Cart...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0V9" />
                    </svg>
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              {/* S-Kaupat超市购买按钮 - 优化尺寸和样式 */}
              <button
                onClick={handleSKaupatClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm"
              >
                <img 
                  src={sKaupatLogo} 
                  alt="S-Kaupat" 
                  className="w-5 h-5 object-contain"
                />
                <span>Buy at S-Kaupat</span>
              </button>
            </div>
          </div>
        </div>

        {/* 返回按钮 */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/recipes')}
            className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            Back to Recipes
          </button>
        </div>
      </div>
    </div>
  );
}

export default FishSauceDetail;
