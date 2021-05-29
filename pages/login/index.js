
import React, { useState } from 'react'
import Image from 'next/image'
import img from '../../public/logo.png'

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router'

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { Input, InputAdornment, IconButton, FormControl, InputLabel } from '@material-ui/core';

import { LoginInApp } from "../../services/consumer"
import { useLocalStorage } from "../../hooks"

const useStyles = makeStyles((theme) => ({
    container: {
      padding: theme.spacing(3),
      elevation: 10,
        backgroundColor: "white",
        marginTop: 100,
        borderRadius: 10
    },
    root: {
        backgroundColor: "#BD1828"
    },
    label: {
        color: "#fff"
    },
  }));

function Login() {
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [login, setLogin] = useState('')
    const [error, setError] = useState('')
    const classes = useStyles();
    const router = useRouter()
    const [idCached, setIdCached] = useLocalStorage("id", null)

    const handleChange = (prop) => (event) => {
        setPassword(event.target.value);
    };

    const handleClickShowPassword = () => {
        setShowPass(!showPass);
    };
    
    const onSubmit = async () => {
        const response = await LoginInApp(login, password)
        setError("")
        if(response.ID) {
            if(response.IsInactive == 1) {
                setError("Utento NON attivo")
            }
            else {
                setIdCached(response.ID)
                router.push("/")    
            }
        }
        else {
            setError("Acesso negato, errore nelle credenziali")
        }
    }
    return (
        <div style={{ 
            alignItems: "center", 
            alignContent: "center",
            alignSelf: "center",
            justifyContent: "center"
        }}>
           
            <Container className={classes.container} maxWidth="xs">
            <img style={{ 
                    height: 150,
                    width: 150,
                    alignSelf: "center",
                    textAlign: "center",
                    marginLeft: 140,
                    marginTop: 50,
                    marginBottom: 10
                }} src={img}
                />
                <div style={{ 
                    marginTop: 50
                }}/>
                <form onSubmit={onSubmit}>
                    <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                value={login}
                                onChange={(event) => setLogin(event.target.value)}
                                //inputRef={register}
                                label="Utente"
                                name="email"
                                size="small"
                              //  variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                        <FormControl fullWidth>
                        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                            <Input
                                id="standard-adornment-password"
                                type={showPass ? 'text' : 'password'}
                                value={password}
                                onChange={handleChange('showPass')}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    >
                                    {showPass ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                                }
                            />
                        </FormControl>
                        </Grid>
                        </Grid>
                        <h1 style={{
                            fontSize: 13
                        }}>
                        {error || "" }
                        </h1>
                    </Grid>
                    <Grid  style={{ 
                        marginTop: 30
                    }} item xs={12}>
                        <Button 
                        classes={{
                            root: classes.root, // class name, e.g. `classes-nesting-root-x`
                            label: classes.label, // class name, e.g. `classes-nesting-label-x`
                        }}
                        fullWidth onClick={() => onSubmit()} variant="contained">
                        Accedi
                        </Button>
                         
                    </Grid>
                    </Grid>
                </form>
            </Container>
        </div>
        
    )
}

export default Login
