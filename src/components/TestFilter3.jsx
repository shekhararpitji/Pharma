// "use client"
// import { useEffect, useState } from "react"
// import { CiEraser } from "react-icons/ci"
// import { IoIosSearch, IoMdClose } from "react-icons/io"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"
// import { Eraser, Search, X } from "lucide-react"
// import { Checkbox } from "./ui/checkbox"
// import { ScrollArea } from "./ui/scroll-area"

// const TestFilter3 = ({
//   allData,
//   leftFilterData,
//   graphFilterHandler,
//   recordData,
//   setLeftFilterData,
//   dataType,
//   info,
// }) => {
//   const [searchValue, setSearchValue] = useState("")
//   const [activeIndex, setActiveIndex] = useState("")
//   const [checkboxes, setCheckboxes] = useState({})
//   const [selectAllFilterTracker, setSelectAllFilterTracker] = useState({})

//   const [filterData, setFilterData] = useState({})
//   const [currentKey, setCurrentKey] = useState("")
//   const [previousFilter, setPreviousFilter] = useState({})

//   const mapping = {
//     indianPort: "Indian Port",
//     HS_Code: "H S Code",
//     productDescription: "Product Description",
//     quantityUnits: "Quantity Units",
//     quantity: "Quantity",
//     unitPrice: "Unit Price",
//     currency: "Currency",
//     productName: "Product Name",
//     indianCompany: "Indian Company",
//     foreignCompany: "Foreign Company",
//     foreignCountry: "Foreign Country",
//     "CAS _Number": "CAS Number",
//   }

//   useEffect(() => {
//     const keys = Array.from(new Set(leftFilterData?.flatMap((item) => Object.keys(item))))

//     const initialCheckboxes = {}
//     keys.forEach((key) => {
//       const values = uniqueValues(key)
//       initialCheckboxes[key] = {
//         selectAll: true,
//         items: values.map((value) => ({ value, checked: true })),
//       }
//     })

//     setCheckboxes(initialCheckboxes)

//     testingFun(leftFilterData)
//   }, [leftFilterData])

//   const handleCheckboxChange = (key, index) => {
//     setCheckboxes((prev) => {
//       const updatedItems = prev[key]?.items.map((item, i) => (i === index ? { ...item, checked: !item.checked } : item))

//       const newState = {
//         ...prev,
//         [key]: { items: updatedItems },
//       }

//       return newState
//     })
//   }

//   const handleSelectAllChange = (key, checked) => {
//     setSelectAllFilterTracker((prevState) => ({
//       ...prevState,
//       [key]: checked,
//     }))
//     console.log(key, checked, selectAllFilterTracker, "++===+++")

//     const formattedKey = Object.keys(mapping).find((mappingKey) => mapping[mappingKey] === key)

//     console.log(formattedKey,"gggggggggg")

//     if (!formattedKey) return

//     // Create a new filter object to track changes
//     const currentFilterObject = {}

//     // If checked is true, we want to include all items for this filter
//     // If checked is false, we want to exclude all items for this filter
//     if (checked) {
//       // When selecting all, we need to restore all items that match this filter key
//       // First, get all unique values for this key from the original data
//       const allValuesForKey = Array.from(new Set(allData.map((item) => String(item[formattedKey]))))

//       // Mark all values as checked in our tracking object
//       allValuesForKey.forEach((value) => {
//         currentFilterObject[value] = true
//       })


//       console.log(allData,"ggggggggggggggggooo")

//       // Set the filtered data to include all items
//       setLeftFilterData(allData)
//     } else {
//       // When deselecting all, we need to remove all items that match this filter key
//       // Mark all values as unchecked in our tracking object
//       Object.keys(filterData[key] || {}).forEach((value) => {
//         currentFilterObject[value] = false
//       })

//       // Filter out all items that have this key
//       const newFilteredData = leftFilterData.filter((item) => !item[formattedKey])
//       console.log(newFilteredData,"ggggggggggggggggggggggg")
//       setLeftFilterData(newFilteredData)
//     }

//     // Update our previous filter state
//     setPreviousFilter({ ...currentFilterObject })
//     setCurrentKey(key)

//     // Update the graphs with the new filtered data
//     return testingFun(checked ? allData : leftFilterData.filter((item) => !item[formattedKey]))
//   }

//   const uniqueKeys = Array.from(
//     new Set(
//       leftFilterData
//         .flatMap((item) => Object.keys(item))
//         .filter((key) => key !== "dateOfShipment"), // Exclude "dateofshipment"
//     ),
//   )

//   const uniqueValues = (key) => {
//     if (key === "dateOfShipment") return [] // Ensure no values for "dateofshipment"
//     const values = leftFilterData.map((item) => item[key])
//     return Array.from(new Set(values)) // Remove duplicate values for the given key
//   }

//   const testingFun = (arr) => {
//     const result = {
//       topHScodeByQuantity: {},
//       topHScodeByValue: {},
//       HScodeShipmentCount: {},

//       topProductByQuantity: {},
//       topProductByValue: {},
//       productShipmentCount: {},
//       topYearsByQuantity: {},
//       topYearsByValue: {},

//       topBuyerByQuantity: {},
//       topBuyerByValue: {},

