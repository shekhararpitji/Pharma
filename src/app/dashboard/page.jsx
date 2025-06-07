"use client"
import { useCallback, useEffect, useRef, useState } from "react"

import { CiSearch } from "react-icons/ci"
import { RxSize } from "react-icons/rx"
import { IoBarChart } from "react-icons/io5"
import { FaChevronDown } from "react-icons/fa"
import { TbFileDatabase } from "react-icons/tb";

import {
  Autocomplete,
  Backdrop,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material"
import { useFormik } from "formik"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import debounce from "lodash/debounce"
import { toast } from "react-toastify"
import axiosInstance from "@/utils/axiosInstance"
import Checkbox from "@mui/material/Checkbox"
import { CheckBoxOutlineBlank, CheckBox } from "@mui/icons-material"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { AiOutlineReload } from "react-icons/ai";

const icon = <CheckBoxOutlineBlank fontSize="small" />
const checkedIcon = <CheckBox fontSize="small" />

// COMPONENTS======
import DataCard from "@/components/DataCard"
import Accordion from "@/components/Accordion"
import RecordTable from "@/components/RecordTable"
import TestBarChart from "@/components/TestBarchart"
import HSCodeFilter from "@/components/HSCodeFilter"

// Dynamically import BarChart and disable SSR
const BarChart = dynamic(() => import("../../components/Barchart"), {
  ssr: false,
})

const chapters = [
  { title: "28" },
  { title: "29" },
  { title: "30" },
  { title: "31" },
  { title: "32" },
  { title: "33" },
  { title: "34" },
]

export default function Dashboard() {
  const router = useRouter()
  const [allData, setAllData] = useState([])
  const [showAllGraphs, setShowAllGraphs] = useState(false)
  const [outputDataType, setOutputDataType] = useState("graph")

  const [dateDuration, setDateDuration] = useState("")
  const [selectedSearchValues, setSelectedSearchValues] = useState([])
  const [recordData, setRecordData] = useState([])
  const [recordLoading, setRecordLoading] = useState(false)
  const [recordError, setRecordError] = useState("")
  const [error, setError] = useState(null)
  const [searchApiData, setSearchApiData] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)

  const [graphsData, setGraphsData] = useState([])
  const [leftFilterData, setLeftFilterData] = useState([])

  const [totalData, setTotalData] = useState(null)

  const [showDatePicker, setShowDatePicker] = useState(false)
  const datePickerRef = useRef(null)

  const {
    handleSubmit,
    values,
    errors,
    handleChange,
    touched,
    handleBlur,
    setFieldValue,
    resetForm, // Add this
  } = useFormik({
    initialValues: {
      info: "import",
      dataType: "",
      startDate: "",
      endDate: "",
      duration: "",
      chapter: "",
      searchType: "",
      searchValue: "",
    },
    onSubmit: async (values) => {
      const sessionId = localStorage.getItem("sessionId")
      try {
        setRecordLoading(true)
        setRecordError(null)
        const response = await axiosInstance.get(`/data/records`, {
          params: {
            informationOf: values.info,
            dataType: values.dataType,
            duration: values.duration,
            chapter: values.chapter,
            searchType: values.searchType,
            searchValue: values.searchValue,
            session: sessionId,
          },
        })
        setRecordData(response.data.data)

        const { data, metrics } = response?.data?.data || {}

        if (data) {
          setAllData(data)
          setLeftFilterData(data)
        }

        if (metrics) {
          const dynamicGraphsData = Object.entries(metrics).map(([key, value]) => {
            const data = value.map((item) => ({
              label: item.buyer || item.supplier || item.buyerCountry || item.portOfOrigin || "Unknown",
              value: item.total,
            }))
            return {
              key,
              data,
              label: key.replace(/([A-Z])/g, " $1").trim(),
            }
          })

          setGraphsData(dynamicGraphsData)
        } else {
          console.error("Metrics data is missing in API response.")
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || "An error occurred"
        setRecordError(errorMessage)

        if (err.response.status === 403) {
          router.push("/login")
        }
      } finally {
        setRecordLoading(false)
      }
    },
  })

  const valuesRef = useRef(values)

  useEffect(() => {
    valuesRef.current = values
  }, [values])

  const fetchSuggestions = async (query, currentValues, setSearchApiData, setError) => {
    const sessionId = localStorage.getItem("sessionId")
    const url = `/data/suggestion?informationOf=${currentValues.info}&chapter=${currentValues.chapter ? currentValues.chapter : ""
      }&searchType=${currentValues.searchType}&suggestion=${encodeURIComponent(query)}&session=${sessionId}`
    try {
      const response = await axiosInstance.get(url)

      setSearchApiData([{ title: query }, ...response.data.data])
    } catch (err) {
      toast.error("api failed in catch❌❌❌")
      console.error("error====", err)
      setError(err.message)
    }
  }

  // Debounced API fetch function
  const handleSearch = useCallback(
    debounce(async (query) => {
      if (query) {
        setSearchLoading(true)
        await fetchSuggestions(query, valuesRef.current, setSearchApiData, setError)
        setSearchLoading(false)
      }
    }, 300), // Debounce interval in ms
    [],
  )

  // Add an effect to update chapter selection when data type changes
  useEffect(() => {
    if (values.dataType === "cleaned data") {
      // If current chapter selection includes chapters other than 29 and 30, filter them out
      if (values.chapter && values.chapter.length > 0) {
        const validChapters = values.chapter.filter((chapter) => ["29", "30"].includes(chapter))
        if (JSON.stringify(validChapters) !== JSON.stringify(values.chapter)) {
          setFieldValue("chapter", validChapters)
        }
      }
    }
  }, [values.dataType, setFieldValue, values.chapter])

  // useEffect(() => {
  //   if (values.dataType === "cleaned data") {
  //     // If switching to cleaned data, filter out rawCthat aren't 29 or 30
  //     const validChapters = chapters.filter((chapter) => ["29", "30"].includes(chapter.title))
  //     if (validChapters.length === 0) {
  //       // If no valid chapters remain, default to both 29 and 30
  //       setFieldValue("chapter", ["29", "30"])
  //     } else {
  //       // Otherwise keep only the vali d ones
  //       setFieldValue("chapter", validChapters)
  //     }
  //   }
  // }, [values.dataType, setFieldValue, values.chapter])

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const sessionId = localStorage.getItem("sessionId")
  //       const response = await axiosInstance.get(`/data/records`, {
  //         params: {
  //           informationOf: "export",
  //           dataType: "cleaned data",
  //           duration: "01/02/2022-01/02/2025",
  //           chapter: "30",
  //           searchType: "product name",
  //           searchValue: "Acetic Acid",
  //           session: sessionId,
  //         },
  //       })
  //       setRecordData(response.data.data)

  //       const { data, metrics } = response?.data?.data || {}
  //       if (data) {
  //         setAllData(data)
  //         setLeftFilterData(data)
  //       }
  //       if (metrics) {
  //         const dynamicGraphsData = Object.entries(metrics).map(([key, value]) => {
  //           const data = value.map((item) => ({
  //             label: item.buyer || item.supplier || item.buyerCountry || item.portOfOrigin || "Unknown",
  //             value: item.total,
  //           }))
  //           return {
  //             key,
  //             data,
  //             label: key.replace(/([A-Z])/g, " $1").trim(),
  //           }
  //         })

  //         setGraphsData(dynamicGraphsData)
  //       } else {
  //         console.error("Metrics data is missing in API response.")
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error)
  //     }
  //   })()
  // }, [])

  const graphFilterHandler = (filteredData) => {
    setGraphsData(filteredData.data)
    setTotalData(filteredData)
  }

  const searchOptions = [
    { title: "Product Description", value: "productDescription" },
    { title: "Product Name", value: "productName" },
    { title: "CAS Number", value: "CAS_Number" },
    { title: "HS Code (6 digit)", value: "H_S_Code" },
    {
      title: values.info === "import" ? "Indian Company (Importer)" : "Foreign Company (Importer)",
      value: values.info === "import" ? "buyer" : "supplier",
    },
    {
      title: values.info === "export" ? "Indian Company (Exporter)" : "Foreign Company (Exporter)",
      value: values.info === "export" ? "buyer" : "supplier",
    },
  ]

  // const formatDate = (date) => {
  //   if (!date) return "";
  //   const [year, month, day] = date.split("-");
  //   return `${day}/${month}/${year.slice(-2)}`;
  // };

  const formatDate = (date) => {
    if (!date) return ""

    const [year, month, day] = date.split("-")
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    return `${Number.parseInt(day, 10)}-${monthNames[Number.parseInt(month, 10) - 1]}-${year}`
  }

  useEffect(() => {
    if (!values.startDate && !values.endDate) {
      const today = new Date()
      const lastThreeYears = new Date()
      lastThreeYears.setFullYear(today.getFullYear() - 5) // Get last 3 years' date

      const formattedStartDate = lastThreeYears.toLocaleDateString("en-GB").split("/").join("/")
      const formattedEndDate = today.toLocaleDateString("en-GB").split("/").join("/")

      setFieldValue("startDate", lastThreeYears.toISOString().split("T")[0])
      setFieldValue("endDate", today.toISOString().split("T")[0])
      setFieldValue("duration", `${formattedStartDate}-${formattedEndDate}`)
    }
  }, [setFieldValue, values.startDate, values.endDate])

  useEffect(() => {
    if (values.startDate && values.endDate) {
      const formattedStartDate = new Date(values.startDate).toLocaleDateString("en-GB").split("/").join("/")
      const formattedEndDate = new Date(values.endDate).toLocaleDateString("en-GB").split("/").join("/")

      // Only update if the duration would actually change
      const newDuration = `${formattedStartDate}-${formattedEndDate}`
      if (values.duration !== newDuration) {
        setFieldValue("duration", newDuration)
      }
    }
  }, [values.startDate, values.endDate, setFieldValue, values.duration])

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Add this useEffect to clear search value when specified filters change
  useEffect(() => {
    // Clear search value when any of these values change
    setFieldValue("searchValue", "")
    setSelectedSearchValues([])
    setSearchApiData([])
  }, [
    values.info,
    values.dataType,
    values.startDate,
    values.endDate,
    values.duration,
    values.chapter,
    values.searchType,
  ])

  return (
    <div className="px-1 py-2 bg-gray-100">
      <form className="flex w-full flex-col justify-between items-center gap-6" onSubmit={handleSubmit}>
        <div className="flex w-full items-center justify-between gap-2">
          {/* <div>
            <ToggleButtonGroup
              value={values.info}
              exclusive
              onChange={(event, newAlignment) => setFieldValue("info", newAlignment)}
              aria-label="text alignment"
              size="small"
            >
              <ToggleButton
                value="import"
                aria-label="Import"
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#1E3A8A",
                    color: "white",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "#1E3A8A",
                  },
                }}
              >
                Import
              </ToggleButton>
              <ToggleButton
                value="export"
                aria-label="Export"
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#1E3A8A",
                    color: "white",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "#1E3A8A",
                  },
                }}
              >
                Export
              </ToggleButton>
            </ToggleButtonGroup>
          </div> */}
          <div>
            <ToggleButtonGroup
              value={values.info}
              exclusive
              onChange={(event, newAlignment) => setFieldValue("info", newAlignment)}
              aria-label="text alignment"
              size="small"
              sx={{
                borderRadius: "50px",
                overflow: "hidden",
                backgroundColor: "white",
                border: "1px solid #d1d5db",
                display: "flex",
                gap: "4px",
              }}
            >
              {/* IMPORT BUTTON */}
              <ToggleButton
                value="import"
                aria-label="Import"
                sx={{
                  borderRadius: "50px",
                  padding: values.info === "import" ? "5px" : "6px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  textTransform: "none",
                  minWidth: "unset",
                  border: "none",
                  justifyContent: "center",
                  transition: "all 0.3s ease-in-out",
                  backgroundColor: "transparent",
                  color: "#1E3A8A",
                  "&.Mui-selected": {
                    backgroundColor: "transparent",
                    color: "#1E3A8A",
                    marginRight: "-25px",
                  },
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                <div
                  style={{
                    borderRadius: "50px",
                    backgroundColor: values.info === "import" ? "#1E3A8A" : "transparent",
                    color: values.info === "import" ? "white" : "transparent",
                    padding: values.info === "import" ? "6px 16px" : "0px",
                    maxWidth: values.info === "import" ? "100px" : "0px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                    transition: "all 0.3s ease-in-out",
                    overflow: "hidden",
                  }}
                >
                  Import
                </div>
                <span
                  style={{
                    fontWeight: "bold",
                    opacity: values.info === "import" ? 0 : 1,
                    width: values.info === "import" ? 0 : "auto",
                    overflow: "hidden",
                    transition: "all 0.3s ease-in-out",
                    color: "#1E3A8A",
                  }}
                >
                  Import
                </span>
              </ToggleButton>

              {/* EXPORT BUTTON */}
              <ToggleButton
                value="export"
                aria-label="Export"
                sx={{
                  borderRadius: "50px",
                  padding: values.info === "export" ? "5px" : "6px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  textTransform: "none",
                  minWidth: "unset",
                  justifyContent: "center",
                  border: "none",
                  transition: "all 0.3s ease-in-out",
                  backgroundColor: "transparent",
                  color: "#1E3A8A",
                  "&.Mui-selected": {
                    backgroundColor: "transparent",
                    marginLeft: "-15px",
                    color: "#1E3A8A",
                  },
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                <div
                  style={{
                    borderRadius: "50px",
                    backgroundColor: values.info === "export" ? "#1E3A8A" : "transparent",
                    color: values.info === "export" ? "white" : "transparent",
                    padding: values.info === "export" ? "6px 16px" : "0px",
                    maxWidth: values.info === "export" ? "100px" : "0px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                    transition: "all 0.3s ease-in-out",
                    overflow: "hidden",
                  }}
                >
                  Export
                </div>
                <span
                  style={{
                    fontWeight: "bold",
                    opacity: values.info === "export" ? 0 : 1,
                    width: values.info === "export" ? 0 : "auto",
                    overflow: "hidden",
                    transition: "all 0.3s ease-in-out",
                    color: "#1E3A8A",
                  }}
                >
                  Export
                </span>
              </ToggleButton>
            </ToggleButtonGroup>
          </div>


          {/* DATE======= */}
          {/* <div className="w-full">
            <Datepicker
              // value={values.duration}
              value={dateDuration}
              // displayFormat="DD/MM/YYYY"
              // inputId="datepicker"
              // inputName="datepicker"
              // required={true}
              inputClassName="w-full p-2 border-[1px] border-[#C4C4C4] rounded-md focus:ring-0  bg-white placeholder:text-gray text-gray dark:bg-blue-900 dark:placeholder:text-blue-100"
              onChange={(newValue) => {
                setDateDuration(newValue);
                const formattedStartDate = format(
                  newValue.startDate,
                  "dd/MM/yyyy"
                );
                const formattedEndDate = format(newValue.endDate, "dd/MM/yyyy");
                setFieldValue(
                  "duration",
                  `${formattedStartDate}-${formattedEndDate}`
                );
              }}
              // showShortcuts={true}
              primaryColor={"blue"}
              // customShortcuts={customShortcuts}
              // onChange={(newValue) => {
              //   setFieldValue("duration", newValue);
              // }}
            />
          </div> */}

          <div className="bg-white relative rounded-full border border-gray-300" ref={datePickerRef}>
            <div
              className="text-gray-700 w-max font-medium p-2 cursor-pointer"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              {values.startDate && values.endDate
                ? `${formatDate(values.startDate)} - ${formatDate(values.endDate)}`
                : "Select Date Range"}
            </div>

            {/* Date Picker Fields */}
            {showDatePicker && (
              <div className="w-full bg-white p-4 flex flex-col gap-4 absolute z-30 top-12 rounded shadow-md">
                <div className="flex flex-col gap-2">
                  <label>Start Date</label>
                  <input
                    type="date"
                    className="p-2 rounded bg-gray-100"
                    value={values.startDate}
                    onChange={(e) => setFieldValue("startDate", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label>End Date</label>
                  <input
                    type="date"
                    className="p-2 rounded bg-gray-100"
                    value={values.endDate}
                    onChange={(e) => setFieldValue("endDate", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* DATA TYPE======= */}
          <div className="w-[250px] !border-none">
            <FormControl className="w-full rounded-full" size="small" sx={{ backgroundColor: "white", "& .MuiOutlinedInput-root": { borderRadius: "50px" } }}>
              <InputLabel id="data-type-label" className="border-none">Data Type</InputLabel>
              <Select
                label="Data Type"
                labelId="data-type-label"
                id="data-type"
                name="dataType"
                value={values.dataType}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.dataType && Boolean(errors.dataType)}
              >
                <MenuItem value="raw data">Raw</MenuItem>
                <MenuItem value="cleaned data">Cleaned</MenuItem>
              </Select>
            </FormControl>
          </div>
          {/* <div className="w-[400px]">
            <Autocomplete
              size="small"
              id="chapter-select"
              options={chapters}
              getOptionLabel={(option) => option.title}
              value={
                chapters.find((option) => option.title === values.chapter) ||
                null
              }
              onChange={(event, newValue) => {
                setFieldValue("chapter", newValue?.title || "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chapter"
                  error={touched.chapter && !!errors.chapter}
                  helperText={touched.chapter && errors.chapter}
                />
              )}
              style={{ width: "100%", backgroundColor: "white" }}
            />
          </div> */}
          <div className="w-[300px]">
            <Autocomplete
              multiple
              disableCloseOnSelect
              size="small"
              id="chapter-select"
              options={
                values.dataType === "cleaned data"
                  ? chapters.filter((chapter) => ["29", "30"].includes(chapter.title))
                  : chapters
              }
              getOptionLabel={(option) => option.title}
              value={chapters.filter((option) => values.chapter.includes(option.title))}
              onChange={(event, newValue) => {
                const selected = newValue.map((item) => item.title)
                setFieldValue("chapter", selected)
              }}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                  {option.title}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chapter"
                  error={touched.chapter && !!errors.chapter}
                  helperText={touched.chapter && errors.chapter}
                />
              )}
              style={{ width: "100%", backgroundColor: "white" }}
              sx={{ backgroundColor: "white", "& .MuiOutlinedInput-root": { borderRadius: "50px" } }}
              className="rounded-full"
            />
          </div>
          <div className="w-[500px]">
            <FormControl className="w-full rounded-full" size="small" sx={{ backgroundColor: "white", borderColor: "gray", "& .MuiOutlinedInput-root": { borderRadius: "50px" } }}>
              <InputLabel
                id="search-type-label"
              // sx={{ color: "black", backgroundColor: "white", paddingX: 1 }}
              >
                Search Type
              </InputLabel>
              <Select
                label="Search Type"
                labelId="search-type-label"
                id="search-type"
                name="searchType"
                value={values.searchType}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.searchType && Boolean(errors.searchType)}
              >
                {searchOptions.map((item, i) => (
                  <MenuItem
                    disabled={
                      values.dataType === ""
                        ? true
                        : (values.dataType === "raw data" && ["Product Name", "CAS Number"].includes(item.title)) ||
                        (values.dataType !== "raw data" && item.title === "Product Description")
                    }
                    value={item.value}
                    key={i}
                  >
                    {item.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <AiOutlineReload size={28}
              className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors duration-200"
              onClick={() => {
                resetForm()
                setSearchApiData([])
                setFieldValue("searchValue", "")
                setSelectedSearchValues([])
                setShowDatePicker(false)
              }} />
          </div>
        </div>

        <div className="flex gap-5 ">
          <div>
            <Stack sx={{ width: 500, marginBottom: 2 }}>
              <Autocomplete
                sx={{ backgroundColor: "white" }}
                multiple
                id="size-small-outlined-multi"
                size="small"
                options={searchApiData}
                value={selectedSearchValues}
                // options={
                //   values.searchValue.length >= 3
                //     ? [...searchApiData, { title: searchValue, custom: true }]
                //     : searchApiData
                // }
                loading={searchLoading}
                getOptionLabel={(option) => option.title || ""}
                filterOptions={(options) => options}
                onInputChange={(event, value, reason) => {
                  if (reason === "input") {
                    if (value.length >= 3) {
                      handleSearch(value)
                    }
                  }
                }}
                onChange={(event, value) => {
                  setSelectedSearchValues(value)
                  const selectedTitles = value.map((item) => item.title).join(", ")
                  setFieldValue("searchValue", selectedTitles)
                }}
                onBlur={() => {
                  setSearchApiData([]) // Clear options if nothing is selected
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search"
                    placeholder="Search..."
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {searchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Stack>
          </div>

          <div>
            <Stack direction="row" spacing={2}>
              <Button
                type="submit"
                className="bg-theme_color"
                variant="contained"
                sx={{
                  backgroundColor: "#1E3A8A",
                  "&:hover": {
                    backgroundColor: "#162F63",
                  },
                }}
                endIcon={<CiSearch />}
              ></Button>
            </Stack>
          </div>

          {/* <div>
            <Button
              variant="contained"
              onClick={() => setShowAllGraphs(!showAllGraphs)}
              sx={{
                backgroundColor: "#1E3A8A",
                "&:hover": {
                  backgroundColor: "#162F63",
                },
              }}
            >
              {showAllGraphs ? "show data" : "show graphs"}
            </Button>
          </div> */}

          <div>
            <ToggleButtonGroup
              value={outputDataType}
              exclusive
              onChange={(event, newAlignment) => {
                if (newAlignment !== null) {
                  // Prevent null value which can cause issues
                  setOutputDataType(newAlignment)
                  setShowAllGraphs(newAlignment === "data") // Set directly based on value
                }
              }}
              aria-label="text alignment"
              size="small"
            >
              <ToggleButton
                value="graph"
                aria-label="Graph"
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#1E3A8A",
                    color: "white",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "#1E3A8A",
                  },
                }}
                endIcon={<TbFileDatabase />}

              >
                graph
              </ToggleButton>
              <ToggleButton
                value="data"
                aria-label="Data"
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#1E3A8A",
                    color: "white",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "#1E3A8A",
                  },
                }}
              >
                data
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>
      </form>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <p className="py-4"></p>
        </div>
      </dialog>
      {recordLoading ? (
        <div>
          <Backdrop sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })} open={true}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      ) : recordError ? (
        <div className="text-red-500 text-center">{recordError}</div>
      ) : (
        <div className="space-y-6">
          <div className="sticky top-2 left-0 w-full z-20">{totalData && <DataCard totalData={totalData} />}</div>
          <div
            // className="grid gap-5"
            // style={{ gridTemplateColumns: "1fr 6fr" }}
            className="flex gap-5"
          >
            <div className="sticky top-24 left-0 w-40 z-10 h-fit">
              {/* <Filter leftFilterData={leftFilterData} /> */}
              {/* <TestFilter
                  leftFilterData={leftFilterData}
                  graphFilterHandler={graphFilterHandler}
                  recordData={recordData}
                  setLeftFilterData={setLeftFilterData}
                  setLeftFilterData2={setLeftFilterData2}
                  dataType={values.dataType}
                  searchType={values.searchType}
                  info={values.info}
                /> */}
              <HSCodeFilter
                allData={allData}
                leftFilterData={leftFilterData}
                graphFilterHandler={graphFilterHandler}
                recordData={recordData}
                setLeftFilterData={setLeftFilterData}
                dataType={values.dataType}
                searchType={values.searchType}
                info={values.info}
              />

              {/* <TestFilter2
                  leftFilterData={leftFilterData}
                  graphFilterHandler={graphFilterHandler}
                  recordData={recordData}
                  setLeftFilterData={setLeftFilterData}
                  setLeftFilterData2={setLeftFilterData2}
                  dataType={values.dataType}
                  searchType={values.searchType}
                  info={values.info}
                /> */}
            </div>
            {leftFilterData?.length > 0 && (
              <div className="w-[88%] flex flex-col gap-5">
                {showAllGraphs ? (
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="card bg-base-100  shadow-xl rounded-lg">
                          <div className="card-body p-2">
                            <div className="flex justify-between">
                              <h6 className="card-title text-xs">Year/Month (5/50)</h6>
                              <div className="flex gap-2">
                                <h6 className="card-title text-xs">1Y 3Y</h6>
                                <button onClick={() => document.getElementById("my_modal_3").showModal()}>
                                  <IoBarChart />
                                </button>
                                <RxSize />
                              </div>
                            </div>

                            <div>
                              <label className="input input-sm input-bordered flex items-center gap-2">
                                <input type="text" className="grow" placeholder="Search" />
                                <FaChevronDown />
                              </label>
                              <Accordion />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
                    {graphsData.length > 0 ? (
                      graphsData.map((graph, index) => (
                        <div key={index} className="card bg-base-100 w-full border-2">
                          <div className="p-3">
                            {graph.data && graph.data.length > 0 ? (
                              <>
                                <TestBarChart data={graph.data} label={graph.label} />
                                {/* <BarChart data={graph.data} label={graph.label} /> */}
                              </>
                            ) : (
                              <p>No data available for the chart</p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div>something went wrong</div>
                    )}
                  </div>
                )}
                <div className="w-full">{leftFilterData && <RecordTable data={leftFilterData} />}</div>
              </div>
            )}
          </div>
          {/* <BarChartWithTrendLine /> */}
          {/* <div>{recordData && <Table data={recordData?.data} />}</div> */}
        </div>
      )}
    </div>
  )
}
