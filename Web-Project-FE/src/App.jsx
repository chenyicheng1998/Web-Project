import React, { useState, useEffect } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./components/HomeManager/Home.jsx";
import NotFound from "./components/NotFound.jsx";
import Login from "./components/LoginManager/LogIn.jsx";
import Signin from "./components/LoginManager/SignIn.jsx";
import Recipes from "./components/RecipeManager/Recipes.jsx";
import RecipeDetail from './components/RecipeManager/RecipeDetail.jsx';
import Ingredient from './components/IngredientManager/Ingredient.jsx';
import FishSauceDetail from './components/IngredientManager/FishSauceDetail.jsx';
import About from './components/About.jsx';
import Cart from './components/CartManager/Cart.jsx';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signin" element={<Signin />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="recipes/:id" element={<RecipeDetail />} />
          <Route path="ingredient/:id" element={<Ingredient />} />
          <Route path="fish-sauce" element={<FishSauceDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App
