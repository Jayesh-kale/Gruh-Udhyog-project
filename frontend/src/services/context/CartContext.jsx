import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {

    const [cartItems, setCartItems] = useState(() => {

        const savedCart = localStorage.getItem("cart");

        return savedCart ? JSON.parse(savedCart) : [];

    });

    useEffect(() => {

        localStorage.setItem(

            "cart",

            JSON.stringify(cartItems)

        );

    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {

        setCartItems((prev) => {

            const existingItem = prev.find(
                (item) => item._id === product._id &&
                    (item.packageId || item.packageIndex || "") ===
                    (product.packageId || product.packageIndex || "")
            );

            if (existingItem) {

                return prev.map((item) =>

                    item._id === product._id &&
                    (item.packageId || item.packageIndex || "") ===
                    (product.packageId || product.packageIndex || "")

                        ? {

                            ...item,

                            quantity: item.quantity + quantity

                        }

                        : item

                );

            }

            return [

                ...prev,

                {

                    ...product,

                    quantity

                }

            ];

        });

    };

    const removeFromCart = (productId, packageId) => {

        setCartItems((prev) =>

            prev.filter(

                (item) => item._id !== productId ||
                    (item.packageId || item.packageIndex || "") !== (packageId || "")

            )

        );

    };

    const updateQuantity = (productId, quantity, packageId) => {

        if (quantity < 1) return;

        setCartItems((prev) =>

            prev.map((item) =>

                item._id === productId &&
                    (item.packageId || item.packageIndex || "") === (packageId || "")

                    ? {

                        ...item,

                        quantity

                    }

                    : item

            )

        );

    };

    const clearCart = () => {

        setCartItems([]);

    };

    const buyNow = (product, quantity = 1) => {

        setCartItems([

            {

                ...product,

                quantity

            }

        ]);

    };

    const cartTotal = useMemo(() => {

        return cartItems.reduce(

            (total, item) =>

                total +
                (item.selectedPackage?.price ?? item.defaultOnlinePrice) *
                item.quantity,

            0

        );

    }, [cartItems]);

    const totalItems = useMemo(() => {

        return cartItems.reduce(

            (total, item) =>

                total + item.quantity,

            0

        );

    }, [cartItems]);

    return (

        <CartContext.Provider

            value={{

                cartItems,

                totalItems,

                cartTotal,

                addToCart,

                buyNow,

                removeFromCart,

                updateQuantity,

                clearCart

            }}

        >

            {children}

        </CartContext.Provider>

    );

}

export function useCart() {

    return useContext(CartContext);

}