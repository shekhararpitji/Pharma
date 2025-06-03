"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Freecurrencyapi from "@everapi/freecurrencyapi-js";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { authNotExist } from "@/redux/reducers/authReducer";

const countryCurrencies = [
  {
    country: "United States",
    currency: "US Dollar",
    code: "USD",
    img: "https://flagcdn.com/w320/us.png",
  },
  {
    country: "United Kingdom",
    currency: "Pound Sterling",
    code: "GBP",
    img: "https://flagcdn.com/w320/gb.png",
  },
  {
    country: "European Union",
    currency: "Euro",
    code: "EUR",
    img: "https://flagcdn.com/w320/eu.png",
  },
  {
    country: "India",
    currency: "Indian Rupee",
    code: "INR",
    img: "https://flagcdn.com/w320/in.png",
  },
  {
    country: "Japan",
    currency: "Japanese Yen",
    code: "JPY",
    img: "https://flagcdn.com/w320/jp.png",
  },
  {
    country: "Australia",
    currency: "Australian Dollar",
    code: "AUD",
    img: "https://flagcdn.com/w320/au.png",
  },
  {
    country: "Canada",
    currency: "Canadian Dollar",
    code: "CAD",
    img: "https://flagcdn.com/w320/ca.png",
  },
  {
    country: "China",
    currency: "Chinese Yuan",
    code: "CNY",
    img: "https://flagcdn.com/w320/cn.png",
  },
  {
    country: "Switzerland",
    currency: "Swiss Franc",
    code: "CHF",
    img: "https://flagcdn.com/w320/ch.png",
  },
  {
    country: "Russia",
    currency: "Russian Ruble",
    code: "RUB",
    img: "https://flagcdn.com/w320/ru.png",
  },
  {
    country: "Brazil",
    currency: "Brazilian Real",
    code: "BRL",
    img: "https://flagcdn.com/w320/br.png",
  },
  {
    country: "South Africa",
    currency: "South African Rand",
    code: "ZAR",
    img: "https://flagcdn.com/w320/za.png",
  },
  {
    country: "Mexico",
    currency: "Mexican Peso",
    code: "MXN",
    img: "https://flagcdn.com/w320/mx.png",
  },
  {
    country: "Singapore",
    currency: "Singapore Dollar",
    code: "SGD",
    img: "https://flagcdn.com/w320/sg.png",
  },
  {
    country: "United Arab Emirates",
    currency: "UAE Dirham",
    code: "AED",
    img: "https://flagcdn.com/w320/ae.png",
  },
  {
    country: "South Korea",
    currency: "South Korean Won",
    code: "KRW",
    img: "https://flagcdn.com/w320/kr.png",
  },
  {
    country: "New Zealand",
    currency: "New Zealand Dollar",
    code: "NZD",
    img: "https://flagcdn.com/w320/nz.png",
  },
  {
    country: "Saudi Arabia",
    currency: "Saudi Riyal",
    code: "SAR",
    img: "https://flagcdn.com/w320/sa.png",
  },
  {
    country: "Turkey",
    currency: "Turkish Lira",
    code: "TRY",
    img: "https://flagcdn.com/w320/tr.png",
  },
  {
    country: "Thailand",
    currency: "Thai Baht",
    code: "THB",
    img: "https://flagcdn.com/w320/th.png",
  },
];

