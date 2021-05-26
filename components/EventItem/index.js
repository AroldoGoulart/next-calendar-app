import React, { useState, } from 'react'
import CallIcon from '@material-ui/icons/Call';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { useLocalStorage } from "../../hooks"
import { useRouter } from 'next/router'
import { AppBar, Toolbar, IconButton } from "@material-ui/core"
import AssignmentIcon from '@material-ui/icons/Assignment';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { FiberPin } from '@material-ui/icons';


export function EventItem(props) {
  const [mapInfo, setMapInfo] = useLocalStorage("mapInfo", {})
  const router = useRouter()
  
  // Will call the company
    const openCall = () => {
    } 

    // Will open the map
    const openMap = (objectToMap) => {
      setMapInfo(objectToMap)
      router.push("map", `map`)
    } 

    const openDocument = (objectToMap) => {
      setMapInfo(objectToMap)
      console.log(objectToMap)
      router.push(`documents`)
    }

    const openEdit = () => {
      
    }


    const { children } = props
    if(!children) {
        return (
          <h1> ok</h1>
        )
      }
      return (
        <div 
          style={{
            backgroundColor: "#f9f9f9",
            padding: 5,
            marginBottom: 25,
            borderRadius: 5,
            marginLeft: -20,
            marginRight: -20,
            marginTop: -20,
          }} 
          key={children.ID}
        >
          <h1 style={{
            fontSize: 20,
            fontWeight: '600',
          }}>
          {children.ora}
          </h1>
          
          <h3 style={{
            fontSize: 15,
            fontWeight: '500',
            marginTop: -10
          }}>
          {children.Targa}
          </h3>

          <h3 style={{
            fontSize: 16,
            fontWeight: '500',
            marginTop: -10
          }}>
          {children.Modello}
          </h3>

          <h3 style={{
            fontSize: 14,
            color: "grey",
            fontWeight: '500',
            marginTop: -10
          }}>
          {children.company_name}
          </h3>

          <h3 style={{
            fontSize: 14,
            color: "grey",
            fontWeight: '500',
            marginTop: -10
          }}>
          {children.tipo == "R" ? "Riparazione" : "Perizia"}
          </h3>

          
          {
            children.latitude > 0 && (
              <LocationOnIcon 
                style={{
                  color: "#BD1821"
                }}
                onClick={() => openMap(children)}
              />
            )
          }
          
          {
            children.telCarrozzeria ? (
              <CallIcon 
                style={{
                  color: "#BD1821",
                  marginLeft: !children.latitude > 0 ? 0 : 5
                }}
                onClick={() => openCall(children.telCarrozzeria)}
              />
            ): null
          }
        
        {
          children.numdocumenti ? ( 
            <AssignmentIcon
              style={{
                  color: "#BD1821",
                  marginLeft: !children.latitude > 0 ? 0 : 5
                }}
                onClick={() => openDocument(children)}
            ></AssignmentIcon>

          ): null
        }
        {
          children.condizione == "A" ?  (
            <EditIcon
            onClick={() => openEdit(children)}
            style={{
                color: "#BD1821",
                marginLeft: !children.latitude > 0 ? 0 : 5
            }}
            />
          ): (
            <VisibilityIcon
              style={{
                  color: "#BD1821",
                  marginLeft: !children.latitude > 0 ? 0 : 5
              }}
            /> 
          )
        }
        </div>
      )
}