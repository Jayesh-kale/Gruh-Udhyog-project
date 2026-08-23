import React, { useEffect, useState } from "react";

const initialFormData = {
    name: "",
    category: "",
    type: "",
    description: "",
    defaultOnlinePrice: "",
    unit: "kg",

    isListedOnline: true,
    isFeatured: false,
    displayOrder: 0,

    isSeasonal: false,
    season: "",

    isActive: true,

    image: null
};


const ProductForm = ({
    product = null,
    onSubmit,
    onCancel,
    loading = false
}) => {

    const [formData, setFormData] = useState(initialFormData);

    const [preview, setPreview] = useState("");

    // EDIT MODE

    useEffect(() => {

        if (product) {

            setFormData({

                name:
                    product.name || "",

                category:
                    product.category || "",

                type:
                    product.type || "",

                description:
                    product.description || "",

                defaultOnlinePrice:
                    product.defaultOnlinePrice ?? "",

                unit:
                    product.unit || "kg",

                isListedOnline:
                    product.isListedOnline ?? true,

                isFeatured:
                    product.isFeatured ?? false,

                displayOrder:
                    product.displayOrder ?? 0,

                isSeasonal:
                    product.isSeasonal ?? false,

                season:
                    product.season || "",

                isActive:
                    product.isActive ?? true,

                image: null

            });


            if (product.image?.url) {

                setPreview(
                    product.image.url
                );

            }

        } else {

            setFormData(initialFormData);

            setPreview("");

        }

    }, [product]);

    // HANDLE INPUT
    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;


        setFormData(prev => ({

            ...prev,

            [name]:
                type === "checkbox"
                    ? checked
                    : value

        }));

    };



    // IMAGE CHANGE


    const handleImageChange = (e) => {

        const file =
            e.target.files?.[0];

        if (!file) return;


        setFormData(prev => ({

            ...prev,

            image: file

        }));


        setPreview(
            URL.createObjectURL(file)
        );

    };



    // REMOVE IMAGE


    const removeImage = () => {

        setFormData(prev => ({

            ...prev,

            image: null

        }));

        setPreview("");

    };



    // SUBMIT


    const handleSubmit = (e) => {

        e.preventDefault();


        const data = {

            ...formData,

            defaultOnlinePrice:
                Number(
                    formData.defaultOnlinePrice
                ),

            displayOrder:
                Number(
                    formData.displayOrder
                ),

            season:
                formData?.isSeasonal
                    ? formData.season
                    : null

        };


        onSubmit(data);

    };


    const isEditMode =
        Boolean(product);


    return (
        <form
            onSubmit={handleSubmit}
        >

            {/*BASIC INFORMATION*/}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-header bg-white py-3">

                    <h5 className="mb-1 fw-semibold">
                        Basic Information
                    </h5>

                    <small className="text-muted">
                        Product information visible to customers.
                    </small>

                </div>


                <div className="card-body">

                    <div className="row g-3">


                        {/* NAME */}

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">

                                Product Name
                                <span className="text-danger">
                                    *
                                </span>

                            </label>

                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="Enter product name"
                                value={
                                    formData.name
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>


                        {/* CATEGORY */}

                        <div className="col-md-3">

                            <label className="form-label fw-semibold">

                                Category
                                <span className="text-danger">
                                    *
                                </span>

                            </label>

                            <input
                                type="text"
                                name="category"
                                className="form-control"
                                placeholder="e.g. Cake"
                                value={
                                    formData.category
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>


                        {/* TYPE */}

                        <div className="col-md-3">

                            <label className="form-label fw-semibold">

                                Type

                            </label>

                            <input
                                type="text"
                                name="type"
                                className="form-control"
                                placeholder="e.g. Chocolate"
                                value={
                                    formData.type
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>


                        {/* DESCRIPTION */}

                        <div className="col-12">

                            <label className="form-label fw-semibold">

                                Description

                            </label>

                            <textarea
                                name="description"
                                className="form-control"
                                rows="4"
                                placeholder="Enter product description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                    </div>

                </div>

            </div>


            {/*   
                PRICE & UNIT
               */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-header bg-white py-3">

                    <h5 className="mb-1 fw-semibold">
                        Pricing & Unit
                    </h5>

                    <small className="text-muted">
                        Online selling price and measurement unit.
                    </small>

                </div>


                <div className="card-body">

                    <div className="row g-3">


                        {/* PRICE */}

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">

                                Online Price
                                <span className="text-danger">
                                    *
                                </span>

                            </label>

                            <div className="input-group">

                                <span className="input-group-text">
                                    ₹
                                </span>

                                <input
                                    type="number"
                                    name="defaultOnlinePrice"
                                    className="form-control"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={
                                        formData.defaultOnlinePrice
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                        </div>


                        {/* UNIT */}

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">

                                Unit
                                <span className="text-danger">
                                    *
                                </span>

                            </label>

                            <select
                                name="unit"
                                className="form-select"
                                value={
                                    formData.unit
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            >

                                <option value="kg">
                                    Kilogram (kg)
                                </option>

                                <option value="g">
                                    Gram (g)
                                </option>

                                <option value="ml">
                                    Millilitre (ml)
                                </option>

                                <option value="pcs">
                                    Pieces (pcs)
                                </option>

                                <option value="packet">
                                    Packet
                                </option>

                            </select>

                        </div>

                    </div>

                </div>

            </div>


            {/*   
                PRODUCT IMAGE
               */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-header bg-white py-3">

                    <h5 className="mb-1 fw-semibold">
                        Product Image
                    </h5>

                    <small className="text-muted">
                        Image displayed to customers.
                    </small>

                </div>


                <div className="card-body">

                    <div className="row g-4 align-items-center">


                        {/* PREVIEW */}

                        <div className="col-md-4">

                            <div
                                className="border rounded-3 d-flex align-items-center justify-content-center"
                                style={{
                                    height: "220px",
                                    overflow: "hidden"
                                }}
                            >

                                {preview ? (

                                    <img
                                        src={preview}
                                        alt="Product Preview"
                                        className="img-fluid w-100 h-100"
                                        style={{
                                            objectFit:
                                                "cover"
                                        }}
                                    />

                                ) : (

                                    <div className="text-muted text-center">

                                        <div className="fs-1">
                                            📷
                                        </div>

                                        <small>
                                            No image selected
                                        </small>

                                    </div>

                                )}

                            </div>

                        </div>


                        {/* UPLOAD */}

                        <div className="col-md-8">

                            <label className="form-label fw-semibold">

                                Upload Image

                            </label>

                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={
                                    handleImageChange
                                }
                            />

                            <div className="form-text">
                                Recommended: JPG, PNG or WEBP.
                            </div>


                            {preview && (

                                <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm mt-3"
                                    onClick={
                                        removeImage
                                    }
                                >
                                    Remove Image
                                </button>

                            )}

                        </div>

                    </div>

                </div>

            </div>


            {/*   
                ONLINE VISIBILITY
               */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-header bg-white py-3">

                    <h5 className="mb-1 fw-semibold">
                        Online Visibility
                    </h5>

                    <small className="text-muted">
                        Control how this product appears to customers.
                    </small>

                </div>


                <div className="card-body">

                    <div className="row g-3">


                        {/* LIST ONLINE */}

                        <div className="col-md-6">

                            <div className="form-check form-switch">

                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="isListedOnline"
                                    id="isListedOnline"
                                    checked={
                                        formData.isListedOnline
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                                <label
                                    className="form-check-label fw-semibold"
                                    htmlFor="isListedOnline"
                                >
                                    Listed Online
                                </label>

                            </div>

                            <small className="text-muted">
                                Customers can see and order this product.
                            </small>

                        </div>


                        {/* FEATURED */}

                        <div className="col-md-6">

                            <div className="form-check form-switch">

                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="isFeatured"
                                    id="isFeatured"
                                    checked={
                                        formData.isFeatured
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                                <label
                                    className="form-check-label fw-semibold"
                                    htmlFor="isFeatured"
                                >
                                    Featured Product
                                </label>

                            </div>

                            <small className="text-muted">
                                Show this product in featured products.
                            </small>

                        </div>


                        {/* DISPLAY ORDER */}

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">

                                Display Order

                            </label>

                            <input
                                type="number"
                                name="displayOrder"
                                className="form-control"
                                min="0"
                                value={
                                    formData.displayOrder
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            <div className="form-text">
                                Lower numbers appear first.
                            </div>

                        </div>


                        {/* ACTIVE */}

                        <div className="col-md-6">

                            <div className="form-check form-switch mt-4">

                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="isActive"
                                    id="isActive"
                                    checked={
                                        formData.isActive
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                                <label
                                    className="form-check-label fw-semibold"
                                    htmlFor="isActive"
                                >
                                    Active Product
                                </label>

                            </div>

                            <small className="text-muted">
                                Inactive products are not available.
                            </small>

                        </div>

                    </div>

                </div>

            </div>


            {/*   
                SEASON
               */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-header bg-white py-3">

                    <h5 className="mb-1 fw-semibold">
                        Seasonal Settings
                    </h5>

                    <small className="text-muted">
                        Configure seasonal availability.
                    </small>

                </div>


                <div className="card-body">

                    <div className="form-check form-switch mb-3">

                        <input
                            className="form-check-input"
                            type="checkbox"
                            name="isSeasonal"
                            id="isSeasonal"
                            checked={
                                formData.isSeasonal
                            }
                            onChange={
                                handleChange
                            }
                        />

                        <label
                            className="form-check-label fw-semibold"
                            htmlFor="isSeasonal"
                        >
                            Seasonal Product
                        </label>

                    </div>


                    {formData.isSeasonal && (

                        <div>

                            <label className="form-label fw-semibold">

                                Season

                            </label>

                            <input
                                type="text"
                                name="season"
                                className="form-control"
                                placeholder="e.g. Diwali, Summer, Winter"
                                value={
                                    formData.season
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                    )}

                </div>

            </div>


            {/*   
                ACTIONS
               */}

            <div className="d-flex justify-content-end gap-2 mb-4">

                <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={
                        onCancel
                    }
                    disabled={loading}
                >
                    Cancel
                </button>


                <button
                    type="submit"
                    className="btn btn-dark px-5"
                    disabled={loading}
                >

                    {loading ? (

                        <>

                            <span
                                className="spinner-border spinner-border-sm me-2"
                            />

                            {isEditMode
                                ? "Updating..."
                                : "Creating..."
                            }

                        </>

                    ) : (

                        isEditMode
                            ? "Update Product"
                            : "Create Product"

                    )}

                </button>

            </div>

        </form>

    );

};

export default ProductForm;