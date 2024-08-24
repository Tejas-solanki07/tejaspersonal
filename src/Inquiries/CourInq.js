import * as React from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import Menu from "@mui/material/Menu";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Snackbar, Alert } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import utc from "dayjs/plugin/utc";
import DoneIcon from "@mui/icons-material/Done";
import Pagination from "@mui/material/Pagination";
import { styled } from "@mui/system";

import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  FilledInput,
} from "@mui/material";
import dayjs from "dayjs";
import DialogContent from "@mui/material/DialogContent";
import jwttoken from "../Token";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SortIcon from "@mui/icons-material/Sort";
import AddIcon from "@mui/icons-material/Add";
import { Grid } from "@mui/material";

import axios from "axios";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";

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

function Form1() {
  const newdate = () => {
    const selectedDate = new Date();

    selectedDate.setHours(12, 0, 0, 0);
    const formattedDate = selectedDate.toISOString();

    return formattedDate;
  };

  const [data, setData] = React.useState({
    // Date: dayjs(newdate().toISOString()),
    Date: newdate(),
    Course: [],
  });
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
  const [value, setValue] = React.useState(0);

  const [type, settype] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [arr, setArr] = React.useState([]);
  const [reject, setReject] = React.useState([]);
  const [confirm, setconfirm] = React.useState([]);
  const [update, doUpdate] = React.useState(false);
  const [id, setId] = React.useState();
  const [page, setpage] = React.useState(1);

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

  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  const handleClose1 = () => {
    setOpen(false);
    setData({ Date: newdate() });

    setId("");

    setOpen1(false);
  };

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen(false);
    setData({ Date: newdate() });

    setId("");

    setOpen2(false);
  };

  const [searchname, setseearchname] = React.useState("");
  const handlesearchname = (e) => {
    setseearchname(e.target.value);
  };

  const handleChange = (e, type) => {
    setData({ ...data, [type]: e.target.value });
  };

  const handleopen = () => {
    setOpen(!open);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handlechange1 = (event, newValue) => {
    setValue(newValue);
  };

  const [totalPages, settotalpages] = React.useState();
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
  }, [value, totalPages]);

  const Co = ["React", "Node", "C", "C++", "Python", "Mern Stack", "AWS"];
  const handlecourse = (e) => {
    let value = e.target.value;
    setData({ ...data, Course: value });
  };
  console.log("page:", page);
  console.log("value:", value);
  React.useEffect(() => {
    if (value == 0) {
      axios
        .get(
          `http://localhost:5000/inquiry/OnGoing?page=${page}&limit=${10}`,
          jwttoken()
        )
        .then((data) => {
          console.log(data);
          setArr(data.data.data);
          settotalpages(data.data.totalPages);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (value == 1) {
      axios
        .get(
          `http://localhost:5000/inquiry/Reject?page=${page}&limit=${10}`,
          jwttoken()
        )
        .then((data) => {
          console.log(data);
          setReject(data.data.data);
          settotalpages(data.data.totalPages);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .get(
          `http://localhost:5000/inquiry/Confirm?page=${page}&limit=${10}`,
          jwttoken()
        )
        .then((data) => {
          console.log(data);
          setconfirm(data.data.data);
          settotalpages(data.data.totalPages);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [update, value, page]);

  const handlesubmit = () => {
    if (id) {
      axios
        .post(`http://localhost:5000/inquiry/Update?id=${id}`, data, jwttoken())
        .then((data1) => {
          doUpdate(!update);
          setData({ Date: newdate() });

          setOpen(false);
          setId("");
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
        .post("http://localhost:5000/inquiry/addInquiry", data, jwttoken())
        .then((data) => {
          doUpdate(!update);
          handleClick1({ vertical: "top", horizontal: "center" });
          setData({ Date: newdate() });

          setOpen(false);

          setId("");

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
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  };

  dayjs.extend(utc);

  const handleDateChange = (val) => {
    const selectedDate = new Date(val);
    selectedDate.setHours(12, 0, 0, 0);
    const formattedDate = selectedDate.toISOString();

    setData({ ...data, Date: formattedDate });
  };

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

  const snack = React.useMemo(() => {
    console.log("snaclbar");
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
  const pagination = React.useMemo(() => {
    return (
      <Grid
        xs={12}
        sm={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: { xs: 2, sm: 0 }, // Add margin on top for small screens
        }}
      >
        <Box>
          <CustomPagination
            count={totalPages ? totalPages : 1}
            page={page}
            size="small"
            siblingCount={1}
            boundaryCount={1}
            onChange={(e, p) => {
              setpage(p);
            }}
            showFirstButton={false}
            showLastButton={false}
          />
        </Box>
      </Grid>
    );
  }, [totalPages, page]);
  
  const ingredients = React.useMemo(() => {
    console.log("ingredients");
    return (
      <Grid container spacing={2}>
        <Grid
          xs={12}
          sm={2}
          sx={{
            display: "flex",
            justifyContent: { xs: "center", sm: "flex-start" }, // Center on small screens
            alignItems: "flex-start",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: { xs: 0, sm: 1 },
              ml: { xs: 0, sm: 2 },
            }}
          >
            <div>
              <Tooltip title="Add Inquiry" arrow>
                <Button onClick={handleopen}>
                  <AddIcon />
                </Button>
              </Tooltip>
            </div>
            <div>
              <Tooltip title="Filter" arrow>
                <Button
                  id="basic-button"
                  aria-controls={openmenu1 ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openmenu1 ? "true" : undefined}
                  onClick={handleClickmenu1}
                >
                  <FilterAltIcon sx={{ color: "#0063cc" }} />
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
                    key={index}
                    onClick={() => {
                      axios
                        .get(
                          `http://localhost:5000/inquiry/coursefillbymonth?month=${montharr[index]}&sort=${order1}&type=${type}`,
                          jwttoken()
                        )
                        .then((data) => {
                          if (type === "onGoing") {
                            setArr(data.data);
                            setorder1(order1 === 1 ? -1 : 1);
                          } else if (type === "Reject") {
                            setReject(data.data);
                            setorder1(order1 === 1 ? -1 : 1);
                          } else {
                            setconfirm(data.data);
                            setorder1(order1 === 1 ? -1 : 1);
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
                  aria-controls={openmenu ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openmenu ? "true" : undefined}
                  onClick={handleClickmenu}
                >
                  <SortIcon sx={{ color: "#0063cc" }} />
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
                        `http://localhost:5000/inquiry/Alldata?key=${type}`,
                        jwttoken()
                      )
                      .then((data) => {
                        if (type === "onGoing") {
                          setArr(data.data.allData);
                        } else if (type === "Reject") {
                          setReject(data.data.allData);
                        } else {
                          setconfirm(data.data.allData);
                        }
                        handleClosemenu();
                      });
                  }}
                >
                  All
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    axios
                      .get(
                        `http://localhost:5000/inquiry/coursefillbydate?key=Date&sortby=${order}&type=${type}`,
                        jwttoken()
                      )
                      .then((data) => {
                        if (type === "onGoing") {
                          setArr(data.data.data);
                          setorder(order === 1 ? -1 : 1);
                        } else if (type === "Reject") {
                          setReject(data.data.data);
                          setorder(order === 1 ? -1 : 1);
                        } else {
                          setconfirm(data.data.data);
                          setorder(order === 1 ? -1 : 1);
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
                        `http://localhost:5000/inquiry/coursefillbydate?key=FullName&sortby=${order}&type=${type}`,
                        jwttoken()
                      )
                      .then((data) => {
                        if (type === "onGoing") {
                          setArr(data.data.data);
                          setorder(order === 1 ? -1 : 1);
                        } else if (type === "Reject") {
                          setReject(data.data.data);
                          setorder(order === 1 ? -1 : 1);
                        } else {
                          setconfirm(data.data.data);
                          setorder(order === 1 ? -1 : 1);
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
        <Grid
          xs={12}
          sm={4}
          sx={{
            display: "flex",
            justifyContent: { xs: "center", sm: "flex-end" }, // Centered on small screens
            alignItems: "center",
            mt: { xs: 2, sm: 0 }, // Add margin on top for small screens
          }}
        >
          <Box sx={{ width: { xs: "100%", sm: 400 }, ml: 2 }}>
            <TextField
              value={searchname}
              id="filled-hidden-label-small"
              placeholder="Search Inquiries..."
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
                  padding: "0 16px",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "white",
                  },
                  "& input": {
                    padding: "12px 0",
                  },
                },
                "& .MuiFilledInput-underline:before": {
                  borderBottom: "none",
                },
                "& .MuiFilledInput-underline:after": {
                  borderBottom: "none",
                },
                "& .MuiFilledInput-underline:hover:not(.Mui-disabled):before": {
                  borderBottom: "none",
                },
              }}
            />
          </Box>
          <Box sx={{ mt: 1 }}>
            <Tooltip title="Search" arrow>
              <Button sx={{ color: "#0063cc" }}>
                <SearchIcon
                  onClick={() => {
                    console.log("trimmed", searchname.trim().length);
                    if (searchname.trim().length > 0) {
                      axios
                        .get(
                          `http://localhost:5000/inquiry/commansearchstu?FullName=${searchname}&type=${type}&page=${page}&limit=${10}`,
                          jwttoken()
                        )
                        .then((data) => {
                          console.log(data);
                          if (type === "onGoing") {
                            setArr(data.data.filterdata);
                            settotalpages(data.data.totalPages);
                          } else if (type === "Reject") {
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
                      setseearchname("");
                    }
                  }}
                />
              </Button>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>
    );
  }, [
    totalPages,
    value,
    open,
    arr,
    reject,
    confirm,
    order,
    order1,
    anchorEl,
    anchorEl1,
    searchname,
  ]);
  const table = React.useMemo(() => {
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
          <Box>
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
                      }}
                    >
                      Full Name
                    </TableCell>
                    <TableCell align="center">Contact</TableCell>
                    <TableCell align="center">Email</TableCell>
                    <TableCell align="center">Date</TableCell>
                    <TableCell align="center">College Name</TableCell>
                    <TableCell align="center">Interested Course</TableCell>
                    <TableCell align="center">Description</TableCell>
                    <TableCell align="center">Follow-Up</TableCell>
                    <TableCell align="center">Interaction</TableCell>
                    <TableCell align="center" colSpan={3}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ height: arr && arr.length < 1 ? 220 : 0 }}>
                  {arr && arr.length > 0 ? (
                    arr.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: 0,
                          },
                        }}
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
                        <TableCell align="center">
                          {row.Course &&
                            row.Course.map((val) => <Box>{val}</Box>)}
                        </TableCell>
                        <TableCell align="center">{row.Description}</TableCell>
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
                        <TableCell align="center">
                          <Tooltip title="Edit" arrow>
                            <Button
                              onClick={() => {
                                setData(row);
                                setId(row._id);
                                setOpen(true);
                              }}
                            >
                              <EditIcon />
                            </Button>
                          </Tooltip>
                        </TableCell>

                        <TableCell align="center">
                          <Tooltip title="Reject" arrow>
                            <Button
                              onClick={() => {
                                setId(row._id);
                                handleClickOpen1();
                              }}
                              color="error"
                            >
                              <CloseIcon />
                            </Button>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Confirm" arrow>
                            <Button
                              onClick={() => {
                                setId(row._id);
                                handleClickOpen2();
                              }}
                              color="success"
                            >
                              <DoneIcon />
                            </Button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell align="center" colSpan={12}>
                        No Data Available!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          <Box>
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
                      }}
                    >
                      Full Name
                    </TableCell>
                    <TableCell align="center">Contact</TableCell>
                    <TableCell align="center">Email</TableCell>
                    <TableCell align="center">Date</TableCell>
                    <TableCell align="center">College Name</TableCell>
                    <TableCell align="center">Interested Course</TableCell>
                    <TableCell align="center">Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody
                  sx={{ height: reject && reject.length < 1 ? 220 : 0 }}
                >
                  {reject && reject.length > 0 ? (
                    reject.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
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
                        <TableCell align="center">
                          {row.Course &&
                            row.Course.map((val) => <Box>{val}</Box>)}
                        </TableCell>
                        <TableCell align="center">{row.Description}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell align="center" colSpan={7}>
                        No Data Available!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </CustomTabPanel>

        <CustomTabPanel value={value} index={2}>
          <Box>
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
                      }}
                    >
                      Full Name
                    </TableCell>
                    <TableCell align="center">Contact</TableCell>
                    <TableCell align="center">Email</TableCell>
                    <TableCell align="center">Date</TableCell>
                    <TableCell align="center">College Name</TableCell>
                    <TableCell align="center">Interested Course</TableCell>
                    <TableCell align="center">Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody
                  sx={{
                    height: confirm && confirm.length < 1 ? 220 : 0,
                  }}
                >
                  {confirm && confirm.length > 0 ? (
                    confirm.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: 0,
                          },
                        }}
                      >
                        <TableCell
                          align="center"
                          sx={{
                            position: "sticky",
                            left: 0,
                            backgroundColor: "white",
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
                        <TableCell align="center">{row.Course}</TableCell>
                        <TableCell align="center">{row.Description}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell align="center" colSpan={7}>
                        No Data Available!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </CustomTabPanel>
      </Box>
    );
  }, [value, arr, reject, confirm, page]);
  const dialog = React.useMemo(() => {
    console.log("datad ialog");
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  slotProps={{ textField: { variant: "filled" } }}
                  label="Choose Your Date"
                  // defaultValue={id ? dayjs(data.Date) : dayjs(newdate())}
                  value={dayjs(data.Date)}
                  onChange={handleDateChange}
                  sx={{ width: 530 }}
                />
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
            sx={{ mb: 1 }}
          />

          <Box sx={{ mt: 1 }}>
            <FormControl variant="filled" fullWidth>
              <InputLabel id="demo-multiple-checkbox-label">
                Interested Course
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                fullWidth
                multiple
                value={data.Course || []}
                onChange={handlecourse}
                input={<FilledInput />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {Co &&
                  Co.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox
                        checked={data.Course && data.Course.indexOf(name) > -1}
                      />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ minWidth: 120, mb: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Follow-Up</InputLabel>
              <Select
                variant="filled"
                value={data.FollowUp}
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
                variant="filled"
                value={data.Interaction}
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
            variant="filled"
            label="Description"
            value={data.Description}
            id="fullWidth"
            sx={{ mb: 2 }}
            onChange={(e) => {
              handleChange(e, "Description");
            }}
          />
          <Grid container spacing={2} justifyContent="right" sx={{ mt: 0.5 }}>
            <Button
              onClick={() => {
                setOpen(!open);
                setData({ Date: data.Date });
                setId("");
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
      </Dialog>
    );
  }, [open, data, id]);
  const dialogreject = React.useMemo(() => {
    console.log("rejct");
    return (
      <Dialog
        open={open1}
        onClose={handleClose1}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Reject Student"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you Want to Reject ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose1}>Cancel</Button>
          <Button
            onClick={() => {
              axios
                .post(
                  `http://localhost:5000/inquiry/RejectedInquiry?id=${id}`,
                  {},
                  jwttoken()
                )
                .then((data) => {
                  doUpdate(!update);
                  handleClick1({ vertical: "top", horizontal: "center" });
                  setData({ Date: newdate() });

                  setAlertSuccess({
                    open: true,
                    message: " Inquiry Reject Successfully",
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
              handleClose1();
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  }, [open1]);
  const dialogconfirm = React.useMemo(() => {
    console.log("confirm");
    return (
      <Dialog
        open={open2}
        onClose={handleClose2}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Student"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to Confirm Student ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose2}>Cancel</Button>
          <Button
            onClick={() => {
              axios
                .post(
                  `http://localhost:5000/inquiry/ConfimInquiry?id=${id}`,
                  {},
                  jwttoken()
                )
                .then((data) => {
                  doUpdate(!update);
                  handleClick1({ vertical: "top", horizontal: "center" });
                  handleClose2();

                  setAlertSuccess({
                    open: true,
                    message: "Inquiry Confirmed Successfully",
                  });
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

  return (
    <>
      {snack}
      <React.Fragment>
        {ingredients}
        {table}

        {dialog}
      </React.Fragment>
      {dialogreject}
      {dialogconfirm}
    </>
  );
}
export default Form1;
