import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  MonthView,
  Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';
import InfiniteScroll from 'react-infinite-scroll-component';
import LinearProgress from '@material-ui/core/LinearProgress';

import { FiCalendar, FiBell, FiUsers } from "react-icons/fi";
import { BottomNavigation, Button, BottomNavigationAction, IconButton, Fab, Toolbar, Slide, AppBar, Typography, InputBase } from "@material-ui/core/"
import { useRouter } from 'next/router'
import { format, compareAsc } from 'date-fns'
import messageAnimation from "./../lotties/message-in-a-bottle.json"
import Lottie from "react-lottie"
import { ArrowUpward, AccountCircle, ExitToApp, Search } from '@material-ui/icons';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import { fade, makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';

export const appointments = [
    {
      title: 'P 2x',
      startDate: new Date(2021, 5, 25, 9, 35),
      endDate: new Date(2021, 5, 25, 10, 30),
      id: 0,
      location: 'Room 1',
      type: "P"
    }, 
    {
        title: 'R 2x',
        startDate: new Date(2021, 5, 25, 9, 35),
        endDate: new Date(2021, 5, 25, 10, 30),
        id: 0,
        location: 'Room 1',
        type: 'R'
      }, 
  ];


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    selected: {
        "&$selected": {
            color: "#BD1821"
          }
    },
    menuButton: {
      marginRight: theme.spacing(2),
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

const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: messageAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

function CustomLoadingOverlay() {
    return (
        <div style={{ position: 'absolute', top: 0, width: '100%' }}>
          <LinearProgress />
        </div>
    );
}


const handlerClickTp = (event) => {
    const { data } = event
    console.log(data) 
}

const Appointment = ({
    children, style, ...restProps
  }) => (
    <Appointments.Appointment
      {...restProps}
      style={{
        ...style,
        backgroundColor: children[1].props.data.type == "P" ? "#4f5bff"  : '#1aed9c',
        borderRadius: '8px',
        textAlign: "right",
        fontSize: 13
      }}
      onClick={(eve) => handlerClickTp(eve)}
    >   
    {console.log()}
          {children}
    </Appointments.Appointment>
  );
  

export default function Home(props) {
    const [calendars, setCalendars] = useState([{}, {}, {}, {}, {}, {} ])
    const [value, setValue] = useState(0)
    const [mounted, setMounted] = useState(false)
    const classes = useStyles();

    const [currentMonth, setCurrentMonth] = useState((new Date()));
    const router = useRouter()
    const monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
    ];   
    const [scrollPosition, setScrollPosition] = useState(0);
    const handleScroll = () => {
        const position = window.pageYOffset;
        setScrollPosition(position);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        setMounted(true)
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const navigate = (href) => {
       // router.push(href)
    }

    const fetchData = () => {
        return null
    }
    
    const refresh = () => {
        return true
    }

    const renderProfile = () => {
        return (
            <div style={{
                padding: 50
            }}>
               <Button 
               size={'large'}
               color="primary"
               startIcon={<AccountCircle/>}
               style={{
                   flex: 1,
                   width: "100%",
                   marginBottom: 30,
                   height: 50
               }} variant="contained"
               >
                Informazione
                </Button>

                <Button 
               size={'large'}
               color="secondary"
               startIcon={<ExitToApp/>}
               style={{
                   flex: 1,
                   width: "100%",       
                   marginBottom: 30,
                   height: 50
               }} variant="contained"
               >
                Disconnettersi
                </Button>
            </div>
        )
    }

    const renderNotification = () => {
        return (
            <div style={{ margin: 10 }}>
                <div style={{ alignContent: 'center', alignItems: 'center', padding: 30 }}>
                    <Lottie options={defaultOptions}
                        height={250}
                        width={250}
                    />
                    <h1 style={{ 
                        textAlign: "center",
                        fontSize: 20
                        }}>
                    Nessuna notifica in questo momento
                    </h1>
                </div>
            </div>
        )
    }

    const renderHome = () => {
        return (
            <InfiniteScroll
                dataLength={calendars.length} //This is important field to render the next data
                next={fetchData}
                hasMore={true}
                loader={CustomLoadingOverlay()}
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                        <b>Yay! You have seen it all</b>
                    </p>
                }
                style={{
                    paddingRight: 20,
                    paddingLeft: 20,
                    paddingTop: 20
                }}
                // below props only if you need pull down functionality
                refreshFunction={refresh}
                pullDownToRefresh
                pullDownToRefreshThreshold={50}
                >
                {
                    calendars.map((value, index) => {
                        const now = new Date()
                        let todayData = new Date(now.getFullYear(), now.getMonth() + index, 1);
                        const today_format = format(todayData, 'yyyy/MM/dd')
                        const name = todayData.getMonth()

                        return (
                            <Paper>
                                <Scheduler 
                                    onClick={( a) => alert(a)}
                                    locale={"it"}
                                    data={appointments}
                                >
                                    <ViewState
                                        currentDate={today_format}
                                        locale
                                    />
                                        <MonthView 
                                            today
                                            endOfGroup={false}
                                            dayScaleEmptyCellComponent={() => {
                                                return <h1> ok </h1>
                                            }}
                                            otherMonth={false}

                                        />
                                    <Appointments
                                        appointmentComponent={Appointment}
                                    />

                                        <Typography variant="h5" style={{
                                            position: "relative",
                                            margin: 10
                                        }}>
                                        {monthNames[name]}
                                        </Typography>
                                </Scheduler>
                            </Paper>
                        )
                    })
                }
            </InfiniteScroll>
        )
    }

    function HideOnScroll(props) {
        const { children, window } = props;
        // Note that you normally won't need to set the window ref as useScrollTrigger
        // will default to window.
        // This is only being set here because the demo is in an iframe.
        const trigger = useScrollTrigger({ target: window ? window() : undefined });
      
        if(value != 0) {
            return null
        }
        return (
          <Slide appear={true} direction="down" in={!trigger} style={{ }}>
            {children}
          </Slide>
        );
      }

    const renderContent = () => {
        if(value == 0) {
            return renderHome()
        }
        if(value == 1) {
            return renderNotification()
        }
        return renderProfile()
    }

    if(!mounted) {
        return null
    }
    return (
        <div>
            <HideOnScroll {...props}>
            <AppBar style={{
                backgroundColor: "#BD1828"
            }}  position="static">
                <Toolbar>
                    <Typography className={classes.title} variant="h6" noWrap>
                    NonSolograndine
                    </Typography>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                        <Search />
                        </div>
                        <InputBase
                        placeholder="Search…"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>
                </Toolbar>
            </AppBar>
            </HideOnScroll>
            
            <div style={{
                marginBottom: 60
            }}>
                {
                    renderContent()
                }
            </div>
                
            <div>
            
            </div>
            <footer>
            {
                value == 0 && scrollPosition >= 50 ? 
                    (
                    <aside style={{ 
                        position: "fixed",
                        bottom: 80,
                        right: 20,
                        zIndex: 10
                    }}>
                        <Fab onClick={() => {
                              window.scrollTo(0, 0)
                        }}  style={{ backgroundColor: "#DB1828"}} aria-label="add">
                            <ArrowUpward  style={{ color: "white" }} />
                        </Fab>
                    </aside>
                    )
                : null
            }
               
                <BottomNavigation
                    style={{
                        position: "fixed",
                        bottom: 0,
                        width: "100%"
                    }}
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                    showLabels
                    >
                    <BottomNavigationAction 
                        onClick={() => navigate('home')}
                        label="Calendario" 
                        icon={<FiCalendar  />}
                        classes={classes}
                    />
                    <BottomNavigationAction 
                        onClick={() => navigate('notifications')} 
                        label="Notifiche" 
                        icon={<FiBell />} 
                        classes={classes}
                    />
                    <BottomNavigationAction 
                        onClick={() => navigate('profile')} 
                        label="Profilo" 
                        icon={<FiUsers />} 
                        classes={classes}
                    />
                </BottomNavigation>
            </footer>

            
        </div>
  )
}