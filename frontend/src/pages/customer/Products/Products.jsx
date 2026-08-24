import "./Products.css";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AOS from "aos";

import PageHeader from "../../../components/common/PageHeader";
import SearchBar from "../../../components/common/SearchBar";
import Select from "../../../components/common/Select";
import Loader from "../../../components/common/Loader";
import Pagination from "../../../components/common/Pagination";
import EmptyState from "../../../components/common/EmptyState";

import { getProduct, categoryService } from "../../../services/productService";

import ProductGrid from "../../../components/customer/products/ProductGrid/ProductGrid";

function Products() {

    const [searchParams] = useSearchParams();

    const [products, setProducts] = useState([]);
    //to set category option
    const [catOption, setCatOption] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState(() => searchParams.get("category") ?? "");

    const [sort, setSort] = useState(() => searchParams.get("sort") ?? "");

    const [currentPage, setCurrentPage] = useState(1);

    const [pagination, setPagination] = useState({});

    useEffect(() => {

        AOS.refresh();
        getCategory();

    }, []);
    //Whenever category changes we should go back to page 1.
    useEffect(() => {
        setCurrentPage(1);

    }, [category]);

    useEffect(() => {

        fetchProducts();


    }, [currentPage, sort, category]);



    useEffect(() => {

        const timer = setTimeout(() => {

            setCurrentPage(1);
            fetchProducts();

        }, 1000);

        return () => clearTimeout(timer);

    }, [search]);



    const fetchProducts = async () => {

        try {

            setLoading(true);
            //GET /products?page=1&limit=8&sort=-createdAt&search=papad
            const response = await getProduct({

                page: currentPage,

                limit: 8,

                sort,

                search,

                category
            });

            if (response.success) {

                setProducts(
                    response.data.products
                );

                setPagination(
                    response.data.pagination
                );

            }

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    const getCategory = async () => {

        try {

            const response = await categoryService();
            setCatOption(
                (response || []).map((categoryName) => ({

                    value: categoryName,
                    label: categoryName

                }))
            );
        } catch (error) {
            console.log(error);
        }

    };

    return (

        <section className="products-page container">

            <div
                data-aos="fade-down"
            >

                <PageHeader

                    title="Products"

                    subtitle="Browse our homemade products."

                />

            </div>

            <div className="product-toolbar" data-aos="fade-up" >

                <SearchBar

                    value={search}

                    onChange={(e) => setSearch(e.target.value)}

                    placeholder="Search Products..."

                />

                <Select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="All Categories"
                    options= {catOption}
                />
                <Select

                    value={sort}

                    onChange={(e) => setSort(e.target.value)}

                    options={[

                        {

                            value: "-createdAt",

                            label: "Newest"

                        },

                        {

                            value: "createdAt",

                            label: "Oldest"

                        },

                        {

                            value: "defaultOnlinePrice",

                            label: "Price ↑"

                        },

                        {

                            value: "-defaultOnlinePrice",

                            label: "Price ↓"

                        }

                    ]}

                />

            </div>

            <div className="products-summary">

                <p>

                    Showing

                    <strong>

                        {" "}
                        {pagination.totalProducts || 0}

                    </strong>

                    {" "}Products

                </p>

            </div>

            {

                products.length > 0 ?

                    <div
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >

                        <ProductGrid

                            products={products}

                        />

                    </div>

                    :

                    <EmptyState

                        title="No Products Found"

                        description="We couldn't find any products matching your search."

                    />

            }

            {

                pagination.totalPages > 1 &&

                <div

                    className="mt-5"

                    data-aos="fade-up"

                >

                    <Pagination

                        currentPage={pagination.currentPage}

                        totalPages={pagination.totalPages}

                        onPageChange={(page) => {

                            setCurrentPage(page);

                            window.scrollTo({

                                top: 0,

                                behavior: "smooth"

                            });

                        }}

                    />

                </div>

            }

        </section>

    );

}

export default Products;