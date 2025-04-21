"use client";
import React, { useEffect, useState } from "react";
import { CiEraser } from "react-icons/ci";
import { IoIosSearch, IoMdClose } from "react-icons/io";

const TestFilter = ({
  leftFilterData,
  graphFilterHandler,
  recordData,
  setLeftFilterData,
  setLeftFilterData2,
  dataType,
  info,
}) => {
  // console.log("LEFT FILTER==========", leftFilterData);
  const [searchValue, setSearchValue] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [checkboxes, setCheckboxes] = useState({});

  useEffect(() => {
    const keys = Array.from(
      new Set(leftFilterData?.flatMap((item) => Object.keys(item)))
    );

    const initialCheckboxes = {};
    keys.forEach((key) => {
      const values = uniqueValues(key);
      initialCheckboxes[key] = {
        selectAll: true,
        items: values.map((value) => ({ value, checked: true })),
      };
    });

    setCheckboxes(initialCheckboxes);

    testingFun(leftFilterData);
  }, [leftFilterData]);

  const handleCheckboxChange = (key, index) => {
    setCheckboxes((prev) => {
      const updatedItems = prev[key]?.items.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      );

      const newState = {
        ...prev,
        [key]: { items: updatedItems },
      };

      return newState;
    });
  };

  const handleSelectAllChange = (key) => {
    const allSelected = !checkboxes[key]?.selectAll;


    // Get the initial data for the selected filter
    let initialData = [];
    if (allSelected) {
      initialData = leftFilterData.filter((item) =>
        uniqueValues(key).includes(item[key])
      );
    }
    setCheckboxes((prev) => ({
      ...prev,
      [key]: {
        selectAll: allSelected,
        items: uniqueValues(key).map((value) => ({
          value,
          checked: allSelected, // Toggle all items based on "Select All"
        })),
      },
    }));


    // ✅ Update the filtered data only if "Select All" is checked
    if (allSelected) {
      setLeftFilterData2(initialData);
    } else {
      setLeftFilterData2([]); // Clear data if unchecked
    }
  };

  // useEffect( () => {
  //   formatDataIntoFilterObjects(leftFilterData)
  // }, [])

  // const formatDataIntoFilterObjects = (data) => {
  //   const filterObject = {};
  //   data.forEach(dataItem => {
  //     for( const [key, value] of Object.entries(dataItem)){
  //       if([
  //         "indianPort",
  //         "HS_Code",
  //         "productDescription",
  //         "quantityUnits",
  //         "unitPrice",
  //         "currency",
  //         "productName",
  //         "HS_Code",
  //         "indianCompany",
  //         "foreignCompany",
  //         "foreignCountry"
  //       ].includes(key)){
  //         console.log(key, value, '+++++++')
  //         if(filterObject[key]){
  //           if(!filterObject[key][value.toString()]){
  //             filterObject[key][value.toString()] = true
  //           }
  //         }else{
  //           filterObject[key]={}
  //           filterObject[key][value.toString()] = true
  //         }
  //       }
  //       console.log(filterObject[key], '+++++')
  //     }
  //   })
  //   // console.log(JSON.stringify(filterObject), '0000000')
  // }



  const uniqueKeys = Array.from(
    new Set(
      leftFilterData
        .flatMap((item) => Object.keys(item))
        .filter((key) => key !== "dateOfShipment") // Exclude "dateofshipment"
    )
  );

  const uniqueValues = (key) => {
    if (key === "dateOfShipment") return []; // Ensure no values for "dateofshipment"
    const values = leftFilterData.map((item) => item[key]);
    return Array.from(new Set(values)); // Remove duplicate values for the given key
  };

  const formatKey = (key) => {
    return key
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/([A-Z])/g, " $1") // Add spaces before uppercase letters in camelCase
      .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize each word
      .trim(); // Remove extra spaces
  };

  const aggregate = (arr, query) => {
    console.log("INSIDE AGGREGATE===========", arr, query, uncheckedItems);

    uncheckedItems.push({
      key: query.key,
      value: query.value[0],
    });
    
    const filteredList = arr.filter(
      (item) =>
        !uncheckedItems.some((unchecked) => {
          let keyName = unchecked.key;
          return item[keyName] === unchecked.value;
        })
    );

    console.log("filterList============", filteredList);
    setLeftFilterData(filteredList);
    setLeftFilterData2(filteredList);
    return testingFun(filteredList);
  };

  const testingFun = (arr) => {
    let result = {
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
      uniqueForeignCompanies: new Set(),
    };


    if (dataType === "cleaned data") {
      result.topProductByQuantity = {};
      result.topProductByValue = {};
      result.productShipmentCount = {};
    }

    arr.forEach((item) => {
      const year = item.dateOfShipment.split("-")[0];

      // Track unique companies
      result.uniqueIndianCompanies.add(item.indianCompany);
      result.uniqueForeignCompanies.add(item.foreignCompany);

      // Aggregate Year by quantity and value
      result.topYearsByQuantity[year] =
        (result.topYearsByQuantity[year] || 0) + parseFloat(item.quantity);
      result.topYearsByValue[year] =
        (result.topYearsByValue[year] || 0) +
        parseFloat(item.quantity) * parseFloat(item.unitPrice);

      if (info === "import") {
        // Aggregate buyers by quantity and value
        result.topBuyerByQuantity[item.indianCompany] =
          (result.topBuyerByQuantity[item.indianCompany] || 0) +
          parseFloat(item.quantity);
        result.topBuyerByValue[item.indianCompany] =
          (result.topBuyerByValue[item.indianCompany] || 0) +
          parseFloat(item.quantity) * parseFloat(item.unitPrice);
        //  Aggregate suppliers by quantity and value
        result.topSupplierByQuantity[item.foreignCompany] =
          (result.topSupplierByQuantity[item.foreignCompany] || 0) +
          parseFloat(item.quantity);
        result.topSupplierByValue[item.foreignCompany] =
          (result.topSupplierByValue[item.foreignCompany] || 0) +
          parseFloat(item.quantity) * parseFloat(item.unitPrice);
      }
      //  else {
      //   // Aggregate suppliers by quantity and value
      //   result.topSupplierByQuantity[item.indianCompany] =
      //     (result.topSupplierByQuantity[item.indianCompany] || 0) +
      //     parseFloat(item.quantity);
      //   result.topSupplierByValue[item.indianCompany] =
      //     (result.topSupplierByValue[item.indianCompany] || 0) +
      //     parseFloat(item.quantity) * parseFloat(item.unitPrice);
      // }

      if (info === "export") {
        // Aggregate buyers by quantity and value
        result.topBuyerByQuantity[item.foreignCompany] =
          (result.topBuyerByQuantity[item.foreignCompany] || 0) +
          parseFloat(item.quantity);
        result.topBuyerByValue[item.foreignCompany] =
          (result.topBuyerByValue[item.foreignCompany] || 0) +
          parseFloat(item.quantity) * parseFloat(item.unitPrice);

        // Aggregate suppliers by quantity and value
        result.topSupplierByQuantity[item.indianCompany] =
          (result.topSupplierByQuantity[item.indianCompany] || 0) +
          parseFloat(item.quantity);
        result.topSupplierByValue[item.indianCompany] =
          (result.topSupplierByValue[item.indianCompany] || 0) +
          parseFloat(item.quantity) * parseFloat(item.unitPrice);
      }
      //  else {
      //   // Aggregate suppliers by quantity and value
      //   result.topSupplierByQuantity[item.foreignCompany] =
      //     (result.topSupplierByQuantity[item.foreignCompany] || 0) +
      //     parseFloat(item.quantity);
      //   result.topSupplierByValue[item.foreignCompany] =
      //     (result.topSupplierByValue[item.foreignCompany] || 0) +
      //     parseFloat(item.quantity) * parseFloat(item.unitPrice);
      // }

      // Aggregate Indian ports by quantity and value
      result.topIndianPortByQuantity[item.indianPort] =
        (result.topIndianPortByQuantity[item.indianPort] || 0) +
        parseFloat(item.quantity);
      result.topIndianPortByValue[item.indianPort] =
        (result.topIndianPortByValue[item.indianPort] || 0) +
        parseFloat(item.quantity) * parseFloat(item.unitPrice);

      // Aggregate countries by quantity and value
      result.topCountryByQuantity[item.foreignCountry] =
        (result.topCountryByQuantity[item.foreignCountry] || 0) +
        parseFloat(item.quantity);
      result.topCountryByValue[item.foreignCountry] =
        (result.topCountryByValue[item.foreignCountry] || 0) +
        parseFloat(item.quantity) * parseFloat(item.unitPrice);

      // Count shipments for each category
      result.yearShipmentCount[year] =
        (result.yearShipmentCount[year] || 0) + 1;

      result.buyerShipmentCount[item.indianCompany] =
        (result.buyerShipmentCount[item.indianCompany] || 0) + 1;
      result.supplierShipmentCount[item.foreignCompany] =
        (result.supplierShipmentCount[item.foreignCompany] || 0) + 1;
      result.indianPortShipmentCount[item.indianPort] =
        (result.indianPortShipmentCount[item.indianPort] || 0) + 1;
      result.countryShipmentCount[item.foreignCountry] =
        (result.countryShipmentCount[item.foreignCountry] || 0) + 1;

      if (dataType === "cleaned data") {
        // Aggregate Product by quantity and value only if dataType is "cleaned data"
        result.topProductByQuantity[item.productName] =
          (result.topProductByQuantity[item.productName] || 0) +
          parseFloat(item.quantity);
        result.topProductByValue[item.productName] =
          (result.topProductByValue[item.productName] || 0) +
          parseFloat(item.quantity) * parseFloat(item.unitPrice);

        result.productShipmentCount[item.productName] =
          (result.productShipmentCount[item.productName] || 0) + 1;
      }

      // Aggregate HScode by quantity and value only if dataType is "cleaned data"
      result.topHScodeByQuantity[item.HS_Code] =
        (result.topHScodeByQuantity[item.HS_Code] || 0) +
        parseFloat(item.quantity);
      result.topHScodeByValue[item.HS_Code] =
        (result.topHScodeByValue[item.HS_Code] || 0) +
        parseFloat(item.quantity) * parseFloat(item.unitPrice);

      result.HScodeShipmentCount[item.HS_Code] =
        (result.HScodeShipmentCount[item.HS_Code] || 0) + 1;

      // Update total quantity and value
      result.totalQuantity += parseFloat(item.quantity);
      result.totalValue +=
        parseFloat(item.quantity) * parseFloat(item.unitPrice);
    });

    // Function to transform data to API format and include totalCount
    const transformToAPIFormat = (data, key, countData) => ({
      key,
      data: Object.keys(data)
        .map((label) => ({
          label,
          value: data[label],
          totalCount: countData[label] || 0, // Add totalCount
        }))
        .sort((a, b) => b.value - a.value), // Sort by value in descending order
      label: key.replace(/([A-Z])/g, " $1").trim(), // Format the key for display
    });

    const apiResponse = {
      data: [
        transformToAPIFormat(
          result.topYearsByQuantity,
          "topYearsByQuantity",
          result.yearShipmentCount
        ),
        transformToAPIFormat(
          result.topYearsByValue,
          "topYearsByValue",
          result.yearShipmentCount
        ),

        transformToAPIFormat(
          result.topBuyerByQuantity,
          "topBuyerByQuantity",
          result.buyerShipmentCount
        ),
        transformToAPIFormat(
          result.topBuyerByValue,
          "topBuyerByValue",
          result.buyerShipmentCount
        ),

        transformToAPIFormat(
          result.topSupplierByQuantity,
          "topSupplierByQuantity",
          result.supplierShipmentCount
        ),
        transformToAPIFormat(
          result.topSupplierByValue,
          "topSupplierByValue",
          result.supplierShipmentCount
        ),

        transformToAPIFormat(
          result.topIndianPortByQuantity,
          "topIndianPortByQuantity",
          result.indianPortShipmentCount
        ),
        transformToAPIFormat(
          result.topIndianPortByValue,
          "topIndianPortByValue",
          result.indianPortShipmentCount
        ),

        transformToAPIFormat(
          result.topCountryByQuantity,
          "topCountryByQuantity",
          result.countryShipmentCount
        ),
        transformToAPIFormat(
          result.topCountryByValue,
          "topCountryByValue",
          result.countryShipmentCount
        ),

        transformToAPIFormat(
          result.topHScodeByQuantity,
          "topHScodeByQuantity",
          result.HScodeShipmentCount
        ),
        transformToAPIFormat(
          result.topHScodeByValue,
          "topHScodeByValue",
          result.HScodeShipmentCount
        ),
      ],
      totalIndianCompanies: result.uniqueIndianCompanies.size,
      totalForeignCompanies: result.uniqueForeignCompanies.size,
      totalQuantity: result.totalQuantity,
      totalValue: result.totalValue,
      shipmentCount: arr.length,
    };

    if (dataType === "cleaned data") {
      apiResponse.data.push(
        transformToAPIFormat(
          result.topProductByQuantity,
          "topProductByQuantity",
          result.productShipmentCount
        ),
        transformToAPIFormat(
          result.topProductByValue,
          "topProductByValue",
          result.productShipmentCount
        )
      );
    }

    graphFilterHandler(apiResponse);

    return apiResponse;
  };

  const getSingleFilter = (key, value) => {
    setCheckboxes((prev) => ({
      ...prev,
      [key]: {
        items: prev[key].items.map((item) =>
          item.value === value ? { ...item, checked: true } : item
        ),
      },
    }));

    const list = uncheckedItems.filter((item) => item.value != value);
    const filteredList = recordData.data.filter(
      (item) =>
        !list.some((unchecked) => {
          let keyName = unchecked.key;
          return item[keyName] === unchecked.value;
        })
    );
    console.log("delete unchecked::::::::::", filteredList, list);
    setLeftFilterData2(filteredList);
    return testingFun(filteredList);
  };

  const handleResetFilters = () => {
    // Initialize checkboxes with "Select All" checked and all items checked
    const resetCheckboxes = {};
    uniqueKeys.forEach((key) => {
      resetCheckboxes[key] = {
        selectAll: true, // ✅ "Select All" checked
        items: uniqueValues(key).map((value) => ({
          value,
          checked: true, // ✅ All individual checkboxes checked
        })),
      };
    });

    setCheckboxes(resetCheckboxes);

    // ✅ Reset the filtered data to the full dataset (initial data)
    setLeftFilterData2(leftFilterData);
  };

  const uncheckedItems = Object.entries(checkboxes).flatMap(([key, data]) =>
    data.items.filter((item) => !item.checked).map((item) => ({ key, ...item }))
  );

  return (
    <div
      className="w-44 rounded-md flex bg-white relative shadow-xl"
      onMouseLeave={() => setActiveIndex(null)}
    >
      <div className="w-full flex flex-col justify-between rounded-md">
        <div className="p-3 border-b-2">
          <h4 className="font-semibold text-xl">Filters</h4>
        </div>

        {leftFilterData.length > 0 && (
          <div>
            {Object.keys(leftFilterData[0])
              .filter((key) => key !== "dateOfShipment" && key !== "checked")
              .map((key, index) => (
                <div key={key} className="relative">
                  <div
                    className={`p-3 flex justify-between items-center cursor-pointer hover:bg-gray-300 ${
                      index === Object.keys(leftFilterData[0]).length - 2
                        ? ""
                        : "border-b-2"
                    }`}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    {formatKey(key)}
                  </div>
                  {activeIndex === index && (
                    <div
                      className="z-10 absolute w-56 bg-white border-gray-300 rounded-lg p-2 border-2"
                      style={{ top: `${-5}px`, left: "100%" }}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
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
                        {/* Select All Checkbox */}
                        <label className="flex items-center gap-2 my-2">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm"
                            checked={
                              checkboxes[uniqueKeys[index]]?.selectAll || false
                            }
                            onChange={() => {
                              handleSelectAllChange(uniqueKeys[index]);
                              aggregate(leftFilterData, {
                                key: uniqueKeys[index],
                                value: checkboxes[uniqueKeys[index]].items.map(
                                  (item, i) => item.value
                                ),
                              });
                            }}
                          />
                          <span>Select All</span>
                        </label>
                        <CiEraser
                          size={22}
                          className="cursor-pointer"
                          onClick={handleResetFilters}
                        />
                      </div>
                      {/* Render Unique Values for the Active Key */}
                      <div className="flex flex-col gap-1 max-h-72 overflow-y-auto">
                        {uniqueValues(uniqueKeys[index])
                          .filter((value) =>
                            String(value)
                              .toLowerCase()
                              .includes(searchValue.toLowerCase())
                          )
                          .map((value, i) => (
                            <div key={i}>
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  className="checkbox checkbox-sm"
                                  checked={
                                    checkboxes[uniqueKeys[index]]?.items?.some(
                                      (item) =>
                                        item.value === value && item.checked
                                    ) ?? true
                                  }
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      getSingleFilter(uniqueKeys[index], value);
                                    } else {
                                      handleCheckboxChange(
                                        uniqueKeys[index],
                                        i
                                      );
                                      aggregate(leftFilterData, {
                                        key: uniqueKeys[index],
                                        value: [value],
                                      });
                                    }
                                  }}
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
        )}
      </div>
    </div>
  );
};

export default TestFilter;
