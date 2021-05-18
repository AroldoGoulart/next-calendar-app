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
import { BottomNavigation, Button, BottomNavigationAction, Fab, Toolbar, Slide, AppBar, Typography } from "@material-ui/core/"
import { useRouter } from 'next/router'
import { format, compareAsc } from 'date-fns'
import messageAnimation from "./../lotties/message-in-a-bottle.json"
import Lottie from "react-lottie"
import { ArrowUpward, AccountCircle, ExitToApp } from '@material-ui/icons';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';


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

export default function Home(props) {
    const [calendars, setCalendars] = useState([{}, {}, {}, {}, {}, {} ])
    const [value, setValue] = useState(0)
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
                                <Scheduler>
                                    <ViewState
                                        currentDate={today_format}
                                    />
                                        <MonthView 
                                            today
                                            endOfGroup={false}
                                            otherMonth={false}
                                            title={"er"}
                                        />
                                        <Typography variant="h5" style={{
                                            position: "relative",
                                            margin: 10
                                        }}>{monthNames[name]}</Typography>
                                    <Appointments />
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

    return (
        <div>   
            <HideOnScroll {...props}>
                <AppBar>
                <Toolbar>
                    <Typography variant="h6">Benvenuto!</Typography>
                </Toolbar>
                </AppBar>
            </HideOnScroll>
            
            <div style={{
                marginTop: 60,
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
                        }} color="primary" aria-label="add">
                            <ArrowUpward />
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
                        icon={<FiCalendar/>}
                    />
                    <BottomNavigationAction 
                        onClick={() => navigate('notifications')} 
                        label="Notifiche" 
                        icon={<FiBell />} 
                    />
                    <BottomNavigationAction 
                        onClick={() => navigate('profile')} 
                        label="Profilo" 
                        icon={<FiUsers />} 
                    />
                </BottomNavigation>
            </footer>

            
        </div>
  )
}
