import React, { useEffect, useState, useRef } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import FilterSidebar from '@/components/FilterSidebar';
import ProductCard from '@/components/ProductCard';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '@/redux/productSlice';

const Products = () => {
  const { products } = useSelector(store => store.product)
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 9999999])
  const [brand, setBrand] = useState("All")
  const [category, setCategory] = useState("All")
  const [search, setSearch] = useState("")
  const [sortOrder, setSortOrder] = useState('')

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const askAI = async () => {
    if (!question.trim()) return;

    const userMessage = { role: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    const currentQuestion = question;
    setQuestion("");

    try {
      setLoading(true);
      const { data } =await axios.post(`${import.meta.env.VITE_URL}/api/v1/assistant`, {
        question: currentQuestion,
      });
      setMessages((prev) => [...prev, { role: "assistant", text: data.answer }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", text: "Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  const dispatch = useDispatch();

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/product/getallproducts`)
      if (res.data.success) {
        setAllProducts(res.data.products)
        dispatch(setProducts(res.data.products))
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (allProducts.length == 0) return;
    let filtered = [...allProducts]
    if (search.trim() !== "") {
      filtered = filtered.filter(p => p.productName?.toLowerCase().includes(search.toLowerCase()))
    }
    if (category != 'All') {
      filtered = filtered.filter(p => p.category === category)
    }
    if (brand != 'All') {
      filtered = filtered.filter(p => p.brand === brand)
    }
    filtered = filtered.filter(p => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1])
    if (sortOrder === "lowToHigh") {
      filtered.sort((a, b) => a.productPrice - b.productPrice)
    } else if (sortOrder === "highToLow") {
      filtered.sort((a, b) => b.productPrice - a.productPrice)
    }
    dispatch(setProducts(filtered))
  }, [search, category, brand, sortOrder, priceRange, allProducts, dispatch])

  useEffect(() => {
    getAllProducts()
  }, [])

  return (
    <div className="pt-30 pb-10">
      <div className="max-w-7xl mx-auto flex gap-7">

        {/* Sidebar */}
        <FilterSidebar
          allProducts={allProducts}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          category={category}
          setCategory={setCategory}
          brand={brand}
          setBrand={setBrand}
          search={search}
          setSearch={setSearch}
        />

        {/* Main product section */}
        <div className="flex flex-col flex-1">
          <div className="flex justify-end mb-4">
            <Select onValueChange={(value) => setSortOrder(value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lowToHigh">Price : Low to High</SelectItem>
                <SelectItem value="highToLow">Price : High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} loading={loading} />
            ))}
          </div>
        </div>

      </div>

      {/* Floating AI Chat Widget */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 50 }}>
        {chatOpen && (
          <div style={{
            width: '300px',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            background: 'white',
            marginBottom: '12px'
          }}>
            {/* Header */}
            <div style={{
              background: '#ec4899',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px'
                }}>🤖</div>
                <div>
                  <p style={{ color: 'white', fontWeight: 600, fontSize: '13px', margin: 0 }}>AI Assistant</p>
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '11px', margin: 0 }}>Ask me anything</p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                style={{
                  background: 'transparent', border: 'none', color: 'white',
                  fontSize: '16px', cursor: 'pointer', lineHeight: 1
                }}
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div style={{
              height: '320px',
              overflowY: 'auto',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              background: '#f9fafb'
            }}>
              {messages.length === 0 && (
                <p style={{ color: '#9ca3af', fontSize: '12px', textAlign: 'center', marginTop: '16px' }}>
                  👋 Ask about products, prices, or recommendations!
                </p>
              )}
              {messages.map((msg, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: '80%',
                    padding: '7px 10px',
                    borderRadius: msg.role === "user" ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    background: msg.role === "user" ? '#ec4899' : 'white',
                    color: msg.role === "user" ? 'white' : '#111827',
                    fontSize: '12px',
                    lineHeight: '1.5',
                    border: msg.role === "assistant" ? '1px solid #e5e7eb' : 'none',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    padding: '7px 12px', borderRadius: '12px 12px 12px 2px',
                    background: 'white', border: '1px solid #e5e7eb',
                    fontSize: '12px', color: '#9ca3af'
                  }}>
                    typing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{
              display: 'flex', gap: '6px', padding: '10px',
              borderTop: '1px solid #e5e7eb', background: 'white',
              alignItems: 'center'
            }}>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askAI()}
                placeholder="Ask about products..."
                style={{
                  flex: 1, border: '1px solid #e5e7eb', borderRadius: '20px',
                  padding: '6px 12px', fontSize: '12px', outline: 'none'
                }}
              />
              <button
                onClick={askAI}
                style={{
                  background: '#ec4899', color: 'white', border: 'none',
                  borderRadius: '50%', width: '32px', height: '32px',
                  cursor: 'pointer', fontSize: '14px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}
              >
                ➤
              </button>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: '#ec4899', color: 'white', border: 'none',
            boxShadow: '0 4px 16px rgba(236,72,153,0.4)',
            fontSize: '24px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginLeft: 'auto'
          }}
        >
          {chatOpen ? '✕' : '🤖'}
        </button>
      </div>
    </div>
  );
};

export default Products;