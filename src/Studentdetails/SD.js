import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import Pagination from "@mui/material/Pagination";
import { styled } from "@mui/system";
import jwttoken from "../Token";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import { Box, FormControl, InputLabel, Select, MenuItem,Paper, Typography } from "@mui/material";
import Alert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import utc from "dayjs/plugin/utc";
import TableCell from "@mui/material/TableCell";

import Menu from "@mui/material/Menu";

import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Grid } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import Tooltip from "@mui/material/Tooltip";

import dayjs from "dayjs";

import FilterAltIcon from "@mui/icons-material/FilterAlt";

import SortIcon from "@mui/icons-material/Sort";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";

import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import SearchIcon from "@mui/icons-material/Search";
function convertToIST(utcDateStr) {
  const date = new Date(utcDateStr);

  const options = {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    // hour12: false // 24-hour format
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}

function SD() {
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

  const newdate = () => {
    const selectedDate = new Date();

    selectedDate.setHours(12, 0, 0, 0);
    const formattedDate = selectedDate.toISOString();

    return formattedDate;
  };
  const [page, setpage] = React.useState(1);
  console.log(page);

  const [totalpages, settotalpages] = React.useState("");

  const [id, setId] = React.useState("");
  const [render, setrender] = React.useState("no");
  console.log(render);
  const [data, setData] = React.useState({
    Date: newdate(),
    btime: "",
    days: [],
  });

  const [arr, setarr] = React.useState([]);
  const [update, doupdate] = React.useState(false);
  const [coursearr, setcoursearr] = React.useState([]);
  const [parent, setParent] = React.useState({});
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

  const handleClick12 = (newState) => {
    setState({ ...state, op: true });
  };

  const handleClose12 = () => {
    setState({ ...state, op: false });
    setAlertSuccess({ ...alertSuccess, open: false });
    setAlertMsg({ ...alertMsg, open: false });
  };

  const handleparent = (e) => {
    setParent({ ...e.target.value });
  };
  console.log(parent);
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });
  const [open, setOpen] = React.useState(false);
  const [order, setorder] = React.useState(1);
  const [order1, setorder1] = React.useState(1);

  const handlechange = (e, type) => {
    setData({ ...data, [type]: e.target.value });
  };
  const handlestudent = (e, type) => {
    setData({ ...data, [type]: e.target.value });
  };
  console.log(data);
  React.useEffect(() => {
    axios
      .get("http://localhost:5000/batchEvent/allcourse", jwttoken())
      .then((data) => {
        setcoursearr(data.data.data);
        console.log("arr is set");
      })
      .catch((err) => {
        console.log(err);
      });

    if (!parent._id) {
      axios
        .get(
          `http://localhost:5000/student/Alldata?page=${page}&limit=${5}`,
          jwttoken()
        )
        .then((data) => {
          console.log(data);
          setarr(data.data.data);
          settotalpages(data.data.totalPages);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (parent._id) {
      axios
        .get(
          `http://localhost:5000/student/allStuden?id=${
            parent._id
          }&page=${page}&limit=${5}`,
          jwttoken()
        )
        .then((data) => {
          console.log(data);
          setarr(data.data.data);
          settotalpages(data.data.totalPages);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [parent, update, render, page]);
  React.useEffect(() => {
    if (parent._id) {
      axios
        .get(`http://localhost:5000/inquiry/falsestu?Course=${parent.Course}`)
        .then((data) => {
          console.log(data);
          setstudent(data.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [parent, render]);
  const [searchname, setseearchname] = React.useState("");

  const handlesubmit = () => {
    if (id) {
      axios
        .post(
          `http://localhost:5000/student/UpdateStu?id=${id}`,
          data,
          jwttoken()
        )
        .then((data) => {
          console.log(data);
          doupdate(!update);
          setrender("yes");
          setOpen(!open);
          setData({ Date: newdate() });

          setId("");
          handleClick12({ vertical: "top", horizontal: "center" });
          setAlertSuccess({
            open: true,
            message: "Student Detail Updated Successfully",
          });
        })
        .catch((err) => {
          console.log(err);
          if (err.response.data) {
            handleClick12({ vertical: "top", horizontal: "center" });
            setAlertMsg({
              open: true,
              message: err.response.data.error.details[0].message,
            });
          }
        });
    } else {
      axios
        .post(
          `http://localhost:5000/student/stuadd?course=${parent.Course}`,
          { ...data, CourseId: parent._id },
          jwttoken()
        )
        .then((data) => {
          console.log("data posted", data);
          doupdate(!update);
          setrender("yes");
          setOpen(!open);
          setData({ Date: newdate() });

          setId("");
          handleClick12({ vertical: "top", horizontal: "center" });
          setAlertSuccess({
            open: true,
            message: " Student Detail Added Successfully",
          });
        })
        .catch((err) => {
          console.log(err);
          if (err.response.data) {
            handleClick12({ vertical: "top", horizontal: "center" });
            setAlertMsg({
              open: true,
              message: err.response.data.error.details[0].message,
            });
          }
        });
    }
  };

  const maxsize = 1000 * 130;
  const handleFileUpload = (event) => {
    const checksize = event.target.files[0];
    if (checksize.size >= maxsize) {
      handleClick12({ vertical: "top", horizontal: "center" });

      setAlertMsg({
        open: true,
        message: "Aadhar Card Size Must be less then 100 KB",
      });
    } else {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onloadend = function () {
        const baseString = reader.result;
        setData((prevData) => ({ ...prevData, baseString }));
        handleClick12({ vertical: "top", horizontal: "center" });
        setAlertSuccess({
          open: true,
          message: " Aadhar Uploaded  Successfully",
        });
      };
    }
  };

  const handleopen = () => {
    setOpen(!open);
  };

  const handleupdate = (row) => {
    setData(row);
    setId(row._id);
    setOpen(true);
  };
  dayjs.extend(utc);
  const handleDateChange = (val) => {
    const selectedDate = new Date(val);
    selectedDate.setHours(12, 0, 0, 0);
    const formattedDate = selectedDate.toISOString();

    setData({ ...data, Date: formattedDate });
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openmenu = Boolean(anchorEl);
  const handleClickmenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handlesearchname = (e) => {
    setseearchname(e.target.value);
  };
  console.log(data.Date);
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

  const [student, setstudent] = React.useState([]);
  const pagination = React.useMemo(() => {
    return (
      <Grid xs={5} sm={5} sx={{display:'flex',justifyContent:'center'}}>
        <Box sx={{ mt: 2 }}>
          <CustomPagination
            count={totalpages?totalpages:1}
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
  }, [totalpages,page]);
  
  const ingredients = React.useMemo(() => {
    console.log("ingredients called");
    return (
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sm={2}
          sx={{
            display: "flex",
            justifyContent: { xs: "center", sm: "flex-start" },
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ display: "flex", mt: 1 }}>
            <div>
              <Tooltip title="Add Student Details" arrow>
                <Button
                  disabled={parent._id ? false : true}
                  onClick={() => {
                    handleopen();
                  }}
                >
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
                {montharr &&
                  montharr.map((val, index) => (
                    <MenuItem
                      onClick={() => {
                        axios
                          .get(
                            `http://localhost:5000/student/filtermonth?perentId=${
                              parent._id ? parent._id : ""
                            }&month=${
                              montharr[index]
                            }&sort=${order1}&page=${page}&limit=${5}`,
                            jwttoken()
                          )
                          .then((data) => {
                            console.log(data);
                            setarr(data.data.data);
                            settotalpages(data.data.totalPages);
                            setorder1(order1 == 1 ? -1 : 1);
                          })

                          .catch((err) => {
                            console.log(err);
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
                    setParent({});
                    handleClosemenu();
                  }}
                >
                  All
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    axios
                      .get(
                        `http://localhost:5000/student/fillter?key=Date&page=${page}&limit=${5}&sortby=${order}&courseid=${
                          parent._id ? parent._id : ""
                        }`,
                        jwttoken()
                      )
                      .then((data) => {
                        console.log(data);
                        setorder(order == 1 ? -1 : 1);
                        setarr(data.data.data);
                        settotalpages(data.data.totalPages);
                      })
                      .catch((err) => {
                        console.log(err);
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
                        `http://localhost:5000/student/fillter?key=Name&sortby=${order}&page=${page}&limit=${5}&courseid=${
                          parent._id ? parent._id : ""
                        }`,
                        jwttoken()
                      )
                      .then((data) => {
                        console.log(data);
                        setorder(order == 1 ? -1 : 1);
                        setarr(data.data.data);
                        settotalpages(data.data.totalPages);
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                    handleClosemenu();
                  }}
                >
                  Sort By Name
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    axios
                      .get(
                        `http://localhost:5000/student/fillter?key=Rfees&sortby=${order}&page=${page}&limit=${5}&courseid=${
                          parent._id ? parent._id : ""
                        }`,
                        jwttoken()
                      )
                      .then((data) => {
                        console.log(data);
                        setorder(order == 1 ? -1 : 1);
                        setarr(data.data.data);
                        settotalpages(data.data.totalPages);
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                    handleClosemenu();
                  }}
                >
                  Sort By RF
                </MenuItem>
              </Menu>
            </div>
          </Box>
        </Grid>
{pagination}
        <Grid item xs={2}  sm={2}>
          <Box sx={{ mx: 2 }}>
            <FormControl sx={{ width: 140 }}>
              <InputLabel id="demo-simple-select-label"
               sx={{
                top: "-6px", // Adjust label position slightly upwards
                backgroundColor: "white", // Background to avoid overlap with border
    
                "&.Mui-focused": {
                  top: "0px", // Position when focused
                },
              }}
              >
                {" "}
                Select Course
              </InputLabel>
              <Select
                onChange={(e) => {
                  handleparent(e);
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Status"
                sx={{
                  height: 50,
                  minWidth: "100%",
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
                renderValue={(data) => {
                  return (parent._id && data.batchName) || "";
                }}
              >
                {coursearr &&
                  coursearr.map((row) => (
                    <MenuItem key={row._id} value={row}>
                      <TableRow>
                        <Typography align="center">{row.batchName}</Typography>
                      </TableRow>
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </Grid>

        <Grid
        xs={12}
        sm={3}
        sx={{
          display: "flex",
          justifyContent: { xs: "center", sm: "center" },
          alignItems: "center",
        }}
        >
          <Box sx={{ width: 400, ml: 3, mt: 2 }}>
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
          <Box sx={{ mt: 2 }}>
            <Tooltip title="Search" arrow>
              <Button sx={{ color: "#0063cc" }}>
                <SearchIcon
                  onClick={() => {
                    if (searchname.trim().length > 0) {
                      axios
                        .get(
                          `http://localhost:5000/student/stusearch?Name=${searchname}&page=${page}&limit=${5}`,
                          jwttoken()
                        )
                        .then((data) => {
                          setarr(data.data.data);
                          settotalpages(data.data.totalPages);
                          setseearchname("");
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    } else {
                      handleClick12({ vertical: "top", horizontal: "center" });
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
          </Box>
        </Grid>
      </Grid>
    );
  }, [
    totalpages,
    open,
    anchorEl1,
    anchorEl,
    searchname,
    order,
    order1,
    parent,
    coursearr,
  ]);

  const snack = React.useMemo(() => {
    console.log("snackbar called");
    return (
      <Snackbar
        open={op}
        autoHideDuration={3000}
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
  
  const dialogdata = React.useMemo(() => {
    console.log("dialog called");
    return (
      <Dialog
        open={open}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
          },
        }}
      >
        <DialogTitle></DialogTitle>
        <DialogContent>
          {id == "" && (
            <Box sx={{ minWidth: 120, mb: 2 }}>
              <FormControl variant="filled" fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Select and Add Student Detail
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  onChange={(e) => {
                    handlestudent(e, "inquiryId");
                  }}
                >
                  {student &&
                    student.map((val) => (
                      <MenuItem value={val._id} key={val._id}>
                        <Box>{val.FullName}</Box>
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {id && (
            <TextField
              fullWidth
              label="Full Name"
              value={data.Name}
              variant="filled"
              id="fullWidth"
              sx={{ mb: 2 }}
              onChange={(e) => {
                handlechange(e, "Name");
              }}
            />
          )}

          {id && (
            <TextField
              type="number"
              id="outlined-basic"
              label="Contact Info"
              variant="filled"
              value={data.Contact}
              fullWidth
              sx={{ mb: 2 }}
              onChange={(e) => {
                handlechange(e, "Contact");
              }}
            />
          )}
          <TextField
            type="number"
            id="outlined-basic"
            label=" Parent Contact Info"
            variant="filled"
            value={data.Parentcontact}
            fullWidth
            sx={{ mb: 2 }}
            onChange={(e) => {
              handlechange(e, "Parentcontact");
            }}
          />

          {id && (
            <TextField
              id="outlined-basic"
              label="Email"
              variant="filled"
              value={data.Email}
              fullWidth
              sx={{ mb: 2 }}
              onChange={(e) => {
                handlechange(e, "Email");
              }}
            />
          )}

          {id && (
            <TextField
              id="outlined-basic"
              label="College Name"
              variant="filled"
              value={data.CollegeName}
              fullWidth
              sx={{ mb: 2 }}
              onChange={(e) => {
                handlechange(e, "CollegeName");
              }}
            />
          )}
          <TextField
            type="number"
            id="outlined-basic"
            disabled={id ? true : false}
            label="Total Fees"
            variant="filled"
            value={data.Tfees}
            fullWidth
            sx={{ mb: 2 }}
            onChange={(e) => {
              handlechange(e, "Tfees");
            }}
          />
          <TextField
            id="outlined-basic"
            label="Academic Course"
            variant="filled"
            value={data.AcademicCourse}
            fullWidth
            sx={{ mb: 1 }}
            onChange={(e) => {
              handlechange(e, "AcademicCourse");
            }}
          />

          <Box sx={{ mb: 1 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Choose Your Date"
                  slotProps={{ textField: { variant: "filled" } }}
                  onChange={handleDateChange}
                  // defaultValue={id ? dayjs(data.Date) : dayjs(newdate())}
                  value={dayjs(data.Date)}
                  sx={{ width: 530 }}
                  fullWidth
                ></DatePicker>
              </DemoContainer>
            </LocalizationProvider>
          </Box>

          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={4} sx={{ mb: 2, mt: 2 }}>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                sx={{ mt: 1 }}
              >
                Aadhar Card
                <VisuallyHiddenInput
                  type="file"
                  onChange={(e) => {
                    handleFileUpload(e);
                  }}
                />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setId("");
              setData({ Date: data.Date });
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
        </DialogActions>
      </Dialog>
    );
  }, [open, data, id]);
  const table = React.useMemo(() => {
    console.log("table callwd");
    return (
      <Box sx={{ mx: 2,mt:3 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650, mx: 3 }} aria-label="simple table">
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
                  Student Name
                </TableCell>
                <TableCell align="center">Contact</TableCell>
                <TableCell align="center">Parent Contact</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">College Name</TableCell>
                <TableCell align="center">Academic Course</TableCell>
                <TableCell align="center">Course</TableCell>
                <TableCell align="center">Total Fees</TableCell>
                <TableCell align="center">Paid Fees</TableCell>
                <TableCell align="center">Remaining Fees</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Batch Days</TableCell>
                <TableCell align="center">Batch Timing</TableCell>
                <TableCell align="center" colSpan={2}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ height: arr && arr.length < 1 ? 300 : 0 }}>
              {arr && arr.length > 0 ? (
                arr.map((row) => (
                  <TableRow
                    key={row.name}
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
                      {row.Name}
                    </TableCell>
                    <TableCell align="center">{row.Contact}</TableCell>
                    <TableCell align="center">{row.Parentcontact}</TableCell>
                    <TableCell align="center">{row.Email}</TableCell>
                    <TableCell align="center">{row.CollegeName}</TableCell>
                    <TableCell align="center">{row.AcademicCourse}</TableCell>
                    <TableCell align="center">
                      {row && row.CourseId && row.CourseId.Course}
                    </TableCell>
                    <TableCell align="center">{row.Tfees}</TableCell>
                    <TableCell align="center">{row.Pfees}</TableCell>
                    <TableCell align="center">{row.Rfees}</TableCell>
                    <TableCell align="center">
                      {row.Date && row.Date.split("T")[0]}
                    </TableCell>
                    <TableCell align="center">
                      {row &&
                        row.CourseId &&
                        row.CourseId.Days.map((val) => (
                          <Box key={val}>{val}</Box>
                        ))}
                    </TableCell>
                    <TableCell align="center">
                      {row &&
                        row.CourseId &&
                        convertToIST(row.CourseId.BatchTime)}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Download Aadhar">
                        <Button
                          onClick={() => {
                            var a = document.createElement("a"); // Create <a>
                            a.href = row.baseString; // Image Base64 Goes here
                            console.log(row);
                            a.download = `${row.Name}Aadhar.png`; // File name Here
                            a.click(); // Downloaded file
                          }}
                        >
                          <DownloadIcon />
                        </Button>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit" arrow>
                        <Button onClick={() => handleupdate(row)}>
                          <EditIcon />
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={14} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }, [arr]);
  return (
    <React.Fragment>
      
      {snack}

      {ingredients}
      {dialogdata}
      {table}
    </React.Fragment>
  );
}

export default SD;
