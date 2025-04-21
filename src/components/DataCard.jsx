import Image from "next/image";

const formatNumber = (num) => {
  if (!num || isNaN(num)) return "0"; // Handle undefined, null, or NaN values

  if (num >= 1e12) {
    return (num / 1e12).toFixed(2) + "T"; // Convert to trillion
  } else if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + "B"; // Convert to billion
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + "M"; // Convert to million
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + "K"; // Convert to thousand
  }

  return num.toFixed(2); // Keep normal format if below 1K
};

const DataCard = ({ totalData }) => {
  const {
    totalQuantity,
    totalValue,
    totalIndianCompanies,
    totalForeignCompanies,
    shipmentCount,
  } = totalData || {};

  const avgPrice =
    totalQuantity > 0 ? (totalValue / totalQuantity).toFixed(2) : "0";

  const staticData = [
    {
      title: "Volume",
      imgs: "/volume.png",
      value: formatNumber(totalQuantity) || "0",
    },
    {
      title: "Value",
      imgs: "/currency.png",
      value: formatNumber(totalValue) || "0",
    },
    {
      title: "Avg Price",
      imgs: "/average.png",
      value: `${avgPrice} USD`,
    },
    {
      title: "Shipment Count",
      imgs: "/folder.png",
      value: shipmentCount || "0",
    },
    {
      title: "Indian Companies",
      imgs: "/folder.png",
      value: totalIndianCompanies || "",
    },
    {
      title: "Foreign Companies",
      imgs: "/folder.png",
      value: totalForeignCompanies || "",
    },
  ];

  return (
    <div className="flex gap-5">
      {staticData.map((item, i) => (
        <div key={i} className="card bg-base-100 w-96 shadow-xl rounded-lg">
          <div className="p-2">
            <h3 className="card-title text-sm">{item.title}:</h3>
            <div className="flex justify-between text-center">
              <h3 className="text-[#008000] text-md font-bold">{item.value}</h3>
              <div>
                <Image
                  src={item.imgs}
                  alt={item.title}
                  title={item.title}
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataCard;
