import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { HiArrowCircleLeft } from "react-icons/hi";

import ProductForm from "../../../components/admin/ProductForm/ProductForm";

import {
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} from "../../../services/productService";
import toast from "react-hot-toast";



const AdminProducts = () => {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const [selectedProduct, setSelectedProduct] = useState(null);

    const [showForm, setShowForm] = useState(false);

    const [loading, setLoading] = useState(false);

    const [fetching, setFetching] = useState(false);



    // LOAD PRODUCTS


    const loadProducts = async () => {

        try {

            setFetching(true);

            const res =
                await getProduct();

            setProducts(
                res?.data?.products || []
            );

        } catch (error) {

            console.error(
                "Failed to fetch products:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to load products."
            );

        } finally {

            setFetching(false);

        }

    };


    useEffect(() => {

        loadProducts();

    }, []);



    // ADD PRODUCT


    const handleAdd = () => {

        setSelectedProduct(null);

        setShowForm(true);

    };



    // EDIT PRODUCT


    const handleEdit = (product) => {

        setSelectedProduct(product);

        setShowForm(true);

    };

    // DELETE PRODUCT   

    const handleDelete = async (productId) => {
       alert("Are you sure you want to delete this product?");
       await deleteProduct(productId);
       tast.success("Product deleted successfully!");
       await loadProducts();
    }


    // FORM SUBMIT


    const handleSubmit = async (data) => {

        try {

            setLoading(true);


            const formData =
                new FormData();



            // BASIC FIELDS


            formData.append(
                "name",
                data.name
            );

            formData.append(
                "category",
                data.category
            );

            formData.append(
                "type",
                data.type || ""
            );

            formData.append(
                "description",
                data.description || ""
            );

            formData.append(
                "defaultOnlinePrice",
                data.defaultOnlinePrice
            );

            formData.append(
                "unit",
                data.unit
            );

            formData.append(
                "isListedOnline",
                data.isListedOnline
            );

            formData.append(
                "isFeatured",
                data.isFeatured
            );

            formData.append(
                "displayOrder",
                data.displayOrder
            );

            formData.append(
                "isSeasonal",
                data.isSeasonal
            );

            formData.append(
                "season",
                data.isSeasonal
                    ? data.season
                    : ""
            );

            formData.append(
                "isActive",
                data.isActive
            );



            // IMAGE


            if (data.image) {

                formData.append(
                    "image",
                    data.image
                );

            }

            // CREATE / UPDATE
            if (selectedProduct) {

                await updateProduct(
                    selectedProduct._id,
                    formData
                );

                toast.success(
                    "Product updated successfully!"
                );

            } else {

                await createProduct(
                    formData
                );

                toast.success(
                    "Product created successfully!"
                );

            }


            setShowForm(false);

            setSelectedProduct(null);

            await loadProducts();


        } catch (error) {

            console.error(
                "Product save error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to save product."
            );

        } finally {

            setLoading(false);

        }

    };

    const totalProducts = products.length;


    // FORM VIEW


    if (showForm) {

        return (

            <div className="container-fluid py-4">

                    <Button className="btn btn-light" onClick={() => navigate(-1)}>
                        <HiArrowCircleLeft /> Back
                    </Button>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>

                        <h3 className="fw-bold mb-1">

                            {selectedProduct
                                ? "Edit Product"
                                : "Add New Product"
                            }

                        </h3>

                        <p className="text-muted mb-0">

                            {selectedProduct
                                ? "Update product information."
                                : "Create a new product for your customers."
                            }

                        </p>
                    </div>

                </div>


                <ProductForm

                    product={
                        selectedProduct
                    }

                    onSubmit={
                        handleSubmit
                    }

                    onCancel={() => {

                        setShowForm(false);

                        setSelectedProduct(null);

                    }}

                    loading={
                        loading
                    }

                />

            </div>

        );

    }



    // PRODUCT LIST


    return (

        <div className="container-fluid py-4">


            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <Button variant="light" onClick={() => navigate(-1)} className="me-3">
                        <HiArrowCircleLeft /> Back
                    </Button>

                    <h3 className="fw-bold mb-1">
                        Products
                    </h3>

                    <p className="text-muted mb-0">
                        Manage products available to customers.
                    </p>
                    <i className="text-muted mb-0" >
                        Total Products: {totalProducts}
                    </i>
                </div>


                <button
                    className="btn btn-dark"
                    onClick={
                        handleAdd
                    }
                >
                    + Add Product
                </button>

            </div>


            {/*   
                LOADING
               */}

            {fetching ? (

                <div className="text-center py-5">

                    <div className="spinner-border" />

                </div>

            ) : products.length === 0 ? (

                <div className="card border-0 shadow-sm">

                    <div className="card-body text-center py-5">

                        <h5>
                            No products found
                        </h5>

                        <p className="text-muted">
                            Start by adding your first product.
                        </p>

                        <button
                            className="btn btn-dark"
                            onClick={
                                handleAdd
                            }
                        >
                            + Add Product
                        </button>

                    </div>

                </div>

            ) : (

                <div className="row g-4">

                    {products.map(product => (

                        <div
                            className="col-xl-3 col-lg-4 col-md-6"
                            key={
                                product._id
                            }
                        >

                            <div className="card h-100 border-0 shadow-sm">


                                {/* IMAGE */}

                                <div
                                    style={{
                                        height: "220px",
                                        overflow: "hidden"
                                    }}
                                >

                                    {product.image?.url ? (

                                        <img
                                            src={
                                                product.image.url
                                            }
                                            alt={
                                                product.name
                                            }
                                            className="w-100 h-100"
                                            style={{
                                                objectFit:
                                                    "cover"
                                            }}
                                        />

                                    ) : (

                                        <div className="bg-light h-100 d-flex align-items-center justify-content-center">

                                            <span className="text-muted">
                                                No Image
                                            </span>

                                        </div>

                                    )}

                                </div>


                                {/* BODY */}

                                <div className="card-body">


                                    <div className="d-flex justify-content-between align-items-start">

                                        <div>

                                            <h5 className="fw-semibold mb-1">
                                                {
                                                    product.name
                                                }
                                            </h5>

                                            <small className="text-muted">
                                                {
                                                    product.category
                                                }

                                                {product.type &&
                                                    ` • ${product.type}`
                                                }
                                            </small>

                                        </div>


                                        {product.isFeatured && (

                                            <span className="badge bg-warning text-dark">
                                                Featured
                                            </span>

                                        )}

                                    </div>


                                    <div className="mt-3">

                                        <span className="fs-5 fw-bold">

                                            ₹
                                            {
                                                product.defaultOnlinePrice
                                            }

                                        </span>

                                        <span className="text-muted ms-1">


                                            {
                                                product.unit
                                            }

                                        </span>

                                    </div>


                                    <div className="mt-3 d-flex flex-wrap gap-2">

                                        {product.isListedOnline ? (

                                            <span className="badge bg-success">
                                                Online
                                            </span>

                                        ) : (

                                            <span className="badge bg-secondary">
                                                Hidden
                                            </span>

                                        )}


                                        {product.isSeasonal && (

                                            <span className="badge bg-info text-dark">

                                                {
                                                    product.season ||
                                                    "Seasonal"
                                                }

                                            </span>

                                        )}


                                        {!product.isActive && (

                                            <span className="badge bg-danger">
                                                Inactive
                                            </span>

                                        )}

                                    </div>

                                </div>


                                {/* FOOTER */}

                                <div className="card-footer bg-white border-0 p-3">

                                    <button
                                        className="btn btn-outline-dark w-100"
                                        onClick={() =>
                                            handleEdit(
                                                product
                                            )
                                        }
                                    >
                                        Edit Product
                                    </button>
                                    <hr style={{
                                        border: "none",
                                        height: "3px",
                                        background: "linear-gradient(to right, transparent, #2731a2, transparent)",
                                        boxShadow: "0 5px 15px #cf350e",
                                        
                                    }} />

                                    <button
                                        className="btn btn-outline-danger w-100"
                                        onClick={() => handleDelete(product._id)}
                                    >
                                        Delete Product
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

};

export default AdminProducts;