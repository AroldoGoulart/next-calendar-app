import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { BottomNavigation, Tabs, Tab, Box, Button, Accordion, IconButton, AccordionSummary, Toolbar, Slide, AppBar, Typography, InputBase } from "@material-ui/core/"
import { fade, makeStyles, useTheme } from '@material-ui/core/styles';
import { ArrowUpward, AccountCircle, ExitToApp, Search } from '@material-ui/icons';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SwipeableViews from 'react-swipeable-views';
import { Events } from "../../services/consumer"
import { useLocalStorage } from "../../hooks"

import { EventItem } from "../../components/EventItem"

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    selected: {
        "&$selected": {
            color: "#BD1821"
          }
    },
    indicator: {
      backgroundColor: '#BD1821',
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    text: {
      color: "pink"
    },
    title: {
      flexGrow: 1,
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
}));
const useStylesContainer = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(18),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

// render tabpanel
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
// capsule styles
function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}
// styles of bar
const useStylesTab = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: `auto`,
  },
}));

function SearchScreen(props) {
    const router = useRouter()
    const classes = useStyles();
    const classesContainer = useStylesContainer();
    const classesTab = useStylesTab()
    const theme = useTheme();
    const [value, setValue] = useState(0)
    const [idCached, setIdCached] = useLocalStorage("id", -1)
    const [mapInfo, setMapInfo] = useLocalStorage("mapInfo", {})
    const [repair, setRepair] = useState([])
    const [perizie, setPerizie] = useState([])

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  
    const handleChangeIndex = (index) => {
      setValue(index);
    };

    // convert url in string value and return
    const getDateInUrl = () => {
      let asPath = router.asPath.toLocaleLowerCase().slice(7, 6+11)
        if(router.asPath.toLocaleLowerCase().includes('search')) {
            let indexOf = 0
            for(let i=0; i < router.asPath.toLocaleLowerCase().length; i++) {
                if(router.asPath.toLocaleLowerCase() == "?") {
                    indexOf = i
                }
            }
            return router.asPath.toLocaleLowerCase().slice(7, indexOf)
        }
        else {
            return asPath
        }
     
    }
    
    // get repairs from api
    const getApiRepair = async () => {
      const dateInUrl = getDateInUrl()
      const response = await Events(idCached, dateInUrl, 'repair', "cerca")
      if(response.message == "nothing found") {
        setRepair([])
        return 
      }
      setRepair(Object.entries(response))
    }

    // get perizie from api
    const getApiPerizie = async () => {
      const dateInUrl = getDateInUrl()
      const response = await Events(idCached, dateInUrl, "perizie", "cerca")
      if(response.message == "nothing found") {
        setPerizie([])
        return 
      }
      setPerizie(Object.entries(response))
    }
    
    useEffect(() => {
      getApiRepair()
      getApiPerizie()
    }, [])

    // Will call the company
    const openCall = () => {
    } 
    
    const renderChildren = (children) => {
      return <EventItem children={children}/>
    }
    
    return (
        <div>
            <div>
            <AppBar style={{
                backgroundColor: "#a0a0a0"
            }} 
            position="static">
                <Toolbar>
                    <IconButton onClick={() => router.back()} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                    NonSolograndine
                    </Typography>
                    <Button color="inherit">
                    {getDateInUrl()}
                    </Button>
                </Toolbar>
            </AppBar>
            </div>

            <div className={classesContainer.root}>
            <div className={classesTab.root}>
              <AppBar position="static" color="default">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  classes={classes}
                  scrollButtons="auto"
                  variant="fullWidth"
                  aria-label="full width tabs example"
                >
                  <Tab label="Tutto" {...a11yProps(0)} />
                  <Tab label="Perizie" {...a11yProps(1)} />
                  <Tab label="Riparazion" {...a11yProps(2)} />
                </Tabs>
              </AppBar>
              <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
              >
                <TabPanel value={value} index={0} dir={theme.direction}>
                  {
                    <>
                    {
                      // for every perizie item, render it
                      perizie.map(perizieValue => {
                        return renderChildren(perizieValue[1])
                      })
                    }
                    {
                      // for every repair item, render it
                      repair.map(repairValue => {
                        return renderChildren(repairValue[1])
                      })
                    }
                    </>
                    
                  }
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                  {
                    // for every perizie item, render it
                    perizie.map(perizieValue => {
                      return renderChildren(perizieValue[1])
                    })
                  }
                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction}>
                  {
                    // for every repair item, render it
                    repair.map(repairValue => {
                      return renderChildren(repairValue[1])
                    })
                  }
                </TabPanel>
              </SwipeableViews>
            </div>

          </div>

        </div>
    )
}


export default SearchScreen

