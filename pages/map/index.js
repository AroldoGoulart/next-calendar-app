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
import CallIcon from '@material-ui/icons/Call';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { Map, GoogleApiWrapper } from 'google-maps-react';

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

const AnyReactComponent = ({ text }) => <div>{text}</div>;

function Location(props) {
    const classes = useStyles()
    const router = useRouter()
    const [mapInfo, setMapInfo] = useLocalStorage("mapInfo", {})

    return (
        <>
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
                      </Button>
                  </Toolbar>
              </AppBar>
          </div>


          <div style={{
            margin: 10,
            padding: 10,
          }}>
              <h1 style={{
                fontSize: 16,
                fontWeight: "500"
              }}>
              {mapInfo.company_name}
              </h1>
              <h1  style={{
                fontSize: 16,
                fontWeight: "500"
              }}>
              {mapInfo.Carrozzeria}
              </h1>
          </div>
          <Map
              google={props.google}
              zoom={14}
              style={{
                width: '100%',
                height: '100%'
              }}
              initialCenter={
                {
                  lat: mapInfo.latitude,
                  lng: mapInfo.longitude
                }
              }
          />
        </>
    )
}  


export default GoogleApiWrapper({
  apiKey: "AIzaSyCEkgR7uGrfoAY7T2cDcXHKHsSsbzUUzSY"
})(Location);

