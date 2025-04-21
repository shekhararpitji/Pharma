import * as React from "react";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export default function Sizes() {
  return (
    <Stack sx={{ width: 500 }}>
      <Autocomplete
        sx={{ backgroundColor: "white" }}
        multiple
        id="size-small-outlined-multi"
        size="small"
        options={top100Films}
        getOptionLabel={(option) => option.title}
        // defaultValue={[top100Films[13]]}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search"
            placeholder="search the product..."
          />
        )}
      />
    </Stack>
  );
}


const top100Films = [
  { title: "Sorafenib", year: 1994 },
  { title: "Benzyl Alcohol", year: 1994 },
];
