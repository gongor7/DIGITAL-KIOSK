import { TimerContext } from "@/context/TimerContext"
import { useCredentialStore } from "@/hooks"
import { Box, Card, Grid, Typography } from "@mui/material"
import { forwardRef, useContext, useImperativeHandle } from "react"
// @ts-ignore
import imageLogo from '@/assets/images/carnet.png';

export const PreviousRecognition = forwardRef((_, ref) => {

   const { changeStep } = useCredentialStore()

   const { resetTimer } = useContext(TimerContext)

   useImperativeHandle(ref, () => ({
      action: () => {
         changeStep('faceRecognition')
         resetTimer()
      },
      onRemoveCam: () => {}
   }))

   return (
      <Grid
         container
         justifyContent="center"
         alignItems="center"
         style={{ height: '65vh' }}
      >
         <Grid item container sm={6} direction="column">
            <Card sx={{ ml: 10, borderRadius: '30px', p: 2}} variant="outlined">
               <Typography sx={{ pl: 5 }} style={{ fontSize: '3.5vw' }} align="center">
                  Por favor recoja su carnet de identidad de la bandeja
               </Typography>
            </Card>
         </Grid>
         <Grid item container sm={6} direction="column">
            <Box display="flex" justifyContent="center">
               <img src={imageLogo} alt="Imagen carnet" style={{ width: '30vw'}} />
            </Box>
         </Grid>
      </Grid>
   )
})