//       topSupplierByQuantity: {},
//       topSupplierByValue: {},

//       topIndianPortByQuantity: {},
//       topIndianPortByValue: {},

//       topCountryByQuantity: {},
//       topCountryByValue: {},

//       yearShipmentCount: {},
//       buyerShipmentCount: {},
//       supplierShipmentCount: {},
//       indianPortShipmentCount: {},
//       countryShipmentCount: {},

//       totalQuantity: 0,
//       totalValue: 0,

//       uniqueIndianCompanies: new Set(),
//       uniqueForeignCompanies: new Set(),
//     }

//     if (dataType === "cleaned data") {
//       result.topProductByQuantity = {}
//       result.topProductByValue = {}
//       result.productShipmentCount = {}
//     }

//     arr.forEach((item) => {
//       const year = item.dateOfShipment.split("-")[0]

//       // Track unique companies
//       result.uniqueIndianCompanies.add(item.indianCompany)
//       result.uniqueForeignCompanies.add(item.foreignCompany)

//       // Aggregate Year by quantity and value
//       result.topYearsByQuantity[year] = (result.topYearsByQuantity[year] || 0) + Number.parseFloat(item.quantity)
//       result.topYearsByValue[year] =
//         (result.topYearsByValue[year] || 0) + Number.parseFloat(item.quantity) * Number.parseFloat(item.unitPrice)

//       if (info === "import") {
//         // Aggregate buyers by quantity and value
//         result.topBuyerByQuantity[item.indianCompany] =
//           (result.topBuyerByQuantity[item.indianCompany] || 0) + Number.parseFloat(item.quantity)
//         result.topBuyerByValue[item.indianCompany] =
//           (result.topBuyerByValue[item.indianCompany] || 0) +
//           Number.parseFloat(item.quantity) * Number.parseFloat(item.unitPrice)
//         //  Aggregate suppliers by quantity and value
//         result.topSupplierByQuantity[item.foreignCompany] =
//           (result.topSupplierByQuantity[item.foreignCompany] || 0) + Number.parseFloat(item.quantity)
//         result.topSupplierByValue[item.foreignCompany] =
//           (result.topSupplierByValue[item.foreignCompany] || 0) +
//           Number.parseFloat(item.quantity) * Number.parseFloat(item.unitPrice)
//       }

//       if (info === "export") {
//         // Aggregate buyers by quantity and value
//         result.topBuyerByQuantity[item.foreignCompany] =
//           (result.topBuyerByQuantity[item.foreignCompany] || 0) + Number.parseFloat(item.quantity)
//         result.topBuyerByValue[item.foreignCompany] =
//           (result.topBuyerByValue[item.foreignCompany] || 0) +
//           Number.parseFloat(item.quantity) * Number.parseFloat(item.unitPrice)

//         // Aggregate suppliers by quantity and value
//         result.topSupplierByQuantity[item.indianCompany] =
//           (result.topSupplierByQuantity[item.indianCompany] || 0) + Number.parseFloat(item.quantity)
//         result.topSupplierByValue[item.indianCompany] =
//           (result.topSupplierByValue[item.indianCompany] || 0) +
//           Number.parseFloat(item.quantity) * Number.parseFloat(item.unitPrice)
//       }

//       // Aggregate Indian ports by quantity and value
//       result.topIndianPortByQuantity[item.indianPort] =
//         (result.topIndianPortByQuantity[item.indianPort] || 0) + Number.parseFloat(item.quantity)
//       result.topIndianPortByValue[item.indianPort] =
//         (result.topIndianPortByValue[item.indianPort] || 0) +
//         Number.parseFloat(item.quantity) * Number.parseFloat(item.unitPrice)

//       // Aggregate countries by quantity and value
//       result.topCountryByQuantity[item.foreignCountry] =
//         (result.topCountryByQuantity[item.foreignCountry] || 0) + Number.parseFloat(item.quantity)
//       result.topCountryByValue[item.foreignCountry] =
//         (result.topCountryByValue[item.foreignCountry] || 0) +
//         Number.parseFloat(item.quantity) * Number.parseFloat(item.unitPrice)

//       // Count shipments for each category
//       result.yearShipmentCount[year] = (result.yearShipmentCount[year] || 0) + 1

//       result.buyerShipmentCount[item.indianCompany] = (result.buyerShipmentCount[item.indianCompany] || 0) + 1
//       result.supplierShipmentCount[item.foreignCompany] = (result.supplierShipmentCount[item.foreignCompany] || 0) + 1
//       result.indianPortShipmentCount[item.indianPort] = (result.indianPortShipmentCount[item.indianPort] || 0) + 1
//       result.countryShipmentCount[item.foreignCountry] = (result.countryShipmentCount[item.foreignCountry] || 0) + 1

//       if (dataType === "cleaned data") {
//         // Aggregate Product by quantity and value only if dataType is "cleaned data"
//         result.topProductByQuantity[item.productName] =
//           (result.topProductByQuantity[item.productName] || 0) + Number.parseFloat(item.quantity)
//         result.topProductByValue[item.productName] =
//           (result.topProductByValue[item.productName] || 0) +
//           Number.parseFloat(item.quantity) * Number.parseFloat(item.unitPrice)