const Navbar = () => {
  const pathname = usePathname();
  const apiKey = "fca_live_yjJUTCPZCMosYS61xxVAAscj99B2G1AHTgH6rPWv"; // Replace with your actual API key
  const freecurrencyapi = new Freecurrencyapi(apiKey);

  const dispatch = useDispatch();

  const { auth } = useSelector((state) => state.authReducer);

  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const dropdownRef = useRef(null); // Ref for dropdown
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      freecurrencyapi
        .latest({ base_currency: fromCurrency, currencies: toCurrency })
        .then((response) => {
          const rate = response.data[toCurrency];
          setConvertedAmount((amount * rate).toFixed(2));
        })
        .catch((error) =>
          console.error("Error fetching exchange rate:", error)
        );
    }
  }, [fromCurrency, toCurrency, amount]);

  const getFlagUrl = (code) =>
    `https://flagcdn.com/w40/${code.slice(0, 2).toLowerCase()}.png`;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("sessionId");
    dispatch(authNotExist());
    router.push("/login");
  }

  useEffect(() => {
    if (auth) {
      router.push("/login");
    }
  }, [auth, router]);

  return (
    <div className="navbar bg-theme_color text-white py-1">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <a>Parent</a>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </li>
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </div>
        <Link href="/">Chemys</Link>
      </div>

      <div className="navbar-center flex gap-12">
        <div className="navbar-center hidden md:flex lg:flex">
          <ul className="flex gap-10 px-1">
            <li>
              <Link
                href="/"
                className={`nav-link ${pathname === "/" ? "active" : ""}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className={`nav-link ${pathname === "/dashboard" ? "active" : ""
                  }`}
              >
                Dashboard
              </Link>
            </li>
            <li className="relative group">
              <Link href="" className={`nav-link`}>
                Resources
              </Link>
              <ul className="absolute z-10 left-0  w-40 bg-blue-900 border rounded-md shadow-xl hidden group-hover:block">
                <li>
                  <Link
                    href="/countries"
                    className="block px-4 py-1.5 hover:bg-blue-800 rounded-md"
                  >
                    Countries
                  </Link>
                </li>
                <li>
                  <Link
                    href="/indian-ports"
                    className="block px-4 py-1.5 hover:bg-blue-800"
                  >
                    Indian Ports
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hs-codes"
                    className="block px-4 py-1.5 hover:bg-blue-800 rounded-md"
                  >
                    HS Codes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/converter"
                    // className={`nav-link ${
                    //   pathname === "/converter" ? "active" : ""
                    // }`}
                    className="block px-4 py-1.5 hover:bg-blue-800 rounded-md"
                  >
                    Converter
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link
                href="/about-us"
                className={`nav-link ${pathname === "/about-us" ? "active" : ""
                  }`}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact-us"
                className={`nav-link ${pathname === "/contact-us" ? "active" : ""
                  }`}
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div className="navbar-center flex gap-5 text-md">
          {[fromCurrency, toCurrency].map((currency, index) => (
            <div key={index} className="relative" ref={dropdownRef}>
              <div
                className="border-white border p-2 rounded-md cursor-pointer flex items-center gap-2"
                onClick={() =>
                  setDropdownOpen(dropdownOpen === index ? null : index)
                }
              >
                <Image
                  src={getFlagUrl(currency)}
                  alt="flag"
                  width={30}
                  height={30}
                />
                {currency}{" "}
                <span className="bg-blue-200 rounded-md px-4 text-blue-900">
                  {index === 0 ? amount : convertedAmount}
                </span>
              </div>
              {dropdownOpen === index && (
                <div
                  style={{
                    position: "absolute",
                    zIndex: 30,
                    maxHeight: "170px",
                    overflowY: "auto",
                    borderRadius: "4px",
                  }}
                  className="shadow-md bg-white text-black p-2.5 space-y-1 top-12"
                >
                  {countryCurrencies.map((item, i) => (
                    <div
                      key={i}
                      className="cursor-pointer pr-3 border-b-2 hover:bg-slate-200 flex gap-2 items-center p-1"
                      onClick={() => {
                        if (index === 0) setFromCurrency(item.code);
                        else setToCurrency(item.code);
                        setDropdownOpen(null);
                      }}
                    >
                      <Image
                        src={getFlagUrl(item.code)}
                        alt={item.country}
                        width={40}
                        height={40}
                      />
                      {item.code}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="navbar-end flex gap-8 ">
        <Link href="/admin-dashboard" className="btn btn-sm">
          Admin
        </Link>
        {auth && auth.email ? (
          <button onClick={handleLogout} className="btn btn-sm">
            Logout
          </button>
        ) : (
          <Link href="/login" className="btn btn-sm">
            Login In
          </Link>
        )}

      </div>
    </div>
  );
};

export default Navbar;
