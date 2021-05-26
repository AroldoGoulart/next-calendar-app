
import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Create, FiberPin } from '@material-ui/icons';
import { useRouter } from 'next/router'
import FlatList from 'flatlist-react';

import { AppBar, Toolbar, IconButton, Button,  } from "@material-ui/core"
import FolderIcon from '@material-ui/icons/Folder';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import Input from '@material-ui/core/Input';
import { CameraFeed } from '../../components/Camera';
import { useLocalStorage } from "../../hooks"
import { CreateDocument, listDocument } from '../../services/consumer';
import SendIcon from '@material-ui/icons/Send';
const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  }));

  
function DocumentsScreen() {
    const classes = useStyles();
    const router = useRouter()
    const [images, setImages] = useState([[]])
    const [videos, setVideos] = useState()
    const [mapInfo, setMapInfo] = useLocalStorage("mapInfo", {})
    const [customizedTimes, setcustomizedTimes] = useState([])
    const [canges, setcanges] = useState(0)
    const [localDocs, setLocalDocs] = useLocalStorage("localDoc", [])
    const [imageNumber, setImageNumber] = useState(0)
    useEffect(() => {
        setLocalDocs(customizedTimes)
    }, [customizedTimes])
    
    // executed just when app opened
    useEffect(() => {
        console.log("items", mapInfo)
        const {
            ID_incarichi,
            IDoperatore,
            cliente_id,
            id_profilo,
            numdocumenti,
            tipo,
        } = mapInfo

        const callApis = async () => {
            await CreateDocument(ID_incarichi, id_profilo, tipo)
            const docs = await listDocument(ID_incarichi)
           // console.log(Object.entries(docs))
            let formattedDoc = []
            for(let i =0; i < Object.entries(docs).length; i++) {
                formattedDoc[i] = {
                    ...Object.entries(docs)[i][1],
                    images: []
                }
            }
            
            setcustomizedTimes(formattedDoc)
        }
 
        listDocument()
        callApis()
    }, [])

    const selectItemFromFolder = (event, childrenIndex) => {
        const file = event.target.files[0]
        let olddata = customizedTimes
        olddata[childrenIndex].images = [
            ...olddata[childrenIndex].images,
            file
        ]
        setcanges(canges+1) 
        setcustomizedTimes(olddata)
        setImageNumber(imageNumber+1)
    }

    const removeImage = (indexToRemove, imgIndex) => {
        let filtered = customizedTimes
        let newImageArray = []

        for(let i = 0; i < filtered[indexToRemove-1].images.length; i++) {
            const imageVal = filtered[indexToRemove-1].images[i]
            if(i != imgIndex) {
                newImageArray[newImageArray.length] = imageVal
            }
        }
        filtered[indexToRemove-1].images = newImageArray

        setcustomizedTimes(filtered)
        setcanges(canges+1)

        setImageNumber(imageNumber-1)
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
                    Documents - {mapInfo.Modello}({mapInfo.Targa})
                    </Typography>
                </Toolbar>
            </AppBar>
            </div>
                {imageNumber     ?  (
                    <div style={{
                        flex: 1,
                        flexDirection: "row",
                        marginTop: 10,
                        marginBottom: 10,
                    }}> 
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<SendIcon/>}
                            fullWidth
                        >
                        Enviar
                        </Button>
                    </div>
                ): null} 
                <div>
                    <FlatList
                    list={localDocs}
                    key={canges} 
                    renderItem={(value, index) => {
                        return (
                            <Accordion >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                > 
                                    <Typography style={{
                                        flex: 1
                                    }} className={classes.heading}>
                                    {value.documento}
                                    </Typography>

                                    <div style={{
                                        alignSelf: "flex-end",
                                        flexDirection: "row",
                                        marginRight: 5
                                    }}>

                                    <IconButton
                                        variant="contained"
                                        containerElement='label' 
                                        component="label"
                                    >   
                                        <FolderIcon></FolderIcon>
                                        <input  
                                            onChange={(a) => selectItemFromFolder(a, index)}
                                            type="file"
                                            hidden
                                            accept="image/*"
                                        />
                                    </IconButton>
                                    
                                    <IconButton
                                        variant="contained"
                                        containerElement='label' 
                                        component="label"
                                    >   
                                        <CameraAltIcon></CameraAltIcon>
                                        <input  
                                            onChange={(a) => selectItemFromFolder(a, index)}
                                            type="file"
                                            hidden
                                        />
                                    </IconButton>
                                </div>
                                </AccordionSummary>
                                <AccordionDetails style={{ flexDirection: "column"}}>
                                    {value.images.map((image, index) => {
                                        return (
                                            <div  onClick={() => removeImage(value.id_Join, index)}
                                            style={{
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}>
                                                <img style={{
                                                    borderRadius: 50,
                                                    backgroundColor: "gray"
                                                }} height={"40"} width={"40"} src={URL.createObjectURL(image)}/>
                                                <h1 style={{
                                                    fontSize: 15,
                                                    fontWeight: '500',
                                                }}>
                                                {image.name}
                                                </h1>
                                            </div>
                                        )
                                    })}
                                </AccordionDetails>
                            </Accordion>
                        )
                    } }
                    renderWhenEmpty={() => <div>List is empty!</div>}
                    //sortBy={["firstName", {key: "lastName", descending: true}]}
                />
            </div>
    </div>
      
    );
}

export default DocumentsScreen