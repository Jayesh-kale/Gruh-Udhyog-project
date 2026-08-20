import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

function SearchBar({

    value,

    onChange,

    placeholder="Search..."

}) {

    return (

        <div className="search-bar">

            <FaSearch/>

            <input

                value={value}

                onChange={onChange}

                placeholder={placeholder}

            />

        </div>

    );

}

export default SearchBar;