//         result.productShipmentCount[item.productName] = (result.productShipmentCount[item.productName] || 0) + 1
//       }

//       // Aggregate HScode by quantity and value only if dataType is "cleaned data"
//       result.topHScodeByQuantity[item.HS_Code] =
//         (result.topHScodeByQuantity[item.HS_Code] || 0) + Number.parseFloat(item.quantity)
//       result.topHScodeByValue[item.HS_Code] =
//         (result.topHScodeByValue[item.HS_Code] || 0) +
//         Number.parseFloat(item.quantity) * Number.parseFloat(item.unitPrice)

//       result.HScodeShipmentCount[item.HS_Code] = (result.HScodeShipmentCount[item.HS_Code] || 0) + 1

//       // Update total quantity and value
//       result.totalQuantity += Number.parseFloat(item.quantity)
//       result.totalValue += Number.parseFloat(item.quantity) * Number.parseFloat(item.unitPrice)
//     })

//     // Function to transform data to API format and include totalCount
//     const transformToAPIFormat = (data, key, countData) => ({
//       key,
//       data: Object.keys(data)
//         .map((label) => ({
//           label,
//           value: data[label],
//           totalCount: countData[label] || 0, // Add totalCount
//         }))
//         .sort((a, b) => b.value - a.value), // Sort by value in descending order
//       label: key.replace(/([A-Z])/g, " $1").trim(), // Format the key for display
//     })

//     const apiResponse = {
//       data: [
//         transformToAPIFormat(result.topYearsByQuantity, "topYearsByQuantity", result.yearShipmentCount),
//         transformToAPIFormat(result.topYearsByValue, "topYearsByValue", result.yearShipmentCount),

//         transformToAPIFormat(result.topBuyerByQuantity, "topBuyerByQuantity", result.buyerShipmentCount),
//         transformToAPIFormat(result.topBuyerByValue, "topBuyerByValue", result.buyerShipmentCount),

//         transformToAPIFormat(result.topSupplierByQuantity, "topSupplierByQuantity", result.supplierShipmentCount),
//         transformToAPIFormat(result.topSupplierByValue, "topSupplierByValue", result.supplierShipmentCount),

//         transformToAPIFormat(result.topIndianPortByQuantity, "topIndianPortByQuantity", result.indianPortShipmentCount),
//         transformToAPIFormat(result.topIndianPortByValue, "topIndianPortByValue", result.indianPortShipmentCount),

//         transformToAPIFormat(result.topCountryByQuantity, "topCountryByQuantity", result.countryShipmentCount),
//         transformToAPIFormat(result.topCountryByValue, "topCountryByValue", result.countryShipmentCount),

//         transformToAPIFormat(result.topHScodeByQuantity, "topHScodeByQuantity", result.HScodeShipmentCount),
//         transformToAPIFormat(result.topHScodeByValue, "topHScodeByValue", result.HScodeShipmentCount),
//       ],
//       totalIndianCompanies: result.uniqueIndianCompanies.size,
//       totalForeignCompanies: result.uniqueForeignCompanies.size,
//       totalQuantity: result.totalQuantity,
//       totalValue: result.totalValue,
//       shipmentCount: arr.length,
//     }

//     if (dataType === "cleaned data") {
//       apiResponse.data.push(
//         transformToAPIFormat(result.topProductByQuantity, "topProductByQuantity", result.productShipmentCount),
//         transformToAPIFormat(result.topProductByValue, "topProductByValue", result.productShipmentCount),
//       )
//     }

//     graphFilterHandler(apiResponse)

//     return apiResponse
//   }

//   const getSingleFilter = (key, value, checked) => {
//     console.log("delete unchecked::::::::::", key, value, checked)
//     const formattedKey = Object.keys(mapping).find((mappingKey) => mapping[mappingKey] === key)

//     if (currentKey === key) {
//       setPreviousFilter({ ...previousFilter, [value]: checked })
//     } else {
//       setPreviousFilter({ [value]: checked })
//     }
//     setCurrentKey(key)

//     let newCheckedValue
//     if (checked) {
//       const filterFromAllData = allData.filter((item) => String(item[formattedKey]) === String(value))
//       newCheckedValue = [...leftFilterData, ...filterFromAllData]
//     } else {
//       newCheckedValue = leftFilterData.filter((item) => String(item[formattedKey]) !== String(value))
//     }

//     // Update the "Select All" state based on whether all items are checked
//     // First, get all the values for this filter category
//     const allValuesForKey = Object.keys(filterData[key] || {})

//     // Create a new state object with the updated value
//     const updatedFilterState = {
//       ...filterData[key],
//       [value]: checked,
//     }

//     // Check if all values are now checked
//     const allChecked = allValuesForKey.every((val) => {
//       // For the current value being changed, use the new checked state
//       if (val === value) return checked
//       // For all other values, use their existing state
//       return updatedFilterState[val]
//     })

//     // Update the "Select All" state for this key
//     setSelectAllFilterTracker((prevState) => ({
//       ...prevState,
//       [key]: allChecked,
//     }))

//     console.log(filterData, "-----+++++")
//     setLeftFilterData(newCheckedValue)
//     return testingFun(newCheckedValue)
//   }

