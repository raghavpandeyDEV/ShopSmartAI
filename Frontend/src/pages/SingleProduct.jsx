import BreadCrums from "@/components/BreadCrums";
import ProductImg from "@/components/ProductImg";
import ProductDesc from "@/components/ProductDesc";
import RecommendedProducts from "@/components/RecommendationPage";
import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const SingleProduct = () => {
  const { id: productId } = useParams();

  const { products } = useSelector(
    (store) => store.product
  );

  const product = products.find(
    (item) => item._id === productId
  );

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (!product) {
    return (
      <div className="pt-30 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="pt-30 py-10 max-w-7xl mx-auto">
      <BreadCrums />

      {/* Product Section */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 items-start gap-10">
        <ProductImg
          key={productId}
          images={product.productImg}
        />

        <ProductDesc product={product} />
      </div>

      {/* AI Recommendations */}
      {user?._id && (
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6">
            You Might Also Like
          </h2>

          <RecommendedProducts
            userId={user._id}
          />
        </div>
      )}
    </div>
  );
};

export default SingleProduct;