# seed.py
import random
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import faker

fake = faker.Faker()

# ---- CONFIG ----
MONGO_URI = "mongodb+srv://Raghav:raghav123@e-commerce.bxu7ckl.mongodb.net/"
DB_NAME = "test"              

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# ---- STEP 1: Fetch Real Product IDs ----
def get_real_product_ids():
    products = list(db.products.find({}, {"_id": 1}))
    if len(products) < 10:
        print(f"⚠️  Only {len(products)} products found.")
        print("    Add at least 20-30 products via your admin dashboard first.")
        exit()
    print(f"✅ Found {len(products)} real products")
    return [p["_id"] for p in products]

# ---- STEP 2: Create Fake Users ----
def seed_users(n=200):
    users = []
    for _ in range(n):
        users.append({
            "_id": ObjectId(),
            "name": fake.name(),
            "email": fake.unique.email(),
            "password": "hashed_password",
            "createdAt": fake.date_time_between(start_date="-1y", end_date="now"),
            "updatedAt": datetime.now()
        })
    db.users.insert_many(users)
    print(f"✅ Inserted {n} fake users")
    return [u["_id"] for u in users]

# ---- STEP 3: Create Fake Orders using Real Product IDs ----
def seed_orders(user_ids, product_ids, orders_per_user=(3, 10)):
    orders = []

    # cluster products so purchase patterns are realistic
    # users tend to buy from same category = better SVD signal
    chunk_size = max(1, len(product_ids) // 5)
    product_clusters = [
        product_ids[i:i+chunk_size]
        for i in range(0, len(product_ids), chunk_size)
    ]

    for user_id in user_ids:
        # each user prefers 1-2 clusters
        preferred_clusters = random.sample(
            product_clusters,
            k=min(2, len(product_clusters))
        )
        preferred_products = [p for cluster in preferred_clusters for p in cluster]

        num_orders = random.randint(*orders_per_user)
        for _ in range(num_orders):
            # 70% from preferred cluster, 30% random
            pool = preferred_products if random.random() < 0.7 else product_ids

            num_products = random.randint(1, 4)
            selected = random.sample(pool, k=min(num_products, len(pool)))

            products_list = [
                {"productId": pid, "quantity": random.randint(1, 3)}
                for pid in selected
            ]

            amount = round(random.uniform(299, 15000), 2)
            tax = round(amount * 0.18, 2)
            shipping = 49 if amount < 500 else 0

            orders.append({
                "_id": ObjectId(),
                "user": user_id,
                "products": products_list,
                "amount": amount,
                "tax": tax,
                "shipping": shipping,
                "currency": "INR",
                "status": random.choices(
                    ["Paid", "Pending", "Failed"],
                    weights=[80, 15, 5]
                )[0],
                "razorpayOrderId": f"order_{fake.uuid4()[:8]}",
                "razorpayPaymentId": f"pay_{fake.uuid4()[:8]}",
                "razorpaySignature": fake.uuid4(),
                "createdAt": fake.date_time_between(start_date="-6m", end_date="now"),
                "updatedAt": datetime.now()
            })

    db.orders.insert_many(orders)
    print(f"✅ Inserted {len(orders)} orders")

# ---- RUN ----
if __name__ == "__main__":
    print("🌱 Seeding database...\n")

    product_ids = get_real_product_ids()
    user_ids = seed_users(200)
    seed_orders(user_ids, product_ids)

    print("\n✅ Done! Summary:")
    print(f"   Products: {db.products.count_documents({})} (real)")
    print(f"   Users:    {db.users.count_documents({})}")
    print(f"   Orders:   {db.orders.count_documents({})}")