//   const handleResetFilters = () => {
//     const resetCheckboxes = {}
//     uniqueKeys.forEach((key) => {
//       resetCheckboxes[key] = {
//         selectAll: true,
//         items: uniqueValues(key).map((value) => ({
//           value,
//           checked: true,
//         })),
//       }
//     })

//     setCheckboxes(resetCheckboxes)

//     // Reset all "Select All" states to true
//     const resetSelectAll = {}
//     Object.keys(mapping).forEach((key) => {
//       resetSelectAll[mapping[key]] = true
//     })
//     setSelectAllFilterTracker(resetSelectAll)

//     setLeftFilterData(allData)
//     testingFun(allData)
//   }

//   useEffect(() => {
//     formatDataIntoFilterObjects(leftFilterData)
//   }, [leftFilterData])

//   const formatDataIntoFilterObjects = (data) => {
//     const filterObject = {}

//     // First, initialize all filter categories with select all = true
//     Object.keys(mapping).forEach((key) => {
//       if (!selectAllFilterTracker[mapping[key]]) {
//         setSelectAllFilterTracker((prevState) => ({
//           ...prevState,
//           [mapping[key]]: true,
//         }))
//       }
//     })

//     // Then populate the filter values from the data
//     data.forEach((dataItem) => {
//       for (const [key, value] of Object.entries(dataItem)) {
//         if (
//           [
//             "indianPort",
//             "HS_Code",
//             "productDescription",
//             "quantity",
//             "quantityUnits",
//             "unitPrice",
//             "currency",
//             "productName",
//             "indianCompany",
//             "foreignCompany",
//             "foreignCountry",
//             "CAS _Number",
//           ].includes(key)
//         ) {
//           if (!filterObject[mapping[key]]) {
//             filterObject[mapping[key]] = {}
//           }

//           if (value !== undefined && value !== null) {
//             filterObject[mapping[key]][value.toString()] = true
//           }
//         }
//       }
//     })

//     // Apply any previous filter selections
//     if (currentKey && previousFilter) {
//       filterObject[currentKey] = { ...(filterObject[currentKey] || {}), ...previousFilter }
//     }

//     // Update "Select All" state for each filter category
//     // by checking if all items in that category are selected
//     Object.keys(filterObject).forEach((key) => {
//       const allValues = Object.keys(filterObject[key])
//       const allChecked = allValues.every((val) => filterObject[key][val])

//       setSelectAllFilterTracker((prevState) => ({
//         ...prevState,
//         [key]: allChecked,
//       }))
//     })

//     setFilterData(filterObject)
//   }

//   return (
//     <div className="w-44 rounded-md flex bg-white relative shadow-xl" onMouseLeave={() => setActiveIndex(null)}>
//       <div className="w-full flex flex-col justify-between rounded-md">
//         <div className="p-3 border-b-2">
//           <h4 className="font-semibold text-xl">Filters</h4>
//         </div>
//         <div>
//           {Object.keys(filterData).map((key, index) => (
//             <div key={key} className="relative">
//               <Popover open={key === activeIndex} onOpenChange={(open) => setActiveIndex(open ? key : null)}>
//                 <PopoverTrigger asChild>
//                   <div
//                     className="p-3 flex justify-between items-center cursor-pointer hover:bg-gray-300"
//                     onMouseEnter={() => setActiveIndex(key)}
//                   >
//                     {key}
//                   </div>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-56 h-[200px] overflow-y-auto bg-white p-0 ml-[-5px]" side="right" align="center">
//                   <div className="border-b border-gray-200 p-2 flex items-center gap-2">
//                     <Search className="h-4 w-4 shrink-0 opacity-50" />
//                     <Input
//                       type="text"
//                       value={searchValue}
//                       onChange={(e) => setSearchValue(e.target.value)}
//                       placeholder="Type here"
//                       className="h-8 w-full border-0 p-0 border-black focus-visible:ring-0 focus-visible:ring-offset-0"
//                     />
//                     {searchValue && (
//                       <Button variant="ghost" size="icon" className="h-5 w-5 p-0" onClick={() => setSearchValue("")}>
//                         <X className="h-4 w-4" />
//                       </Button>
//                     )}
//                   </div>
//                   <div className="flex justify-between items-center p-2">
//                     <div className="flex items-center space-x-2">
//                       <Checkbox
//                         id="selectAll"
//                         checked={selectAllFilterTracker[key]}
//                         onCheckedChange={(checked) => handleSelectAllChange(key, checked === true)}
//                       />
//                       <label
//                         htmlFor="selectAll"
//                         className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                       >
//                         Select All
//                       </label>
//                     </div>
//                     <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleResetFilters}>
//                       <Eraser className="h-4 w-4" />
//                     </Button>
//                   </div>
//                   <ScrollArea className="h-72 px-2">
//                     {/* <div className="flex flex-col gap-1 py-1">
//                       {Object.keys(filterData[key])
//                         .filter((value) => searchValue === "" || value.toLowerCase().includes(searchValue.toLowerCase()))
//                         .map((value, i) => (
//                           <div key={i} className="flex items-center space-x-2 py-1">
//                             <Checkbox
//                               id={`filter-${i}`}
//                               checked={filterData[key][value]}
//                               onCheckedChange={(checked) => {
//                                 getSingleFilter(key, value, checked === true)
//                               }}
//                             />
//                             <label
//                               htmlFor={`filter-${i}`}
//                               className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                             >
//                               {value}
//                             </label>
//                           </div>
//                         ))}
//                     </div> */}

