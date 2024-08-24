import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import dayjs from "dayjs";

import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import jwttoken from "../Token";
import Pagination from "@mui/material/Pagination";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";

import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Menu from "@mui/material/Menu";

import SortIcon from "@mui/icons-material/Sort";

import SearchIcon from "@mui/icons-material/Search";

import Tooltip from "@mui/material/Tooltip";

import utc from "dayjs/plugin/utc";

import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

import Select from "@mui/material/Select";

import axios from "axios";
import { Snackbar, Alert } from "@mui/material";
import Paper from "@mui/material/Paper";

import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { blue } from "@mui/material/colors";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Eventi() {
  const CustomPagination = styled(Pagination)(({ theme }) => ({
    "& .MuiPaginationItem-root": {
      width: "30px", // Default width
      height: "30px", // Default height
     
      "&.Mui-selected": {
        width: "30px", // Width for selected item
        height: "30px", // Height for selected item
        "&:hover": {
          width: "30px", // Adjust width on hover when selected
          height: "30px", // Keep height consistent on hover when selected
        },
      },
    },
  }));
  const [totalpages, settotalpages] = React.useState(1);

  const [page, setpage] = React.useState(1);
  console.log(page);

  const newdate = () => {
    const selectedDate = new Date();

    selectedDate.setHours(12, 0, 0, 0);
    const formattedDate = selectedDate.toISOString();

    return formattedDate;
  };

  const [parent, setParent] = React.useState({});

  const [value, setValue] = React.useState(0);

  const [data, setData] = React.useState({ Date: newdate() });
  const [open, setOpen] = React.useState(false);
  const [arr, setArr] = React.useState([]);
  const [ong, setong] = React.useState([]);

  const [reject, setReject] = React.useState([]);
  const [confirm, setconfirm] = React.useState([]);
  const [update, doUpdate] = React.useState(false);
  const [id, setId] = React.useState(0);
  const [alertMsg, setAlertMsg] = React.useState({ open: false, message: "" });
  const [alertSuccess, setAlertSuccess] = React.useState({
    open: false,
    message: "",
  });

  const [state, setState] = React.useState({
    op: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, op } = state;

  const handleClick1 = (newState) => {
    setState({ ...state, op: true });
  };
  const handleClose12 = () => {
    setState({ ...state, op: false });
    setAlertSuccess({ ...alertSuccess, open: false });
    setAlertMsg({ ...alertMsg, open: false });
  };

  const handleClose = () => {
    setOpen(false);
    setData({ Date: newdate() });

    setId();
  };
  const handleChange = (e, type) => {
    setData({ ...data, [type]: e.target.value });
  };
  const handlesubmit = () => {
    if (id) {
      axios
        .post(
          `http://localhost:5000/Eventinquiry/Update?id=${id}`,
          data,
          jwttoken()
        )
        .then((data) => {
          doUpdate(!update);
          handleClose();
          handleClick1({ vertical: "top", horizontal: "center" });
          setAlertSuccess({
            open: true,
            message: " Inquiry Updated Successfully",
          });
        })
        .catch((err) => {
          console.log(err);
          if (err.response.data) {
            handleClick1({ vertical: "top", horizontal: "center" });
            setAlertMsg({
              open: true,
              message: err.response.data.error.details[0].message,
            });
          }
        });
    } else {
      axios
        .post(
          "http://localhost:5000/Eventinquiry/addInquiry",
          {
            ...data,
            eventId: parent._id,
          },
          jwttoken()
        )
        .then((data) => {
          console.log(data);
          doUpdate(!update);
          handleClose();
          handleClick1({ vertical: "top", horizontal: "center" });
          setAlertSuccess({
            open: true,
            message: " Inquiry Added Successfully",
          });
        })
        .catch((err) => {
          console.log(err);
          if (err.response.data) {
            handleClick1({ vertical: "top", horizontal: "center" });
            setAlertMsg({
              open: true,
              message: err.response.data.error.details[0].message,
            });
          }
        });
    }
  };
  React.useEffect(() => {
    axios
      .get("http://localhost:5000/event/Displayevent", jwttoken())
      .then((data) => {
        setArr(data.data.data);
        console.log("arr is set ");
      })
      .catch((err) => {
        console.log(err);
        console.log(data);
      });

    if (parent._id) {
      if (value == 0) {
        axios
          .get(
            `http://localhost:5000/Eventinquiry/OnGoing?id=${
              parent._id
            }&page=${page}&limit=${10}`,
            jwttoken()
          )

          .then((data) => {
            setong(data.data.data);
            console.log(data);
            settotalpages(data.data.totalPages);
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (value == 1) {
        axios
          .get(
            `http://localhost:5000/Eventinquiry/Reject?id=${
              parent._id
            }&page=${page}&limit=${10}`,
            jwttoken()
          )

          .then((data) => {
            setReject(data.data.data);
            console.log("reject is set");
            settotalpages(data.data.totalPages);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        axios
          .get(
            `http://localhost:5000/Eventinquiry/Confirm?id=${
              parent._id
            }&page=${page}&limit=${10}`,
            jwttoken()
          )

          .then((data) => {
            setconfirm(data.data.data);
            console.log("confirm is set");
            settotalpages(data.data.totalPages);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, [update, parent._id, value, page]);

  const handleopen = () => {
    setOpen(!open);
  };

  const handlechange1 = (event, newValue) => {
    setValue(newValue);
  };

  const handleparent = (e) => {
    setParent({ ...e.target.value });
  };

  dayjs.extend(utc);
  const handleDateChange = (val, type) => {
    const selectedDate = new Date(val);
    selectedDate.setHours(12, 0, 0, 0);
    const formattedDate = selectedDate.toISOString();

    setData({ ...data, Date: formattedDate });
  };

  const [type, settype] = React.useState("");
  const [searchname, setseearchname] = React.useState("");
  const handlesearchname = (e) => {
    setseearchname(e.target.value);
  };
  console.log(searchname);

  console.log(value);
  React.useEffect(() => {
    if (value == 0) {
      settype("onGoing");
      setpage(1);
    } else if (value == 1) {
      settype("Reject");
      setpage(1);
    } else {
      settype("Confirm");
      setpage(1);
    }
  }, [value, totalpages]);
  console.log(type);

  const [order, setorder] = React.useState(1);

  const [order1, setorder1] = React.useState(1);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openmenu = Boolean(anchorEl);
  const handleClickmenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosemenu = () => {
    setAnchorEl(null);
  };
  const [anchorEl1, setAnchorEl1] = React.useState(null);
  const openmenu1 = Boolean(anchorEl1);
  const handleClickmenu1 = (event) => {
    setAnchorEl1(event.currentTarget);
  };
  console.log(totalpages);
  const handleClosemenu1 = () => {
    setAnchorEl1(null);
  };

  const montharr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const monthname = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [open2, setOpen2] = React.useState(false);

  const [open3, setOpen3] = React.useState(false);

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setData({ Date: newdate() });

    setId();
    setOpen2(false);
  };

  const handleClickOpen3 = () => {
    setOpen3(true);
  };

  const handleClose3 = () => {
    setData({ Date: newdate() });

    setId();
    setOpen3(false);
  };
  const handlePageChange = (event, value) => {
    setpage(value); // This will trigger the useEffect dependent on 'page'
  };

  const pagination = React.useMemo(() => {
    return (
      <Grid
        
        item  xs={12} sm={6} md={5} sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'center' } }}  
    
      >
        <Box>
          <CustomPagination
            count={totalpages?totalpages:1}
            page={page}
            size="small"
            siblingCount={1}
            boundaryCount={1}
            onChange={handlePageChange}
            showFirstButton={false}
            showLastButton={false} // Using the handler function
          />
        </Box>
      </Grid>
    );
  }, [totalpages, page]); // Add 'page' to the dependency array

  const Snack = React.useMemo(() => {
    console.log("snackbar called");
    return (
      <Snackbar
        open={op}
        autoHideDuration={2000}
        onClose={handleClose12}
        anchorOrigin={{ vertical, horizontal }}
      >
        {(alertSuccess.open || alertMsg.open) && (
          <Alert
            onClose={handleClose12}
            severity={alertSuccess.open ? "success" : "error"}
            // alertSuccess.open? "success": alertMsg.open? "error": alertInfo.open? "info": "info"\

            variant="filled"
            sx={{ width: "100%" }}
          >
            {alertSuccess.open ? alertSuccess.message : alertMsg.message}
          </Alert>
        )}
      </Snackbar>
    );
  }, [op]);
  const ingredients = React.useMemo(() => {
    console.log("ingredients called");
    return (
      <Grid container spacing={2}>
        <Grid
          item
          xs={12} sm={4} md={2} sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}
        >
          <Box sx={{ display: "flex", mt: 1 }}>
            <div>
              <Tooltip title="Add Event Inquiries">
                <Button
                  onClick={handleopen}
                  disabled={parent._id ? false : true}
                >
                  <AddIcon />
                </Button>
              </Tooltip>
            </div>
            <div>
              <Tooltip title="Filter" arrow>
                <Button
                  id="basic-button"
                  disabled={parent._id ? false : true}
                  aria-controls={openmenu1 ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openmenu1 ? "true" : undefined}
                  onClick={handleClickmenu1}
                >
                  <FilterAltIcon
                    sx={{
                      color: parent._id ? blue : "rgba(0, 0, 0, 0.26)",
                    }}
                  />
                </Button>
              </Tooltip>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl1}
                open={openmenu1}
                onClose={handleClosemenu1}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                {montharr.map((val, index) => (
                  <MenuItem
                    onClick={() => {
                      console.log("clicked1");

                      axios
                        .get(
                          `http://localhost:5000/Eventinquiry/filterbyMonth?month=${
                            montharr[index]
                          }&sortby=${order1}&page=${page}&limit=${10}&type=${type}`,
                          jwttoken()
                        )
                        .then((data) => {
                          console.log(data);
                          if (type == "onGoing") {
                            setong(data.data.filterData);
                            setorder1(order1 === 1 ? -1 : 1);
                            settotalpages(data.data.totalPages);
                          } else if (type == "Reject") {
                            setReject(data.data.filterData);
                            setorder1(order1 === 1 ? -1 : 1);
                            settotalpages(data.data.totalPages);
                          } else {
                            setconfirm(data.data.filterData);
                            setorder1(order1 === 1 ? -1 : 1);
                            settotalpages(data.data.totalPages);
                          }
                        })
                        .catch((error) => {
                          console.error("API Request Error:", error);
                        });

                      handleClosemenu1();
                    }}
                  >
                    {monthname[index]}
                  </MenuItem>
                ))}
              </Menu>
            </div>

            <div>
              <Tooltip title="Sort" arrow>
                <Button
                  id="basic-button"
                  disabled={parent._id ? false : true}
                  aria-controls={openmenu ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openmenu ? "true" : undefined}
                  onClick={handleClickmenu}
                >
                  <SortIcon
                    sx={{ color: parent._id ? blue : "rgba(0, 0, 0, 0.26)" }}
                  />
                </Button>
              </Tooltip>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openmenu}
                onClose={handleClosemenu}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem
                  onClick={() => {
                    axios
                      .get(
                        `http://localhost:5000/Eventinquiry/alldata?key=${type}&page=${page}&limit=${10}`,
                        jwttoken()
                      )
                      .then((data) => {
                        console.log(data);
                        if (type == "onGoing") {
                          setong(data.data.allData);
                          settotalpages(data.data.totalPages);
                        } else if (type == "Reject") {
                          setReject(data.data.allData);
                          settotalpages(data.data.totalPages);
                        } else {
                          setconfirm(data.data.allData);
                          settotalpages(data.data.totalPages);
                        }
                      })
                      .catch((error) => {
                        console.error("API Request Error:", error);
                      });
                    handleClosemenu();
                  }}
                >
                  All
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    axios
                      .get(
                        `http://localhost:5000/Eventinquiry/sortby?eventId=${
                          parent._id ? parent._id : ""
                        }&key=Date&page=${page}&limit=${10}&sortBy=${order}&type=${type}`,
                        jwttoken()
                      )
                      .then((data) => {
                        console.log(data);
                        if (type == "onGoing") {
                          setong(data.data.sortData);
                          setorder(order == 1 ? -1 : 1);
                          settotalpages(data.data.totalPages);
                        } else if (type == "Reject") {
                          setReject(data.data.sortData);
                          setorder(order == 1 ? -1 : 1);
                          settotalpages(data.data.totalPages);
                        } else {
                          setconfirm(data.data.sortData);
                          setorder(order == 1 ? -1 : 1);
                          settotalpages(data.data.totalPages);
                        }
                      })
                      .catch((error) => {
                        console.error("API Request Error:", error);
                      });
                    handleClosemenu();
                  }}
                >
                  Sort By Date
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    axios
                      .get(
                        `http://localhost:5000/Eventinquiry/sortby?eventId=${
                          parent._id ? parent._id : ""
                        }&key=FullName&page=${page}&limit=${10}&sortBy=${order}&type=${type}`,
                        jwttoken()
                      )
                      .then((data) => {
                        console.log(data);
                        if (type == "onGoing") {
                          setong(data.data.sortData);
                          setorder(order == 1 ? -1 : 1);
                          settotalpages(data.data.totalPages);
                        } else if (type == "Reject") {
                          setReject(data.data.sortData);
                          setorder(order == 1 ? -1 : 1);
                          settotalpages(data.data.totalPages);
                        } else {
                          setconfirm(data.data.sortData);
                          setorder(order == 1 ? -1 : 1);
                          settotalpages(data.data.totalPages);
                        }
                      })
                      .catch((error) => {
                        console.error("API Request Error:", error);
                      });
                    handleClosemenu();
                  }}
                >
                  Sort By Name
                </MenuItem>
              </Menu>
            </div>
          </Box>
        </Grid>
        {pagination}
        <Grid item  xs={12} sm={4} md={2}>
          <Box sx={{ mx: 2 }}>
            <FormControl sx={{ width: 150 }}>
              <InputLabel
                id="demo-simple-select-label"
                sx={{
                  top: "-6px", // Adjust label position slightly upwards
                  backgroundColor: "white", // Background to avoid overlap with border

                  "&.Mui-focused": {
                    top: "0px", // Position when focused
                  },
                }}
              >
                {" "}
                Select Event
              </InputLabel>
              <Select
                onChange={(e) => {
                  handleparent(e);
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Status"
                renderValue={(data) => {
                  return (parent._id && data.eventName) || "";
                }}
                sx={{
                  height: 50,
                  borderRadius: "16px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      border: "2px solid #0063cc", // Default border color
                    },
                    "&:hover fieldset": {
                      border: "2px solid #0063cc", // Border color on hover
                    },
                    "&.Mui-focused fieldset": {
                      border: "2px solid #0063cc", // Border color when focused
                    },
                  },
                }}
              >
                {arr &&
                  arr.map((row) => (
                    <MenuItem value={row}>
                      <TableRow
                        key={row.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center">{row.eventName}</TableCell>
                      </TableRow>
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid
     item     xs={12} sm={4} md={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-end' } }}
     
        >
          <Box sx={{ width: 400, ml: 3 }}>
            <TextField
              value={searchname}
              id="filled-hidden-label-small"
              placeholder="Search Students..."
              variant="filled"
              size="small"
              onChange={handlesearchname}
              sx={{
                width: "100%",
                maxWidth: 400,
                "& .MuiFilledInput-root": {
                  borderRadius: "16px",
                  border: "2px solid #0063cc",
                  backgroundColor: "white",
                  padding: "0 16px", // Ensure background color is consistent
                  "&:hover": {
                    backgroundColor: "white",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "white",
                  },
                  "& input": {
                    padding: "12px 0", // Adjust vertical padding to center text
                    // Center the text horizontally
                  },
                },
                "& .MuiFilledInput-underline:before": {
                  borderBottom: "none", // Remove the default underline before focus
                },
                "& .MuiFilledInput-underline:after": {
                  borderBottom: "none", // Remove the default underline after focus
                },
                "& .MuiFilledInput-underline:hover:not(.Mui-disabled):before": {
                  borderBottom: "none", // Remove underline on hover
                },
              }}
            />
          </Box>
          <Tooltip title="Search" arrow>
            <Button sx={{ color: "#0063cc" }}>
              <SearchIcon
                onClick={() => {
                  if (searchname.trim().length > 0) {
                    axios
                      .get(
                        `http://localhost:5000/Eventinquiry/search?FullName=${searchname}&type=${type}&page=${page}&limit=${10}`,
                        jwttoken()
                      )
                      .then((data) => {
                        console.log(data);
                        if (type == "onGoing") {
                          setong(data.data.filterdata);
                          settotalpages(data.data.totalPages);
                        } else if (type == "Reject") {
                          setReject(data.data.filterdata);
                          settotalpages(data.data.totalPages);
                        } else {
                          setconfirm(data.data.filterdata);
                          settotalpages(data.data.totalPages);
                        }

                        setseearchname("");
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  } else {
                    handleClick1({ vertical: "top", horizontal: "center" });
                    setAlertMsg({
                      open: true,
                      message: "Please Enter Name First",
                    });
                    setseearchname("")
                  }
                }}
              />
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
    );
  }, [
    totalpages,
    open,
    anchorEl,
    anchorEl1,
    searchname,
    parent,
    arr,
    order,
    order1,
  ]);
  const dialog = React.useMemo(() => {
    console.log("dilog called");
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <TextField
            id="outlined-basic"
            label="Full Name"
            variant="filled"
            value={data.FullName}
            onChange={(e) => {
              handleChange(e, "FullName");
            }}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            id="outlined-basic"
            type="number"
            label="Contact"
            variant="filled"
            value={data.Contact}
            onChange={(e) => {
              console.log(e);
              handleChange(e, "Contact");
            }}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            id="outlined-basic"
            label="Email"
            variant="filled"
            value={data.Email}
            onChange={(e) => {
              handleChange(e, "Email");
            }}
            fullWidth
            sx={{ mb: 1 }}
          />

          <Box sx={{ mb: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
              <DemoContainer components={["DatePicker"]} fullWidth>
                <DatePicker
                  label="Choose Your Date"
                  sx={{ width: 533 }}
                  slotProps={{ textField: { variant: "filled" } }}
                  value={dayjs(data.Date)}
                  onChange={handleDateChange}
                  fullWidth
                ></DatePicker>
              </DemoContainer>
            </LocalizationProvider>
          </Box>

          <TextField
            id="outlined-basic"
            label="College Name"
            value={data.CollageName}
            variant="filled"
            onChange={(e) => {
              handleChange(e, "CollageName");
            }}
            fullWidth
            sx={{ mb: 2 }}
          />

          <Box sx={{ minWidth: 120, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Follow-Up</InputLabel>
              <Select
                value={data.FollowUp}
                variant="filled"
                onChange={(e) => {
                  handleChange(e, "FollowUp");
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Status"
              >
                <MenuItem value={"Yes"}>Yes</MenuItem>
                <MenuItem value={"No"}>No</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ minWidth: 120, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Interaction</InputLabel>
              <Select
                value={data.Interaction}
                variant="filled"
                onChange={(e) => {
                  handleChange(e, "Interaction");
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Status"
              >
                <MenuItem value={"Office"}>Office</MenuItem>
                <MenuItem value={"Oncall"}>On-Call</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TextField
            fullWidth
            label="Description"
            value={data.Description}
            variant="filled"
            id="fullWidth"
            sx={{ mb: 2 }}
            onChange={(e) => {
              handleChange(e, "Description");
            }}
          />
          <Grid container spacing={2} justifyContent="right" sx={{ mt: 0.5 }}>
            <Button
              onClick={() => {
                handleClose();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handlesubmit();
              }}
            >
              Submit
            </Button>
          </Grid>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    );
  }, [open, data, id]);
  const table = React.useMemo(() => {
    console.log("table czlled");
    return (
      <Box>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Tabs
            value={value}
            onChange={handlechange1}
            aria-label="basic tabs example"
          >
            <Tab label="onGoing" {...a11yProps(0)} />
            <Tab label="Reject" {...a11yProps(1)} />
            <Tab label="Confirmed" {...a11yProps(2)} />
          </Tabs>
        </Box>

        <CustomTabPanel value={value} index={0}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{
                      position: "sticky",
                      left: 0,
                      backgroundColor: "white",
                      zIndex: 1,
                    }}
                  >
                    Full Name
                  </TableCell>
                  <TableCell align="center">Contact</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Collage Name</TableCell>
                  <TableCell align="center">FollowUp</TableCell>
                  <TableCell align="center">Interaction</TableCell>
                  <TableCell align="center">Description</TableCell>
                  <TableCell align="center" colSpan={3}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ height: ong && ong.length < 1 ? 220 : 0 }}>
                {ong && ong.length > 0 ? (
                  ong.map((row) => (
                    <TableRow
                      key={row._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        align="center"
                        sx={{
                          position: "sticky",
                          left: 0,
                          backgroundColor: "white",
                          zIndex: 1,
                        }}
                      >
                        {row.FullName}
                      </TableCell>
                      <TableCell align="center">{row.Contact}</TableCell>
                      <TableCell align="center">{row.Email}</TableCell>
                      <TableCell align="center">
                        {row.Date && row.Date.split("T")[0]}
                      </TableCell>
                      <TableCell align="center">{row.CollageName}</TableCell>
                      <TableCell
                        align="center"
                        style={{
                          color: row.FollowUp == "Yes" ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {row.FollowUp}
                      </TableCell>
                      <TableCell align="center">{row.Interaction}</TableCell>
                      <TableCell align="center">{row.Description}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit" arrow>
                          <Button
                            onClick={() => {
                              setOpen(true);
                              setData(row);
                              setId(row._id);
                            }}
                          >
                            <EditIcon />
                          </Button>
                        </Tooltip>
                      </TableCell>

                      <TableCell>
                        <Tooltip title="Reject" arrow>
                          <Button
                            color="error"
                            onClick={() => {
                              setId(row._id);
                              handleClickOpen2();
                            }}
                          >
                            <CloseIcon />
                          </Button>
                        </Tooltip>
                      </TableCell>

                      <TableCell>
                        <Tooltip title="Confirm" arrow>
                          <Button
                            color="success"
                            onClick={() => {
                              setId(row._id);
                              handleClickOpen3();
                            }}
                          >
                            <DoneIcon />
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={11}>
                      No Data Available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Full Name</TableCell>
                  <TableCell align="center">Contact</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Collage Name</TableCell>
                  <TableCell align="center">FollowUp</TableCell>
                  <TableCell align="center">Interaction</TableCell>
                  <TableCell align="center">Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ height: reject && reject.length < 1 ? 220 : 0 }}>
                {reject && reject.length > 0 ? (
                  reject.map((row) => (
                    <TableRow
                      key={row._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="center">{row.FullName}</TableCell>
                      <TableCell align="center">{row.Contact}</TableCell>
                      <TableCell align="center">{row.Email}</TableCell>
                      <TableCell align="center">
                        {row.Date && row.Date.split("T")[0]}
                      </TableCell>
                      <TableCell align="center">{row.CollageName}</TableCell>
                      <TableCell
                        align="center"
                        style={{
                          color: row.FollowUp == "Yes" ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {row.FollowUp}
                      </TableCell>

                      <TableCell align="center">{row.Interaction}</TableCell>
                      <TableCell align="center">{row.Description}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={8}>
                      No Data Available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CustomTabPanel>

        <CustomTabPanel value={value} index={2}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Full Name</TableCell>
                  <TableCell align="center">Contact</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Collage Name</TableCell>
                  <TableCell align="center">FollowUp</TableCell>
                  <TableCell align="center">Interaction</TableCell>
                  <TableCell align="center">Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody
                sx={{ height: confirm && confirm.length < 1 ? 220 : 0 }}
              >
                {confirm && confirm.length > 0 ? (
                  confirm.map((row) => (
                    <TableRow
                      key={row._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="center">{row.FullName}</TableCell>
                      <TableCell align="center">{row.Contact}</TableCell>
                      <TableCell align="center">{row.Email}</TableCell>
                      <TableCell align="center">
                        {row.Date && row.Date.split("T")[0]}
                      </TableCell>
                      <TableCell align="center">{row.CollageName}</TableCell>
                      <TableCell align="center">{row.FollowUp}</TableCell>
                      <TableCell align="center">{row.Interaction}</TableCell>
                      <TableCell align="center">{row.Description}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={8}>
                      No Data Available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CustomTabPanel>
      </Box>
    );
  }, [ong, reject, confirm, value, searchname]);
  const rejectdialog = React.useMemo(() => {
    console.log("rejectdialog");
    return (
      <Dialog
        open={open2}
        onClose={handleClose2}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Reject Student"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do You Want To Reject?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose2}>Cancel</Button>
          <Button
            onClick={() => {
              axios
                .post(
                  `http://localhost:5000/Eventinquiry/RejectedInquiry?id=${id}`,
                  {},
                  jwttoken()
                )

                .then((data) => {
                  console.log(data);
                  doUpdate(!update);
                  setData({ Date: newdate() });

                  handleClick1({ vertical: "top", horizontal: "center" });
                  setAlertSuccess({
                    open: true,
                    message: " Inquiry Rejected Successfully",
                  });

                  handleClose2();
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  }, [open2]);
  const confirmdialog = React.useMemo(() => {
    console.log("cofnrim dialog");
    return (
      <Dialog
        open={open3}
        onClose={handleClose3}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Student"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do You Want To Confirm?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose3}>Cancel</Button>
          <Button
            onClick={() => {
              axios
                .post(
                  `http://localhost:5000/Eventinquiry/ConfimInquiry?id=${id}`,
                  {},
                  jwttoken()
                )
                .then((data) => {
                  console.log(data);
                  doUpdate(!update);
                  setData({ Date: newdate() });

                  handleClick1({ vertical: "top", horizontal: "center" });
                  setAlertSuccess({
                    open: true,
                    message: " Inquiry Confirmed Successfully",
                  });

                  handleClose2();
                })
                .catch((err) => {
                  console.log(err);
                });
              handleClose3();
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  }, [open3]);
  return (
    <React.Fragment>
      {Snack}

      {ingredients}

      {dialog}

      {table}

      {rejectdialog}
      {confirmdialog}
    </React.Fragment>
  );
}

export default Eventi;
