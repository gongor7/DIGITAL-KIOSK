import { useAuthStore } from "@/hooks/useAuthStore";
import { useLoanStore } from "@/hooks/useLoanStore";
import { AppBar, CircularProgress, Grid, Toolbar, Typography } from "@mui/material";
import { useContext, useEffect, useState } from 'react';
import { CardLoan } from "./CardLoan";
import { useCredentialStore } from "@/hooks";
import Swal from 'sweetalert2'
import { TimerContext } from "@/context/TimerContext";
import { ComponentButton } from "@/components";

export const LoanView = () => {
  const { user } = useAuthStore();
  const { loans, getLoans } = useLoanStore();
  const { startLogout } = useAuthStore();
  const { changeIdentityCard, changeIdentifyUser, changeStep } = useCredentialStore();
  const { printKardexLoan } = useLoanStore();

  const [ loading, setLoading ] = useState(false)

  const { seconds, resetTimer } = useContext(TimerContext)

  useEffect(() => {
    getLoans(user.nup);
  }, [])

  useEffect(() => {
    if(seconds == 1) {
      changeIdentityCard('');
      changeIdentifyUser(false)
      startLogout();
      resetTimer()
    }
  }, [seconds]);

  const handlePaperClick = async (loanId: number) => {
    resetTimer()
    setLoading(true)
    const response:any = await printKardexLoan(loanId)
    switch(response) {
      case 200:
        Swal.fire({
          title: 'Impresión exitosa',
          text: 'Recoja su hoja impresa',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
        break;
      case 400:
        Swal.fire({
          title: 'No hay impresora conectada',
          text: 'Contactese con soporte',
          icon: 'warning',
          confirmButtonText: 'Aceptar',
        });
        break;
      case 501:break;
      default:
        Swal.fire({
          title: 'Hubo un error',
          text: 'El servicio de impresión no se encuentra disponible',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        })
        break;
    }
    setLoading(false)
  };

  const handleExit = () => {
    startLogout()
    changeStep('home')
    changeIdentifyUser(false)
    changeIdentityCard('')
  }

  return (
    <>
      <AppBar position="static" style={{ background: '#f2f2f2', flex: '0 0 0%' }}>
        <Toolbar>
          <Typography style={{ fontSize: '4vw', fontWeight: 700 }}>MIS PRESTAMOS</Typography>
          <Typography style={{ fontSize: '3vw', fontWeight: 700}}>{ seconds }</Typography>
        </Toolbar>
      </AppBar>
      {
        loans && <Grid container>
          {
            loans.current.map((loan: any) => {
              return (
                <Grid item key={loan.id} xs={12} sm={4}>
                  <CardLoan
                    title={loan.procedure_modality}
                    onPressed={() => handlePaperClick(loan.id)}
                  />
                </Grid>
              )
            })
          }
          {
            loans.liquited.map((loan: any) => {
              return (
                <Grid item key={loan.id} xs={12} sm={4} justifyContent="center" alignContent="center">
                  <CardLoan
                    title={loan.procedure_modality}
                    onPressed={() => handlePaperClick(loan.id)}
                  />
                </Grid>
              )
            })
          }
          <Grid container justifyContent="center" alignContent="center">
            <Grid item sm={2} xs={12} >
              <ComponentButton
                onClick={() => handleExit()}
                text={`SALIR`}
                sx={{ fontSize: innerWidth > innerHeight ? '3.5vw' : '4.5vw', width: '100%', padding: "0px 30px" }}
              />
            </Grid>
          </Grid>
          {loading &&
            <div className="overlay">
              <CircularProgress
                size={120}
                sx={{
                  color: '#42c9b7',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                }}
              />
            </div>
            }
        </Grid>
      }
    </>
  )
}