//                     <div className="flex flex-col gap-1 py-1">
//   {Object.keys(filterData[key])
//     .filter((value) => searchValue === "" || value.toLowerCase().includes(searchValue.toLowerCase()))
//     .map((value, i) => (
//       <div key={i} className="flex items-center space-x-2 py-1">
//         <Checkbox
//           id={`filter-${i}`}
//           checked={filterData[key][value]}
//           onCheckedChange={(checked) => {
//             getSingleFilter(key, value, checked === true)
//           }}
//         />
//         <label
//           htmlFor={`filter-${i}`}
//           className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//         >
//           {value}
//         </label>
//       </div>
//     ))}
//   {/* Handle Empty Case */}
//   {Object.keys(filterData[key]).filter((value) => searchValue === "" || value.toLowerCase().includes(searchValue.toLowerCase())).length === 0 && (
//     <div className="text-sm text-gray-500 py-2 px-1">No options available</div>
//   )}
// </div>

//                   </ScrollArea>
//                 </PopoverContent>
//               </Popover>
//             </div>

//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default TestFilter3




"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Eraser, Search, X } from "lucide-react"
import { Checkbox } from "./ui/checkbox"
import { ScrollArea } from "./ui/scroll-area"

const TestFilter3 = ({
  allData,
  leftFilterData,
  graphFilterHandler,
  recordData,
  setLeftFilterData,
  dataType,
  info,
}) => {
  const [searchValue, setSearchValue] = useState("")
  const [activeIndex, setActiveIndex] = useState("")
  const [checkboxes, setCheckboxes] = useState({})
  const [selectAllFilterTracker, setSelectAllFilterTracker] = useState({})

  const [filterData, setFilterData] = useState({})
  const [currentKey, setCurrentKey] = useState("")
  const [previousFilter, setPreviousFilter] = useState({})

  const mapping = {
    indianPort: "Indian Port",
    HS_Code: "H S Code",
    productDescription: "Product Description",
    quantityUnits: "Quantity Units",
    quantity: "Quantity",
    unitPrice: "Unit Price",
    currency: "Currency",
    productName: "Product Name",
    indianCompany: "Indian Company",
    foreignCompany: "Foreign Company",
    foreignCountry: "Foreign Country",
    "CAS _Number": "CAS Number",
  }

  useEffect(() => {
    const keys = Array.from(new Set(leftFilterData?.flatMap((item) => Object.keys(item))))

    const initialCheckboxes = {}
    keys.forEach((key) => {
      const values = uniqueValues(key)
      initialCheckboxes[key] = {
        selectAll: true,
        items: values.map((value) => ({ value, checked: true })),
      }
    })

    setCheckboxes(initialCheckboxes)

    testingFun(leftFilterData)
  }, [leftFilterData])

  const handleCheckboxChange = (key, index) => {
    setCheckboxes((prev) => {
      const updatedItems = prev[key]?.items.map((item, i) => (i === index ? { ...item, checked: !item.checked } : item))

      const newState = {
        ...prev,
        [key]: { items: updatedItems },
      }

      return newState
    })
  }

  const handleSelectAllChange = (key, checked) => {
    setSelectAllFilterTracker((prevState) => ({
      ...prevState,
      [key]: checked,
    }))
    console.log(key, checked, selectAllFilterTracker, "++===+++")

    const formattedKey = Object.keys(mapping).find((mappingKey) => mapping[mappingKey] === key)

    console.log(formattedKey, "gggggggggg")

    if (!formattedKey) return

    // Create a new filter object to track changes
    const currentFilterObject = {}

    // If checked is true, we want to include all items for this filter
    // If checked is false, we want to exclude all items for this filter
    if (checked) {
      // When selecting all, we need to restore all items that match this filter key
      // First, get all unique values for this key from the original data
      const allValuesForKey = Array.from(new Set(allData.map((item) => String(item[formattedKey]))))

      // Mark all values as checked in our tracking object
      allValuesForKey.forEach((value) => {
        currentFilterObject[value] = true
      })

      console.log(allData, "ggggggggggggggggooo")

      // Set the filtered data to include all items
      setLeftFilterData(allData)
    } else {
      // When deselecting all, we need to remove all items that match this filter key
      // Mark all values as unchecked in our tracking object
      Object.keys(filterData[key] || {}).forEach((value) => {
        currentFilterObject[value] = false
      })

      // Filter out all items that have this key
      const newFilteredData = leftFilterData.filter((item) => !item[formattedKey])
      console.log(newFilteredData, "ggggggggggggggggggggggg")
      setLeftFilterData(newFilteredData)
    }

    // Update our previous filter state
    setPreviousFilter({ ...currentFilterObject })
    setCurrentKey(key)

    // Update the filter data to maintain the category even when empty
    setFilterData((prevFilterData) => ({
      ...prevFilterData,
      [key]: currentFilterObject,
    }))

    // Update the graphs with the new filtered data
    return testingFun(checked ? allData : leftFilterData.filter((item) => !item[formattedKey]))
  }

  const uniqueKeys = Array.from(
    new Set(
      leftFilterData
        .flatMap((item) => Object.keys(item))
        .filter((key) => key !== "dateOfShipment"), // Exclude "dateofshipment"
    ),
  )

  const uniqueValues = (key) => {
    if (key === "dateOfShipment") return [] // Ensure no values for "dateofshipment"
    const values = leftFilterData.map((item) => item[key])
    return Array.from(new Set(values)) // Remove duplicate values for the given key
  }

  const testingFun = (arr) => {
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
      uniqueForeignCompanies: new Set(),
    }

    if (dataType === "cleaned data") {
      result.topProductByQuantity = {}
      result.topProductByValue = {}
      result.productShipmentCount = {}
    }

    arr.forEach((item) => {
      const year = item.dateOfShipment.split("-")[0]

      // Track unique companies
      result.uniqueIndianCompanies.add(item.indianCompany)
      result.uniqueForeignCompanies.add(item.foreignCompany)

      // Aggregate Year by quantity and value
      result.topYearsByQuantity[year] = (result.topYearsByQuantity[year] || 0) + Number.parseFloat(item.quantity)
      result.topYearsByValue[year] =
        (result.topYearsByValue[year] || 0) + Number.parseFloat(item.quantity) * Number.parseFloat(item.unitPrice)

      if (info === "import") {
        // Aggregate buyers by quantity and value
        result.topBuyerByQuantity[item.indianCompany] =
          (result.topBuyerByQuantity[item.indianCompany] || 0) + Number.parseFloat(item.quantity)
        result.topBuyerByValue[item.indianCompany] =
          (result.topBuyerByValue[item.indianCompany] || 0) +
          Number.parseFloat(item.quantity) * Number.parseFloat(item.unitPrice)
        //  Aggregate suppliers by quantity and value
        result.topSupplierByQuantity[item.foreignCompany] =
          (result.topSupplierByQuantity[item.foreignCompany] || 0) + Number.parseFloat(item.quantity)
        result.topSupplierByValue[item.foreignCompany] =
          (result.topSupplierByValue[item.foreignCompany] || 0) +
          Number.parseFloat(item.quantity) * Number.parseFloat(item.unitPrice)
      }

      if (info === "export") {
        // Aggregate buyers by quantity and value
        result.topBuyerByQuantity[item.foreignCompany] =
          (result.topBuyerByQuantity[item.foreignCompany] || 0) + Number.parseFloat(item.quantity)
        result.topBuyerByValue[item.foreignCompany] =
          (result.topBuyerByValue[item.foreignCompany] || 0) +
          Number.parseFloat(item.quantity) * Number.parseFloat(item.unitPrice)

        // Aggregate suppliers by quantity and value
        result.topSupplierByQuantity[item.indianCompany] =
          (result.topSupplierByQuantity[item.indianCompany] || 0) + Number.parseFloat(item.quantity)
        result.topSupplierByValue[item.indianCompany] =
          (result.topSupplierByValue[item.indianCompany] || 0) +
          Number.parseFloat(item.quantity) * Number.parseFloat(item.unitPrice)
      }

      // Aggregate Indian ports by quantity and value
      result.topIndianPortByQuantity[item.indianPort] =
        (result.topIndianPortByQuantity[item.indianPort] || 0) + Number.parseFloat(item.quantity)
      result.topIndianPortByValue[item.indianPort] =
        (result.topIndianPortByValue[item.indianPort] || 0) +
        Number.parseFloat(item.quantity) * Number.parseFloat(item.unitPrice)

      // Aggregate countries by quantity and value
      result.topCountryByQuantity[item.foreignCountry] =
        (result.topCountryByQuantity[item.foreignCountry] || 0) + Number.parseFloat(item.quantity)
      result.topCountryByValue[item.foreignCountry] =
        (result.topCountryByValue[item.foreignCountry] || 0) +
        Number.parseFloat(item.quantity) * Number.parseFloat(item.unitPrice)

      // Count shipments for each category
      result.yearShipmentCount[year] = (result.yearShipmentCount[year] || 0) + 1

      result.buyerShipmentCount[item.indianCompany] = (result.buyerShipmentCount[item.indianCompany] || 0) + 1
      result.supplierShipmentCount[item.foreignCompany] = (result.supplierShipmentCount[item.foreignCompany] || 0) + 1
      result.indianPortShipmentCount[item.indianPort] = (result.indianPortShipmentCount[item.indianPort] || 0) + 1
      result.countryShipmentCount[item.foreignCountry] = (result.countryShipmentCount[item.foreignCountry] || 0) + 1

      if (dataType === "cleaned data") {
        // Aggregate Product by quantity and value only if dataType is "cleaned data"
        result.topProductByQuantity[item.productName] =
          (result.topProductByQuantity[item.productName] || 0) + Number.parseFloat(item.quantity)
        result.topProductByValue[item.productName] =
          (result.topProductByValue[item.productName] || 0) +
          Number.parseFloat(item.quantity) * Number.parseFloat(item.unitPrice)

        result.productShipmentCount[item.productName] = (result.productShipmentCount[item.productName] || 0) + 1
      }

      // Aggregate HScode by quantity and value only if dataType is "cleaned data"
      result.topHScodeByQuantity[item.HS_Code] =
        (result.topHScodeByQuantity[item.HS_Code] || 0) + Number.parseFloat(item.quantity)
      result.topHScodeByValue[item.HS_Code] =
        (result.topHScodeByValue[item.HS_Code] || 0) +
        Number.parseFloat(item.quantity) * Number.parseFloat(item.unitPrice)

      result.HScodeShipmentCount[item.HS_Code] = (result.HScodeShipmentCount[item.HS_Code] || 0) + 1

      // Update total quantity and value
      result.totalQuantity += Number.parseFloat(item.quantity)
      result.totalValue += Number.parseFloat(item.quantity) * Number.parseFloat(item.unitPrice)
    })

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
    })

    const apiResponse = {
      data: [
        transformToAPIFormat(result.topYearsByQuantity, "topYearsByQuantity", result.yearShipmentCount),
        transformToAPIFormat(result.topYearsByValue, "topYearsByValue", result.yearShipmentCount),

        transformToAPIFormat(result.topBuyerByQuantity, "topBuyerByQuantity", result.buyerShipmentCount),
        transformToAPIFormat(result.topBuyerByValue, "topBuyerByValue", result.buyerShipmentCount),

        transformToAPIFormat(result.topSupplierByQuantity, "topSupplierByQuantity", result.supplierShipmentCount),
        transformToAPIFormat(result.topSupplierByValue, "topSupplierByValue", result.supplierShipmentCount),

        transformToAPIFormat(result.topIndianPortByQuantity, "topIndianPortByQuantity", result.indianPortShipmentCount),
        transformToAPIFormat(result.topIndianPortByValue, "topIndianPortByValue", result.indianPortShipmentCount),

        transformToAPIFormat(result.topCountryByQuantity, "topCountryByQuantity", result.countryShipmentCount),
        transformToAPIFormat(result.topCountryByValue, "topCountryByValue", result.countryShipmentCount),

        transformToAPIFormat(result.topHScodeByQuantity, "topHScodeByQuantity", result.HScodeShipmentCount),
        transformToAPIFormat(result.topHScodeByValue, "topHScodeByValue", result.HScodeShipmentCount),
      ],
      totalIndianCompanies: result.uniqueIndianCompanies.size,
      totalForeignCompanies: result.uniqueForeignCompanies.size,
      totalQuantity: result.totalQuantity,
      totalValue: result.totalValue,
      shipmentCount: arr.length,
    }

    if (dataType === "cleaned data") {
      apiResponse.data.push(
        transformToAPIFormat(result.topProductByQuantity, "topProductByQuantity", result.productShipmentCount),
        transformToAPIFormat(result.topProductByValue, "topProductByValue", result.productShipmentCount),
      )
    }

    graphFilterHandler(apiResponse)

    return apiResponse
  }

  const getSingleFilter = (key, value, checked) => {
    console.log("delete unchecked::::::::::", key, value, checked)
    const formattedKey = Object.keys(mapping).find((mappingKey) => mapping[mappingKey] === key)

    if (currentKey === key) {
      setPreviousFilter({ ...previousFilter, [value]: checked })
    } else {
      setPreviousFilter({ [value]: checked })
    }
    setCurrentKey(key)

    let newCheckedValue
    if (checked) {
      const filterFromAllData = allData.filter((item) => String(item[formattedKey]) === String(value))
      newCheckedValue = [...leftFilterData, ...filterFromAllData]
    } else {
      newCheckedValue = leftFilterData.filter((item) => String(item[formattedKey]) !== String(value))
    }

    // Update the "Select All" state based on whether all items are checked
    // First, get all the values for this filter category
    const allValuesForKey = Object.keys(filterData[key] || {})

    // Create a new state object with the updated value
    const updatedFilterState = {
      ...filterData[key],
      [value]: checked,
    }

    // Ensure the filter category remains in filterData even when empty
    setFilterData((prevFilterData) => ({
      ...prevFilterData,
      [key]: updatedFilterState,
    }))

    // Check if all values are now checked
    const allChecked = allValuesForKey.every((val) => {
      // For the current value being changed, use the new checked state
      if (val === value) return checked
      // For all other values, use their existing state
      return updatedFilterState[val]
    })

    // Update the "Select All" state for this key
    setSelectAllFilterTracker((prevState) => ({
      ...prevState,
      [key]: allChecked,
    }))

    console.log(filterData, "-----+++++")
    setLeftFilterData(newCheckedValue)
    return testingFun(newCheckedValue)
  }

  const handleResetFilters = () => {
    const resetCheckboxes = {}
    uniqueKeys.forEach((key) => {
      resetCheckboxes[key] = {
        selectAll: true,
        items: uniqueValues(key).map((value) => ({
          value,
          checked: true,
        })),
      }
    })

    setCheckboxes(resetCheckboxes)

    // Reset all "Select All" states to true
    const resetSelectAll = {}
    Object.keys(mapping).forEach((key) => {
      resetSelectAll[mapping[key]] = true
    })
    setSelectAllFilterTracker(resetSelectAll)

    setLeftFilterData(allData)
    testingFun(allData)
  }

  useEffect(() => {
    formatDataIntoFilterObjects(leftFilterData)
  }, [leftFilterData])

  const formatDataIntoFilterObjects = (data) => {
    const filterObject = {}

    // Initialize all filter categories regardless of data
    Object.keys(mapping).forEach((key) => {
      const mappedKey = mapping[key]
      filterObject[mappedKey] = filterObject[mappedKey] || {}

      if (!selectAllFilterTracker[mappedKey]) {
        setSelectAllFilterTracker((prevState) => ({
          ...prevState,
          [mappedKey]: true,
        }))
      }
    })

    // Then populate the filter values from the data
    data.forEach((dataItem) => {
      for (const [key, value] of Object.entries(dataItem)) {
        if (
          [
            "indianPort",
            "HS_Code",
            "productDescription",
            "quantity",
            "quantityUnits",
            "unitPrice",
            "currency",
            "productName",
            "indianCompany",
            "foreignCompany",
            "foreignCountry",
            "CAS _Number",
          ].includes(key)
        ) {
          if (!filterObject[mapping[key]]) {
            filterObject[mapping[key]] = {}
          }

          if (value !== undefined && value !== null) {
            filterObject[mapping[key]][value.toString()] = true
          }
        }
      }
    })

    // Apply any previous filter selections
    if (currentKey && previousFilter) {
      filterObject[currentKey] = { ...(filterObject[currentKey] || {}), ...previousFilter }
    }

    // Update "Select All" state for each filter category
    // by checking if all items in that category are selected
    Object.keys(filterObject).forEach((key) => {
      const allValues = Object.keys(filterObject[key])
      const allChecked = allValues.length > 0 && allValues.every((val) => filterObject[key][val])

      setSelectAllFilterTracker((prevState) => ({
        ...prevState,
        [key]: allChecked,
      }))
    })

    setFilterData(filterObject)
  }

  return (
    <div className="w-44 rounded-md flex bg-white relative shadow-xl" onMouseLeave={() => setActiveIndex(null)}>
      <div className="w-full flex flex-col justify-between rounded-md">
        <div className="p-3 border-b-2">
          <h4 className="font-semibold text-xl">Filters</h4>
        </div>
        <div>
          {Object.keys(filterData).map((key, index) => (
            <div key={key} className="relative">
              <Popover open={key === activeIndex} onOpenChange={(open) => setActiveIndex(open ? key : null)}>
                <PopoverTrigger asChild>
                  <div
                    className="p-3 flex justify-between items-center cursor-pointer hover:bg-gray-300"
                    onMouseEnter={() => setActiveIndex(key)}
                  >
                    {key}
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className="w-56 h-[200px] overflow-y-auto bg-white p-0 ml-[-5px]"
                  side="right"
                  align="center"
                >
                  <div className="border-b border-gray-200 p-2 flex items-center gap-2">
                    <Search className="h-4 w-4 shrink-0 opacity-50" />
                    <Input
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="Type here"
                      className="h-8 w-full border-0 p-0 border-black focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    {searchValue && (
                      <Button variant="ghost" size="icon" className="h-5 w-5 p-0" onClick={() => setSearchValue("")}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex justify-between items-center p-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="selectAll"
                        checked={selectAllFilterTracker[key]}
                        onCheckedChange={(checked) => handleSelectAllChange(key, checked === true)}
                      />
                      <label
                        htmlFor="selectAll"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Select All
                      </label>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleResetFilters}>
                      <Eraser className="h-4 w-4" />
                    </Button>
                  </div>
                  <ScrollArea className="h-72 px-2">
                    {/* <div className="flex flex-col gap-1 py-1">
                      {Object.keys(filterData[key])
                        .filter((value) => searchValue === "" || value.toLowerCase().includes(searchValue.toLowerCase()))
                        .map((value, i) => (
                          <div key={i} className="flex items-center space-x-2 py-1">
                            <Checkbox
                              id={`filter-${i}`}
                              checked={filterData[key][value]}
                              onCheckedChange={(checked) => {
                                getSingleFilter(key, value, checked === true)
                              }}
                            />
                            <label
                              htmlFor={`filter-${i}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {value}
                            </label>
                          </div>
                        ))}
                    </div> */}

                    <div className="flex flex-col gap-1 py-1">
                      {Object.keys(filterData[key])
                        .filter(
                          (value) => searchValue === "" || value.toLowerCase().includes(searchValue.toLowerCase()),
                        )
                        .map((value, i) => (
                          <div key={i} className="flex items-center space-x-2 py-1">
                            <Checkbox
                              id={`filter-${i}`}
                              checked={filterData[key][value]}
                              onCheckedChange={(checked) => {
                                getSingleFilter(key, value, checked === true)
                              }}
                            />
                            <label
                              htmlFor={`filter-${i}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {value}
                            </label>
                          </div>
                        ))}
                      {/* Handle Empty Case */}
                      {Object.keys(filterData[key]).filter(
                        (value) => searchValue === "" || value.toLowerCase().includes(searchValue.toLowerCase()),
                      ).length === 0 && <div className="text-sm text-gray-500 py-2 px-1">No options available</div>}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TestFilter3

