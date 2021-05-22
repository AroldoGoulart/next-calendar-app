
import CallIcon from '@material-ui/icons/Call';
import LocationOnIcon from '@material-ui/icons/LocationOn';

export function EventItem(props) {
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
        
        </div>
      )
}