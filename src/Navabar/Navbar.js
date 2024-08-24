import * as React from 'react';
import AppBar from '@mui/material/AppBar';

import Box from '@mui/material/Box';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Snackbar, Alert } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';

import List from '@mui/material/List';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';

import DialogTitle from '@mui/material/DialogTitle';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { Outlet, useNavigate } from 'react-router-dom';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { Dialog, dialogClasses, Grid } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import LogoutIcon from '@mui/icons-material/Logout';
import Button from "@mui/material/Button";
function ButtonAppBar() {
  
  const [open1, setOpen1] = React.useState(false);
 
  
  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };
  
  const[text1,settext]=React.useState()
  const [open, setOpen] = React.useState(false);
 const[name,setname]=React.useState()

  React.useEffect(()=>{
    const getname=localStorage.getItem('displayname')
    if(getname){
      setname(getname)
    }
 
  },[])
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
    
    
  };
 
  const Nav=useNavigate("")
let dasharr=['/dashBoard/dashBoard']
    let arr=["/course/AddCourse","/course/CourInq",'/course/Batch-For-Course',"/course/Studentdetails","/course/Invoice","/course/Completedcourse"]
  let arr1=["/events/Events","/events/einquiries","/events/Batches","/events/Old"]

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  
  const DrawerList = (
    <Box sx={{width: 250 }} role="presentation">

<SimpleTreeView>
      {/* <TreeItem itemId="charts-community" label="Dashboard" />
         */}
      <List>
         {['Dashboard'].map(
           (text, index) => (
             <ListItem key={text} disablePadding onClick={()=>{localStorage.setItem('displayname',text); setname(text);Nav(`${dasharr[index]}`);
             
             
             }}>
               <ListItemButton onClick={()=>{
      setOpen(false)
    }}

    >
                 {/* <ListItemIcon>
                   {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                 </ListItemIcon>
                  */}
                 <ListItemText primary={text} />
               </ListItemButton>
            </ListItem>
           )
         )}
       </List>
        <TreeItem itemId="grid" label="Course">
        <List>
         {['Add Batches','Course-Inquiries','Assign-Students to Batch', 'Student Details','Invoice','Completed-courses'].map(
           (text, index) => (
             <ListItem key={text} disablePadding onClick={()=>{localStorage.setItem('displayname',text); setname(text); ;Nav(`${arr[index]}`);
            


             }}>
               <ListItemButton onClick={()=>{
      setOpen(false)
    }}

    >
                 <ListItemIcon>
                   {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                 </ListItemIcon>
                 <ListItemText primary={text} />
               </ListItemButton>
            </ListItem>
           )
         )}
       </List>
     
          
        </TreeItem>
        <TreeItem itemId="pickers" label="Event">
        <List>
      {[ 'Add-Events','Event Inquiries','Add Students-Events','Completed Events'].map(
           (text, index) => (
             <ListItem key={text} disablePadding onClick={()=>{localStorage.setItem('displayname',text); setname(text);settext(text);Nav(`${arr1[index]}`)}}>
               <ListItemButton onClick={()=>{
      setOpen(false)
    }}
    >
                 <ListItemIcon>
                   {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                 </ListItemIcon>
                 <ListItemText primary={text} />
               </ListItemButton>
             </ListItem>
           )
         )}
       </List>
      
        </TreeItem>
        
      
      </SimpleTreeView>



  
    </Box>
  );
  
  return (
    <>
    <Box sx={{ flexGrow: 1 ,mb:4}}>
      <AppBar position="static">
        <Toolbar>
        <Grid container>
  <Grid 
    item xs={1} 
    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
  >
    <MenuIcon onClick={toggleDrawer(true)} />
  </Grid>
  <Drawer open={open} onClose={toggleDrawer(false)}>
    {DrawerList}
  </Drawer>

  <Grid 
    item xs={9} 
    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
  >
    
    <Typography 
      variant="h6" 
      component="div" 
      sx={{ flexGrow: 1, textAlign: 'center' }}
    >
      {name?name:'Dashboard'}
    </Typography>
  </Grid>
  
  <Grid 
    item xs={2} 
    sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
  >
    <Typography 
      variant="h6" 
      component="div" 
      sx={{ flexGrow: 1, textAlign: 'center',mr:1 }}
    >
      Tech Nishal
    </Typography>

      <LogoutIcon color='white'
      onClick={()=>{handleClickOpen1()}}
      />
 
  </Grid>
</Grid>


        </Toolbar>
      </AppBar>
    </Box>
      <Outlet/>
      <Dialog
                  open={open1}
                  onClose={handleClose1}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Logout"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Do you Want to Logout ?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose1}>Cancel</Button>
                    <Button onClick={()=>{
                      localStorage.removeItem('token')
                      localStorage.removeItem('displayname')
                      handleClick1({ vertical: "top", horizontal: "center" });

                      setAlertSuccess({
                        open: true,
                        message: 'Logout Success',
                       
                      });
                      setTimeout(()=>{
                        Nav('/')
                      },2000)
                      handleClose1()

                    }}>
                      Confirm
                    </Button>
                  </DialogActions>
                </Dialog>
                <Snackbar
        open={op}
        autoHideDuration={2000}
        onClose={handleClose12}
        anchorOrigin={{ vertical, horizontal }}
        
      >
          {alertSuccess.open  && (
    <Alert
      onClose={handleClose12}
      severity="success"
                
      variant="filled"
      sx={{ width: "100%" }}
    >
    {alertSuccess.message} 
    </Alert>
  )}
      </Snackbar>
      </>
  );
}
export default React.memo(ButtonAppBar)




















// export default function ButtonAppBar() {
  
//   const [open, setOpen] = React.useState(false);
//   const Nav=useNavigate("")
  
//   let arr=["/dashBoard/","/dashBoard/Add Course","/dashBoard/CourInq",'/dashBoard/Batch-For-Course',"/dashBoard/Invoice","/dashBoard/Studentdetails","/dashBoard/Events","/dashBoard/einquiries","/dashBoard/Old","/dashBoard/Batches","/dashBoard/Completedcourse"]

//   const toggleDrawer = (newOpen) => () => {
//     setOpen(newOpen);
//   };

//   const DrawerList = (
//     <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
//       <List>
//         {[ 'Dashboard','Add Course','Course-Inquiries','Add Batches-Course', 'Invoice', 'Student Details','Events','Event Inquiries','Completed Events','Add Batches-Events','Completed-courses'].map(
//           (text, index) => (
//             <ListItem key={text} disablePadding onClick={()=>{Nav(`${arr[index]}`)}}>
//               <ListItemButton>
//                 <ListItemIcon>
//                   {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
//                 </ListItemIcon>
//                 <ListItemText primary={text} />
//               </ListItemButton>
//             </ListItem>
//           )
//         )}
//       </List>
//       <Divider />
      
//     </Box>
//   );

//   return (
//     <>
//     <Box sx={{ flexGrow: 1 ,mb:4}}>
//       <AppBar position="static">
//         <Toolbar>
          
//             <MenuIcon  onClick={toggleDrawer(true)}/>
      

//           <Drawer open={open} onClose={toggleDrawer(false)}>
//             {DrawerList}
//           </Drawer>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1 ,textAlign:'center'}}>
//             Tech Nishal
//           </Typography>
//         </Toolbar>
//       </AppBar>
//     </Box>
//       <Outlet/>
//       </>
//   );
// }
