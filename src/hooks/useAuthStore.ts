import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { coffeApi } from "@/services";
import {
  onLogin,
  onLogout,
} from "@/store";
import { useCredentialStore } from ".";
import { getEnvVariables } from "@/helpers";

export const useAuthStore = () => {
  const { status, user } = useSelector((state: any) => state.auth);
  const { changeIdentityCard, changeStep, changeName } = useCredentialStore();
  const dispatch = useDispatch();

  const { changeLoadingGlobal } = useCredentialStore()
  const { MAC_DEVICE } = getEnvVariables()

  const startLogin = async (identityCard: string) => {
    try {
      changeLoadingGlobal(true)
      const { data } = await coffeApi.post('/kiosk/get_session', {
        "device_name": MAC_DEVICE,
        "identity_card": "4362223"
        // "identity_card": identityCard
      });
      localStorage.setItem('token', data.payload.access_token);
      const dataUser = {
        "nup": data.payload.nup,
        "fullName": data.payload.full_name,
        "degree": data.payload.degree
      }
      setTimeout(() => {
        const user = `${JSON.stringify(dataUser)}`;
        localStorage.setItem('user', user);
        changeIdentityCard(identityCard)
        changeName(data.payload.full_name) /* nueva implementación */
        dispatch(onLogin(dataUser));
        changeStep('instructionCard')
        changeLoadingGlobal(false)
      }, 1000)
    } catch (error: any) {
      changeLoadingGlobal(false)
      changeIdentityCard('')
      if (!error.response) return Swal.fire('Intentalo nuevamente', 'Error en el servidor', 'error')
      dispatch(onLogout());
      const message = error.response.data.message
        Swal.fire({
          title: 'Carnet no valido',
          text: message,
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
    }
  }

  const checkAuthToken = async () => {
    const token = localStorage.getItem('token');

    if (token) {
      const user = localStorage.getItem('user')
      return dispatch(onLogin(JSON.parse(user!)));
    } else {
      localStorage.clear();
      dispatch(onLogout());
    }
  }

  const startLogout = () => {
    localStorage.clear();
    dispatch(onLogout());
  }

  const authMethodRegistration = async (body: object) =>{
    try {
      const { data } = await coffeApi.post('/report/register_auth_kiosk', body)
      console.log(data)
    } catch(error: any) {
      console.error("Hubo un error: ", error)
    }
  }



  return {
    //* Propiedades
    status,
    user,
    //* Métodos
    startLogin,
    checkAuthToken,
    startLogout,
    authMethodRegistration
  }

}
