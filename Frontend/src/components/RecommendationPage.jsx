import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SkeletonCard = () => (
  <div className="flex-shrink-0 w-48 bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-40 bg-gray-100" />
    <div className="p-3 space-y-2">
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-3 bg-gray-100 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mt-3" />
    </div>
  </div>
);

const ProductCard = ({ product }) => {
  const [imgError, setImgError] = useState(false);
  const imgSrc = !imgError && product.image ? product.image : null;
  const score = product.predictedScore?.toFixed(2);

  return (
    <Link
      to={`/products/${product.productId}`}
      className="flex-shrink-0 w-48 bg-white rounded-xl border border-gray-100
                 overflow-hidden no-underline
                 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="h-40 bg-gray-50 flex items-center justify-center overflow-hidden">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={product.productName}
            onError={() => setImgError(true)}
            className="h-full w-full object-contain p-2"
          />
        ) : (
          <span className="text-4xl text-gray-200">🛍️</span>
        )}
      </div>

      <div className="p-3">
        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
          {product.category}
        </span>
        <p className="mt-0.5 text-xs font-medium text-gray-800 leading-snug line-clamp-2 min-h-[2.5rem]">
          {product.productName}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900">
            ₹{product.productPrice?.toLocaleString("en-IN")}
          </span>
          {score && (
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-1.5 py-0.5 rounded-full">
              {score} ★
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

const RecommendedProducts = ({ userId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axios.get(
  `${import.meta.env.VITE_RECOMMENDER_URL}/recommend/${userId}`)
      .then((res) => {
        setProducts(res.data?.recommendations ?? []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [userId]);

  if (error) return null;

  return (
    <div className="overflow-x-auto pb-2 -mx-1 px-1">
      <div className="flex gap-3 w-max">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          : products.map((p) => (
              <ProductCard key={p.productId} product={p} />
            ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;