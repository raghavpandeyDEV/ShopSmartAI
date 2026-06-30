from flask import Flask, jsonify
from pymongo import MongoClient
from bson import ObjectId
from bson.errors import InvalidId
import pandas as pd
from surprise import SVD, Dataset, Reader
from surprise.model_selection import train_test_split
from surprise import accuracy
import joblib
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

MONGO_URI = os.environ.get("MONGO_URI")
DB_NAME = "test"
MODEL_PATH = "svd_model.pkl"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]


def get_orders_dataframe():
    orders = list(db.orders.find({"status": "Paid"}, {"user": 1, "products": 1}))
    rows = []
    for order in orders:
        user_id = str(order["user"])
        for item in order["products"]:
            product_id = str(item["productId"])
            quantity = item.get("quantity", 1)
            rating = min(quantity, 5)
            rows.append((user_id, product_id, rating))

    df = pd.DataFrame(rows, columns=["user_id", "product_id", "rating"])
    df = df.groupby(["user_id", "product_id"], as_index=False)["rating"].sum()
    df["rating"] = df["rating"].clip(upper=5)
    return df


def train_model():
    print("🔄 Training SVD model...")
    df = get_orders_dataframe()

    if len(df) < 50:
        print("⚠️  Not enough order data to train. Run seed.py first.")
        return None

    reader = Reader(rating_scale=(1, 5))
    data = Dataset.load_from_df(df[["user_id", "product_id", "rating"]], reader)

    trainset, testset = train_test_split(data, test_size=0.2)
    algo = SVD(n_factors=50, n_epochs=20, lr_all=0.005, reg_all=0.02)
    algo.fit(trainset)

    predictions = algo.test(testset)
    rmse = accuracy.rmse(predictions)
    print(f"✅ Model trained | RMSE: {rmse:.4f}")

    joblib.dump(algo, MODEL_PATH)
    print(f"✅ Model saved to {MODEL_PATH}")
    return algo


def load_model():
    if os.path.exists(MODEL_PATH):
        print("✅ Loaded existing model")
        return joblib.load(MODEL_PATH)
    return train_model()


model = load_model()


@app.route("/recommend/<user_id>", methods=["GET"])
def recommend(user_id):
    if model is None:
        return jsonify({"error": "Model not trained yet"}), 500

    try:
        try:
            user_object_id = ObjectId(user_id)
        except InvalidId:
            return jsonify({"error": "Invalid user id"}), 400

        all_products = list(db.products.find({}))
        all_product_ids = [str(p["_id"]) for p in all_products]

        user_orders = list(db.orders.find({"user": user_object_id, "status": "Paid"}))
        already_bought = set()
        for order in user_orders:
            for item in order["products"]:
                already_bought.add(str(item["productId"]))

        predictions = []
        for product_id in all_product_ids:
            if product_id not in already_bought:
                pred = model.predict(user_id, product_id)
                predictions.append({
                    "productId": product_id,
                    "score": round(pred.est, 3)
                })

        predictions.sort(key=lambda x: x["score"], reverse=True)
        top_predictions = predictions[:8]

        recommendations = []
        for pred in top_predictions:
            product = db.products.find_one({"_id": ObjectId(pred["productId"])})
            if not product:
                continue

            # resolve image — handles both string URLs and {url: "..."} dicts
            image = None
            if product.get("productImg"):
                first_img = product["productImg"][0]
                if isinstance(first_img, dict):
                    image = first_img.get("url")
                elif isinstance(first_img, str):
                    image = first_img

            recommendations.append({
                "productId": str(product["_id"]),
                "productName": product.get("productName"),
                "productPrice": product.get("productPrice"),
                "brand": product.get("brand"),
                "category": product.get("category"),
                "image": image,
                "predictedScore": pred["score"]
            })

        return jsonify({
            "userId": user_id,
            "totalRecommendations": len(recommendations),
            "recommendations": recommendations
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/retrain", methods=["POST"])
def retrain():
    global model
    model = train_model()
    if model:
        return jsonify({"message": "Model retrained successfully"})
    return jsonify({"error": "Not enough data"}), 400


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "modelLoaded": model is not None})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)