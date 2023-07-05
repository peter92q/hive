import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { signInUser } from '../Configs/Redux/account';
import { useForm, FieldValues } from 'react-hook-form';
import { buttonStyle2 } from '../Configs/Styles/buttons';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import { useState } from 'react';
import { useAppDispatch } from '../Configs/Redux/store';
import Cookies from 'js-cookie';

export default function Login() {
  const [errorMsg, setErrorMsg] = useState<string>()
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: 'onTouched',
  });

  async function submitForm(data: FieldValues) {
    try{
      await dispatch(signInUser(data))
      const cookieUser = Cookies.get('user');
      if(cookieUser){
        navigate('/',{replace: true})
      }
      else{
        setErrorMsg("Invalid credentials.")
      }
    }catch(error: any){ 
      console.log(error)
    }
  } 

  return (
    <div
    >
        <Container
          component="main"
          maxWidth="xs"
          className="h-[81vh] form-container"
          
        >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: '#ae6e06' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" color="whitesmoke">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit(submitForm)}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                fullWidth
                label="Username"
                required
                {...register('username', { required: 'Username required' })}
                error={!!errors.username}
                helperText={errors?.username?.message as string}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Password"
                type="password"
                required
                {...register('password', {
                  required: 'Password required'})
                }
                error={!!errors.password}
                helperText={errors?.password?.message as string}
              />
              {errorMsg && <div className='text-red-700 text-[15px] w-full flex justify-center items-center text-center'>{errorMsg}</div>}
              <button
                disabled={!isValid}
                type="submit"
                className={`${buttonStyle2} px-2 py-2.5 w-full max-h-[50px]`}
              > 
                {isSubmitting ? (
                  <PulseLoader size={8} color="white" />
                ) : (
                  'Sign In'
                )}
              </button>
              <Grid container className="mt-2">
                <Grid item>
                  <p
                    onClick={() => navigate('/register')}
                    className="text-blue-500 underline cursor-pointer"
                  >
                    {"Don't have an account? Sign Up"}
                  </p>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
        <img src="./left.png" className='absolute bottom-0 z-[-1]'/>
        <img src="./right.png" className='absolute right-0 bottom-0 z-[-1] h-[55%]'/>
    </div>
  );
}
