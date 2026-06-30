import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const ShowUserOrders = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [userOrder, setUserOrder] = useState(null);

  const getUserOrders = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/orders/user-order/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );



      if (res.data.success) {
        setUserOrder(res.data.orders);
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (userId) getUserOrders();
  }, [userId]);

  return (
    <div className="pr-20 flex flex-col gap-3">
      <div className="w-full p-6">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft />
          </Button>
          <h1 className="text-2xl font-bold">User Orders</h1>
        </div>

        {/* Content */}
        {!userOrder ? (
          <p className="text-lg">Loading...</p>
        ) : userOrder.length === 0 ? (
          <p className="text-gray-800 text-2xl">
            No Orders found for this user
          </p>
        ) : (
          <div className="space-y-6 w-full">

            {userOrder.map((order) => (
              <div
                key={order._id}
                className="shadow-lg rounded-2xl p-5 border border-gray-200"
              >

                {/* Order ID */}
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
                      {order.user?.firstName || "Unknown"}{" "}
                      {order.user?.lastName}
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
                    {order.products?.map((product, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-3">

                          <img
                            onClick={() =>
                              navigate(`/products/${product?.productId?._id}`)
                            }
                            className="w-16 h-16 cursor-pointer object-cover rounded"
                            src={
                              product?.productId?.productImg?.[0]?.url ||
                              "/placeholder.png"
                            }
                            alt=""
                          />

                          <div>
                            <span className="w-[300px] line-clamp-2 block">
                              {product?.productId?.productName}
                            </span>

                            <span className="text-xs text-gray-500">
                              {product?.productId?._id}
                            </span>
                          </div>
                        </div>

                        <span className="font-medium">
                          ₹{product?.productId?.productPrice} x{" "}
                          {product?.quantity}
                        </span>
                      </li>
                    ))}
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

export default ShowUserOrders;