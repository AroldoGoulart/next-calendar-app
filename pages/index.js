import React, { useState, useEffect, useRef } from 'react';
import Paper from '@material-ui/core/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  MonthView,
  Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FiCalendar, FiBell, FiUsers } from "react-icons/fi";
import { BottomNavigation, Button, BottomNavigationAction, IconButton, Fab, Toolbar, Slide, AppBar, Typography, InputBase } from "@material-ui/core/"
import { useRouter } from 'next/router'
import { format, compareAsc } from 'date-fns'
import messageAnimation from "./../lotties/message-in-a-bottle.json"
import carLoadingAnimation from "./../lotties/car_loading.json"
import Lottie from "react-lottie"
import { ArrowUpward, AccountCircle, ExitToApp, Search } from '@material-ui/icons';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import { fade, makeStyles } from '@material-ui/core/styles';
import { useLocalStorage } from "../hooks"
import { CalendarEvents } from '../services/consumer'

// Default styles
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

// Default config for animations
const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: messageAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

export default function Home(props) {
    const [calendars, setCalendars] = useState([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {} ])
    const [value, setValue] = useState(0)
    const [mounted, setMounted] = useState(false)
    const [Final, setFinalScroll] = useState(false)
    const [renderedCounter, setRenderedCounter] = useState(0)
    const [appointments, setAppointments] = useState([])
    const [cercaText, setCercaText] = useState('')
    const [year, setYear] = useState(new Date().getFullYear())
    const classes = useStyles();
    const [idCached, setIdCached] = useLocalStorage('id', -1)
    const ServicesRef = useRef(null);
    const [currentMonth, setCurrentMonth] = useState((new Date()));
    const router = useRouter()
    const [scrollPosition, setScrollPosition] = useState(750);
    const monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
    ];   

    // handleScroll state to scroll screen
    const handleScroll = () => {
        const position = window.pageYOffset;
        setScrollPosition(position);
    };

    // Executed when the app run first time
    useEffect(() => {
        // Verify if user is logged
        if(idCached == -1) {
            // if not logged, go to login screen
            router.push("login")
        }
        else { 
            setMounted(true)
            getAppointments()
            window.addEventListener('scroll', handleScroll, { passive: true });
            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        }
    }, []);

    const getAppointments = async () => {
        // Fetch from API
        const events = await CalendarEvents(2021, idCached)

        if(events.message == "nothing found") {

        }
        else {
            // Convert data of database in json
            let convertedArray = []
            for(let i=0; i < Object.keys(events).length; i++) {
                const { 
                    dataestesa,
                    giorno,
                    numAttiveP,
                    numAttiveR,
                    nump,
                    numr
                } = events[i]
                
                convertedArray[i] = {
                    title: numr ? `R ${numr}x` : `P ${nump}x`,
                    id: i,
                    dataFromDb: {
                        nump,
                        numr,
                        numAttiveP,
                        numAttiveR,
                        giorno,
                        dataestesa,
                    },
                    numAttiveR,
                    numAttiveP,
                    location:  "not matter",
                    type: numr ? `R` : `P`,
                    startDate: new Date(2021, Number.parseInt(dataestesa.slice(0,2)), Number.parseInt(dataestesa.slice(4,6)), 9, 20),
                    endDate: new Date(2021, Number.parseInt(dataestesa.slice(0,2)), Number.parseInt(dataestesa.slice(4,6)), 10, 30),
                }
            }
            setRenderedCounter(renderedCounter+1)
            setAppointments(convertedArray)          
        }
        
    }

    const navigate = (href) => {
       // router.push(href)
    }

    // Get the action of click in an appointment
    const handlerClickTp = (event) => {
        const { data: { title, type, startDate } } = event
        console.log("ego", event.data.dataFromDb.dataestesa)
        const dateUrl =  format(startDate, 'yyyy/MM/dd')
        router.push("list", `?date=${event.data.dataFromDb.dataestesa}`)
    }

    const handlerDisconnect = () => {
        setIdCached(-1)
        router.push("login")
    }

    // Render all appointment
    const Appointment = ({
        children, style, ...restProps
    }) => {
        
        return (
            <Appointments.Appointment
                {...restProps}
                style={{
                    ...style,
                    backgroundColor: children[1].props.data.type == 'R' 
                    ? children[1].props.data.numAttiveR ? `#95f943` :  `#fc675f`
                    : children[1].props.data.numAttiveP ? `#437af9` :  `#cc342c`,
                    borderRadius: '2px',
                    textAlign: "center",
                    fontSize: 13,
                    height: 35,
                    paddingTop: 4,
                    paddingBottom: 4
                }}
                onClick={(eve) => handlerClickTp(eve)}
            >   
            <>  
                {children}
            </>
        </Appointments.Appointment>
        )
    }
        
    
    // render profile view
    const renderProfile = () => {
        return (
            <div style={{
                padding: 50
            }}>
            <Button 
               size={'large'}
               color="secondary"
               onClick={() => handlerDisconnect()}
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

    // render notification view
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

    // render home view
    const renderHome = () => {
        return (
            <InfiniteScroll
                dataLength={calendars.length}
                //next={this.fetchMoreData}
                style={{  }} //To put endMessage and loader to the top.
                inverse={true} //
                hasMore={true}
                loader={<h4>Loading...</h4>}
                scrollableTarget="scrollableDiv"
                initialScrollY={750}
            >
            {
                calendars.map((value, index) => {
                    const now = new Date()
                    let todayData = new Date(now.getFullYear(), now.getMonth()-1 + index, 1);
                    const today_format = format(todayData, 'yyyy/MM/dd')
                    const name = todayData.getMonth()
                    if(index == calendars.length) {
                        setFinalScroll(true)
                    }
                    return (
                        <Paper>
                            <Scheduler
                                // onClick={(a) => alert(a)}
                                locale={"it-IT"}
                                key={renderedCounter}
                                data={appointments}
                            >
                                <ViewState
                                    currentDate={today_format}
                                    locale={"it-IT"}
                                />
                                    <MonthView 
                                        today
                                        displayName={`moe`}
                                        endOfGroup={false}
                                        otherMonth={true}
                                    />
                                    <Appointments
                                        appointmentComponent={Appointment}
                                        key={appointments.length}
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

    const handlerKeyPress = (event) => {
        if(event.key === 'Enter') {
            router.push("search", `?date=${cercaText}?search`)
        }
    }

    // hide top of page when scroll
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

    // manage the state of tabbarbuttons
    const renderContent = () => {
        if(value == 0) {
            return renderHome()
        }
        if(value == 1) {
            return renderNotification()
        }
        return renderProfile()
    }

    // if the component is not rendered yet
    if(!mounted) {
        let customOptions = defaultOptions
        customOptions.animationData = carLoadingAnimation
        return (
            <div style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 100
            }}>
                <Lottie options={customOptions}
                    height={250}
                    width={250}
                />
                <h2 style={{
                    textAlign: "center"
                }}>
                Loading
                </h2>
            </div>
        )
    }

    return (
        <div>
            <AppBar style={{
                backgroundColor: "#a0a0a0"
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
                        placeholder="Cerca"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{ 'aria-label': 'search' }}
                        value={cercaText}
                        onKeyPress={handlerKeyPress}
                        onChange={(event) => setCercaText(event.target.value)}
                        />
                    </div>
                </Toolbar>
            </AppBar>
            <div 
            id="scrollableDiv"
            style={{
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
                              window.scrollTo(0, 750)
                        }}  style={{ backgroundColor: "#a0a0a0"}} aria-label="add">
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
                        width: "100%",
                        elevation: 4,
                        zIndex: 4
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