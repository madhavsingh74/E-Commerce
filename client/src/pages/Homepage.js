import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { useAuth } from '../context/auth';
import axios from "axios";
import toast from "react-hot-toast";
import { Checkbox, Radio } from "antd";
import { Prices } from '../components/Prices';
import { AiOutlineReload } from "react-icons/ai";
import "../styles/Homepage.css";
import { useCart } from "../context/cart";


const Homepage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [auth,setAuth]=useAuth()
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  //slider






  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
    
  }, []);

  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/prodyct/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   if (page === 1) return;
  //   loadMore();
  // }, [page]);

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/prodyct/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);
  //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/prodyct/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };


  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };
  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);
  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/prodyct/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };
 ///slider
 

  

  return (
    <Layout title={"ALl Products - Best offers "}>
       <div className='bg-image hover-zoom' >
       <img
        src="/images/fashion.jpg"
        className="banner-img"
        alt="bannerimage"
        width={"100%"}
       
      />
     </div>
    
      
     
  

      <div className="row mt-3">
      <div className="col-md-3 ">
      <h4 className="text-center">Filter By Category</h4>
      <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>
      </div>
        
          <div className="col-md-9 ">
          
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap">
          {products?.map((p) => (
             
                <div className="card m-2" style={{ width: "18rem" }}>
                  <img
                    src={`/api/v1/prodyct/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">{p.description.substring(0, 60)}</p>
                    <p className="card-text">$ {p.price}</p>
                    <button
                      className="btn btn-info ms-1"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button
                      className="btn btn-dark ms-1"
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p])
                        );
                        toast.success("Item Added to cart");
                      }}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
             
            ))}
          </div>
          <div>
          <div className="m-2 p-3">
          {products && products.length < total && (
              <button
                className="btn loadmore"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? (
                  "Loading ..."
                ) : (
                  <>
                    {" "}
                    Loadmore <AiOutlineReload />
                  </>
                )}
              </button>
            )}
          </div>
          </div>
         </div>
         </div>
  
    </Layout>
  )
}

export default Homepage

