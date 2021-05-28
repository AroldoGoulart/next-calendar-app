
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
import { useLocalStorage } from "../../hooks"
import { CreateDocument, listDocument } from '../../services/consumer';
import SendIcon from '@material-ui/icons/Send';
import DelIcon from '@material-ui/icons/Delete';
import Sheet from 'react-modal-sheet';
import Checkbox from '@material-ui/core/Checkbox';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
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
    const [isOpen, setOpen] = useState(false);
    const [check, setCheck] = useState();
    const [openedModalReference, setopenedModalReference] = useState(0);
    const listPossibles = [
        "Documento Intero",
        "Fronte", 
        "Retro",
        "Fronte / Retro",
        'Pagina 1',
        "Pagina 2", 
        "Pagina 3",
        'Altra pagina'
    ]

    const [imageToSelectedType, setImageToSelectedType] = useState()

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

/*     useEffect(() => {
        if(localDocs) {
            setcustomizedTimes(localDocs)
        }
    }, [localDocs]) */
    const selectItemFromFolder = (event, childrenIndex) => {
        setopenedModalReference(childrenIndex)
        const file = event.target.files[0]
        setOpen(true)
        setImageToSelectedType(file)
    }

    const saveModal = () => {   
        setCheck(0)
        setOpen(false)

        let olddata = customizedTimes
        console.log(olddata)

        olddata[openedModalReference].images = [
            ...olddata[openedModalReference].images,
            { 
                name: listPossibles[check],
                file: imageToSelectedType
            } 
        ]

        console.log(olddata)
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
                {
                    imageNumber ?  (
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
                    ) 
                    : null
                } 
                <div>
                    <FlatList
                    list={localDocs}
                    key={`${canges}_${localDocs.length}`} 
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
                                            capture="environment"
                                            accept="image/*"
                                        />
                                    </IconButton>
                                </div>
                                </AccordionSummary>
                                <AccordionDetails style={{ flexDirection: "column" }}>
                                    {value.images.map((image, index) => {
                                        return (
                                            <div  onClick={() => removeImage(value.id_Join, index)}
                                            style={{
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexDirection: "row",
                                                flex: 1
                                            }}>
                                                <div>
                                                    <img style={{
                                                        borderRadius: 50,
                                                        backgroundColor: "gray"
                                                    }} height={"40"} width={"40"} src={URL.createObjectURL(image.file)}/>

                                                    <a style={{ marginLeft: 10 }}> 
                                                    {image.name}
                                                    </a>
                                                    <IconButton
                                                        variant="contained"
                                                        containerElement='label' 
                                                        component="label"
                                                        style={{
                                                            position: "absolute",
                                                            right: 55
                                                        }}
                                                    >   
                                                        <DelIcon></DelIcon>
                                                        <input  
                                                            onChange={(a) => selectItemFromFolder(a, index)}
                                                            type="file"
                                                            hidden
                                                        />
                                                    </IconButton>
                                                    

                                                </div>
                                                        
                                                

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
                <Sheet isOpen={isOpen} onClose={() => setOpen(false)}>
                    <Sheet.Container>
                    <Sheet.Header>
                        <div style={{ padding: 20, paddingBottom: 10, paddingTop: 10, flexDirection: "row", flex: 1,
                        backgroundColor: "#f2f2f2"                        
                         }}>
                            <IconButton
                                variant="contained"
                                containerElement='label' 
                                component="label"
                                onClick={() => setOpen(false)}
                                style={{
                                    flex: 1,
                                    marginBottom: 3
                                }}
                            >   
                                <HighlightOffIcon></HighlightOffIcon>
                            </IconButton>
                            <a style={{
                                flex: 1,
                                textAlign: 'center',
                                fontSize: 16,
                                fontWeight: "600",
                                marginTop: 10
                            }}>Delega Incassso</a>
                        </div>
                    </Sheet.Header>
                    
                    <Sheet.Content>
                        <div style={{
                            padding: 20,
                            marginLeft: 10
                        }}>
                            {listPossibles.map((item, index) => {
                                return (
                                    <div style={{
                                        backgroundColor: "#fcfcfc",
                                        padding: 15,
                                        borderRadius: 10,
                                        marginBottom: 10,
                                        alignContent: "center"
                                    }}>
                                    <Checkbox
                                        style={{
                                            right: 10,
                                            alignSelf: "center",
                                            marginTop: -2.5
                                        }}
                                        size={40}
                                        checked={check != null ? index == check  : false}
                                        onChange={() => setCheck(index)}
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                    />
                                        {item}
                                    </div>
                                )
                            })}
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                style={{
                                    padding: 15,
                                    marginBottom: 5
                                }}
                                onClick={() => saveModal()}
                            >
                            Salva
                            </Button>
                        </div>
                    </Sheet.Content>
                    </Sheet.Container>

                    <Sheet.Backdrop />
                </Sheet>
      
            </div>
    </div>
      
    );
}

export default DocumentsScreen