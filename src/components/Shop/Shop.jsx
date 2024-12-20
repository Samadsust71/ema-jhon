import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link, useLoaderData } from 'react-router-dom';

const Shop = () => {
    
    const cartItems =  useLoaderData()
    
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState(cartItems)
    const[count,setCount]=useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(9)
    const[pageNo, setPageaNo] = useState(0)
    const totalPages = Math.ceil(count/itemsPerPage)
    

    const pages = [...Array(totalPages).keys()]
   
    useEffect(()=>{
        fetch("http://localhost:5000/productsCount")
        .then(res=>res.json())
        .then(data=>setCount(data.count))
    },[])

    useEffect(() => {
        fetch(`http://localhost:5000/products?page=${pageNo}&size=${itemsPerPage}`)
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [pageNo,itemsPerPage]);

    // useEffect(() => {
    //     const storedCart = getShoppingCart();
    //     const savedCart = [];
    //     // step 1: get id of the addedProduct
    //     for (const id in storedCart) {
    //         // step 2: get product from products state by using id
    //         const addedProduct = products.find(product => product._id === id)
    //         if (addedProduct) {
    //             // step 3: add quantity
    //             const quantity = storedCart[id];
    //             addedProduct.quantity = quantity;
    //             // step 4: add the added product to the saved cart
    //             savedCart.push(addedProduct);
    //         }
    //         
    //     }
    //     // step 5: set the cart
    //     setCart(savedCart);
    // }, [products])

    const handleAddToCart = (product) => {
        // cart.push(product); '
        let newCart = [];
        // const newCart = [...cart, product];
        // if product doesn't exist in the cart, then set quantity = 1
        // if exist update quantity by 1
        const exists = cart.find(pd => pd._id === product._id);
        if (!exists) {
            product.quantity = 1;
            newCart = [...cart, product]
        }
        else {
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd._id !== product._id);
            newCart = [...remaining, exists];
        }

        setCart(newCart);
        addToDb(product._id)
    }

    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }

    const handlePrevPage = ()=>{
        if (pageNo >0) {
           setPageaNo(pageNo-1)
        }
    }
    const handleNextPage = ()=>{
        if (pageNo < pages.length-1) {
           setPageaNo(pageNo+1)
        }
    }
    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product
                        key={product._id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart
                    cart={cart}
                    handleClearCart={handleClearCart}
                >
                    <Link className='proceed-link' to="/orders">
                        <button className='btn-proceed'>Review Order</button>
                    </Link>
                </Cart>
            </div>
            <div className='pagination'>
                <p>{pageNo}</p>
                <button onClick={()=>handlePrevPage()}>Prev</button>
               {
                pages.map(page=><button className={page === pageNo? "active":""} onClick={()=>setPageaNo(page)} key={page}>{page}</button>)
               }
               <button onClick={()=>handleNextPage()}>Next</button>
               <select onChange={(e)=>{
                setItemsPerPage(parseInt(e.target.value))
                setPageaNo(0)
                }} className='items-per-page' defaultValue={itemsPerPage} name="pages" id="pages">
                <option value="6">6</option>
                <option value="9">9</option>
                <option value="15">15</option>
                <option value="24">24</option>
                <option value="36">36</option>
                <option value="50">50</option>
               </select>
            </div>
        </div>
    );
};

export default Shop;