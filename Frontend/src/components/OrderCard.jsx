import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderCard = ({ userOrder }) => {
  const navigate = useNavigate();

  return (
    
    <div className="py-10 pr-20 px-6 flex flex-col gap-3">
      <div className="w-full">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft />
          </Button>
          <h1 className="text-2xl font-bold">Orders</h1>
        </div>

        {userOrder?.length === 0 ? (
          <p className="text-gray-800 text-2xl">No Orders found for this user</p>
        ) : (
          <div className="space-y-6 w-full">
            {userOrder?.map((order) => (
              <div
                key={order._id}
                className="shadow-lg rounded-2xl p-5 border border-gray-200"
              >
                {/* Order Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    Order ID:{" "}
                    <span className="text-gray-600">{order._id}</span>
                  </h2>
                </div>

                {/* Amount */}
                <p className="text-sm text-gray-500 mb-4">
                  Amount:{" "}
                  <span className="font-bold">
                    {order.currency} {order.amount?.toFixed(2)}
                  </span>
                </p>

                {/* User Info + Status */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">User:</span>{" "}
                      {order.user?.firstName || "Unknown"} {order.user?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Email: {order.user?.email || "N/A"}
                    </p>
                  </div>

                  <span
                    className={`${
                      order.status === "Paid"
                        ? "bg-green-500"
                        : order.status === "Failed"
                        ? "bg-red-500"
                        : "bg-orange-300"
                    } text-white px-2 py-1 rounded-lg`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Products */}
                <div>
                  <h3 className="font-medium mb-2">Products:</h3>
                  <ul className="space-y-2">
                    {order.products?.map((product, index) => {
                      const p = product?.productId;
                      if (!p) return null;
                      return (
                        <li
                          key={index}
                          className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              onClick={() => navigate(`/products/${p._id}`)}
                              className="w-16 h-16 cursor-pointer object-cover rounded"
                              src={p.productImg?.[0]?.url || "/placeholder.png"}
                              alt={p.productName || "product"}
                            />
                            <div>
                              <span className="w-[300px] line-clamp-2 block">
                                {p.productName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {p._id}
                              </span>
                            </div>
                          </div>
                          <span className="font-medium">
                            ₹{p.productPrice} x {product?.quantity}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;