"use client";

import React, { useEffect, useState } from "react";
import { CiEraser } from "react-icons/ci";
import { IoIosSearch, IoMdClose } from "react-icons/io";

const TestFilter4 = ({
  allData,
  leftFilterData,
  graphFilterHandler,
  setLeftFilterData,
  dataType,
  info,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);
  const [filterStates, setFilterStates] = useState({});
  const [filterData, setFilterData] = useState({});

  // Mapping object for display names
  const fieldMapping = {
    indianPort: "Indian Port",
    HS_Code: "HS Code",
    productDescription: "Product Description",
    quantityUnits: "Quantity Units",
    quantity: "Quantity",
    unitPrice: "Unit Price",
    currency: "Currency",
    productName: "Product Name",
    indianCompany: "Indian Company",
    foreignCompany: "Foreign Company",
    foreignCountry: "Foreign Country",
    "CAS _Number": "CAS Number"
  };

  // Initialize filter states from data
  useEffect(() => {
    const initializeFilters = () => {
      const filters = {};
      const states = {};

      leftFilterData.forEach(item => {
        Object.entries(item).forEach(([key, value]) => {
          if (fieldMapping[key]) {
            const displayKey = fieldMapping[key];
            if (!filters[displayKey]) {
              filters[displayKey] = new Set();
              states[displayKey] = { selectAll: true };
            }
            filters[displayKey].add(value.toString());
          }
        });
      });

      // Convert Sets to arrays and create filter objects
      const processedFilters = {};
      Object.entries(filters).forEach(([key, values]) => {
        processedFilters[key] = Array.from(values).reduce((acc, value) => {
          acc[value] = true;
          return acc;
        }, {});
      });

      setFilterData(processedFilters);
      setFilterStates(states);
    };

    initializeFilters();
  }, [leftFilterData]);

  // Handle individual filter changes
  const handleFilterChange = (filterKey, value, checked) => {
    // Update filter state
    setFilterData(prev => ({
      ...prev,
      [filterKey]: {
        ...prev[filterKey],
        [value]: checked
      }
    }));

    // Update data based on filter
    const originalKey = Object.keys(fieldMapping).find(key => fieldMapping[key] === filterKey);
    const newData = checked
      ? [...leftFilterData, ...allData.filter(item => String(item[originalKey]) === String(value))]
      : leftFilterData.filter(item => String(item[originalKey]) !== String(value));

    setLeftFilterData(newData);
    processDataForGraphs(newData);
  };

  // Handle select all for a filter category
  const handleSelectAll = (filterKey, checked) => {
    const updatedFilterData = {
      ...filterData,
      [filterKey]: Object.keys(filterData[filterKey]).reduce((acc, key) => {
        acc[key] = checked;
        return acc;
      }, {})
    };
    setFilterData(updatedFilterData);

    // Update filter states
    setFilterStates(prev => ({
      ...prev,
      [filterKey]: { ...prev[filterKey], selectAll: checked }
    }));

    // Update data based on all filters
    const originalKey = Object.keys(fieldMapping).find(key => fieldMapping[key] === filterKey);
    const newData = checked
      ? allData
      : leftFilterData.filter(item => !Object.keys(filterData[filterKey]).includes(String(item[originalKey])));

    setLeftFilterData(newData);
    processDataForGraphs(newData);
  };

  // Process data for graphs (similar to original testingFun)
  const processDataForGraphs = (data) => {
    const result = {
      topHScodeByQuantity: {},
      topHScodeByValue: {},
      HScodeShipmentCount: {},
      topProductByQuantity: {},
      topProductByValue: {},
      productShipmentCount: {},
      topYearsByQuantity: {},
      topYearsByValue: {},
      topBuyerByQuantity: {},
      topBuyerByValue: {},
      topSupplierByQuantity: {},
      topSupplierByValue: {},
      topIndianPortByQuantity: {},
      topIndianPortByValue: {},
      topCountryByQuantity: {},
      topCountryByValue: {},
      yearShipmentCount: {},
      buyerShipmentCount: {},
      supplierShipmentCount: {},
      indianPortShipmentCount: {},
      countryShipmentCount: {},
      totalQuantity: 0,
      totalValue: 0,
      uniqueIndianCompanies: new Set(),
      uniqueForeignCompanies: new Set()
    };

    data.forEach(item => {
      const year = item.dateOfShipment.split('-')[0];
      const quantity = parseFloat(item.quantity);
      const value = quantity * parseFloat(item.unitPrice);

      // Track unique companies
      result.uniqueIndianCompanies.add(item.indianCompany);
      result.uniqueForeignCompanies.add(item.foreignCompany);

      // Aggregate by year
      result.topYearsByQuantity[year] = (result.topYearsByQuantity[year] || 0) + quantity;
      result.topYearsByValue[year] = (result.topYearsByValue[year] || 0) + value;
      result.yearShipmentCount[year] = (result.yearShipmentCount[year] || 0) + 1;

      // Aggregate by HS Code
      result.topHScodeByQuantity[item.HS_Code] = (result.topHScodeByQuantity[item.HS_Code] || 0) + quantity;
      result.topHScodeByValue[item.HS_Code] = (result.topHScodeByValue[item.HS_Code] || 0) + value;
      result.HScodeShipmentCount[item.HS_Code] = (result.HScodeShipmentCount[item.HS_Code] || 0) + 1;

      // Aggregate by Indian Port
      result.topIndianPortByQuantity[item.indianPort] = (result.topIndianPortByQuantity[item.indianPort] || 0) + quantity;
      result.topIndianPortByValue[item.indianPort] = (result.topIndianPortByValue[item.indianPort] || 0) + value;
      result.indianPortShipmentCount[item.indianPort] = (result.indianPortShipmentCount[item.indianPort] || 0) + 1;

      // Aggregate by Country
      result.topCountryByQuantity[item.foreignCountry] = (result.topCountryByQuantity[item.foreignCountry] || 0) + quantity;
      result.topCountryByValue[item.foreignCountry] = (result.topCountryByValue[item.foreignCountry] || 0) + value;
      result.countryShipmentCount[item.foreignCountry] = (result.countryShipmentCount[item.foreignCountry] || 0) + 1;

      if (info === 'import') {
        // Aggregate buyers (Indian companies for imports)
        result.topBuyerByQuantity[item.indianCompany] = (result.topBuyerByQuantity[item.indianCompany] || 0) + quantity;
        result.topBuyerByValue[item.indianCompany] = (result.topBuyerByValue[item.indianCompany] || 0) + value;
        result.buyerShipmentCount[item.indianCompany] = (result.buyerShipmentCount[item.indianCompany] || 0) + 1;

        // Aggregate suppliers (Foreign companies for imports)
        result.topSupplierByQuantity[item.foreignCompany] = (result.topSupplierByQuantity[item.foreignCompany] || 0) + quantity;
        result.topSupplierByValue[item.foreignCompany] = (result.topSupplierByValue[item.foreignCompany] || 0) + value;
        result.supplierShipmentCount[item.foreignCompany] = (result.supplierShipmentCount[item.foreignCompany] || 0) + 1;
      } else {
        // Aggregate suppliers (Indian companies for exports)
        result.topSupplierByQuantity[item.indianCompany] = (result.topSupplierByQuantity[item.indianCompany] || 0) + quantity;
        result.topSupplierByValue[item.indianCompany] = (result.topSupplierByValue[item.indianCompany] || 0) + value;
        result.supplierShipmentCount[item.indianCompany] = (result.supplierShipmentCount[item.indianCompany] || 0) + 1;

        // Aggregate buyers (Foreign companies for exports)
        result.topBuyerByQuantity[item.foreignCompany] = (result.topBuyerByQuantity[item.foreignCompany] || 0) + quantity;
        result.topBuyerByValue[item.foreignCompany] = (result.topBuyerByValue[item.foreignCompany] || 0) + value;
        result.buyerShipmentCount[item.foreignCompany] = (result.buyerShipmentCount[item.foreignCompany] || 0) + 1;
      }

      // Update totals
      result.totalQuantity += quantity;
      result.totalValue += value;
    });

    graphFilterHandler(result);
  };

  // Reset all filters
  const handleResetFilters = () => {
    const resetFilters = Object.keys(filterData).reduce((acc, key) => {
      acc[key] = Object.keys(filterData[key]).reduce((values, value) => {
        values[value] = true;
        return values;
      }, {});
      return acc;
    }, {});

    setFilterData(resetFilters);
    setFilterStates(Object.keys(resetFilters).reduce((acc, key) => {
      acc[key] = { selectAll: true };
      return acc;
    }, {}));

    setLeftFilterData(allData);
    processDataForGraphs(allData);
  };

  // Filter the options based on search value
  const getFilteredOptions = (filterKey) => {
    if (!filterData[filterKey]) return [];
    return Object.keys(filterData[filterKey]).filter(value =>
      value.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  return (
    <div className="w-44 rounded-md flex bg-white relative shadow-xl">
      <div className="w-full flex flex-col justify-between rounded-md">
        <div className="p-3 border-b-2">
          <h4 className="font-semibold text-xl">Filters</h4>
        </div>
        <div>
          {Object.keys(filterData).map((filterKey) => (
            <div key={filterKey} className="relative">
              <div
                className="p-3 flex justify-between items-center cursor-pointer hover:bg-gray-300"
                onMouseEnter={() => setActiveFilter(filterKey)}
                onMouseLeave={() => setActiveFilter(null)}
              >
                {filterKey}
              </div>
              {activeFilter === filterKey && (
                <div
                  className="z-10 absolute w-56 bg-white border-gray-300 rounded-lg p-2 border-2"
                  style={{ top: "-5px", left: "100%" }}
                >
                  <div className="border-b-2 border-black flex justify-center items-center gap-2">
                    <IoIosSearch size={30} />
                    <input
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="Type here"
                      className="w-full focus:outline-none focus:ring-0"
                    />
                    <IoMdClose
                      size={30}
                      className="cursor-pointer"
                      onClick={() => setSearchValue("")}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="flex items-center gap-2 my-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={filterStates[filterKey]?.selectAll}
                        onChange={(e) => handleSelectAll(filterKey, e.target.checked)}
                      />
                      <span>Select All</span>
                    </label>
                    <CiEraser
                      size={22}
                      className="cursor-pointer"
                      onClick={handleResetFilters}
                    />
                  </div>
                  <div className="flex flex-col gap-1 max-h-72 overflow-y-auto">
                    {getFilteredOptions(filterKey).map((value) => (
                      <div key={value}>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm"
                            checked={filterData[filterKey][value]}
                            onChange={(e) =>
                              handleFilterChange(filterKey, value, e.target.checked)
                            }
                          />
                          <span>{value}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestFilter4;