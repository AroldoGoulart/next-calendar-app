import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { BottomNavigation, Button, Accordion, IconButton, AccordionSummary, Toolbar, Slide, AppBar, Typography, InputBase } from "@material-ui/core/"
import { fade, makeStyles } from '@material-ui/core/styles';
import { ArrowUpward, AccountCircle, ExitToApp, Search } from '@material-ui/icons';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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


  const useStylesContainer = makeStyles((theme) => ({
    root: {
      width: '100%',
      padding: 10 
    },
    heading: {
      fontSize: theme.typography.pxToRem(18),
      fontWeight: theme.typography.fontWeightRegular,
    },
  }));

  
function List(props) {
    const router = useRouter()
    console.log(router);
    const classes = useStyles();
    const classesContainer = useStylesContainer();

    const [data, setData] = useState([
      { 
        title: "Pranzo Pronto",
        author: "vittorio09",
        hour: "08:30",
        icons: {
          edit: true,
          detail: true
        }
      }
    ])
    const getDateInUrl = () => {
      let asPath = router.asPath.toLocaleLowerCase().slice(7, 6+11)
      //asPath = asPath.replace("/date=", "")
      console.log(asPath)
      return asPath
    }

    return (
        <div>
            <div>
            <AppBar style={{
                backgroundColor: "#BD1828"
            }} 
            position="static">
                <Toolbar>
                    <IconButton onClick={() => router.push("/")} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
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
            {
              data.map(value => {
                return (
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography variant="h3" className={classesContainer.heading}>{value.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="h7">
                        Opções
                      </Typography>
                    </AccordionDetails>
                </Accordion>
                )
              })
            }
          </div>

        </div>
    )
}


export default List

