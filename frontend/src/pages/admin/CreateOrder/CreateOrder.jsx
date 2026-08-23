import React, { useEffect, useMemo, useState } from "react";

import { createOrder } from "../../../services/orderService";
import { getProduct } from "../../../services/productService";
import toast from "react-hot-toast";


const CreateOrder = () => {

    const [products, setProducts] = useState([]);

    const [loadingProducts, setLoadingProducts] =
        useState(false);

    const [submitting, setSubmitting] =
        useState(false);

    const [formData, setFormData] = useState({

        customer: {
            name: "",
            phone: "",
            village: ""
        },

        items: [],

        paymentMethod: "Cash",

        paidAmount: "",

        rawMaterials: [],

        notes: ""

    });



    // LOAD PRODUCTS


    const loadProducts = async () => {

        try {

            setLoadingProducts(true);

            const res = await getProduct();

            setProducts(
                res?.data?.products || []
            );

        } catch (error) {

            console.error(
                "Failed to load products:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to load products."
            );

        } finally {

            setLoadingProducts(false);

        }

    };


    useEffect(() => {

        loadProducts();

    }, []);



    // CUSTOMER CHANGE


    const handleCustomerChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData(prev => ({

            ...prev,

            customer: {

                ...prev.customer,

                [name]: value

            }

        }));

    };



    // PAYMENT METHOD


    const handlePaymentMethodChange = (e) => {

        setFormData(prev => ({

            ...prev,

            paymentMethod:
                e.target.value

        }));

    };



    // ADD PRODUCT


    const addProduct = () => {

        setFormData(prev => ({

            ...prev,

            items: [

                ...prev.items,

                {

                    productId: "",

                    quantity: 1,

                    pricePerUnit: ""

                }

            ]

        }));

    };



    // REMOVE PRODUCT


    const removeProduct = (index) => {

        setFormData(prev => ({

            ...prev,

            items: prev.items.filter(
                (_, i) => i !== index
            )

        }));

    };



    // PRODUCT CHANGE


    const handleProductChange = (
        index,
        field,
        value
    ) => {

        setFormData(prev => {

            const updatedItems =
                [...prev.items];

            updatedItems[index] = {

                ...updatedItems[index],

                [field]: value

            };

            return {

                ...prev,

                items: updatedItems

            };

        });

    };



    // ADD RAW MATERIAL


    const addRawMaterial = () => {

        setFormData(prev => ({

            ...prev,

            rawMaterials: [

                ...prev.rawMaterials,

                {

                    name: "",

                    quantity: "",

                    unit: "Kg"

                }

            ]

        }));

    };



    // REMOVE RAW MATERIAL


    const removeRawMaterial = (index) => {

        setFormData(prev => ({

            ...prev,

            rawMaterials:
                prev.rawMaterials.filter(
                    (_, i) => i !== index
                )

        }));

    };



    // RAW MATERIAL CHANGE


    const handleRawMaterialChange = (
        index,
        field,
        value
    ) => {

        setFormData(prev => {

            const updatedMaterials =
                [...prev.rawMaterials];

            updatedMaterials[index] = {

                ...updatedMaterials[index],

                [field]: value

            };

            return {

                ...prev,

                rawMaterials:
                    updatedMaterials

            };

        });

    };



    // LIVE BILL CALCULATION


    const bill = useMemo(() => {

        let subtotal = 0;

        const calculatedItems =
            formData.items.map(item => {

                const quantity =
                    Number(item.quantity) || 0;

                const pricePerUnit =
                    Number(item.pricePerUnit) || 0;

                const itemTotal =
                    quantity * pricePerUnit;

                subtotal += itemTotal;

                return {

                    ...item,

                    quantity,

                    pricePerUnit,

                    itemTotal

                };

            });


        const paid =
            Number(formData.paidAmount) || 0;

        const remaining =
            Math.max(
                0,
                subtotal - paid
            );

        const excess =
            Math.max(
                0,
                paid - subtotal
            );

        let paymentStatus = "Pending";

        if (subtotal > 0 && paid >= subtotal) {

            paymentStatus = "Paid";

        } else if (paid > 0) {

            paymentStatus = "Partially Paid";

        }

        return {

            subtotal,

            calculatedItems,

            paid,

            remaining,

            excess,

            paymentStatus

        };

    }, [
        formData.items,
        formData.paidAmount
    ]);



    // SUBMIT


    const handleSubmit = async (e) => {

        e.preventDefault();



        // CUSTOMER VALIDATION


        if (
            !formData.customer.name.trim()
        ) {

            toast.error(
                "Customer name is required."
            );

            return;

        }


        if (
            !formData.customer.phone.trim()
        ) {

            toast.error(
                "Customer phone is required."
            );

            return;

        }


        if (
            !formData.customer.village.trim()
        ) {

            toast.error(
                "Village is required."
            );

            return;

        }



        // PRODUCT VALIDATION


        if (
            formData.items.length === 0
        ) {

            toast.error(
                "Add at least one product."
            );

            return;

        }


        const productIds = new Set();


        for (
            const item of formData.items
        ) {

            if (!item.productId) {

                toast.error(
                    "Please select a product."
                );

                return;

            }


            if (
                productIds.has(
                    item.productId
                )
            ) {

                toast.error(
                    "Duplicate products are not allowed."
                );

                return;

            }


            productIds.add(
                item.productId
            );


            if (
                Number(item.quantity) <= 0
            ) {

                toast.error(
                    "Quantity must be greater than 0."
                );

                return;

            }


            if (
                item.pricePerUnit === "" ||
                Number(item.pricePerUnit) < 0
            ) {

                toast.error(
                    "Enter a valid price for every product."
                );

                return;

            }

        }



        // PAYMENT VALIDATION


        if (bill.paid < 0) {

            toast.error(
                "Paid amount cannot be negative."
            );

            return;

        }


        if (bill.excess > 0) {

            toast.error(
                "Paid amount cannot exceed the order total."
            );

            return;

        }


        try {

            setSubmitting(true);


             
            // PAYLOAD
             

            const payload = {

                orderType: "Offline",

                customer: {

                    name:
                        formData.customer.name.trim(),

                    phone:
                        formData.customer.phone.trim(),

                    village:
                        formData.customer.village.trim()

                },

                items:
                    formData.items.map(item => ({

                        productId:
                            item.productId,

                        quantity:
                            Number(item.quantity),

                        pricePerUnit:
                            Number(item.pricePerUnit)

                    })),

                paymentMethod:
                    formData.paymentMethod,

                paidAmount:
                    bill.paid,

                rawMaterials:
                    formData.rawMaterials
                        .filter(material =>
                            material.name.trim() &&
                            Number(material.quantity) > 0
                        )
                        .map(material => ({

                            name:
                                material.name.trim(),

                            quantity:
                                Number(material.quantity),

                            unit:
                                material.unit

                        })),

                notes:
                    formData.notes.trim()

            };


            console.log(
                "Offline Order Payload:",
                payload
            );


             
            // CREATE ORDER
             

            await createOrder(payload);


            toast.success(
                "Offline order created successfully!"
            );


             
            // RESET
             

            setFormData({

                customer: {

                    name: "",
                    phone: "",
                    village: ""

                },

                items: [],

                paymentMethod: "Cash",

                paidAmount: "",

                rawMaterials: [],

                notes: ""

            });


        } catch (error) {

            console.error(
                "Failed to create offline order:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to create offline order."
            );

        } finally {

            setSubmitting(false);

        }

    };
    // UI
    return (

        <div className="container-fluid py-4">
             {/* PAGE HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h3 className="fw-bold mb-1">
                        Create Offline Order
                    </h3>

                    <p className="text-muted mb-0">
                        Create an order for an offline customer.
                    </p>

                </div>

                <span className="badge bg-dark px-3 py-2">
                    OFFLINE ORDER
                </span>

            </div>


            <form onSubmit={handleSubmit}>
    
        {/* CUSTOMER DETAILS  */}

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-header bg-white py-3">

                        <h5 className="mb-0 fw-semibold">
                            Customer Details
                        </h5>

                    </div>

                    <div className="card-body">

                        <div className="row g-3">

                            <div className="col-md-4">

                                <label className="form-label fw-semibold">
                                    Customer Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    placeholder="Enter customer name"
                                    value={
                                        formData.customer.name
                                    }
                                    onChange={
                                        handleCustomerChange
                                    }
                                    required
                                />

                            </div>


                            <div className="col-md-4">

                                <label className="form-label fw-semibold">
                                    Phone
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    className="form-control"
                                    placeholder="Enter phone number"
                                    value={
                                        formData.customer.phone
                                    }
                                    onChange={
                                        handleCustomerChange
                                    }
                                    required
                                />

                            </div>


                            <div className="col-md-4">

                                <label className="form-label fw-semibold">
                                    Village
                                </label>

                                <input
                                    type="text"
                                    name="village"
                                    className="form-control"
                                    placeholder="Enter village"
                                    value={
                                        formData.customer.village
                                    }
                                    onChange={
                                        handleCustomerChange
                                    }
                                    required
                                />

                            </div>

                        </div>

                    </div>

                </div>


                 
        {/* PRODUCTS */}
     

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">

                        <div>

                            <h5 className="mb-0 fw-semibold">
                                Products
                            </h5>

                            <small className="text-muted">
                                Set the offline selling price.
                            </small>

                        </div>

                        <button
                            type="button"
                            className="btn btn-dark btn-sm"
                            onClick={addProduct}
                        >
                            + Add Product
                        </button>

                    </div>


                    <div className="card-body">

                        {formData.items.length === 0 ? (

                            <div className="text-center py-5">

                                <div className="text-muted mb-3">
                                    No products added to this order.
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-outline-dark"
                                    onClick={addProduct}
                                >
                                    + Add First Product
                                </button>

                            </div>

                        ) : (

                            formData.items.map(
                                (item, index) => (

                                    <div
                                        className="row g-3 align-items-end mb-3 pb-3 border-bottom"
                                        key={index}
                                    >

                                        {/* PRODUCT */}

                                        <div className="col-lg-4">

                                            <label className="form-label">
                                                Product
                                            </label>

                                            <select
                                                className="form-select"
                                                value={
                                                    item.productId
                                                }
                                                onChange={e =>
                                                    handleProductChange(
                                                        index,
                                                        "productId",
                                                        e.target.value
                                                    )
                                                }
                                            >

                                                <option value="">
                                                    Select Product
                                                </option>

                                                {loadingProducts ? (

                                                    <option disabled>
                                                        Loading products...
                                                    </option>

                                                ) : (

                                                    products.map(
                                                        product => (

                                                            <option
                                                                key={
                                                                    product._id
                                                                }
                                                                value={
                                                                    product._id
                                                                }
                                                            >
                                                                {
                                                                    product.name
                                                                }
                                                                {" - "}
                                                                {
                                                                    product.unit
                                                                }
                                                            </option>

                                                        )
                                                    )

                                                )}

                                            </select>

                                        </div>


                                        {/* QUANTITY */}

                                        <div className="col-lg-2">

                                            <label className="form-label">
                                                Quantity
                                            </label>

                                            <input
                                                type="number"
                                                min="1"
                                                step="1"
                                                className="form-control"
                                                value={
                                                    item.quantity
                                                }
                                                onChange={e =>
                                                    handleProductChange(
                                                        index,
                                                        "quantity",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />

                                        </div>


                                        {/* PRICE */}

                                        <div className="col-lg-2">

                                            <label className="form-label">
                                                Price / Unit
                                            </label>

                                            <div className="input-group">

                                                <span className="input-group-text">
                                                    ₹
                                                </span>

                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    className="form-control"
                                                    placeholder="0"
                                                    value={
                                                        item.pricePerUnit
                                                    }
                                                    onChange={e =>
                                                        handleProductChange(
                                                            index,
                                                            "pricePerUnit",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />

                                            </div>

                                        </div>


                                        {/* ITEM TOTAL */}

                                        <div className="col-lg-2">

                                            <label className="form-label">
                                                Item Total
                                            </label>

                                            <div className="form-control bg-light fw-semibold">

                                                ₹{" "}

                                                {(
                                                    Number(
                                                        item.quantity
                                                    ) *
                                                    Number(
                                                        item.pricePerUnit
                                                    ) || 0
                                                ).toFixed(2)}

                                            </div>

                                        </div>


                                        {/* REMOVE */}

                                        <div className="col-lg-2">

                                            <button
                                                type="button"
                                                className="btn btn-outline-danger w-100"
                                                onClick={() =>
                                                    removeProduct(
                                                        index
                                                    )
                                                }
                                            >
                                                Remove
                                            </button>

                                        </div>

                                    </div>

                                )
                            )

                        )}

                    </div>

                </div>


                 
        LIVE BILL PREVIEW
     

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-header bg-dark text-white py-3">

                        <div className="d-flex justify-content-between align-items-center">

                            <div>

                                <h5 className="mb-0">
                                    Live Bill Preview
                                </h5>

                                <small className="opacity-75">
                                    Automatically calculated while creating the order
                                </small>

                            </div>

                            <span className="badge bg-light text-dark">
                                Temporary
                            </span>

                        </div>

                    </div>


                    <div className="card-body">

                        {/* PRODUCT SUMMARY */}

                        {bill.calculatedItems.length > 0 && (

                            <div className="table-responsive mb-4">

                                <table className="table align-middle mb-0">

                                    <thead>

                                        <tr>

                                            <th>
                                                Product
                                            </th>

                                            <th className="text-center">
                                                Qty
                                            </th>

                                            <th className="text-end">
                                                Price
                                            </th>

                                            <th className="text-end">
                                                Total
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {bill.calculatedItems.map(
                                            (item, index) => {

                                                const selectedProduct =
                                                    products.find(
                                                        product =>
                                                            product._id ===
                                                            item.productId
                                                    );

                                                return (

                                                    <tr
                                                        key={index}
                                                    >

                                                        <td>

                                                            {
                                                                selectedProduct?.name ||
                                                                "Product not selected"
                                                            }

                                                        </td>

                                                        <td className="text-center">

                                                            {
                                                                item.quantity
                                                            }

                                                        </td>

                                                        <td className="text-end">

                                                            ₹{" "}
                                                            {
                                                                item.pricePerUnit.toFixed(
                                                                    2
                                                                )
                                                            }

                                                        </td>

                                                        <td className="text-end fw-semibold">

                                                            ₹{" "}
                                                            {
                                                                item.itemTotal.toFixed(
                                                                    2
                                                                )
                                                            }

                                                        </td>

                                                    </tr>

                                                );

                                            }
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}


                        {/* BILL SUMMARY */}

                        <div className="row justify-content-end">

                            <div className="col-md-6 col-lg-5">

                                <div className="d-flex justify-content-between mb-2">

                                    <span className="text-muted">
                                        Subtotal
                                    </span>

                                    <span className="fw-semibold">
                                        ₹{" "}
                                        {
                                            bill.subtotal.toFixed(
                                                2
                                            )
                                        }
                                    </span>

                                </div>


                                <div className="d-flex justify-content-between mb-2">

                                    <span className="text-muted">
                                        Paid Amount
                                    </span>

                                    <span className="fw-semibold">
                                        ₹{" "}
                                        {
                                            bill.paid.toFixed(
                                                2
                                            )
                                        }
                                    </span>

                                </div>


                                <hr />


                                <div className="d-flex justify-content-between align-items-center">

                                    <span className="fw-bold">
                                        Remaining
                                    </span>

                                    <span className="fw-bold fs-5">
                                        ₹{" "}
                                        {
                                            bill.remaining.toFixed(
                                                2
                                            )
                                        }
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* BIG TOTAL */}

                        <div className="bg-light rounded-3 p-4 mt-4 text-center">

                            <div className="text-muted text-uppercase small fw-semibold">
                                Total Amount
                            </div>

                            <div className="display-4 fw-bold mt-1">
                                ₹{" "}
                                {
                                    bill.subtotal.toFixed(
                                        2
                                    )
                                }
                            </div>

                            <div className="text-muted mt-2">
                                Tell the customer:
                                <strong className="ms-1">
                                    ₹{" "}
                                    {
                                        bill.subtotal.toFixed(
                                            2
                                        )
                                    }
                                </strong>
                            </div>

                        </div>


                        {/* PAYMENT STATUS */}

                        <div className="text-center mt-3">

                            {bill.paymentStatus === "Paid" && (

                                <span className="badge bg-success px-3 py-2">
                                    Fully Paid
                                </span>

                            )}

                            {bill.paymentStatus === "Partially Paid" && (

                                <span className="badge bg-warning text-dark px-3 py-2">
                                    Partially Paid
                                </span>

                            )}

                            {bill.paymentStatus === "Pending" && (

                                <span className="badge bg-danger px-3 py-2">
                                    Payment Pending
                                </span>

                            )}

                        </div>

                    </div>

                </div>


                 
        PAYMENT
     

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-header bg-white py-3">

                        <h5 className="mb-0 fw-semibold">
                            Payment
                        </h5>

                    </div>

                    <div className="card-body">

                        <div className="row g-3">

                            {/* PAYMENT METHOD */}

                            <div className="col-md-4">

                                <label className="form-label fw-semibold">
                                    Payment Method
                                </label>

                                <select
                                    className="form-select"
                                    value={
                                        formData.paymentMethod
                                    }
                                    onChange={
                                        handlePaymentMethodChange
                                    }
                                    required
                                >

                                    <option value="Cash">
                                        Cash
                                    </option>

                                    <option value="UPI">
                                        UPI
                                    </option>

                                </select>

                            </div>


                            {/* PAID */}

                            <div className="col-md-4">

                                <label className="form-label fw-semibold">
                                    Paid Amount
                                </label>

                                <div className="input-group">

                                    <span className="input-group-text">
                                        ₹
                                    </span>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className={`form-control ${bill.excess > 0
                                                ? "is-invalid"
                                                : ""
                                            }`}
                                        placeholder="0"
                                        value={
                                            formData.paidAmount
                                        }
                                        onChange={e =>
                                            setFormData(prev => ({

                                                ...prev,

                                                paidAmount:
                                                    e.target.value

                                            }))
                                        }
                                    />

                                    {bill.excess > 0 && (

                                        <div className="invalid-feedback">

                                            Paid amount is greater
                                            than the order total.

                                        </div>

                                    )}

                                </div>

                            </div>


                            {/* REMAINING */}

                            <div className="col-md-4">

                                <label className="form-label fw-semibold">
                                    Remaining Amount
                                </label>

                                <div className="form-control bg-light fw-semibold">

                                    ₹{" "}
                                    {
                                        bill.remaining.toFixed(
                                            2
                                        )
                                    }

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                 
        RAW MATERIALS
     

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">

                        <div>

                            <h5 className="mb-0 fw-semibold">
                                Raw Materials
                            </h5>

                            <small className="text-muted">
                                Optional for offline orders
                            </small>

                        </div>

                        <button
                            type="button"
                            className="btn btn-outline-dark btn-sm"
                            onClick={addRawMaterial}
                        >
                            + Add Raw Material
                        </button>

                    </div>


                    <div className="card-body">

                        {formData.rawMaterials.length === 0 ? (

                            <p className="text-muted mb-0">
                                No raw materials added.
                            </p>

                        ) : (

                            formData.rawMaterials.map(
                                (material, index) => (

                                    <div
                                        className="row g-3 align-items-end mb-3"
                                        key={index}
                                    >

                                        <div className="col-md-5">

                                            <label className="form-label">
                                                Material Name
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="e.g. Maida"
                                                value={
                                                    material.name
                                                }
                                                onChange={e =>
                                                    handleRawMaterialChange(
                                                        index,
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />

                                        </div>


                                        <div className="col-md-3">

                                            <label className="form-label">
                                                Quantity
                                            </label>

                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                className="form-control"
                                                value={
                                                    material.quantity
                                                }
                                                onChange={e =>
                                                    handleRawMaterialChange(
                                                        index,
                                                        "quantity",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>


                                        <div className="col-md-2">

                                            <label className="form-label">
                                                Unit
                                            </label>

                                            <select
                                                className="form-select"
                                                value={
                                                    material.unit
                                                }
                                                onChange={e =>
                                                    handleRawMaterialChange(
                                                        index,
                                                        "unit",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            >

                                                <option value="Kg">
                                                    Kg
                                                </option>

                                                <option value="Gram">
                                                    Gram
                                                </option>

                                                <option value="Piece">
                                                    Piece
                                                </option>

                                                <option value="Packet">
                                                    Packet
                                                </option>

                                            </select>

                                        </div>


                                        <div className="col-md-2">

                                            <button
                                                type="button"
                                                className="btn btn-outline-danger w-100"
                                                onClick={() =>
                                                    removeRawMaterial(
                                                        index
                                                    )
                                                }
                                            >
                                                Remove
                                            </button>

                                        </div>

                                    </div>

                                )
                            )

                        )}

                    </div>

                </div>


                 
        NOTES
     

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-header bg-white py-3">

                        <h5 className="mb-0 fw-semibold">
                            Notes
                        </h5>

                    </div>

                    <div className="card-body">

                        <textarea
                            className="form-control"
                            rows="3"
                            placeholder="Add notes about this offline order..."
                            value={
                                formData.notes
                            }
                            onChange={e =>
                                setFormData(prev => ({

                                    ...prev,

                                    notes:
                                        e.target.value

                                }))
                            }
                            required
                        />

                    </div>

                </div>


                 
        FINAL ACTION
     

                <div className="d-flex justify-content-end gap-2">

                    <button
                        type="button"
                        className="btn btn-outline-secondary px-4"
                        onClick={() =>
                            window.history.back()
                        }
                        disabled={submitting}
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        className="btn btn-dark px-5"
                        disabled={
                            submitting ||
                            bill.subtotal <= 0 ||
                            bill.excess > 0
                        }
                    >

                        {submitting ? (

                            <>

                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                />

                                Creating Order...

                            </>

                        ) : (

                            <>
                                Create Offline Order
                                <span className="ms-2">
                                    ₹{" "}
                                    {
                                        bill.subtotal.toFixed(
                                            2
                                        )
                                    }
                                </span>
                            </>

                        )}

                    </button>

                </div>

            </form>

        </div>

    );

};

export default CreateOrder;