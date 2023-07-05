import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useAppSelector } from '../Configs/Redux/store';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { buttonStyle2 } from '../Configs/Styles/buttons';
import { PulseLoader } from 'react-spinners';
import axios from 'axios';

export default function Register() {
  const { user } = useAppSelector((state) => state.account);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: 'onTouched',
  });

  function handleApiErrors(errors: any) {
    console.log(errors);
    if (errors) {
      errors.forEach((error: string) => {
        if (error.includes('Password')) {
          setError('password', { message: error });
        } else if (error.includes('Email')) {
          setError('email', { message: error });
        } else if (error.includes('Username')) {
          setError('username', { message: error });
        }
      });
    }
  }

  return (
    <div className="pb-10  overflow-y-scroll">
      {!user ? (
        <Container
          component="main"
          maxWidth="xs"
          className="pb-5 rounded-md shadow-lg form-container"
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
              <HowToRegIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ color: 'white' }}>
              Register
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit((data) =>
                axios
                  .post('http://localhost:5001/api/account/register', data)
                  .then(() => {
                    navigate('/login');
                  })
                  .catch((error) => handleApiErrors(error))
              )}
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
                label="Email"
                required
                {...register('email', {
                  required: 'Email required',
                  pattern: {
                    value:
                      /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/,
                    message: 'Not a valid email address',
                  },
                })}
                error={!!errors.email}
                helperText={errors?.email?.message as string}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Password"
                type="password"
                required
                {...register('password', {
                  required: 'Password required',
                  pattern: {
                    value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/,
                    message: 'Password does not meet complexity requirements',
                  },
                })}
                error={!!errors.password}
                helperText={errors?.password?.message as string}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Confirm Password"
                type="password"
                required
                {...register('confirmPassword', {
                  required: 'Confirm password required',
                  validate: (value) =>
                    value === watch('password') ||
                    'The passwords do not match.',
                })}
                error={!!errors.confirmPassword}
                helperText={errors?.confirmPassword?.message as string}
              />
              <TextField
                margin="normal"
                fullWidth
                label="First Name"
                required
                {...register('firstName', { required: 'First name required' })}
                error={!!errors.firstName}
                helperText={errors?.firstName?.message as string}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Last Name"
                required
                {...register('lastName', { required: 'Last name required' })}
                error={!!errors.lastName}
                helperText={errors?.lastName?.message as string}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Country"
                required
                {...register('country', { required: 'Country required' })}
                error={!!errors.country}
                helperText={errors?.country?.message as string}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel id="birthYear-label" required>
                  Birth Year
                </InputLabel>
                <Select
                  labelId="birthYear-label"
                  label="Birth Year"
                  {...register('birthYear', {
                    required: 'Birth year required',
                  })}
                  error={!!errors.birthYear}
                  MenuProps={{
                    PaperProps: { sx: { maxHeight: 200 } },
                  }}
                >
                  {[...Array(new Date().getFullYear() - 1930 + 1)].map(
                    (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      );
                    }
                  )}
                </Select>
              </FormControl>
              <button
                disabled={!isValid}
                type="submit"
                className={`${buttonStyle2} px-2 py-2.5 w-full ${!isValid ? 'opacity-30 hover:opacity-30 cursor-default':''}`}
              >
                {isSubmitting ? (
                  <PulseLoader size={8} color="white" />
                ) : (
                  'Create Account'
                )}
              </button>
              <Grid container className="mt-1">
                <Grid item>
                  <p
                    onClick={() => navigate('/login')}
                    className="text-blue-500 underline cursor-pointer"
                  >
                    {'Already have an account? Login'}
                  </p>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      ) : (
        <h1
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'blue',
          }}
        >
          Already logged in
        </h1>
      )}
    </div>
  );
}
